---
phase: 03-modo-cuenta
plan: 04
subsystem: ui
tags: [nextjs, privy, wagmi, viem, localStorage, polling]

requires:
  - phase: 03-modo-cuenta
    plan: "01/02/03"
    provides: "GET /api/cuenta/account, GET /api/cuenta/rate, POST /api/cuenta/sync-deposits, POST /api/cuenta/withdraw, lib/config/cuenta.ts"
  - phase: 01-wallet-mode
    plan: "02"
    provides: "useTokenBalances(address), patrón de transfer (switchChainAsync + writeContractAsync), design system shadcn/Tailwind"
provides:
  - "lib/hooks/use-cuenta-mode.ts: useCuentaMode() persistido en localStorage['twin-mode'] (D-19)"
  - "components/mode-toggle.tsx: segmented control Wallet/Cuenta montado en app/(tabs)/layout.tsx"
  - "app/(tabs)/cuenta/page.tsx: Home de Cuenta (saldo, interés, tasa)"
  - "app/(tabs)/cuenta/pasar/page.tsx: transfer a la bóveda con polling de acreditación"
  - "app/(tabs)/cuenta/retirar/page.tsx: retiro con estado y límite diario"
  - "lib/config/tokens.ts: CHAIN_LABELS y EXPLORER_TX_URL exportados (antes locales a actividad/page.tsx)"
affects: [04]

tech-stack:
  added: []
  patterns:
    - "useCuentaMode(): SSR-safe (default 'wallet', hidrata en useEffect), evita mismatch de hidratación con localStorage"
    - "Polling corto (setInterval-like loop con await sleep) contra POST /api/cuenta/sync-deposits, matcheando el tx_hash local devuelto por writeContractAsync contra myNewMovements"
    - "getAccessToken() de usePrivy() en cada fetch a /api/cuenta/*, nunca se cachea el token entre requests"

key-files:
  created:
    - lib/hooks/use-cuenta-mode.ts
    - components/mode-toggle.tsx
    - app/(tabs)/cuenta/page.tsx
    - app/(tabs)/cuenta/pasar/page.tsx
    - app/(tabs)/cuenta/retirar/page.tsx
  modified:
    - app/(tabs)/layout.tsx
    - lib/config/tokens.ts

key-decisions:
  - "Límite diario en Retirar validado en cliente contra el tope fijo (1000 ARGt) de lib/config/cuenta.ts, no contra el consumo real de las últimas 24h del usuario: no hay endpoint que exponga ese remanente y agregar uno estaba fuera del alcance de este plan (UI-only). El servidor (lib/cuenta/withdrawals.ts, D-14) sigue siendo la fuente de verdad; si el cliente deja pasar un monto que excede el consumo real de 24h, el POST vuelve status:'failed' con reason y la UI lo muestra igual, sin tocar el ledger."
  - "CHAIN_LABELS y EXPLORER_TX_URL, que ya existían duplicados dentro de app/(tabs)/actividad/page.tsx, se promovieron a lib/config/tokens.ts para que pasar/ y retirar/ los reusen sin repetir el mapa; actividad/page.tsx no se tocó (fuera del files_modified de este plan)."

requirements-completed: [CTA-01, CTA-02, CTA-03, CTA-04]

duration: ~40min
completed: 2026-08-20
---

# Phase 3 Plan 4: UI del modo Cuenta (toggle, home, pasar a cuenta, retirar) Summary

**Toggle Wallet/Cuenta persistente en localStorage integrado al shell de tabs, Home de Cuenta con saldo/interés/tasa reales, Pasar a Cuenta reusando el patrón de transfer de Phase 1 con polling de acreditación y sugerencia de bridge (D-07), y Retirar con selector de chain y estados Procesando/Enviado/Fallido — todo el código compila (`npm run build`) y queda cableado a los endpoints reales de 03-01/02/03; la verificación end-to-end con fondos y Postgres reales queda pendiente del mismo checkpoint de Neon/Privy bloqueado en fases anteriores.**

## Performance

- **Duration:** ~40 min
- **Tasks:** 2/3 completados y verificados con `npm run build`; Task 3 es un checkpoint `human-verify` bloqueante — el código quedó implementado y compila, pero la verificación en vivo requiere el mismo entorno runtime (`DATABASE_URL`, Privy app id, fondos reales) que 03-01/02/03 ya reportaron como pendiente
- **Files modified:** 7 (5 creados, 2 modificados)

## Accomplishments

- `lib/hooks/use-cuenta-mode.ts` + `components/mode-toggle.tsx`: toggle Wallet/Cuenta persistido en `localStorage['twin-mode']`, montado en `app/(tabs)/layout.tsx` arriba de las tabs; el tab Home redirige a `/cuenta` o `/home` según el modo activo
- `app/(tabs)/cuenta/page.tsx`: saldo (Display 32px), interés acumulado y tasa (APY real o fallback "Ver en Morpho") leídos de `/api/cuenta/account` y `/api/cuenta/rate` con el access token de Privy
- `app/(tabs)/cuenta/pasar/page.tsx`: mismo patrón de transfer de `enviar/page.tsx` (Phase 1) con destino fijo (`OMNIBUS_VAULT_ADDRESS`) y chain fija (Arbitrum, `DEPOSIT_CHAIN`); tras la tx, poll de `POST /api/cuenta/sync-deposits` cada 5s (máx. 12 intentos) hasta ver el `tx_hash` propio en `myNewMovements`, mostrando "Confirmando..." → "Acreditado" o el mensaje de timeout no bloqueante; sugerencia de bridge si falta saldo en Arbitrum pero hay ARGt en Base/Polygon (D-07)
- `app/(tabs)/cuenta/retirar/page.tsx`: input de monto + selector de las 3 chains, validación contra el saldo de Cuenta (no on-chain) y el tope diario; `POST /api/cuenta/withdraw` síncrono con estado Procesando → Enviado (tx_hash + link a explorer) o Fallido (reason del servidor)
- `npm run build` pasa limpio en los tres commits de código

## Task Commits

1. **Task 1: Toggle Wallet/Cuenta persistente (CTA-01)** - `b60b199` (feat)
2. **Task 2: Home de Cuenta y Pasar a Cuenta (CTA-02, CTA-03)** - `f2a3ed8` (feat)
3. **Task 3 (código de Retirar, checkpoint humano pendiente)** - `49811cf` (feat)

## Files Created/Modified

- `lib/hooks/use-cuenta-mode.ts` - `useCuentaMode()`, SSR-safe, persiste en localStorage
- `components/mode-toggle.tsx` - segmented control Wallet/Cuenta, 44px touch target, accent en activo
- `app/(tabs)/layout.tsx` - `ModeToggle` montado arriba de las tabs; tab Home condicional por modo
- `app/(tabs)/cuenta/page.tsx` - Home de Cuenta: saldo, interés, tasa, CTAs
- `app/(tabs)/cuenta/pasar/page.tsx` - transfer a la bóveda + polling de acreditación + sugerencia de bridge
- `app/(tabs)/cuenta/retirar/page.tsx` - retiro con selector de chain, validación y estados
- `lib/config/tokens.ts` - `CHAIN_LABELS`, `EXPLORER_TX_URL` exportados (reuso, antes locales a `actividad/page.tsx`)

## Decisions Made

- **Límite diario validado en cliente contra el tope fijo, no contra el remanente real de 24h**: no existe (ni estaba en el alcance) un endpoint que exponga cuánto lleva retirado el usuario en la ventana móvil de D-14; el cliente bloquea montos por encima del tope absoluto (1000 ARGt) como UX preventiva, y el servidor (`lib/cuenta/withdrawals.ts`) sigue validando el límite real y devolviendo `reason` en caso de rechazo, que la UI muestra igual sin tocar el ledger (alineado con el `threat_model` T-03-10 del plan: la validación real vive en el servidor).
- **`CHAIN_LABELS`/`EXPLORER_TX_URL` promovidos a `lib/config/tokens.ts`**: ya existían duplicados dentro de `actividad/page.tsx` (Phase 1); en vez de definir un tercer mapa local en `pasar/` y `retirar/`, se exportaron desde el módulo de config único (consistente con D-10 de Phase 1). `actividad/page.tsx` no se modificó, sigue con su copia local hasta que un plan futuro la migre (fuera de alcance aquí).

## Deviations from Plan

None - plan ejecutado tal como está escrito. Los dos puntos de "Decisions Made" arriba son detalles dejados a discreción del ejecutor (`03-CONTEXT.md`: "Copy exacto de pantallas... intervalos precisos de polling del cliente" y "Nombres de rutas... Detalles menores"), no desviaciones de Rule 1-4.

## Known Stubs

Ninguno. Las tres pantallas están completamente cableadas a los endpoints reales de 03-01/02/03, sin datos mock ni placeholders — su verificación en vivo depende del entorno runtime (Neon/Privy), no de código faltante.

## Threat Flags

Ninguno fuera del `threat_model` del plan. La validación cliente de monto/límite en `retirar/page.tsx` es explícitamente solo UX (T-03-10, disposition `mitigate` ya cubierta server-side en 03-02); el saldo/interés en Home solo es visible para el usuario logueado vía su propio token (T-03-11, `accept`).

## CHECKPOINT_PENDING

**Task 3** (`type="checkpoint:human-verify"`, `gate="blocking"`) no fue ejecutado por este executor: el código de las 4 pantallas está completo y `npm run build` pasa, pero la verificación en vivo (`how-to-verify` del plan) requiere:

1. `DATABASE_URL` real (Neon, mismo bloqueo reportado en 03-01: pendiente de aceptar términos en Vercel Marketplace).
2. Privy app id/secret reales (`PRIVY_APP_SECRET`, `NEXT_PUBLIC_PRIVY_APP_ID`) para que `usePrivy()`/`verifyPrivyToken` funcionen de punta a punta.
3. La bóveda fondeada con ARGt y gas real en Arbitrum/Base/Polygon (mismo bloqueo reportado en 03-02 para el flujo de retiro).

Ninguno de esos tres está disponible en este entorno. Ninguno de ellos bloquea el código de este plan: las 4 pantallas compilan y quedan cableadas a los endpoints correctos, listas para el checkpoint apenas el entorno esté disponible.

**Pasos de verificación pendientes (los del plan, sin cambios):**

1. Con `npm run dev` y las envs de 03-01/02/03 seteadas, loguearse con Privy y confirmar que el toggle Wallet/Cuenta aparece arriba de la app y persiste tras refrescar.
2. Cambiar a modo Cuenta: confirmar que la Home de Cuenta muestra saldo (real o "0" si es cuenta nueva), interés acumulado y tasa.
3. Ir a "Pasar a Cuenta", transferir un monto chico de ARGt en Arbitrum, y confirmar que en menos de ~30s la pantalla muestra "Acreditado" y el saldo en la Home sube.
4. Ir a "Retirar", pedir un retiro chico a una chain, y confirmar que el estado pasa a "enviado" con un `tx_hash` que resuelve en el explorer, y que el saldo en Cuenta baja.
5. Intentar retirar más de 1000 ARGt en un día: confirmar que se bloquea con el mensaje del límite (en este build, el bloqueo ocurre en cliente si el monto único supera 1000 ARGt; si el bloqueo depende del acumulado de 24h vía varios retiros chicos, el cliente no lo previene y hay que confirmar que el servidor lo rechaza igual con `reason` visible en la UI).

## Next Phase Readiness

- Las 4 pantallas del modo Cuenta (`useCuentaMode`, `ModeToggle`, Home, Pasar a Cuenta, Retirar) están listas para Phase 4 (badge de solvencia, verificación de inclusión, semáforo público), que puede montarse sobre el mismo shell de tabs y el mismo patrón de `getAccessToken()`.
- **Bloqueante compartido:** verificación end-to-end depende del mismo checkpoint de Neon/Privy que 03-01/02/03 (Task 3 de esos planes). El código de este plan no depende de nada adicional y ya compila.

---
*Phase: 03-modo-cuenta*
*Completed: 2026-08-20*

## Self-Check: PASSED
All 7 created/modified files verified on disk. All 3 task commits (`b60b199`, `f2a3ed8`, `49811cf`) verified in git log.
