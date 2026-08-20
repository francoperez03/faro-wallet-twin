---
phase: 01-wallet-mode
plan: 02
subsystem: wallet
tags: [wagmi, viem, erc20, multicall, react-query, sonner]

requires:
  - phase: 01-wallet-mode
    provides: "Scaffold Next.js + Privy + @privy-io/wagmi, lib/config/tokens.ts, tab shell"
provides:
  - "lib/hooks/use-token-balances.ts: balance de ARGt por chain (multicall useReadContracts) + total, con refetch"
  - "lib/hooks/use-activity.ts: logs Transfer del usuario (enviado/recibido) sobre ~5000 bloques por chain"
  - "components/token-row.tsx, components/balance-list.tsx: desglose de balance por chain"
  - "Home con balance total real (Display) y desglose por chain"
  - "Enviar: formulario con selector de chain, validación de address/monto, switchChain automático + transfer"
  - "Actividad: lista de Transfer reales por chain con link al explorer y empty state"
affects: [01-03, 01-04, phase-3-modo-cuenta]

tech-stack:
  added: []
  patterns:
    - "useReadContracts (wagmi) con chainId por contrato para leer el mismo ERC-20 en varias chains en un solo hook"
    - "Selector de chain como grupo de botones (no shadcn select, no instalado) reusado en Enviar y Actividad"
    - "ABIs mínimas inline (balanceOf, transfer, evento Transfer) en vez de importar un ERC-20 ABI completo"

key-files:
  created:
    - lib/hooks/use-token-balances.ts
    - lib/hooks/use-activity.ts
    - components/token-row.tsx
    - components/balance-list.tsx
  modified:
    - app/(tabs)/home/page.tsx
    - app/(tabs)/enviar/page.tsx
    - app/(tabs)/actividad/page.tsx

key-decisions:
  - "BigInt(0) en vez de 0n en todo el código nuevo: tsconfig.json target es ES2017 (archivo de config, fuera de mi scope de edición) y no soporta BigInt literals"
  - "Toaster de sonner montado localmente en app/(tabs)/enviar/page.tsx (no en app/layout.tsx) para no tocar providers/layout raíz, fuera del scope de este plan"
  - "Selector de chain implementado como grupo de 3 botones (no shadcn 'select', que no está instalado); evita agregar una dependencia nueva para 3 opciones fijas"

patterns-established:
  - "Cualquier hook que lea/escriba ARGt por chain itera CHAINS y usa CHAIN_IDS[chain] para el chainId por contrato/log, nunca hardcodea una chain"

requirements-completed: [M1-01, M1-02, M1-03]

duration: 40min
completed: 2026-08-20
---

# Phase 1 Plan 2: Balances, Transfer y Actividad Summary

**Balance de ARGt multichain vía useReadContracts (multicall), transferencia con switchChain automático antes de transfer, y actividad con logs Transfer reales por chain leídos con viem getLogs sobre los últimos ~5000 bloques.**

## Performance

- **Duration:** ~40 min
- **Tasks:** 3/3 ejecutados (Task 3 es un checkpoint no bloqueante; código completo, addresses de BOLt no llegaron)
- **Files modified:** 7 (4 creados, 3 modificados)

## Accomplishments
- `lib/hooks/use-token-balances.ts`: multicall `useReadContracts` sobre las 3 chains, expone `perChain`, `total`, `errors` por chain y `refetch`; si una chain falla las otras dos siguen mostrando su balance
- Home reemplaza el Skeleton de balance por el total real en tipografía Display (32px/600, tabular-nums) y el desglose por chain (`BalanceList`/`TokenRow`)
- `app/(tabs)/enviar/page.tsx`: selector de chain, validación de address (`0x` + 40 hex) y monto (`>0`, `<= balance`) con el copy de error del UI-SPEC, `switchChainAsync` automático si la chain activa difiere de la elegida, `writeContractAsync` de `transfer`, toasts de sonner, refetch de balances tras confirmar
- `lib/hooks/use-activity.ts` + `app/(tabs)/actividad/page.tsx`: logs `Transfer` (enviado/recibido) del usuario sobre los últimos ~5000 bloques de la chain activa, con link al explorer y empty state "Todavía no hay movimientos"
- `lib/config/tokens.ts` ya traía el comentario de registry para BOLt desde el plan 01-01; no requirió cambios

## Task Commits

1. **Task 1: Balances multichain en Home (M1-01)** - `e73e570` (feat)
2. **Task 2: Transferencia con switchChain automático (M1-02)** - `6b4be96` (feat)
3. **Task 3: Actividad y registry de BOLt (M1-03, bonus)** - `11e050c` (feat)

## Files Created/Modified
- `lib/hooks/use-token-balances.ts` - Hook multicall de balance de ARGt por chain + total + refetch
- `lib/hooks/use-activity.ts` - Hook de logs Transfer (from/to) sobre ~5000 bloques por chain
- `components/token-row.tsx` - Fila de balance por chain (Label + tabular-nums)
- `components/balance-list.tsx` - Mapea `perChain` a filas
- `app/(tabs)/home/page.tsx` - Balance total en Display + `BalanceList` debajo, reemplazando el Skeleton de auth
- `app/(tabs)/enviar/page.tsx` - Formulario de transferencia completo (antes placeholder)
- `app/(tabs)/actividad/page.tsx` - Lista de actividad real por chain (antes placeholder estático)

## Decisions Made
- **BigInt literals evitados:** `npm run build` falló con `TS2737: BigInt literals are not available when targeting lower than ES2020` porque `tsconfig.json` fija `target: ES2017`. Ese archivo es config, fuera del scope declarado del plan y de los archivos que otros dos executors pueden estar tocando en paralelo. Se resolvió usando `BigInt(0)` en vez de `0n` en todo el código nuevo, sin tocar tsconfig.
- **Toaster montado en la página de Enviar, no en el layout raíz:** el UI-SPEC pide sonner para feedback de transacción, pero `app/layout.tsx` y `app/providers.tsx` están fuera del scope de este plan (tocados por 01-01 y potencialmente por otros executors en paralelo). `<Toaster />` de sonner es un portal fijo; renderizarlo dentro de `enviar/page.tsx` es suficiente para mostrar los toasts sin tocar archivos compartidos.
- **Selector de chain como botones, no `<select>` de shadcn:** el componente `select` no está instalado (`components/ui` no lo tiene) y son solo 3 opciones fijas; un grupo de 3 botones con estado activo (mismo patrón visual que el tab bar) evita instalar una dependencia nueva para esto.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] BigInt literals reemplazados por `BigInt(0)`**
- **Found during:** Task 1 (`npm run build`)
- **Issue:** `0n` no compila con `target: ES2017` en `tsconfig.json`
- **Fix:** Reemplazo de todos los `0n` por `BigInt(0)` en `lib/hooks/use-token-balances.ts` y `components/balance-list.tsx`
- **Files modified:** lib/hooks/use-token-balances.ts, components/balance-list.tsx
- **Verification:** `npm run build` pasa sin errores de TypeScript
- **Committed in:** `e73e570` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 3, blocking)
**Impact on plan:** Necesario para que el build pasara con el `tsconfig.json` existente del scaffold. No cambia alcance ni comportamiento.

## Issues Encountered
None además de la deviation documentada arriba.

## User Setup Required

**Login runtime no verificado end-to-end** (heredado de 01-01): `NEXT_PUBLIC_PRIVY_APP_ID` sigue siendo el placeholder `REPLACE_ME_PRIVY_APP_ID`, así que Home/Enviar/Actividad no se pudieron probar con una wallet real conectada. Verificado a nivel de código y con `npm run build` (pasa sin errores) en los 3 tasks. Una vez configurado Privy (ver 01-01-SUMMARY.md, sección "User Setup Required"), falta:
1. Loguearse, confirmar que Home muestra el total y el desglose por chain con montos reales.
2. Enviar ARGt a una address desde una chain distinta a la activa, confirmar que dispara `switchChain` antes del `transfer` y que el balance baja tras confirmar.
3. Confirmar que Actividad muestra los logs `Transfer` reales o el empty state si no hay movimientos en esa chain.

**BOLt (Task 3, checkpoint no bloqueante):** las addresses de BOLt por chain no llegaron por Discord antes del cierre de este plan. El registry en `lib/config/tokens.ts` ya tenía el comentario para agregarlas (`// BOLt: agregar entry aquí cuando lleguen las addresses por Discord`) desde 01-01; no se modificó. Si llegan más tarde, agregar el entry a `TOKENS` con la misma forma que `ARGt` habilita a Home/Enviar/Actividad a mostrar BOLt sin refactor (M1-03 completo). Checkpoint queda **pendiente, sin bloquear** el cierre de la fase, según instrucción explícita del team lead y D-10 del CONTEXT.

## Next Phase Readiness
- `use-token-balances` y `use-activity` quedan disponibles para reuso: el modo Cuenta (Phase 3) y cualquier pantalla que necesite saldo/movimientos de ARGt puede importar estos hooks sin reimplementar la lectura on-chain.
- M1-01 y M1-02 verificables a nivel de código; verificación con fondos reales pendiente de que se configure `NEXT_PUBLIC_PRIVY_APP_ID` (bloqueante compartido con 01-01, no de este plan).
- M1-03 (BOLt) queda como mejor esfuerzo documentado, no bloqueante, tal como especifica el plan.

---
*Phase: 01-wallet-mode*
*Completed: 2026-08-20*
