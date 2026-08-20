---
phase: 03-modo-cuenta
plan: 02
subsystem: cuenta-ledger
tags: [viem, getLogs, erc20, advisory-lock, postgres, mutex]

requires:
  - phase: 03-modo-cuenta
    plan: 01
    provides: "lib/db/client.ts (sql/withTx), lib/privy-server.ts (verifyPrivyToken), lib/config/cuenta.ts (OMNIBUS_VAULT_ADDRESS, DEPOSIT_CHAIN, DAILY_WITHDRAW_LIMIT_BASE_UNITS)"
provides:
  - "lib/cuenta/deposits.ts: syncDeposits() detecta Transfer(to=boveda) en Arbitrum, credita idempotente por tx_hash"
  - "app/api/cuenta/sync-deposits/route.ts: POST que dispara syncDeposits y devuelve depositos del caller"
  - "lib/cuenta/withdrawals.ts: withdraw(userId, amount, chain) con limite diario, advisory lock y firma+envio serializado"
  - "lib/cuenta/chain-mutex.ts: withChainLock(chain, fn) mutex en memoria por chain"
  - "app/api/cuenta/withdraw/route.ts: POST que valida input y expone status/tx_hash"
affects: [03-04]

tech-stack:
  added: []
  patterns:
    - "viem createPublicClient/createWalletClient server-side (no wagmi hooks) para getLogs, readContract y writeContract desde API routes"
    - "erc20Abi de viem reusado para balanceOf/transfer de ARGt en vez de un ABI custom"
    - "withTx + client.query($1,...) para todo flujo con lock/branching (deposits, withdrawals), sql tagged template solo para updates sueltos post-lock"
    - "withChainLock: promise-chain por ChainKey en memoria de modulo, serializa firma+envio fuera de la tx SQL para no pisar nonce"

key-files:
  created:
    - lib/cuenta/deposits.ts
    - app/api/cuenta/sync-deposits/route.ts
    - lib/cuenta/withdrawals.ts
    - lib/cuenta/chain-mutex.ts
    - app/api/cuenta/withdraw/route.ts
  modified: []

key-decisions:
  - "FOR UPDATE en la fila de accounts durante el debito de retiro (no estaba explícito en el plan): el advisory lock es por chain, no por usuario, asi que un usuario retirando en dos chains a la vez podria pisar su propio argt_balance sin este lock de fila. Rule 2 (correctness), no cambia el contrato del plan."
  - "Chequeo de gas nativo de la boveda con margen fijo de 100k gas (ponytail): heuristica simple antes de firmar; si algun transfer real falla por fondos insuficientes de gas, ajustar el margen o usar estimateGas real."
  - "walletAddress nulo en accounts (sintéticos, D-17) rechaza el retiro con 'cuenta sin wallet vinculada' antes de tocar el ledger, en vez de crashear."

requirements-completed: [CTA-02, CTA-04]

duration: ~35min
completed: 2026-08-20
---

# Phase 3 Plan 2: Depósitos por evento Transfer + Retiros firmados Summary

**Detección de depósitos por polling de logs `Transfer` a la bóveda omnibus en Arbitrum (idempotente por `tx_hash`) y retiros firmados server-side con límite diario de 1000 ARGt/24h, `pg_advisory_xact_lock` por chain para el débito, y un mutex en memoria (`withChainLock`) que serializa firma+envío fuera de la transacción SQL — todo implementado y compilando, pendiente de verificación con fondos reales en el checkpoint bloqueante.**

## Performance

- **Duration:** ~35 min
- **Tasks:** 2/3 completados en código (Task 3 es el checkpoint humano bloqueante de fondos reales)
- **Files modified:** 5 (todos nuevos)

## Accomplishments
- `lib/cuenta/deposits.ts`: `syncDeposits()` lee `sync_state.last_processed_block` (default `latest - 5000` si no existe), corre `getLogs` de `Transfer(to=OMNIBUS_VAULT_ADDRESS)` en Arbitrum desde ahí hasta `latest`, matchea `from` contra `accounts.wallet_address`, inserta `movements type='deposit'` (`ON CONFLICT (tx_hash) WHERE type='deposit' DO NOTHING`), suma `argt_balance` y avanza `last_processed_block` — todo en una sola transacción interactiva (`withTx`)
- `app/api/cuenta/sync-deposits/route.ts`: `POST` verifica el token del caller, dispara `syncDeposits()`, devuelve `{ credited, myNewMovements }` con los últimos depósitos del usuario autenticado
- `lib/cuenta/withdrawals.ts`: `withdraw(userId, amount, chain)` toma `pg_advisory_xact_lock(hashtext(chain))`, valida límite diario (suma `withdraw` de las últimas 24h) y balance con `FOR UPDATE` sobre la fila de la cuenta, debita e inserta `movements status='pending'` en la misma tx; fuera de la tx, bajo `withChainLock`, chequea `balanceOf` de la bóveda y gas nativo de la cuenta firmante, firma y envía `transfer` vía `erc20Abi`, y marca `sent`+`tx_hash` o revierte el débito a `failed`
- `lib/cuenta/chain-mutex.ts`: `withChainLock(chain, fn)` encola `fn` detrás de la última operación pendiente por `ChainKey` en un `Map` de módulo, sin tocar Postgres — evita nonces pisados entre retiros casi simultáneos en la misma chain
- `app/api/cuenta/withdraw/route.ts`: `POST` valida `amount` (parseable a bigint, > 0) y `chain` (`CHAINS`), llama `withdraw()`, devuelve `{status:"sent", txHash}` (200) o `{status:"failed", reason}` (422)
- `npm run build` y `eslint` pasan limpios sin `DATABASE_URL` ni `VAULT_PRIVATE_KEY` configuradas

## Task Commits

1. **Task 1: Detección de depósitos (CTA-02)** - `e87167b` (feat)
2. **Task 2: Retiros firmados con límite diario (CTA-04)** - `a7811d6` (feat)
3. **Task 3 (checkpoint humano, no ejecutado por el executor)** - ver abajo

## Files Created

- `lib/cuenta/deposits.ts` - `syncDeposits()`, idempotente, atado a `wallet_address` conocidas
- `app/api/cuenta/sync-deposits/route.ts` - `POST` que dispara el sync y filtra por el caller
- `lib/cuenta/withdrawals.ts` - `withdraw(userId, amount, chain)`, débito→firma→envío con revert en fallo
- `lib/cuenta/chain-mutex.ts` - `withChainLock(chain, fn)`, mutex en memoria por chain
- `app/api/cuenta/withdraw/route.ts` - `POST` con validación de input y respuesta de estado

## Decisions Made

- **`FOR UPDATE` en `accounts` durante el débito de retiro**: el advisory lock de D-15 es por chain (`hashtext(chain)`), no por usuario. Sin un lock adicional a nivel de fila, dos retiros del mismo usuario en chains distintas y simultáneas podrían leer el mismo `argt_balance` antes de que ninguno commitee y sobre-debitar. `SELECT ... FOR UPDATE` cierra esa ventana sin cambiar el contrato del plan (Rule 2, correctness).
- **Margen de gas fijo (100k gas) antes de firmar**: heurística simple (`// ponytail:`) para decidir si la bóveda tiene gas suficiente en la chain destino antes de intentar el `writeContract`; evita un fallo de envío ya con el débito hecho. Techo declarado: si algún retiro real falla por fondos de gas insuficientes pese a pasar este chequeo, subir el margen o cambiar a `estimateGas` real.
- **Cuentas sin `wallet_address` (sintéticas, D-17) rechazan el retiro explícitamente** con `"cuenta sin wallet vinculada"` en vez de fallar más adelante al intentar enviar a una dirección nula.
- **Formato de `movements.amount`/inputs**: `numeric(38,0)` de Postgres se pasa siempre por `BigInt(...)` antes de operar (patrón heredado de 03-01); el body de `withdraw` acepta `amount` como string o number y lo convierte a `bigint` con `BigInt(amount)`, rechazando lo que no parsea.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing critical functionality] `FOR UPDATE` sobre la fila de `accounts` en el débito de retiro**
- **Found during:** Task 2, diseñando el flujo de débito dentro de `withTx`
- **Issue:** El advisory lock de D-15 serializa por chain, no por usuario; sin lock de fila, dos retiros concurrentes del mismo usuario en chains distintas podían leer el mismo balance antes de que cualquiera commiteara
- **Fix:** `SELECT wallet_address, argt_balance FROM accounts WHERE user_id = $1 FOR UPDATE` antes de validar límite/balance y debitar
- **Files modified:** `lib/cuenta/withdrawals.ts`
- **Verification:** `npm run build` pasa; lógica revisada manualmente (no hay entorno con fondos reales aún para probar la concurrencia end-to-end)
- **Committed in:** `a7811d6`

**2. [Rule 2 - Missing critical functionality] Rechazo explícito de retiro sin `wallet_address`**
- **Found during:** Task 2
- **Issue:** Los 60 usuarios sintéticos de 03-01 (D-17) tienen `wallet_address` NULL; sin este chequeo, `withdraw` hubiera intentado enviar un `transfer` a una dirección nula tras debitar
- **Fix:** El débito devuelve `{ ok: false, reason: "cuenta sin wallet vinculada" }` si `account.wallet_address` es nulo, antes de tocar el balance
- **Files modified:** `lib/cuenta/withdrawals.ts`
- **Committed in:** `a7811d6`

No deviations Rule 4 (arquitectónicas); nada requirió decisión del usuario a nivel de código.

## Auth/Env Gates

Ninguno bloqueó la ejecución de código. `VAULT_PRIVATE_KEY` y `DATABASE_URL` no están configuradas en este entorno; ambos módulos usan el mismo patrón de degradación lazy que 03-01 (`getVaultPrivateKey()` solo lanza al llamarse dentro de `withChainLock`, nunca en module-eval), así que `npm run build` pasa sin ellas. La verificación real queda en el checkpoint bloqueante (Task 3).

## Known Stubs

Ninguno. Ambos endpoints están completamente cableados a `lib/cuenta/deposits.ts` / `lib/cuenta/withdrawals.ts`, sin datos mock ni placeholders.

## Threat Flags

Ninguno fuera del `threat_model` del plan. `T-03-04/05/06` cubiertos como estaba previsto (límite+balance en la misma tx del débito, `movements.status` trazable, `userId` siempre de `verifyPrivyToken`). `T-03-07` (clave server-only) sin cambios, aceptado por SPEC §7.7.

## CHECKPOINT_PENDING

**Task 3** (`type="checkpoint:human-action"`, `gate="blocking"`) no fue ejecutado por este executor: requiere `VAULT_PRIVATE_KEY` real, una bóveda fondeada con ARGt y gas en Arbitrum, y una request real a `POST /api/cuenta/withdraw` contra Postgres real. Ninguno de esos tres está disponible en este entorno (mismo bloqueante de Neon que 03-01: términos de Vercel Marketplace pendientes de aceptación).

**Pasos pendientes una vez el entorno esté listo** (además de los ya listados en 03-01-SUMMARY: aplicar schema, seed, `PRIVY_APP_SECRET`):
1. Setear `VAULT_PRIVATE_KEY` (contenido de `~/.wakeup-m2-arb1.key`) en `.env.local` y en Vercel env (server-only, sin prefijo `NEXT_PUBLIC_`); confirmar que el archivo de la clave nunca se agrega a git.
2. Confirmar que `OMNIBUS_VAULT_ADDRESS` (`0x13B56eA93CB18ae90d7Ff6E01Cb97C1AbFB2B992`) tiene ARGt y gas nativo en Arbitrum.
3. Con una cuenta con `wallet_address` y balance (vía depósito real o seed manual), pegarle a `POST /api/cuenta/withdraw` con un monto chico en Arbitrum; confirmar `status: "sent"` y `tx_hash` válido en el explorer.
4. Repetir superando el límite diario (1000 ARGt/24h); confirmar rechazo (422, `status: "failed"`) sin tocar el ledger.
5. Correr `POST /api/cuenta/sync-deposits` dos veces seguidas tras un depósito real; confirmar que la segunda corrida no duplica el movimiento ni el balance.

## Next Phase Readiness

- `lib/cuenta/deposits.ts` (`syncDeposits`) y `lib/cuenta/withdrawals.ts` (`withdraw`) listos para que 03-04 (UI de Cuenta) los consuma vía los dos endpoints nuevos.
- `lib/cuenta/chain-mutex.ts` es un módulo independiente y reusable si otro flujo de esta fase necesita serializar por chain (interés/03-03 no lo necesita: no firma transacciones).
- **Bloqueante:** verificación end-to-end con fondos reales pendiente del mismo checkpoint de Neon/Privy que 03-01. El código no depende de eso para compilar ni para el resto del plan de 03-04.

---
*Phase: 03-modo-cuenta*
*Completed: 2026-08-20*

## Self-Check: PASSED
All 5 created files verified on disk. Both task commits (`e87167b`, `a7811d6`) verified in git log.
