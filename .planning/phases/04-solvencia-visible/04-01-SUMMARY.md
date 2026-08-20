---
phase: 04-solvencia-visible
plan: 01
subsystem: ui
tags: [wagmi, viem, react-query, nextjs, solidity-read]

requires:
  - phase: 02-sobrecito-registry
    plan: "01/02"
    provides: "SobrecitoRegistry desplegado en Arbitrum One (0x89ec9bf3cd42a037a2d004813733fc0d6e2ab03d), REGISTRIES en lib/config/tokens.ts, deployments.json"
  - phase: 03-modo-cuenta
    plan: "04"
    provides: "app/(tabs)/cuenta/page.tsx (Home de Cuenta)"
provides:
  - "lib/sobrecito/registry-abi.ts: ABI minima de SobrecitoRegistry + tipo Cut"
  - "lib/sobrecito/use-registry.ts: useLatestCut (badge) y useCutHistory (status)"
  - "components/cuenta/solvency-badge.tsx: badge verde/ambar/neutro en Cuenta·Home"
  - "app/status/twin-neobank/page.tsx: pagina publica sin login"
affects: [04-02, 04-03]

tech-stack:
  added: []
  patterns:
    - "useLatestCut: dos useReadContract secuenciales (latestCorteId -> getCut), mismo patron que use-vault-position.ts de Phase 1"
    - "useCutHistory: publicClient.getContractEvents con fromBlock 0n (arb1.arbitrum.io/rpc no limita el rango por address+evento en la practica), cacheado con useQuery"

key-files:
  created:
    - lib/sobrecito/registry-abi.ts
    - lib/sobrecito/use-registry.ts
    - components/cuenta/solvency-badge.tsx
    - app/status/twin-neobank/page.tsx
    - components/status/cut-history.tsx
    - components/status/declared-mask.tsx
  modified:
    - "app/(tabs)/cuenta/page.tsx"

key-decisions:
  - "lib/config/tokens.ts no se modifico: REGISTRIES ya existia completo (creado por 02-02, mismo naming NEXT_PUBLIC_REGISTRY_1_* que este plan esperaba), no hacia falta tocarlo"
  - "useCutHistory usa los datos del propio evento CutPublished (cL, cR, verdicts, coverageBps, etc. ya vienen en los args del log) en vez de un getCut adicional por corteId: evita N llamadas RPC redundantes para el mismo dato"
  - "fromBlock 0n en getContractEvents en vez de resolver el bloque de deploy: probado contra arb1.arbitrum.io/rpc (curl directo), no aplica limite de rango de bloques quan se filtra por address+evento; mas simple que leer deployTx de deployments.json"

requirements-completed: [SOL-03, SOL-05]

duration: ~35min
completed: 2026-08-20
---

# Phase 4 Plan 1: Badge de solvencia + /status/twin-neobank Summary

**Badge "Solvencia probada on-chain" en Cuenta·Home y pagina publica /status/twin-neobank, ambos leyendo en vivo el SobrecitoRegistry real de Arbitrum One (0x89ec9bf3cd42a037a2d004813733fc0d6e2ab03d) con wagmi/viem, sin backend propio**

## Performance

- **Duration:** ~35 min
- **Tasks:** 3/3 completados
- **Files modified:** 7 (6 creados, 1 modificado)

## Accomplishments

- `lib/sobrecito/registry-abi.ts`: ABI minima tipada `as const` (getCut, cutExists, cutCount, latestCorteId, evento CutPublished) + tipo `Cut`
- `lib/sobrecito/use-registry.ts`: `useLatestCut(registry)` (dos `useReadContract` secuenciales, calcula `hoursAgo` y status verde/ambar/none) y `useCutHistory(registry)` (event logs `CutPublished` via `getContractEvents`, cacheado con `useQuery`)
- `components/cuenta/solvency-badge.tsx` wireado debajo del saldo en `app/(tabs)/cuenta/page.tsx`: pill verde si el corte tiene menos de 26h, ambar si vencido, texto neutro sin cortes, boton "Verifica tu inclusion" hacia `/cuenta/verificar` (ruta de Plan 02, en paralelo)
- `app/status/twin-neobank/page.tsx`: ruta publica fuera de `(tabs)`, sin ningun chequeo de sesion; muestra veredictos por token, cobertura por bucket, frescura, historial completo con link a la tx en Arbiscan y el `declaredMask` explicado en texto claro (`components/status/declared-mask.tsx`); selector de registry solo si `REGISTRIES.length > 1` (hoy hay uno solo, no aparece); badge "Datos sinteticos" para registries cuyo label matchea `/fixture|sintetic/i`
- Verificado contra el Registry real en Arbitrum One via curl directo a `arb1.arbitrum.io/rpc`: `eth_getLogs` con `fromBlock: 0x0` y filtro por address devuelve el `CutPublished` real (corteId `0xdff809cf...`, publishedAt `0x6a86832e`), confirmando que `useCutHistory` no necesita paginacion en este estado del contrato
- D-08(a) trigger agregado (gap del verifier de fase 3): `app/(tabs)/cuenta/page.tsx` dispara `POST /api/cuenta/sync-deposits` fire-and-forget al cargar Home (mismo token de Privy que ya usaba para `/api/cuenta/account`), por si el usuario cierra `/cuenta/pasar` antes de que termine su polling; errores ignorados, no bloquea el render
- `npm run build` pasa limpio en todos los commits

## Task Commits

1. **Task 1: Config de registries + ABI + hooks de lectura** - `28c3f05` (feat)
2. **Task 2: Badge de solvencia en Cuenta·Home (SOL-03)** - `8af02a9` (feat)
3. **Task 3: Pagina publica /status/twin-neobank (SOL-05)** - `65225b4` (feat)
4. **D-08(a) trigger de sync-deposits en Cuenta Home** (pedido por team-lead, gap del verifier de fase 3) - `d6710f3` (fix)

## Files Created/Modified

- `lib/sobrecito/registry-abi.ts` - ABI + tipo Cut
- `lib/sobrecito/use-registry.ts` - `useLatestCut`, `useCutHistory`
- `components/cuenta/solvency-badge.tsx` - badge verde/ambar/neutro + link a verificacion
- `app/(tabs)/cuenta/page.tsx` - agregado `<SolvencyBadge />` debajo del saldo, sin reordenar el resto; agregado trigger fire-and-forget de `POST /api/cuenta/sync-deposits` en `load()` (D-08(a))
- `app/status/twin-neobank/page.tsx` - pagina publica completa
- `components/status/cut-history.tsx` - lista del historial con link a tx por chain (via `CHAIN_IDS`/`EXPLORER_TX_URL` de `lib/config/tokens.ts`)
- `components/status/declared-mask.tsx` - texto fijo de que esta probado (cL) vs declarado (cR, verdicts, coverageBps, attestationHash)

## Decisions Made

- `lib/config/tokens.ts` no requirio cambios: `REGISTRIES` ya existia (creado por 02-02) con el naming exacto (`NEXT_PUBLIC_REGISTRY_1_*`) que este plan esperaba, poblado con la address real desplegada.
- `useCutHistory` usa los args del propio evento `CutPublished` en vez de un `getCut` adicional por corteId (el evento ya trae cL, cR, verdicts, coverageBps, attestationHash, publishedAt, declaredMask): menos llamadas RPC, mismo dato.
- `fromBlock: 0n` en `getContractEvents` en vez de resolver el bloque de deploy desde `deployments.json`: probado con curl directo contra `arb1.arbitrum.io/rpc`, no aplica limite de rango cuando se filtra por address; mas simple y suficiente para el volumen de logs actual (un solo corte).
- Verde/ambar (`#16A34A`/`#D97706`) son una extension minima de la paleta de `01-UI-SPEC.md` (que no declara colores de semaforo), documentada con comentario `ponytail:` en el componente, usada solo para este estado.

## Deviations from Plan

None - plan ejecutado tal como esta escrito. `lib/config/tokens.ts` figuraba en `files_modified` del frontmatter pero no necesito tocarlo (ya tenia el export completo de 02-02); no es una desviacion de comportamiento, es simplemente que el archivo no necesitaba cambios.

## Issues Encountered

- Verificacion visual completa (renderizar `/status/twin-neobank` en el browser) bloqueada por el mismo blocker de entorno reportado en `03-04-SUMMARY.md`: `NEXT_PUBLIC_PRIVY_APP_ID` en `.env.local` es el placeholder `REPLACE_ME_PRIVY_APP_ID`, y `app/providers.tsx` muestra una pantalla de "Configurar Privy App ID" para *todas* las rutas de la app (incluida `/status`, que no depende de Privy para nada) hasta que se setee un app id real. No es un bug introducido por este plan: es un guard preexistente app-wide. Verificado en su lugar: la ruta responde `200` sin sesion, es estatica en el build (`○ /status/twin-neobank`), y el fetch directo a `arb1.arbitrum.io/rpc` confirma que los datos que la pagina leeria son correctos.

## Known Stubs

Ninguno. Las tres piezas (hooks, badge, pagina publica) estan completamente cableadas al Registry real, sin datos mock.

## Threat Flags

Ninguno fuera del `threat_model` del plan. `REGISTRIES` sigue viniendo solo de env/config, nunca de query params ni input de la pagina publica (T-04-01, cubierto). `/status/twin-neobank` no expone nada mas alla de lo ya publico on-chain (T-04-02, `accept`).

## Next Phase Readiness

- SOL-03 y SOL-05 cumplidos: badge en Cuenta·Home leyendo el Registry en vivo, `/status/twin-neobank` publica con veredictos, cobertura, frescura, historial y declaredMask.
- El boton "Verifica tu inclusion" del badge y cualquier link a `/cuenta/verificar` quedan listos para que 04-02 (verificacion de inclusion, en paralelo) los complete; hasta entonces el link es un 404 esperado.
- `REGISTRIES` y el patron `useLatestCut`/`useCutHistory` estan listos para que 04-03 agregue el segundo entry (Registry del corte mini) sin tocar este codigo: el selector de `/status` ya soporta `REGISTRIES.length > 1`.
- Verificacion visual en browser pendiente del mismo blocker de Privy/Neon que las fases 3 previas; no bloquea este plan.

---
*Phase: 04-solvencia-visible*
*Completed: 2026-08-20*

## Self-Check: PASSED
All 7 created/modified files verified on disk. All 4 commits (`28c3f05`, `8af02a9`, `65225b4`, `d6710f3`) verified in git log.
