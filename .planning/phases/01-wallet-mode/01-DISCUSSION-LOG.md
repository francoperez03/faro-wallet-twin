# Phase 1: Wallet Mode - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-19
**Phase:** 1-wallet-mode
**Mode:** `--auto` — todas las áreas auto-seleccionadas, cada pregunta resuelta con la opción recomendada
**Areas discussed:** Estructura de pantallas, Lectura de balances y RPCs, UX de transferencia, UX de vault, Bridge, BOLt bonus, Actividad

---

## Estructura de pantallas

| Option | Description | Selected |
|--------|-------------|----------|
| Seguir SPEC §4 con tabs mobile-first | 5 pantallas ya diseñadas en el spec, cero decisiones nuevas | ✓ |
| Single-page con secciones | Menos navegación, pero mezcla flujos de firma | |
| Dashboard desktop-first | Menos "neobanco", los jueces evalúan en cualquier dispositivo | |

**Choice:** Recomendada (SPEC §4 ya lo resuelve). **Notes:** estética banco, no dapp.

## Lectura de balances y RPCs

| Option | Description | Selected |
|--------|-------------|----------|
| Multicall (`useReadContracts`) por chain, RPCs públicos | Menos requests, publicnode para Polygon | ✓ |
| Reads individuales | Más simple pero más requests y rate limits | |
| Alchemy en todas las chains | Requiere API key, solo si los públicos fallan | |

**Choice:** Recomendada.

## UX de transferencia

| Option | Description | Selected |
|--------|-------------|----------|
| Address plano + selector de chain + switchChain automático | Cumple M1-02 con el mínimo | ✓ |
| Con ENS | Nice-to-have del spec, costo de tiempo | |

**Choice:** Recomendada (ENS recortado por deadline).

## UX de vault

| Option | Description | Selected |
|--------|-------------|----------|
| approve+deposit / redeem, APY como link a Morpho | Cumple M2 sin estimar APY on-chain | ✓ |
| Estimar APY con convertToAssets en dos bloques | Más lindo, más código y edge cases | |

**Choice:** Recomendada.

## Bridge

| Option | Description | Selected |
|--------|-------------|----------|
| ABI del Notion primero; quote del ABI o preguntar en Discord; estado optimista + polling destino | Sin indexer, cumple M3-01/02 | ✓ |
| Hardcodear fee estimado | Riesgo de txs revertidas en demo | |
| Indexer/tracking cross-chain | Sobredimensionado para 24 h | |

**Choice:** Recomendada.

## BOLt bonus

| Option | Description | Selected |
|--------|-------------|----------|
| Registry de tokens por config, BOLt entra cuando lleguen addresses | No bloquea, costo marginal | ✓ |
| Hardcodear solo ARGt y refactor después | Refactor bajo presión en Phase 3 | |

**Choice:** Recomendada.

## Actividad

| Option | Description | Selected |
|--------|-------------|----------|
| Logs Transfer recientes, chain activa, recortable | Suficiente para demo según SPEC §4 | ✓ |
| Historial multichain persistido | Requiere backend, fuera del alcance | |

**Choice:** Recomendada (primer candidato a recorte).

## Claude's Discretion

- UI (Tailwind, componentes, copy), valores de polling y N bloques, estructura interna del código con config de addresses centralizada.

## Deferred Ideas

None — discussion stayed within phase scope.
