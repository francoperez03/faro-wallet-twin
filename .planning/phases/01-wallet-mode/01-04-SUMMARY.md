---
phase: 01-wallet-mode
plan: 04
subsystem: payments
tags: [bridge, layerzero, oft, wagmi, viem, arbitrum, base, polygon]

requires:
  - phase: 01-01
    provides: "lib/config/tokens.ts (BRIDGE_ADAPTERS, TOKENS.ARGt, CHAIN_IDS), lib/wagmi-config.ts, tab shell con ruta /bridge"
provides:
  - "lib/config/bridge-adapter-abi.ts: ABI del bridge adapter, reconstruido y verificado on-chain (LayerZero V2 OFT), no el archivo real del Notion"
  - "lib/hooks/use-bridge.ts: approve + quoteSend + send con polling de balance en destino"
  - "app/(tabs)/bridge/page.tsx: pantalla 'Mover entre redes' funcional (M3-01, M3-02)"
affects: [phase-3-modo-cuenta]

tech-stack:
  added: []
  patterns:
    - "Verificación empírica de ABI vía eth_call directo (selectores + lecturas de estado) cuando la fuente oficial no está disponible, documentando la evidencia en el propio archivo de config"
    - "Hook de bridge separado de la página (lib/hooks/use-bridge.ts), reusa TOKENS/BRIDGE_ADAPTERS de tokens.ts como use-token-balances.ts"

key-files:
  created:
    - lib/config/bridge-adapter-abi.ts
    - lib/hooks/use-bridge.ts
  modified:
    - "app/(tabs)/bridge/page.tsx"

key-decisions:
  - "ABI del adapter reconstruido por verificación on-chain (LayerZero V2 OFT/IOFT) en vez de usar el fallback genérico sin quote: 13/13 selectores del bytecode coinciden con la interfaz IOFT completa, quoteSend() no revierte y devuelve un fee plausible, token() devuelve exactamente ARGt en Arbitrum, approvalRequired()=true, y peers() para Base/Polygon coinciden con BRIDGE_ADAPTERS. Se prefirió esto al camino de confirmación manual del fee porque hay evidencia fuerte de una función de cotización real y funcional."
  - "Ruta real de la pantalla es app/(tabs)/bridge/page.tsx, no app/(tabs)/mover/page.tsx (el plan referenciaba una ruta que no existe en el scaffold de 01-01, que ya creó y linkeó /bridge en el tab shell). Se implementó en la ruta real para no dejar un tab roto ni una pantalla huérfana."
  - "EIDs de LayerZero V2 (arbitrum=30110, base=30184, polygon=30109) definidos localmente en use-bridge.ts en vez de en tokens.ts: son metadata específica del bridge, no del registry de addresses que reusan fases 3-4, y evita tocar un archivo compartido con otros dos executors corriendo en paralelo sobre el mismo repo."

patterns-established:
  - "Fee de bridge siempre leído on-chain (quoteSend) antes de mostrarlo al usuario y antes de firmar, nunca hardcodeado (T-04-01)"

requirements-completed: [M3-01, M3-02]

duration: 40min
completed: 2026-08-20
---

# Phase 1 Plan 4: Bridge ARGt entre chains Summary

**Bridge real de ARGt entre Arbitrum/Base/Polygon vía adapter LayerZero V2 OFT (approve + quoteSend + send), con fee cotizado on-chain y polling de balance en destino hasta "Completado".**

## Performance

- **Duration:** ~40 min
- **Tasks:** 2/2 ejecutados (Task 1 checkpoint resuelto con verificación empírica en vez de esperar al Notion; Task 2 completo)
- **Files modified:** 3 (2 creados, 1 modificado)

## Accomplishments
- `lib/config/bridge-adapter-abi.ts` con un ABI **verificado on-chain**, no el fallback genérico sin cotización que preveía el plan como peor caso.
- `lib/hooks/use-bridge.ts`: `quoteFee(fromChain, toChain, amount)` + `bridge({fromChain, toChain, amount})` que hace `approve` → `send` (LayerZero OFT) con `value` = fee cotizado, y arranca un polling de 10s (timeout 5min) del balance de ARGt en destino.
- `app/(tabs)/bridge/page.tsx`: selector de red origen/destino (excluye mismo origen=destino), input de monto, fee cotizado mostrado antes de confirmar, botón "Bridgear ARGt", pill de estado ("En tránsito"/"Completado" en accent blue-600 por UI-SPEC).
- `npm run build` pasa sin errores (TypeScript incluido).

## Task Commits

1. **Task 1: ABI del bridge adapter (verificación empírica, no fallback genérico)** - `4497753` (feat)
2. **Task 2: Flujo de bridge (M3-01, M3-02)** - `1a7e42d` (feat)

## Verificación empírica del ABI (evidencia completa)

El ABI real del Notion **no estaba disponible** al momento de esta ejecución. En vez de usar directamente el fallback genérico sin `quote` que preveía el plan como peor caso, se hizo **una verificación on-chain barata contra el adapter de Arbitrum** (`0x4821FBf47B261F0D52Ba0F941CF67b8648f82691`) vía `eth_call` a `https://arb1.arbitrum.io/rpc`:

1. **`eth_getCode`** confirmó que la address tiene bytecode desplegado (no es un EOA ni una address vacía).
2. Se extrajeron los ~35 selectores de función del bytecode y se compararon contra los selectores calculados (`cast sig`) de la interfaz estándar **LayerZero V2 OFT (`IOFT`)**. Coincidieron **13 de 13**: `quoteSend`, `quoteOFT`, `send`, `token`, `endpoint`, `peers`, `setPeer`, `oftVersion`, `sharedDecimals`, `approvalRequired`, `owner`, `transferOwnership`, `renounceOwnership`.
3. Se llamó `quoteSend((30184, <bytes32>, 1e18, 1e18, 0x, 0x, 0x), false)` vía `eth_call`: **no revirtió** y devolvió `nativeFee = 26913340299921 wei (≈ 0.0000269 ETH)`, `lzTokenFee = 0` — un fee plausible para mensajería LayerZero.
4. Se llamó `token()`: devolvió **exactamente** `0x59863989d080B22476DB95656d0C3CC18be92214`, la address de ARGt en Arbitrum de `lib/config/tokens.ts`.
5. Se llamó `approvalRequired()`: devolvió `true`, confirmando que el flujo D-09 (approve + bridge) aplica.
6. Se llamó `peers(30184)` (EID de Base) y `peers(30109)` (EID de Polygon): devolvieron **exactamente** `BRIDGE_ADAPTERS.base` (`0xe80Af1d12426dB4394b147e04f179a38e7C5Dfe7`) y `BRIDGE_ADAPTERS.polygon` (`0xD70ad085684b2A9f4B5d54D7BDB2eCA37a273216`).

Esta combinación (13/13 selectores de la interfaz completa + 4 lecturas de estado consistentes con el registry del proyecto) es evidencia fuerte de que el adapter implementa `IOFT` sin desviaciones. Se usó esta ABI verificada (`quoteSend` + `send` + `token` + `approvalRequired`) en vez del fallback genérico documentado en el plan, porque hay una función de cotización real y funcional — el camino de "fee confirmado manualmente por el usuario" (D-08, para cuando no hay `quote`) no aplica en este caso.

**El checkpoint de Task 1 sigue marcado como pendiente** (ver abajo): esta es una reconstrucción por evidencia empírica, no el ABI real bajado del Notion. Si el ABI real difiere (nombres de parámetros, funciones adicionales, versión distinta de OFT), hay que reemplazar el archivo.

## Files Created/Modified
- `lib/config/bridge-adapter-abi.ts` - ABI verificado on-chain (LayerZero V2 OFT: `quoteSend`, `send`, `token`, `approvalRequired`), con la evidencia completa documentada en comentarios
- `lib/hooks/use-bridge.ts` - Hook `quoteFee`/`bridge`: approve ARGt → quoteSend → send con `value=fee`, polling de balance en destino (10s / timeout 5min → estado `timeout`)
- `app/(tabs)/bridge/page.tsx` - Pantalla real de bridge (reemplaza el placeholder de 01-01), selector origen/destino, fee mostrado antes de confirmar, pill de estado

## Decisions Made
- Ver `key-decisions` en el frontmatter: ABI reconstruido por verificación empírica en vez de fallback genérico; implementación en la ruta real `/bridge` en vez de `/mover`; EIDs de LayerZero definidos localmente en el hook.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Ruta de la pantalla: `app/(tabs)/bridge/page.tsx`, no `app/(tabs)/mover/page.tsx`**
- **Found during:** Task 2
- **Issue:** El plan declaraba `app/(tabs)/mover/page.tsx` como archivo a modificar, pero el scaffold de 01-01 ya creó y linkeó la ruta `/bridge` en `app/(tabs)/layout.tsx` (tab "Mover entre redes" → `href: "/bridge"`), con un placeholder en `app/(tabs)/bridge/page.tsx`. Crear `app/(tabs)/mover/page.tsx` habría dejado una ruta huérfana sin acceso desde la navegación, y el tab existente seguiría mostrando el placeholder.
- **Fix:** Se implementó la pantalla completa en `app/(tabs)/bridge/page.tsx` (la ruta real, ya wireada en el tab shell).
- **Files modified:** `app/(tabs)/bridge/page.tsx`
- **Verification:** `npm run build` genera `/bridge` como ruta estática; el tab "Mover entre redes" apunta a esa ruta.
- **Committed in:** `1a7e42d` (Task 2 commit)

**2. [Rule 1 - Bug/mejora sobre el plan] ABI verificado on-chain en vez de fallback genérico sin quote**
- **Found during:** Task 1
- **Issue:** El plan preveía, si el ABI del Notion no llegaba a tiempo, un fallback genérico con solo `bridge(uint16,address,uint256)` payable y sin función de cotización, forzando confirmación manual del fee por el usuario.
- **Fix:** Antes de aplicar ese fallback, se hizo una verificación empírica barata (selectores + 4 `eth_call` de lectura) que confirmó con alta confianza que el adapter implementa la interfaz estándar LayerZero V2 OFT, incluyendo una función `quoteSend` real y funcional. Se usó esa ABI en vez del fallback genérico, habilitando el camino de cotización automática de D-09 en vez del de confirmación manual.
- **Files modified:** `lib/config/bridge-adapter-abi.ts`
- **Verification:** Ver sección "Verificación empírica del ABI" arriba; evidencia completa también documentada como comentario en el archivo.
- **Committed in:** `4497753` (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 Rule 3 blocking, 1 Rule 1 mejora sobre el fallback previsto). Ninguna cambia el alcance del plan; la segunda mejora la calidad del resultado (fee real cotizado on-chain en vez de confirmación manual).

## Issues Encountered
None — la verificación empírica del ABI resolvió el bloqueo sin necesidad de preguntar en Discord (SPEC §8 preveía esa opción si no había `quote`; no hizo falta).

## User Setup Required

**El checkpoint de Task 1 sigue pendiente en el sentido estricto del plan.** El ABI usado es una reconstrucción verificada empíricamente, no el archivo real bajado del Notion de Twin. Falta:

1. Ir al Notion de Twin, bajar el adjunto real `bridge-adapter-abi.ts` (~2.5 KiB).
2. Comparar contra `lib/config/bridge-adapter-abi.ts`: si coincide en `quoteSend`/`send`/`token`/`approvalRequired`, no hace falta cambiar nada (más allá de reemplazar el archivo por el oficial y quitar el comentario `ponytail`). Si difiere, reemplazar y ajustar `lib/hooks/use-bridge.ts` si cambian nombres/orden de parámetros.
3. Probar el bridge con fondos reales entre al menos dos de las tres chains (Arbitrum ↔ Base ↔ Polygon), confirmando que la pill pasa de "En tránsito" a "Completado" sin refresh manual.

**Marcado como CHECKPOINT_PENDING**: el ABI real del Notion todavía no bajó; se avanzó con el ABI verificado on-chain para no bloquear M3 antes del deadline del hackathon.

## Next Phase Readiness
- M3-01/M3-02 implementados en código y con `npm run build` verde; falta la prueba end-to-end con fondos reales y gas en las 3 chains (bloqueante operativo general de la fase, no específico de este plan).
- Si llega el ABI real del Notion antes de la demo, reemplazar `lib/config/bridge-adapter-abi.ts` es el único cambio esperado (la forma del hook y la página no deberían cambiar si la interfaz real también es LayerZero OFT estándar).

---
*Phase: 01-wallet-mode*
*Completed: 2026-08-20*
