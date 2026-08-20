---
phase: 03-modo-cuenta
plan: 03
subsystem: ledger-interest
tags: [viem, vault, morpho, bigint, cron, vercel]

requires:
  - phase: 03-modo-cuenta
    provides: "lib/db/client.ts (sql/withTx), lib/config/cuenta.ts (OMNIBUS_VAULT_ADDRESS, SPREAD_BPS), lib/db/schema.sql (sync_state)"
provides:
  - "lib/cuenta/interest.ts: accrueInterest() lee convertToAssets del vault real, reparte delta pro rata bigint floor entre accounts"
  - "app/api/cuenta/interest/route.ts: GET/POST protegido por CRON_SECRET, dispara accrueInterest (cron real + manual demo)"
  - "app/api/cuenta/rate/route.ts: GET APY anualizado de los últimos dos snapshots de convertToAssets"
  - "vercel.json: cron diario a /api/cuenta/interest"
affects: [03-04]

tech-stack:
  added: []
  patterns:
    - "publicClient viem server-side (createPublicClient + http(RPC_URLS.arbitrum)) reusa vaultAbi de lib/hooks/use-vault-position.ts en vez de redefinir el ABI"
    - "sync_state guarda snapshot + prev en el mismo withTx que reparte movements, para que APY y devengo lean del mismo par consistente"

key-files:
  created:
    - lib/cuenta/interest.ts
    - app/api/cuenta/interest/route.ts
    - app/api/cuenta/rate/route.ts
    - vercel.json
  modified: []

key-decisions:
  - "Route de interés expone GET y POST con la misma lógica: Vercel Cron Jobs invocan por GET (no POST como asumía el plan); sin esto el cron real devolvería 405 en cada corrida programada"
  - "vaultAbi reusado desde lib/hooks/use-vault-position.ts (client-side) en vez de redefinir el slice ERC-4626 en el módulo server: mismo ABI, una sola fuente"

patterns-established:
  - "Cualquier lectura on-chain server-side de Cuenta usa un publicClient viem propio (no wagmi, que es client-only) con http(RPC_URLS[chain])"

requirements-completed: [CTA-06, CTA-03]

duration: ~25min
completed: 2026-08-20
---

# Phase 3 Plan 3: Devengo de Interés + APY + Cron Summary

**Interés real devengado desde `convertToAssets` del vault ARGt Prime, repartido pro rata bigint-floor entre las cuentas en una única transacción SQL, con APY calculado de los últimos dos snapshots y cron diario de Vercel — código completo y compilando, pendiente de verificación end-to-end contra Postgres real (mismo bloqueo de Neon que 03-01).**

## Performance

- **Duration:** ~25 min
- **Tasks:** 2/3 completados en código (Task 3 es checkpoint humano no bloqueante, ver abajo)
- **Files modified:** 4 (todos creados)

## Accomplishments

- `lib/cuenta/interest.ts`: `accrueInterest()` lee `balanceOf`/`convertToAssets` del vault vía viem público en Arbitrum, compara contra `sync_state['convertToAssets_snapshot_value']` dentro de `withTx`, y si `delta > 0` reparte pro rata (`floor(delta * balance / total)`) insertando `movements type='interest'` y sumando a `accounts.argt_balance`. Primera corrida solo siembra el snapshot sin acreditar. Corridas sin yield nuevo (`delta <= 0`) no acreditan (idempotencia, D-11).
- `app/api/cuenta/interest/route.ts`: `GET`/`POST` protegidos por `CRON_SECRET` (`Authorization: Bearer` o `x-cron-secret`), 401 si no matchea ninguno.
- `app/api/cuenta/rate/route.ts`: `GET` devuelve `{ apy: null }` si falta cualquiera de los dos snapshots (`prev`/`snapshot`), o `{ apy, asOf }` anualizado sobre el intervalo real en días.
- `vercel.json`: cron diario (`0 6 * * *`) a `/api/cuenta/interest`, JSON válido.
- `npm run build` pasa sin `DATABASE_URL`.

## Task Commits

1. **Task 1: Devengo pro rata desde el vault** - `9182b95` (feat)
2. **Task 2: Tasa APY y cron de Vercel** - `bd65597` (feat)

## Files Created/Modified

- `lib/cuenta/interest.ts` - `accrueInterest()`, lectura on-chain + reparto transaccional
- `app/api/cuenta/interest/route.ts` - endpoint protegido, cron + manual
- `app/api/cuenta/rate/route.ts` - APY de los últimos dos snapshots
- `vercel.json` - cron diario

## Decisions Made

- **GET además de POST en `/api/cuenta/interest`**: Vercel Cron Jobs invocan los endpoints configurados en `vercel.json` con un request `GET`, no `POST` como asumía el plan. Sin `GET`, la corrida programada real habría devuelto 405 cada día. Se exportan `GET` y `POST` apuntando al mismo handler; el `POST` queda como el camino natural para dispararlo a mano en la demo (`curl -X POST`).
- **ABI del vault reusado**: `vaultAbi` se importa de `lib/hooks/use-vault-position.ts` (ya tiene el slice ERC-4626 necesario: `balanceOf`, `convertToAssets`) en vez de redefinirlo en el módulo server, evitando dos fuentes de verdad para el mismo ABI.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Cron de Vercel invoca por GET, no POST**
- **Found during:** Task 2, al verificar cómo Vercel dispara los cron jobs definidos en `vercel.json`
- **Issue:** El plan especificaba el endpoint solo como `POST`, pero Vercel Cron Jobs mandan `GET` a la `path` configurada; una corrida real habría fallado con 405 antes de llegar a la validación de `CRON_SECRET`
- **Fix:** `app/api/cuenta/interest/route.ts` exporta `GET` y `POST` apuntando al mismo handler (misma auth, mismo `accrueInterest()`)
- **Files modified:** `app/api/cuenta/interest/route.ts`
- **Verification:** `npm run build` pasa; comportamiento a confirmar contra el cron real en Task 3 (checkpoint)
- **Committed in:** `9182b95`

---

**Total deviations:** 1 auto-fixed (Rule 1, bug de plumbing del cron).
**Impact on plan:** Ninguno en el alcance; corrige que el cron real funcione tal como el plan pretendía.

## Issues Encountered

Ninguno más allá del deviation documentado arriba.

## User Setup Required

**Checkpoint pendiente (Task 3, `type="checkpoint:human-action"`, `gate="non-blocking"`).** Todo el código está implementado y `npm run build` pasa, pero no puede verificarse end-to-end sin `DATABASE_URL` real (mismo bloqueo de Neon que 03-01: pendiente de aceptar términos en Vercel Marketplace) ni `CRON_SECRET` seteado.

Pasos pendientes una vez `DATABASE_URL` exista:
1. Generar `CRON_SECRET` (`openssl rand -hex 32`), setearlo en `.env.local` y en Vercel env.
2. Local: `curl -X POST -H "Authorization: Bearer $CRON_SECRET" localhost:3000/api/cuenta/interest` dos veces seguidas — confirmar que la primera solo siembra el snapshot y la segunda no acredita de más sin yield real.
3. Deployar con `vercel.json` incluido y confirmar en Vercel Dashboard → Cron Jobs que `/api/cuenta/interest` quedó registrado.
4. Disparar una corrida desde el dashboard y confirmar en Logs que llegó con `Authorization: Bearer` y devolvió 200 (no 401, no 405).
5. Confirmar `GET /api/cuenta/rate` una vez que hay dos snapshots.

## Next Phase Readiness

- `lib/cuenta/interest.ts` y las dos rutas quedan listas para que 03-04 (UI de Cuenta) muestre el APY (`/api/cuenta/rate`) y el interés acumulado (ya expuesto por `/api/cuenta/account` de 03-01, alimentado por los `movements type='interest'` que este plan inserta).
- **Bloqueante compartido:** verificación end-to-end depende del mismo checkpoint de Neon que 03-01 (Task 3 de ese plan). El código de este plan no depende de nada adicional y ya compila.

---
*Phase: 03-modo-cuenta*
*Completed: 2026-08-20*

## Self-Check: PASSED
All 4 created files verified on disk. Both task commits (`9182b95`, `bd65597`) verified in git log.
