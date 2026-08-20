---
phase: 02-sobrecito-registry
plan: 02
subsystem: infra
tags: [foundry, arbitrum, solidity, honk-verifier, zk, nextjs-config]

# Dependency graph
requires:
  - phase: 02-sobrecito-registry (plan 01)
    provides: "SobrecitoRegistry (0x89ec9bf3cd42a037a2d004813733fc0d6e2ab03d) y HonkVerifier (0x9e2af6688b7ac79f506f0d61efb030843218d159) desplegados en Arbitrum One, ops/deployments.json de Sobrecito"
provides:
  - "Publish.s.sol en Sobrecito: script reusable (env REGISTRY_ADDRESS/TAMPER_PROOF/CORTE_ID) para publish real y simulación negativa"
  - "CutPublished real on-chain para la fixture full_cut/root, visible en Arbiscan"
  - "Demostración del caso negativo (proof adulterada) revirtiendo ProofRejected contra el contrato real, vía eth_call sin gastar gas"
  - "twin/deployments.json con schema registries[], twin/lib/config/tokens.ts con REGISTRIES, twin/.env.example con NEXT_PUBLIC_REGISTRY_1_*"
affects: [phase-4]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Publish.s.sol: mismo run() sirve para --broadcast (publish real) y para simulación eth_call (sin --broadcast), diferenciado solo por env vars, sin código extra"
    - "REGISTRIES en lib/config/tokens.ts: env NEXT_PUBLIC_REGISTRY_1_* con fallback a los valores reales de deployments.json"

key-files:
  created:
    - /Users/francoperez/repos/job/Sobre/sobrecito/contracts/script/Publish.s.sol
    - /Users/francoperez/repos/twin/deployments.json
  modified:
    - /Users/francoperez/repos/twin/lib/config/tokens.ts
    - /Users/francoperez/repos/twin/.env.example

key-decisions:
  - "RPC arb1.arbitrum.io/rpc (no publicnode) para el broadcast y las verificaciones, heredado del bug de Plan 01 con eth_getTransactionReceipt en publicnode"
  - "Guard de balance (gas*gasPrice*2 < balance) re-chequeado antes del broadcast del publish: 0.000431 ETH cubría ~5.8x el gas real necesario"

requirements-completed: [SOL-02]

# Metrics
duration: ~25min
completed: 2026-08-20
---

# Phase 2 Plan 2: Publish real + handoff de addresses a twin Summary

**Publish.s.sol nuevo en Sobrecito publica la fixture full_cut/root al SobrecitoRegistry real en Arbitrum One (tx confirmada, CutPublished emitido) y demuestra el revert ProofRejected contra el contrato real por simulación eth_call; twin queda con deployments.json/REGISTRIES/.env.example en el schema que Phase 4 espera**

## Performance

- **Duration:** ~25 min
- **Tasks:** 3 (todos auto)
- **Files modified:** 4 (1 creado en Sobrecito, 1 broadcast artifact en Sobrecito, 1 creado + 2 modificados en twin)

## Accomplishments
- `Publish.s.sol` escrito, compila (`forge build` exit 0), sin ningún valor de deploy hardcodeado
- Publish real aceptado on-chain: tx `0xba83e39d39e0ec4d5657445358e5e0c56d5c0438ef601145551cdb1e8b6e8408`, status success, gas usado 1,255,924
- Caso negativo demostrado por `eth_call` (sin `--broadcast`, `TAMPER_PROOF=true`, `CORTE_ID` distinto): revierte `ProofRejected(0xcd49ff02...)`, corteId verificado con `cast keccak`, cero gas gastado
- `deployments.json`, `lib/config/tokens.ts` (`REGISTRIES`) y `.env.example` en twin, copiados literal del deploy/publish reales, sin tocar el resto de esos archivos (ya creados por otro executor en Plan 01-01)

## Task Commits

Tasks 1-2 en el repo Sobrecito (`/Users/francoperez/repos/job/Sobre/sobrecito`, branch `landing-en`); Task 3 en el repo twin:

1. **Task 1: Escribir Publish.s.sol** - `c17b0a3` (feat, repo Sobrecito)
2. **Task 2: Publish real + negativo simulado** - `7db0ab3` (feat, repo Sobrecito; broadcast artifact)
3. **Task 3: Handoff de addresses a twin** - `19718d5` (feat, repo twin)

## Files Created/Modified

En Sobrecito (fuera del repo twin):
- `contracts/script/Publish.s.sol` - script nuevo, lee REGISTRY_ADDRESS/TAMPER_PROOF/CORTE_ID por env, reusa el patrón de carga de proof/public_inputs de `Fixture.sol`
- `contracts/broadcast/Publish.s.sol/42161/run-latest.json` - broadcast real del publish

En twin:
- `deployments.json` - `registries[0]` con address/verifierAddress/chainId/deployTx/keyHash/explorer del deploy de Plan 01, más `publishTx`/`corteId` del publish real de este plan
- `lib/config/tokens.ts` - agregado export `REGISTRIES` ({label, address, chainId}[]), lee `NEXT_PUBLIC_REGISTRY_1_*` con fallback a las addresses reales; resto del archivo (creado en 01-01) intacto
- `.env.example` - agregadas `NEXT_PUBLIC_REGISTRY_1_LABEL/_ADDRESS/_CHAIN_ID` con las addresses reales como ejemplo (públicas, no secretas); resto del archivo intacto

## Addresses y transacciones (publish)

- **Registry:** `0x89ec9bf3cd42a037a2d004813733fc0d6e2ab03d`
- **corteId:** `0xdff809cfa2e350aa5e82057774920a140d993b09a3835c9e2690a6b92f82fe32` (`keccak256("fixture-reducida")`)
- **tx publish:** `0xba83e39d39e0ec4d5657445358e5e0c56d5c0438ef601145551cdb1e8b6e8408` - status 1 (success), gasUsed 1,255,924, effectiveGasPrice ~20,052,000 wei
- **Arbiscan:** https://arbiscan.io/tx/0xba83e39d39e0ec4d5657445358e5e0c56d5c0438ef601145551cdb1e8b6e8408
- **getCut() verificado via cast:** cL=`0x0316ae3f371ee6733a84574ccd257c783e7d4d33340c70ceccfd754014a82d2f` (== `public_inputs[1]`), cR=`0xC0FFEE`, attestationHash=`keccak256("attestation-sintetica")`, blockB=25793955, publishedAt=1787200302, verdicts=[1,1,1,1], coverageBps=[10000,9800,10000]
- **cutExists:** true, **cutCount:** 1, **latestCorteId:** coincide con corteId
- **Caso negativo:** `CORTE_ID=fixture-reducida-tamper-check` (corteId `0xcd49ff02e8c6b067c15695265170106c6b43f2c4425a144cfbeb74ec56f2dc86`), `TAMPER_PROOF=true`, simulación sin broadcast, revierte `ProofRejected(0xcd49ff02...)` - corteId confirmado con `cast keccak "fixture-reducida-tamper-check"`
- **Balance wallet M2:** 0.000431342580566417 ETH (previo) -> 0.000406158792518417 ETH (post-publish); ~0.0000252 ETH gastados en el publish real, cero gastado en el negativo (solo simulación)
- **Respaldo documentado adicional:** 22 tests de Foundry (1 positivo + 5 negativos con selector exacto) corridos en verde en Plan 01 Task 2

## Decisions Made

- RPC `https://arb1.arbitrum.io/rpc` para el broadcast del publish y todas las verificaciones (`cast call`/`cast receipt`), consistente con el cambio de RPC de Plan 01 (publicnode devolvía 403 falso en `eth_getTransactionReceipt`)
- Guard de balance re-chequeado antes del broadcast (`gas_estimado * gasPrice * 2 < balance`): a 0.02 gwei el gas necesario (~0.0000744 ETH) quedaba ampliamente cubierto por el balance real (0.000431 ETH)
- `deployments.json` incluye `publishTx` y `corteId` además del schema mínimo pedido por el plan (campos adicionales no bloqueantes que documentan el publish real, no solo el deploy)

## Deviations from Plan

None - plan ejecutado exactamente como estaba escrito. Los dos hallazgos operativos (RPC y guard de balance) ya estaban anticipados como "operational notes" heredadas de Plan 01 en el dispatch del orchestrator, no deviations nuevas.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required. Las addresses en `.env.example` son públicas por diseño (D-08c/T-02-09), no requieren acción del usuario.

## Next Phase Readiness

- SOL-02 cumplido: publish aceptado on-chain y visible en Arbiscan; publish inválido revierte contra el Registry real.
- Fase 2 completa (SOL-01 de Plan 01 + SOL-02 de este plan).
- Phase 4 puede leer `REGISTRIES` de `lib/config/tokens.ts` (o `deployments.json` directo) sin adaptar nada: mismo naming `NEXT_PUBLIC_REGISTRY_1_*` que `04-01-PLAN.md` espera, mismo array `registries[]` que `04-03-PLAN.md` extiende con un segundo entry ("Corte real (mini)").
- `corteId` y el evento `CutPublished` de este publish son los datos reales que el badge y `/status/twin-neobank` de Phase 4 pueden mostrar de entrada.

---
*Phase: 02-sobrecito-registry*
*Completed: 2026-08-20*
