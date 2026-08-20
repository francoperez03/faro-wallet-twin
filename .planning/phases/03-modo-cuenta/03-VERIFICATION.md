---
phase: 03-modo-cuenta
verified: 2026-08-20T05:02:32Z
status: gaps_found
score: 4/5 must-haves verified at code level (1 partial), runtime pending on all
verdict: GAPS
gaps:
  - truth: "User pasa ARGt a su Cuenta y lo ve acreditado cuando el backend detecta el evento Transfer (D-08: 3 disparadores de sync-deposits)"
    status: partial
    reason: "D-08 (03-CONTEXT.md, decisión no marcada como discrecional) especifica tres disparadores redundantes de syncDeposits(): (a) al cargar la vista Cuenta, (b) polling corto del cliente en la pantalla Pasar a Cuenta, (c) desde el cron de interés como barrido de respaldo. Solo (b) está implementado. Si el usuario navega fuera de /cuenta/pasar antes de que el polling (máx. 60s) detecte su depósito, o si otra causa deja el depósito sin sincronizar, no hay ningún otro disparador en el código que lo recupere: ni app/(tabs)/cuenta/page.tsx (Home) ni lib/cuenta/interest.ts llaman a syncDeposits()."
    artifacts:
      - path: "app/(tabs)/cuenta/page.tsx"
        issue: "load() solo hace fetch a /api/cuenta/account y /api/cuenta/rate; no dispara POST /api/cuenta/sync-deposits al montar (falta el disparador (a) de D-08)"
      - path: "lib/cuenta/interest.ts"
        issue: "accrueInterest() no importa ni llama a syncDeposits(); no hay barrido de respaldo en el cron de interés (falta el disparador (c) de D-08)"
    missing:
      - "Llamar a POST /api/cuenta/sync-deposits (o invocar syncDeposits() directamente si es server-to-server) al cargar app/(tabs)/cuenta/page.tsx"
      - "Invocar syncDeposits() desde accrueInterest() (o desde el handler de app/api/cuenta/interest/route.ts) antes o después de devengar interés, como barrido de respaldo diario"
human_verification:
  - test: "Aplicar schema.sql y seed contra Neon real (DATABASE_URL), setear PRIVY_APP_SECRET/NEXT_PUBLIC_PRIVY_APP_ID reales, y confirmar GET /api/cuenta/account con un login Privy real crea/actualiza la fila de accounts con wallet_address no nulo"
    expected: "Fila en accounts con wallet_address = embedded wallet del usuario logueado"
    why_human: "Requiere Postgres real (Neon, bloqueado en aceptación de términos en Vercel Marketplace) y credenciales Privy reales; no verificable con lectura de código"
  - test: "Depositar ARGt real en Arbitrum a la bóveda omnibus desde la pantalla Pasar a Cuenta y confirmar que el estado pasa a 'Acreditado' dentro del polling, y que correr sync-deposits dos veces no duplica el movimiento ni el balance"
    expected: "Movement type=deposit insertado una sola vez, argt_balance sube exactamente el monto transferido"
    why_human: "Requiere tx real on-chain, RPC de Arbitrum y Postgres real; el índice único sobre tx_hash es correcto por inspección de schema pero la idempotencia end-to-end no se puede probar sin ejecutar"
  - test: "Retirar un monto chico con VAULT_PRIVATE_KEY real y bóveda fondeada con ARGt+gas en Arbitrum/Base/Polygon; confirmar tx_hash válido en el explorer y que el balance en Cuenta baja"
    expected: "status: 'sent' con tx_hash resoluble en el explorer, argt_balance debitado"
    why_human: "Requiere clave privada real, fondos reales en la bóveda y RPC en vivo; el flujo de código (débito→lock→firma→envío→revert en fallo) está verificado por lectura pero no ejecutado"
  - test: "Superar el límite diario (1000 ARGt/24h) con varios retiros chicos acumulados y confirmar que el N-ésimo retiro es rechazado (422, status:'failed') sin tocar el ledger, incluso cuando el cliente no bloquea porque cada retiro individual es menor a 1000"
    expected: "Retiro rechazado con reason del límite diario cuando la suma de withdraws de las últimas 24h + el nuevo monto supera 1000 ARGt"
    why_human: "La query SQL (WHERE created_at > now() - interval '24 hours') es correcta por inspección, pero el comportamiento acumulado con múltiples retiros reales requiere ejecución contra Postgres real"
  - test: "Correr el cron de Vercel end-to-end (o el trigger manual con CRON_SECRET) y confirmar en logs que responde 200 (no 401 ni 405), y que la segunda corrida sin yield nuevo no acredita de más"
    expected: "Primera corrida siembra snapshot sin acreditar; corridas subsiguientes con delta>0 reparten pro rata; delta<=0 no acredita"
    why_human: "Requiere CRON_SECRET real, deploy en Vercel con vercel.json y Postgres real; la lógica de accrueInterest() está verificada por lectura (floor, pro rata, snapshot) pero no ejecutada"
---

# Phase 3: Modo Cuenta Verification Report

**Phase Goal:** Un usuario mantiene un saldo custodial en el neobanco, con interés, y puede mover fondos entre su wallet y su cuenta.
**Verified:** 2026-08-20T05:02:32Z
**Status:** gaps_found (1 code-level gap; all other truths verified at code level; runtime verification pending across the board on Neon/Privy checkpoints, consistent with what all 4 SUMMARYs report)
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (ROADMAP Success Criteria, Phase 3)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User alterna entre modo Wallet y modo Cuenta con un toggle persistente | VERIFIED (code) | `lib/hooks/use-cuenta-mode.ts` persiste en `localStorage['twin-mode']` (D-19), SSR-safe (default `"wallet"`, hidrata en `useEffect`). `components/mode-toggle.tsx` montado en `app/(tabs)/layout.tsx:20` arriba de las tabs; el tab Home condiciona `homeHref` por `mode`. Runtime (persistencia real tras refresh) no verificable sin browser, pero es JS estándar de `localStorage`, no bloqueado por Neon/Privy. |
| 2 | User pasa ARGt a su Cuenta y lo ve acreditado cuando el backend detecta el evento Transfer, atado a su DID de Privy | PARTIAL | Mecanismo de detección/crédito completo y correcto (`lib/cuenta/deposits.ts::syncDeposits()`: `getLogs` de `Transfer(to=bóveda)` en Arbitrum, match `from` contra `wallet_address`, inserta `movements` idempotente por `tx_hash`, actualiza `argt_balance` y `last_processed_block` en la misma `withTx`). Wiring del disparador (b) confirmado: `app/(tabs)/cuenta/pasar/page.tsx` hace poll de `POST /api/cuenta/sync-deposits` cada 5s hasta ver el `tx_hash` propio. **Gap:** disparadores (a) y (c) de D-08 no están wireados — ver Gaps Summary. |
| 3 | User ve su saldo en Cuenta, el interés acumulado y la tasa actual | VERIFIED (code) | `app/(tabs)/cuenta/page.tsx` hace `fetch('/api/cuenta/account')` (saldo + interés) y `fetch('/api/cuenta/rate')` (APY) con el access token de Privy. `app/api/cuenta/account/route.ts` devuelve `argtBalance`, `interestAccrued` (suma de `movements type='interest'`) como strings de bigint. `app/api/cuenta/rate/route.ts` devuelve `{apy: null}` con fallback "Ver en Morpho" si faltan snapshots (D-12), o el APY anualizado real. |
| 4 | User retira de su Cuenta a su embedded wallet en la chain elegida, respetando el límite diario | VERIFIED (code) | `app/(tabs)/cuenta/retirar/page.tsx` → `POST /api/cuenta/withdraw` → `lib/cuenta/withdrawals.ts::withdraw()`: `pg_advisory_xact_lock(hashtext(chain))` (D-15), `SELECT ... FOR UPDATE` sobre la fila de `accounts`, suma de `withdraw` de las últimas 24h vía SQL (`created_at > now() - interval '24 hours'`, D-14) comparada contra `DAILY_WITHDRAW_LIMIT_BASE_UNITS`, débito+`movements status='pending'` en la misma tx, luego firma+envío serializado por `withChainLock` (mutex por chain), `sent`+`tx_hash` o revert a `failed` en cualquier fallo (`revertDebit`). Rechaza explícitamente cuentas con `wallet_address` NULL (sintéticos). |
| 5 | El ledger en Postgres tiene cuentas y movimientos sembrados con usuarios sintéticos, con volumen suficiente para un corte | VERIFIED (code) | `lib/db/schema.sql` define `accounts`/`movements`/`sync_state` idempotente. `lib/db/seed.ts`: 60 cuentas `did:privy:synthetic-001..060`, `wallet_address=null`, PRNG determinista (`mulberry32`, seed fijo `20260819`), balances log-normal clamp [10, 50000] ARGt (mayoría 100-5000 por diseño de la distribución), 1-3 movimientos `deposit`/`interest` históricos por cuenta, upsert idempotente (`ON CONFLICT (user_id) DO UPDATE`, `DELETE`+re-`INSERT` de movements). Ningún componente UI lista o renderiza usuarios sintéticos (`grep -rn "synthetic|did:privy" app/ components/` → sin resultados fuera del propio `lib/db/seed.ts`). |

**Score:** 4/5 truths fully verified at code level, 1/5 partial (mechanism exists, 2 of 3 required trigger points missing). Runtime execution against real Postgres/Privy/vault funds pending on all 5 (see Human Verification).

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `lib/db/schema.sql` | accounts/movements/sync_state idempotente, unique index parcial sobre tx_hash | VERIFIED | `CREATE TABLE IF NOT EXISTS` x3, `CREATE UNIQUE INDEX IF NOT EXISTS movements_deposit_tx_hash_idx ... WHERE type = 'deposit'` |
| `lib/db/client.ts` | `sql` lazy (HTTP) + `withTx` (WebSocket, BEGIN/COMMIT/ROLLBACK real) | VERIFIED | `getDb()` lazy, nunca se conecta en module-eval; `withTx` abre `Pool`, hace `BEGIN`→`fn`→`COMMIT`/`ROLLBACK`, libera y cierra el pool en `finally` |
| `lib/privy-server.ts` | `verifyPrivyToken` server-side, DID + embedded wallet | VERIFIED | Usa `@privy-io/server-auth`, `client.verifyAuthToken(token)` + `client.getUser(userId)`, filtra `linkedAccounts` por `type==='wallet' && walletClientType==='privy'` |
| `lib/config/cuenta.ts` | OMNIBUS_VAULT_ADDRESS, DEPOSIT_CHAIN, DAILY_WITHDRAW_LIMIT_BASE_UNITS, SPREAD_BPS | VERIFIED | Los 4 exports presentes, límite en bigint (`BigInt(1000) * BigInt(10) ** BigInt(18)`), `DEPOSIT_CHAIN="arbitrum"`, `SPREAD_BPS=0` |
| `lib/cuenta/deposits.ts` | `syncDeposits()` idempotente | VERIFIED | Ver Observable Truths #2 |
| `lib/cuenta/withdrawals.ts` | `withdraw()` con lock+límite+revert | VERIFIED | Ver Observable Truths #4 |
| `lib/cuenta/chain-mutex.ts` | mutex en memoria por chain | VERIFIED | `withChainLock()` encola promesas por `ChainKey` en un `Map` de módulo; `ponytail:` documenta el techo (single-instance) |
| `lib/cuenta/interest.ts` | `accrueInterest()` pro rata bigint-floor desde el vault | VERIFIED | `delta = actual - snapshotPrevio`; reparto `(delta * balance) / totalBalances` (floor por división entera de bigint); primera corrida solo siembra snapshot; `delta<=0` no acredita |
| `app/api/cuenta/account/route.ts`, `sync-deposits/route.ts`, `withdraw/route.ts` | autenticados vía verifyPrivyToken | VERIFIED | Los 3 llaman `verifyPrivyToken(req.headers.get("authorization"))` y devuelven 401 en fallo, antes de tocar el ledger |
| `app/api/cuenta/interest/route.ts` | autenticado vía CRON_SECRET Bearer | VERIFIED | Chequea `Authorization: Bearer $CRON_SECRET` o header `x-cron-secret`; 401 si no matchea o si `CRON_SECRET` no está seteado |
| `app/api/cuenta/rate/route.ts` | público, sin datos de usuario | NOTA (no gap) | Sin auth, pero solo expone snapshots agregados de `convertToAssets` (dato público de mercado), ningún dato por-usuario. Fuera del alcance de "cada ruta autentica" del pedido porque no maneja identidad ni fondos. |
| `lib/db/seed.ts` | determinista, ledger-only | VERIFIED | Ver Observable Truths #5 |
| `vercel.json` | cron diario a /api/cuenta/interest | VERIFIED | JSON válido, `"schedule": "0 6 * * *"` |
| `lib/hooks/use-cuenta-mode.ts`, `components/mode-toggle.tsx` | toggle localStorage | VERIFIED | Ver Observable Truths #1 |
| `app/(tabs)/cuenta/page.tsx`, `pasar/page.tsx`, `retirar/page.tsx` | UI cableada a endpoints reales | VERIFIED (salvo gap del disparador (a) en Home) | Ver Observable Truths #2-4 |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| `app/(tabs)/cuenta/pasar/page.tsx` | `POST /api/cuenta/sync-deposits` | `fetch` en `pollForCredit` | WIRED | Poll cada 5s, máx 12 intentos, matchea `txHash` local contra `myNewMovements` |
| `app/(tabs)/cuenta/page.tsx` | `POST /api/cuenta/sync-deposits` | (esperado por D-08 disparador (a)) | NOT_WIRED | `load()` solo llama `/api/cuenta/account` y `/api/cuenta/rate`, nunca `sync-deposits` |
| `app/api/cuenta/interest/route.ts`/`lib/cuenta/interest.ts` | `syncDeposits()` | (esperado por D-08 disparador (c), barrido de respaldo) | NOT_WIRED | `accrueInterest()` no importa `lib/cuenta/deposits.ts` |
| `app/(tabs)/cuenta/retirar/page.tsx` | `POST /api/cuenta/withdraw` | `fetch` en `onSubmit` | WIRED | Envía `amount`/`chain`, maneja `status:"sent"`/`"failed"` |
| `lib/cuenta/withdrawals.ts::withdraw` | Postgres (`accounts`/`movements`) | `withTx` + `FOR UPDATE` + advisory lock | WIRED | Débito, límite 24h y balance validados dentro de la misma transacción antes del insert |
| `lib/cuenta/withdrawals.ts::sendWithdrawal` | vault omnibus on-chain | `viem writeContract` bajo `withChainLock` | WIRED | Firma+envío fuera de la tx SQL, revert de débito en cualquier excepción o fondos insuficientes |
| `lib/cuenta/interest.ts::accrueInterest` | vault ARGt Prime | `readContract(convertToAssets)` | WIRED | Lee `balanceOf` + `convertToAssets` del vault real vía `publicClient` |
| `components/mode-toggle.tsx` | `app/(tabs)/layout.tsx` | import + render | WIRED | `<ModeToggle />` en el layout, arriba de `<main>` |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| CTA-01 | 03-04 | Toggle Wallet/Cuenta persistente | SATISFIED (code) | `use-cuenta-mode.ts` + `mode-toggle.tsx` |
| CTA-02 | 03-02, 03-04 | Pasar ARGt a Cuenta, acreditado por evento Transfer | PARTIAL | Mecanismo + disparador (b) completos; disparadores (a)/(c) de D-08 faltan (ver gap) |
| CTA-03 | 03-03, 03-04 | Saldo, interés acumulado, tasa actual | SATISFIED (code) | `/api/cuenta/account`, `/api/cuenta/rate`, Home de Cuenta |
| CTA-04 | 03-02, 03-04 | Retiro con límite diario | SATISFIED (code) | `withdrawals.ts`, `/api/cuenta/withdraw`, `retirar/page.tsx` |
| CTA-05 | 03-01 | Ledger Postgres con seed sintético | SATISFIED (code) | `schema.sql`, `seed.ts` |
| CTA-06 | 03-03 | Interés pro rata desde yield real del vault | SATISFIED (code) | `interest.ts::accrueInterest`, floor bigint, pro rata |

No orphaned requirements: los 6 IDs de CTA-01..06 aparecen en `requirements-completed` de algún plan y coinciden con `.planning/REQUIREMENTS.md`.

### Anti-Patterns Found

Ninguno bloqueante. `grep` de `TODO|FIXME|XXX|HACK|not implemented|coming soon` sobre todos los archivos de la fase no devuelve resultados. Dos comentarios `// ponytail:` documentados explícitamente con su techo y upgrade path (margen de gas fijo en `withdrawals.ts`, mutex en memoria de una instancia en `chain-mutex.ts`) — ambos son simplificaciones deliberadas y declaradas, no stubs.

### Money-Path Arithmetic Spot Check

- `grep -rn "parseFloat|Number(" lib/cuenta/ lib/db/ app/api/cuenta/"`: dos únicos matches, ambos en `app/api/cuenta/rate/route.ts` (`Number(convertToAssets_prev_value)`, `Number(convertToAssets_snapshot_value)`) para calcular el APY mostrado en UI. Estos valores **no** escriben al ledger ni participan del reparto de interés (que usa bigint floor en `lib/cuenta/interest.ts`); son solo para el display de un porcentaje. Aceptable — no es un money-path de balance.
- Todo lo demás en `lib/cuenta/`, `lib/db/` y las rutas de Cuenta opera sobre `bigint` (balances, montos, deltas). Ningún float toca `argt_balance`/`movements.amount`.

### Security Spot Check

- `account`, `sync-deposits`, `withdraw`: los 3 llaman `verifyPrivyToken` antes de tocar el ledger; `userId` sale siempre de `identity.userId` (nunca del body/query).
- `interest`: protegido por `CRON_SECRET` (Bearer o header custom), 401 si no matchea.
- `rate`: sin auth, pero sin datos por-usuario (ver nota en tabla de artifacts).
- `VAULT_PRIVATE_KEY`, `DATABASE_URL`, `PRIVY_APP_SECRET`, `CRON_SECRET`: ninguno tiene prefijo `NEXT_PUBLIC_`; `grep` confirma que solo se leen desde módulos server (`lib/db/*.ts`, `lib/cuenta/withdrawals.ts`, `lib/privy-server.ts`, `app/api/cuenta/interest/route.ts`). `NEXT_PUBLIC_PRIVY_APP_ID` es intencionalmente público (app id, no secreto).
- `withdraw()` rechaza explícitamente cuentas con `wallet_address` NULL antes de debitar.

### D-Compliance Spot Checks

| Decisión | Estado | Evidencia |
|----------|--------|-----------|
| D-06/D-07 depósitos solo Arbitrum | VERIFIED | `DEPOSIT_CHAIN="arbitrum"`, `deposits.ts` usa `createPublicClient({chain: arbitrum, ...})` hardcoded |
| D-19 toggle en localStorage | VERIFIED | `use-cuenta-mode.ts` |
| D-07 (Phase 1, reusado) sugerencia de bridge en pasar | VERIFIED | `pasar/page.tsx`: `showBridgeSuggestion` + link a `/bridge` cuando falta saldo en Arbitrum pero hay en Base/Polygon |
| interés GET+POST para cron de Vercel | VERIFIED | `export const GET = handle; export const POST = handle;` |
| D-08 tres disparadores de sync-deposits | PARTIAL — ver gap | Solo disparador (b) implementado |
| D-17/D-18 seed determinista y ledger-only | VERIFIED | Ver Observable Truths #5 |

### Human Verification Required

Ver frontmatter `human_verification`. Los cinco ítems (upsert de cuenta con login real, depósito real con idempotencia, retiro real con fondos, límite diario acumulado, cron real end-to-end) requieren Postgres real (Neon, bloqueado en aceptación de términos de Vercel Marketplace según los 4 SUMMARYs) y/o credenciales Privy/clave de bóveda reales. Ninguno es verificable por lectura de código; la lógica subyacente de cada uno fue inspeccionada y es correcta.

### Gaps Summary

Un gap de código real, independiente del bloqueo de runtime: **D-08 solo tiene 1 de 3 disparadores implementados.** `lib/cuenta/deposits.ts::syncDeposits()` es correcto e idempotente, y el flujo principal de la demo (usuario transfiere y espera en la pantalla "Pasar a Cuenta") funciona porque el disparador (b) —polling del cliente— está completo. Pero ni la Home de Cuenta (disparador (a), "al cargar la vista Cuenta") ni el cron de interés (disparador (c), "barrido de respaldo") llaman a `syncDeposits()`. Si un usuario deposita y cierra la pestaña antes de que el polling (máx. 60s) detecte el evento, o si el polling falla por cualquier motivo, su depósito queda sin acreditar indefinidamente hasta que alguien (cualquier usuario) vuelva a visitar `/cuenta/pasar` y dispare una nueva transferencia. Esto no es un problema de runtime pendiente — es un gap en el código que no depende de Neon/Privy para corregirse, y contradice una decisión de contexto explícita (D-08) que fue diseñada precisamente para eliminar este single point of failure.

**This looks like an oversight rather than an intentional deviation** — ninguno de los 4 PLAN.md ni SUMMARY.md menciona haber descoped los disparadores (a)/(c) a propósito; simplemente no fueron asignados a ninguna task. Si el equipo decide aceptarlo como está (p. ej. por tiempo, dado que el disparador (b) cubre el camino feliz de la demo), se puede agregar un override:

```yaml
overrides:
  - must_have: "D-08 tres disparadores de sync-deposits (a, b, c)"
    reason: "Disparador (b) cubre el camino feliz de la demo (usuario espera en pantalla); (a)/(c) descoped por tiempo antes del deadline"
    accepted_by: "{nombre}"
    accepted_at: "{timestamp}"
```

Si no, la corrección es pequeña: un `fetch('/api/cuenta/sync-deposits', {method:'POST', ...})` en el `load()` de `app/(tabs)/cuenta/page.tsx` (disparador a) y una llamada a `syncDeposits()` dentro de `accrueInterest()` o del handler de `app/api/cuenta/interest/route.ts` (disparador c).

Fuera de este gap, la fase está completa a nivel de código: todos los money-paths usan bigint, el flujo de retiro tiene debit-first + revert + advisory lock + FOR UPDATE + mutex por chain, el límite diario es una ventana móvil real en SQL, la idempotencia de depósitos está en el mismo índice único + misma transacción que avanza `last_processed_block`, y toda ruta de Cuenta que toca fondos o identidad autentica correctamente. La verificación runtime (Neon/Privy/fondos reales) está consistentemente bloqueada en los 4 checkpoints documentados y es honesta en los 4 SUMMARYs — no hay ninguna claim de "funciona end-to-end" sin evidencia.

---

*Verified: 2026-08-20T05:02:32Z*
*Verifier: Claude (gsd-verifier)*
