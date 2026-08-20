---
phase: 03-modo-cuenta
plan: 01
subsystem: database
tags: [postgres, neon, privy, server-auth, ledger, bigint]

requires:
  - phase: 01-wallet-mode
    provides: "Scaffold Next.js App Router, lib/config/tokens.ts (registry de chains/tokens), Privy client-side provider"
provides:
  - "lib/db/schema.sql: accounts/movements/sync_state idempotente, índice único parcial sobre tx_hash para deposit (D-03)"
  - "lib/db/client.ts: sql (HTTP, lazy) + withTx (Pool WebSocket con BEGIN/COMMIT/ROLLBACK real) para 03-02/03-03"
  - "lib/db/apply-schema.ts + lib/db/seed.ts: scripts tsx para aplicar schema y sembrar 60 cuentas sintéticas"
  - "lib/privy-server.ts: verifyPrivyToken(authHeader) -> { userId, walletAddress } (D-05)"
  - "app/api/cuenta/account/route.ts: GET que hace upsert de accounts y devuelve balances + interés"
  - "lib/config/cuenta.ts: OMNIBUS_VAULT_ADDRESS, DEPOSIT_CHAIN, DAILY_WITHDRAW_LIMIT_BASE_UNITS, SPREAD_BPS"
affects: [03-02, 03-03, 03-04]

tech-stack:
  added: ["@neondatabase/serverless", "@privy-io/server-auth", "ws", "tsx (dev)", "dotenv-cli (dev)"]
  patterns:
    - "Cliente DB con getDb() lazy (nunca Proxy): sql/withTx no se conectan hasta el primer query real, así next build pasa sin DATABASE_URL"
    - "withTx abre un Pool WebSocket real (no el driver HTTP) para poder branchear sobre una lectura intermedia dentro de BEGIN/COMMIT/ROLLBACK"
    - "Todo valor numeric leído de Postgres se pasa por BigInt(valor) antes de operar; nunca number ni string crudo en cálculos de balance"
    - "verifyPrivyToken degrada con Error('configurar Privy') -> 401 explícito si falta appId/secret real, en vez de crashear el proceso"

key-files:
  created:
    - lib/db/schema.sql
    - lib/db/client.ts
    - lib/db/apply-schema.ts
    - lib/db/seed.ts
    - lib/privy-server.ts
    - lib/config/cuenta.ts
    - app/api/cuenta/account/route.ts
  modified:
    - .env.example
    - package.json

key-decisions:
  - "BigInt literales (1000n) evitados en todo el código nuevo, se usa BigInt(1000) en su lugar: el tsconfig.json del proyecto (target ES2017, compartido con fases 1/2/4) no soporta la sintaxis de literal BigInt sin subir el target global, y tocar ese target es fuera del scope de este plan"
  - "@privy-io/server-auth (deprecado a favor de @privy-io/node) se usó igual porque así lo fija el plan/interfaces; funciona, solo emite warning de deprecación en npm install"
  - "Scripts npm db:apply-schema / db:seed agregados invocando dotenv-cli + tsx, porque ni tsx ni drizzle cargan .env.local automáticamente"

patterns-established:
  - "Cualquier endpoint de Cuenta que necesite identidad importa verifyPrivyToken de lib/privy-server.ts, nunca reverifica tokens por su cuenta"
  - "Queries sueltas de lectura usan sql\`...\`; cualquier flujo con lock/branching (retiro, interés) usa withTx(client => ...)"

requirements-completed: [CTA-05]

duration: ~55min
completed: 2026-08-20
---

# Phase 3 Plan 1: Ledger Postgres + Identidad Privy + Seed Summary

**Schema idempotente (accounts/movements/sync_state) con cliente SQL lazy sobre Neon, verificación server-side de Privy con degradación explícita a 401, endpoint GET /api/cuenta/account con upsert automático, y seed determinista de 60 cuentas sintéticas — todo implementado y compilando, pendiente de aplicarse contra Postgres real (Neon bloqueado en aceptación de términos en Vercel Marketplace).**

## Performance

- **Duration:** ~55 min
- **Tasks:** 2/3 completados en código (Task 3 es un checkpoint humano de aplicación contra DB real, ver abajo)
- **Files modified:** 9

## Accomplishments
- `lib/db/schema.sql`: 3 tablas + índice único parcial sobre `tx_hash` (idempotencia de depósitos, D-03/D-09)
- `lib/db/client.ts`: `sql` (HTTP, lazy, nunca se conecta en build) y `withTx` (Pool WebSocket real con `BEGIN`/`COMMIT`/`ROLLBACK`, necesario para el lock+branching de retiros e interés en 03-02/03-03)
- `lib/privy-server.ts`: verifica el access token de Privy server-side y resuelve la embedded wallet, degrada con 401 "configurar Privy" si falta `PRIVY_APP_SECRET`/`NEXT_PUBLIC_PRIVY_APP_ID` real
- `app/api/cuenta/account/route.ts`: GET que hace upsert de `accounts` con `wallet_address` (D-04) y devuelve balances + interés acumulado (bigints serializados como string)
- `lib/db/seed.ts`: 60 cuentas sintéticas (`did:privy:synthetic-001..060`), PRNG determinista (mulberry32, seed fijo), balances log-normal 10-50.000 ARGt, 1-3 movimientos `deposit`/`interest` en los últimos 14 días, idempotente (upsert de account + delete/insert de sus movimientos)
- `npm run build` pasa sin `DATABASE_URL` configurada

## Task Commits

1. **Task 1: Schema idempotente, cliente SQL y config de Cuenta** - `e32dc50` (feat)
2. **Task 2: Identidad server-side y endpoint de cuenta** - `20299d4` (feat)
3. **Task 3 (código del seed, checkpoint humano pendiente)** - `44a91e4` (feat)

## Files Created/Modified
- `lib/db/schema.sql` - `accounts`, `movements` (CHECK type in deposit/withdraw/interest), `sync_state`, índice único parcial sobre `tx_hash` para `deposit`
- `lib/db/client.ts` - `sql` lazy (HTTP) + `withTx` (Pool WebSocket, sesión interactiva real)
- `lib/db/apply-schema.ts` - script `tsx` que aplica `schema.sql` vía `Client` WebSocket (soporta el archivo completo con varias sentencias, a diferencia del driver HTTP)
- `lib/db/seed.ts` - seed determinista e idempotente de 60 cuentas sintéticas
- `lib/privy-server.ts` - `verifyPrivyToken(authHeader)`
- `lib/config/cuenta.ts` - `OMNIBUS_VAULT_ADDRESS`, `DEPOSIT_CHAIN`, `DAILY_WITHDRAW_LIMIT_BASE_UNITS`, `SPREAD_BPS`
- `app/api/cuenta/account/route.ts` - `GET` con upsert + interés acumulado
- `.env.example` - agregadas `DATABASE_URL`, `PRIVY_APP_SECRET`, `VAULT_PRIVATE_KEY`, `CRON_SECRET`
- `package.json` - deps `@neondatabase/serverless`, `@privy-io/server-auth`, `ws`; devDeps `tsx`, `dotenv-cli`; scripts `db:apply-schema`, `db:seed`

## Decisions Made
- **BigInt sin literales `n`**: el `tsconfig.json` compartido tiene `target: ES2017` (usado por fases 1/2/4); usar `1000n` rompe el typecheck de `next build` con `TS2737`. Se usó `BigInt(1000) * BigInt(10) ** BigInt(18)` en vez de subir el target global (cambio fuera del scope de este plan, con blast radius a todo el repo).
- **`NeonQueryFunction<false, false>` explícito** en `lib/db/client.ts` en vez de `ReturnType<typeof neon>`: ese último resuelve a un tipo unión (`ArrayMode`/`FullResults` como `boolean` genérico en vez de sus defaults `false`) porque `neon` es una función genérica y `ReturnType` sobre una función genérica no instanciada no aplica los defaults de sus type params. El tipo explícito da el tipo de retorno correcto (`Record<string, any>[]`, iterable).
- **`apply-schema.ts` usa `Client` (WebSocket) en vez del driver HTTP `neon()`**: el driver HTTP no soporta un string con múltiples sentencias SQL separadas por `;` en una sola llamada; `Client.query()` (protocolo simple, como `node-postgres`) sí.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] BigInt literales reemplazados por `BigInt(n)`**
- **Found during:** Task 1 (`npm run build` con `lib/config/cuenta.ts`)
- **Issue:** `DAILY_WITHDRAW_LIMIT_BASE_UNITS = 1000n * 10n ** 18n` (tal como está en `<interfaces>` del plan) rompe `next build` con `TS2737` porque el `target` del `tsconfig.json` es `ES2017`
- **Fix:** Se probó subir `target` a `ES2020` primero, pero el checker interno de `next build` (Turbopack) seguía fallando incluso tras limpiar `.next`, `node_modules/.cache` y verificar con `tsc --noEmit` (que sí pasaba). Se revirtió el `target` y se usó la forma funcional `BigInt(1000) * BigInt(10) ** BigInt(18)`, semánticamente idéntica, sin tocar configuración compartida
- **Files modified:** `lib/config/cuenta.ts`, `lib/db/seed.ts`
- **Verification:** `npm run build` pasa
- **Committed in:** `e32dc50` (Task 1), `44a91e4` (seed)

**2. [Rule 3 - Blocking] Tipo explícito `NeonQueryFunction<false, false>` en `sql`**
- **Found during:** Task 2 (`npm run build` con `app/api/cuenta/account/route.ts`)
- **Issue:** `ReturnType<typeof neon>` producía un tipo unión no iterable (`any[][] | Record<string,any>[] | FullQueryResults<boolean>`), rompiendo la destructuración `const [account] = await sql\`...\``
- **Fix:** Import explícito de `NeonQueryFunction<false, false>` como tipo de `sql` y del caché interno `_httpSql`
- **Files modified:** `lib/db/client.ts`
- **Verification:** `npm run build` pasa
- **Committed in:** `20299d4`

**3. [Rule 3 - Blocking] `tsx` y `dotenv-cli` agregados como devDependencies**
- **Found during:** Task 3 (preparar los scripts para cuando `DATABASE_URL` exista)
- **Issue:** Ni `tsx` ni `drizzle` cargan `.env.local` automáticamente; sin `dotenv-cli` el usuario tendría que exportar las env vars a mano
- **Fix:** `npm install -D tsx dotenv-cli` + scripts `db:apply-schema`/`db:seed` en `package.json`
- **Files modified:** `package.json`, `package-lock.json`
- **Committed in:** `44a91e4`

---

**Total deviations:** 3 auto-fixed (todos Rule 3, blocking). Ninguno cambia el alcance del plan.
**Impact on plan:** Todos necesarios para que `next build` compile sin `DATABASE_URL` real y para que los scripts de setup sean ejecutables tal como los describe el checkpoint.

## Issues Encountered
- El intento de subir `tsconfig.json` `target` a `ES2020` para soportar literales BigIntdirectamente no resolvió el error incluso tras limpiar toda caché de build (`.next`, `node_modules/.cache`); `tsc --noEmit` directo sí pasaba con `ES2020`, pero el checker de `next build` seguía reportando `TS2737`. No se investigó más a fondo porque la alternativa (`BigInt(n)`) es más segura (no toca config compartida) y resuelve el problema igual. Documentado como posible bug de Next 16.3.1/Turbopack a investigar si en el futuro se necesita subir el target real.

## User Setup Required

**Checkpoint pendiente (Task 3, `type="checkpoint:human-action"`).** Todo el código está implementado y `npm run build` pasa, pero no puede verificarse end-to-end sin Postgres real. Estado: Neon se está provisionando vía Vercel Marketplace, bloqueado en que el usuario acepte los términos en el browser.

Pasos que faltan una vez `DATABASE_URL` exista:
1. Aceptar términos de Neon en Vercel (bloqueante actual) y confirmar que la DB quedó conectada al proyecto.
2. `vercel env pull` (o setear `DATABASE_URL` y `PRIVY_APP_SECRET` a mano en `.env.local`).
3. `npm run db:apply-schema` (equivalente a `npx dotenv -e .env.local -- npx tsx lib/db/apply-schema.ts`) — confirmar que `accounts`, `movements`, `sync_state` existen.
4. `npm run db:seed` (equivalente a `npx dotenv -e .env.local -- npx tsx lib/db/seed.ts`) — confirmar `SELECT count(*) FROM accounts WHERE wallet_address IS NULL` = 60.
5. Con `npm run dev` y un login Privy real, pegarle a `GET /api/cuenta/account` con el access token — confirmar que aparece una fila nueva en `accounts` con `wallet_address` no nulo.

`PRIVY_APP_SECRET` también sigue en placeholder; sin él, `verifyPrivyToken` devuelve 401 con `{ error: "configurar Privy" }` en vez de crashear.

## Next Phase Readiness
- `lib/db/client.ts` (`sql`/`withTx`), `lib/privy-server.ts` y `lib/config/cuenta.ts` listos para que 03-02 (depósitos/retiros) y 03-03 (interés) los reusen sin reimplementar identidad ni acceso a datos.
- `app/api/cuenta/account/route.ts` listo para que 03-04 (UI de Cuenta) lo consuma.
- **Bloqueante:** el ledger no tiene datos reales hasta que se resuelva el checkpoint de Neon (Task 3). El resto del código no depende de eso y ya compila.

---
*Phase: 03-modo-cuenta*
*Completed: 2026-08-20*

## Self-Check: PASSED
All 7 created files verified on disk. All 3 task commits (`e32dc50`, `20299d4`, `44a91e4`) verified in git log.
