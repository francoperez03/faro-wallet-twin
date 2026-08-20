# Phase 4: Solvencia Visible - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-20
**Phase:** 4-solvencia-visible
**Mode:** `--auto` — gray areas restantes auto-seleccionadas con la opción recomendada. Las decisiones marcadas LOCKED vienen de la discusión conjunta del 19-08 (con el usuario) y se conservaron sin cambios: redefinición de SOL-06 como corte mini (batch único K=64 T=2, toolchain pineado, bb.js en Vercel, segundo Registry, gen-verifier.sh), opening `{balances, salt, corte_id}` con HKDF server-side, badge/semáforo leyendo el Registry con viem (verde < 26 h).
**Areas discussed:** Poseidon2 en browser, Cómputo de openings, Lectura del último corte, /status con dos registries, Smoke test bb.js, Cron del corte mini, Estados de verificación y reporte

---

## Poseidon2 en browser (SOL-04)

| Option | Description | Selected |
|--------|-------------|----------|
| Lib JS/WASM validada contra vector de test de commitment_lib | Se genera un vector desde la lib Noir (mismo IV/domain separation) y solo se confía en la lib JS si lo reproduce; vector commiteado como fixture de test | ✓ |
| Confiar en una lib poseidon2 de npm sin validar | Riesgo alto: parámetros/IV distintos dan verificación siempre-roja, indetectable sin vector | |
| Ejecutar el circuito de commitment con bb.js siempre | Correcto por construcción, pero bundle pesado y más lento; queda como fallback si ninguna lib pasa el vector | |

**Choice:** Recomendada (vector primero; bb.js como fallback si hay mismatch).

## Cómputo de openings

| Option | Description | Selected |
|--------|-------------|----------|
| On-the-fly (ledger + HKDF en el request) en la era fixture; filas por corte cuando exista el mini | Cero infraestructura extra hoy; el salt es determinístico por DID así que se rederiva siempre | ✓ |
| Precomputar filas de openings por corte desde ya | Prematuro: sin corte real no hay corte_id significativo que persistir | |
| Servir el opening de la fixture sintética | El DID del usuario real no está en la fixture; sería mentirle al verificador | |

**Choice:** Recomendada. **Notes:** con el mini, cada corrida persiste `openings(corte_id, user_id, balances, commitment)`.

## Lectura del último corte (badge SOL-03)

| Option | Description | Selected |
|--------|-------------|----------|
| `latestCorteId()` + `getCut()` con useReadContracts | Dos calls directas, patrón ya establecido en Phase 1, sin rangos de bloques | ✓ |
| Event logs `CutPublished` | Necesario para historial, innecesario para el badge; getLogs con RPCs públicos es más frágil | |

**Choice:** Recomendada. **Notes:** los logs quedan para el historial de /status.

## /status con dos registries (fixture + mini)

| Option | Description | Selected |
|--------|-------------|----------|
| Array por env `[{label, address, chainId}]` con labels | Un solo código de lectura, la fixture queda etiquetada "datos sintéticos", con un registry no hay selector | ✓ |
| Solo el registry activo | Pierde el fallback visible y el historial de la fixture | |
| Hardcodear ambos | Las addresses cambian entre deploys; el módulo de config ya existe | |

**Choice:** Recomendada.

## Smoke test bb.js (primera tarea del stretch)

| Option | Description | Selected |
|--------|-------------|----------|
| Smoke primero y bloqueante: proof de bb.js debe verificar en el verifier Solidity generado con bb nativo | El riesgo número 1 declarado el 19-08 es la compatibilidad de versiones; validarlo cuesta horas, descubrirlo al final cuesta el stretch entero | ✓ |
| Construir el pipeline y probar al final | Si bb.js no es compatible, todo el trabajo del mini se tira | |

**Choice:** Recomendada. **Notes:** si falla, el stretch se abandona y la fase cierra con la fixture.

## Cron del corte mini (si el smoke pasa)

| Option | Description | Selected |
|--------|-------------|----------|
| Vercel cron → export ledger → prove con bb.js → publish con viem walletClient (clave M2) | Reusa la wallet publisher de Phase 2 y la función Fluid de 300 s; el endpoint manual invoca la misma función para la demo | ✓ |
| Solo botón manual sin cron | El pitch es "prueba diaria"; el cron es una línea de vercel.json | |
| GitHub Action con bb nativo | Otra plataforma más, toolchain nativo fuera de la Mac no está validado | |

**Choice:** Recomendada.

## Estados de verificación y reporte de discrepancia

| Option | Description | Selected |
|--------|-------------|----------|
| Verde/rojo/gris + reporte por mailto prellenado y console.error | Estados de SPEC §7.4 tal cual; el mailto lleva corte_id, DID y ambos commitments; cero backend nuevo | ✓ |
| Backend de reportes en Postgres | Tabla y endpoint para un botón que en la demo se toca una vez | |
| Solo mostrar el rojo sin acción | El botón "reportar" está en el spec de la pantalla | |

**Choice:** Recomendada. **Notes:** gris cubre "corte en curso" y "sin corte para este usuario" (caso típico de la era fixture).

## Claude's Discretion

- Diseño visual de badge, semáforo y pantalla de verificación (dentro del design system de Phase 1).
- Lib Poseidon2 concreta a intentar primero (el vector de test decide).
- Intervalos de refresco, loading/error, paginación del historial.

## Deferred Ideas

- Storage proofs para cR (SOL-V2-01), Merkle de commitments para inclusión on-chain, UI de auditor con view-key, backend de tickets de discrepancia.
