---
phase: 05-ship
plan: 01
subsystem: ui
tags: [nextjs, app-router, disclosure, feature-flag]

requires:
  - phase: 01-wallet-mode
    provides: "app/layout.tsx, app/(tabs)/layout.tsx (tab bar), lib/config/tokens.ts (módulo de config)"
  - phase: 04-solvency-proof
    provides: "app/status/twin-neobank (declaredMask, evidencia on-chain)"
provides:
  - "Footer global con disclosure corto + link a /disclosure en toda la app"
  - "Página /disclosure con el contenido completo de D-05"
  - "lib/config/app.ts con PRODUCT_NAME y HIDDEN_SECTIONS (D-12), consumido por el tab bar"
affects: [05-02, 05-03]

tech-stack:
  added: []
  patterns:
    - "Feature flag de contingencia: HIDDEN_SECTIONS en lib/config/app.ts, único choke point en app/(tabs)/layout.tsx que filtra tabs por id antes de renderizar"

key-files:
  created:
    - lib/config/app.ts
    - app/disclosure/page.tsx
  modified:
    - app/layout.tsx
    - "app/(tabs)/layout.tsx"

key-decisions:
  - "Config module en lib/config/app.ts (no lib/config.ts): el repo ya usa lib/config/*.ts (tokens.ts, cuenta.ts) como convención de fase 1; se sigue ese patrón en vez de crear un archivo raíz nuevo"
  - "Footer con mb-16 para no quedar tapado por el tab bar fijo (position:fixed bottom-0) en rutas dentro de app/(tabs)"
  - "Tabs id: 'm1' para Home/Enviar/Actividad (nunca se ocultan), 'vault' para Rendimiento, 'bridge' para Bridge; 'cuenta' y 'bolt' quedan reservados en HIDDEN_SECTIONS/comentario para cuando existan esos flujos como tabs"

patterns-established:
  - "Feature flags de contingencia viven como arrays de ids en lib/config/app.ts, consumidos con .filter() en el único punto de renderizado de nav"

requirements-completed: [SHIP-02]

duration: 25min
completed: 2026-08-20
---

# Phase 5 Plan 01: Disclosure + Footer + Feature Flags Summary

**Footer global con link a /disclosure, página /disclosure con el contenido locked de D-05, y HIDDEN_SECTIONS operativo como único choke point para ocultar tabs rotos el día de la demo.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-08-20T00:00:00Z (aprox., no capturado por herramienta de wall-clock)
- **Completed:** 2026-08-20
- **Tasks:** 3
- **Files modified:** 4 (2 creados, 2 modificados)

## Accomplishments
- Footer persistente en toda la app con línea corta y link a `/disclosure`, visible sin quedar tapado por el tab bar fijo
- Página `/disclosure` con las 4 secciones locked de D-05 (PoC no auditado, probado vs declarado con link a `/status/twin-neobank`, clave de bóveda en servidor, texto legal de Twin)
- `HIDDEN_SECTIONS` operativo: probado manualmente ocultando `bridge`, build pasó, revertido a `[]` antes de commitear

## Task Commits

Each task was committed atomically:

1. **Task 1: Config module — PRODUCT_NAME y HIDDEN_SECTIONS** - `3fb9ddf` (feat)
2. **Task 2: Footer global + gateo de nav por HIDDEN_SECTIONS** - `67d6af2` (feat)
3. **Task 3: Página /disclosure** - `9b9fcf9` (feat)

**Plan metadata:** (este commit, docs)

## Files Created/Modified
- `lib/config/app.ts` - PRODUCT_NAME (working name) y HIDDEN_SECTIONS (flag de contingencia D-12)
- `app/layout.tsx` - footer global con línea corta + link a /disclosure
- `app/(tabs)/layout.tsx` - tabs con `id` de sacrificio, filtrados contra HIDDEN_SECTIONS
- `app/disclosure/page.tsx` - página completa de disclosure (D-05)

## Decisions Made
- Config en `lib/config/app.ts` en vez de `lib/config.ts` (plan original asumía un único archivo raíz; el repo real de fase 1 usa `lib/config/*.ts`). Alineado con la nota del team-lead.
- Ids de tabs (`m1`, `vault`, `bridge`) elegidos para mapear directo a la prioridad de sacrificio de D-12; `cuenta` y `bolt` no tienen tab propio hoy (Cuenta es un modo vía `ModeToggle`, no un tab; BOLt es bonus sin UI todavía) así que no se les asignó id todavía — se documentó en el comentario de `lib/config/app.ts` para cuando aparezcan.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Archivo de config en ruta distinta a la del plan**
- **Found during:** Task 1
- **Issue:** El plan asumía `lib/config.ts` como módulo único de config (fase 1 no estaba ejecutada al planear). El repo real usa `lib/config/tokens.ts` y `lib/config/cuenta.ts` como convención.
- **Fix:** Se creó `lib/config/app.ts` siguiendo esa convención en vez de un archivo config.ts raíz nuevo.
- **Files modified:** lib/config/app.ts (en vez de lib/config.ts)
- **Verification:** `grep -n "PRODUCT_NAME\|HIDDEN_SECTIONS" lib/config/app.ts`
- **Committed in:** 3fb9ddf

---

**Total deviations:** 1 auto-fixed (1 blocking — ruta de archivo)
**Impact on plan:** Ninguno funcional; mismo contrato (dos exports) en la ubicación correcta del repo real.

## Issues Encountered
El tab bar de `app/(tabs)/layout.tsx` usa `position: fixed` en el nav inferior, lo que taparía un footer simple puesto al final de `app/layout.tsx` en rutas con tabs. Se resolvió con `mb-16` en el footer para reservar el alto del nav fijo (ver comentario en el código). Verificado con `npm run build` y manualmente con `HIDDEN_SECTIONS = ['bridge']` (revertido antes de commitear, tal como pide la verificación del plan).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- SHIP-02 cubierto por completo: disclosure in-app (footer + página) y flag de contingencia operativo.
- `HIDDEN_SECTIONS` queda listo para el smoke test de Plan 03 sin haber tenido que usarse.
- Cuando el usuario elija el nombre final (Plan 03, Task 1), el único punto a tocar para el branding de display es `PRODUCT_NAME` en `lib/config/app.ts` y el copy de `/disclosure`.

---
*Phase: 05-ship*
*Completed: 2026-08-20*

## Self-Check: PASSED
All created/modified files and task commit hashes verified present on disk and in git log.
