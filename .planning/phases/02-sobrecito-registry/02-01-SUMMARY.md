---
phase: 02-sobrecito-registry
plan: 01
subsystem: infra
tags: [foundry, arbitrum, solidity, honk-verifier, zk]

# Dependency graph
requires: []
provides:
  - "SobrecitoRegistry desplegado y verificado en Arbitrum One (0x89ec9bf3cd42a037a2d004813733fc0d6e2ab03d)"
  - "HonkVerifier desplegado en Arbitrum One (0x9e2af6688b7ac79f506f0d61efb030843218d159)"
  - "ops/deployments.json en el repo Sobrecito, fuente de verdad de addresses para el publish"
affects: [02-02, phase-4]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Deploy.s.sol autoverificado: keyHash/verifier/publisher/owner se assertean contra el manifest antes de terminar el broadcast"
    - "record-deployment.sh genera ops/deployments.json solo desde artefactos medidos (broadcast + manifest + gas-snapshot), nunca addresses tipeadas"

key-files:
  created: []
  modified: []

key-decisions:
  - "Checkpoint de top-up de ETH resuelto por evidencia del orchestrator (balance 0.000528 ETH cubre ~3.7x el gas real a 0.02 gwei en Arbitrum One); guard de balance*gasPrice*2 re-chequeado antes de cada broadcast en vez del umbral fijo de 0.002 ETH del plan"
  - "RPC publicnode (arbitrum-one-rpc.publicnode.com) tiene un bug de clasificacion que rechaza eth_getTransactionReceipt como 'archive request' incluso para tx recien minadas; se cambio a la RPC oficial arb1.arbitrum.io/rpc solo para el resume y las verificaciones post-deploy (D-06 permite RPC configurable)"

requirements-completed: [SOL-01]

# Metrics
duration: 24min
completed: 2026-08-20
---

# Phase 2 Plan 1: Sobrecito Registry Deploy Summary

**SobrecitoRegistry + HonkVerifier desplegados y autoverificados en Arbitrum One mainnet, con el key_hash anclado a la fixture y `ops/deployments.json` generado por `record-deployment.sh`**

## Performance

- **Duration:** 24 min
- **Started:** 2026-08-20T04:04:00Z
- **Completed:** 2026-08-20T04:28:00Z
- **Tasks:** 3 (1 checkpoint override + 2 auto)
- **Files modified:** 2 (en el repo Sobrecito, fuera del repo twin)

## Accomplishments
- Preflight completo: `forge test` 22/22 verde, `dry-run-anvil.sh` exitoso contra anvil local
- Deploy real en Arbitrum One (chainId 42161): `HonkVerifier` en `0x9e2af6688b7ac79f506f0d61efb030843218d159`, `SobrecitoRegistry` en `0x89ec9bf3cd42a037a2d004813733fc0d6e2ab03d`
- Autoverificación de `Deploy.s.sol` pasó (keyHash, verifier, publisher, owner) sin revertir
- `ops/deployments.json` generado y verificado contra la chain real; grep de higiene de la clave privada dio 0 matches en broadcast/, cache/, deployments.json y el log de consola

## Task Commits

Todas en el repo Sobrecito (`/Users/francoperez/repos/job/Sobre/sobrecito`, branch `landing-en`), no en el repo twin:

1. **Task 1: Checkpoint de top-up (override del orchestrator)** - sin commit, verificación de balance/gas price únicamente
2. **Task 2: Preflight (forge test + dry-run-anvil.sh)** - sin commit, solo lectura/verificación
3. **Task 3: Deploy + record-deployment** - `ab5242e` (feat) en el repo Sobrecito: `contracts/broadcast/Deploy.s.sol/42161/run-latest.json` + `ops/deployments.json`

**Plan metadata (repo twin):** este SUMMARY.md, sin modificar STATE.md ni ROADMAP.md por instrucción explícita del orchestrator.

## Files Created/Modified

En `/Users/francoperez/repos/job/Sobre/sobrecito` (fuera del repo twin):
- `contracts/broadcast/Deploy.s.sol/42161/run-latest.json` - broadcast real del deploy en Arbitrum One
- `ops/deployments.json` - registro reproducible generado por `record-deployment.sh`, verificado contra la chain

## Addresses y transacciones

- **HonkVerifier:** `0x9e2af6688b7ac79f506f0d61efb030843218d159`
  - tx: `0xc7d9c47dd1794dcd33f33b894711b46516685da816a6885f54cfa4ed91800c92`
  - gas usado: 3,821,591
- **SobrecitoRegistry:** `0x89ec9bf3cd42a037a2d004813733fc0d6e2ab03d`
  - tx: `0xac1c638a7389c71d4ce46aa289c2efa74b0040c613fd6acc62d4dbc49a1d4805`
  - gas usado: 1,047,522
- **keyHash on-chain:** `0x0a3d8cb59f79a9cea1389fcd41eb5e5a65ea70f89be2ec030f6b2d35b5bd8f9c` (== `circuits/fixtures/manifest.json` `.anchors.agg_l1_vk_hash`)
- **publisher/owner:** `0x13B56eA93CB18ae90d7Ff6E01Cb97C1AbFB2B992` (wallet M2)
- **Balance inicial:** 0.000528710639554417 ETH
- **Balance final:** 0.000431342580566417 ETH (gasto total ~0.0000974 ETH, gas price efectivo ~20,000,001 wei)
- **Balance remanente para el publish de Plan 02 (~1,82M gas estimado):** cubre ampliamente con margen a los gas prices observados (~0.02 gwei)

## Decisions Made

- **Checkpoint de top-up:** el orchestrator ya había verificado por evidencia que el balance real (0.000528 ETH) cubre ~3.7x el gas necesario a los gas prices reales de Arbitrum One (~0.02 gwei), muy por debajo del estimado original de 0.002 ETH del plan (que asumía gas prices más altos). Se trató el checkpoint como satisfecho y se aplicó el guard `remaining_gas * gasPrice * 2 < balance` antes de cada broadcast, en vez de re-bloquear en el umbral fijo de 0.002 ETH.
- **Cambio de RPC durante el broadcast:** la RPC pública `arbitrum-one-rpc.publicnode.com` especificada en el plan devolvió `403 Archive requests require a personal token` al intentar `eth_getTransactionReceipt` de una tx recién confirmada (bug/cuota del tier gratuito, no relacionado con archive data real). Verificado con la RPC oficial `arb1.arbitrum.io/rpc` que la tx del verifier sí había sido minada con éxito (status 0x1). Se usó esa RPC oficial para reanudar el broadcast (`--resume`) y para las verificaciones post-deploy, incluyendo editar el campo `rpc` cacheado por Foundry en `contracts/cache/Deploy.s.sol/42161/run-latest.json` (Foundry ignora `--rpc-url` en `--resume` y usa el valor cacheado). D-06 permite RPC configurable si aparece una necesidad operativa; documentado aquí como deviation Rule 3 (blocking issue).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] RPC publicnode rechazaba `eth_getTransactionReceipt` de una tx confirmada**
- **Found during:** Task 3 (broadcast del deploy real)
- **Issue:** `forge script --broadcast` envió la tx de `HonkVerifier` con éxito (confirmada on-chain, status 0x1), pero `arbitrum-one-rpc.publicnode.com` devolvió `403 Archive requests require a personal token` al pedir el receipt, abortando el script antes de enviar la tx de `SobrecitoRegistry`. El error persistió en reintentos directos vía `curl` a la misma RPC.
- **Fix:** Verificado el estado real de la tx contra la RPC oficial `https://arb1.arbitrum.io/rpc` (confirmó éxito y `contractAddress`). Reanudado el broadcast con `--resume` apuntando a esa RPC; como Foundry cachea la RPC del intento anterior en `contracts/cache/Deploy.s.sol/42161/run-latest.json` e ignora el flag `--rpc-url` en modo resume, se reemplazó el valor `rpc` en ese archivo (dato de estado interno de Foundry, sin secretos) antes de reintentar. El segundo intento completó el broadcast de `SobrecitoRegistry` sin errores.
- **Files modified:** `contracts/cache/Deploy.s.sol/42161/run-latest.json` (no commiteado, gitignorado; estado interno de Foundry, no un artefacto del plan)
- **Verification:** `cast call` contra la RPC oficial confirmó `keyHash`, `publisher` y código on-chain de ambos contratos; grep de higiene de la clave dio 0 matches
- **Committed in:** N/A (el archivo modificado está gitignorado; el commit real de artefactos es `ab5242e`)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** El deploy se completó según lo especificado (misma cuenta, mismo script, mismo key_hash); el único cambio fue la RPC usada para reanudar el broadcast y leer receipts, motivado por una falla operativa del endpoint público especificado. Sin impacto en el resultado ni en el alcance.

## Issues Encountered

- El endpoint `arbitrum-one-rpc.publicnode.com` clasificó incorrectamente `eth_getTransactionReceipt` de una tx reciente como "archive request", bloqueando el flujo normal de `forge script --broadcast`. Resuelto cambiando a la RPC oficial de Arbitrum para el resume y las verificaciones (ver Deviations).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- SOL-01 cumplido: `SobrecitoRegistry` y `HonkVerifier` viven en Arbitrum One con el key_hash de la fixture anclado y autoverificado.
- `ops/deployments.json` en el repo Sobrecito es la fuente de verdad de addresses/tx hashes para Plan 02-02 (publish de la fixture + caso negativo simulado, D-09/D-10/D-11).
- Balance remanente en la wallet M2 (~0.000431 ETH) cubre el publish estimado (~1,82M gas) con margen a los gas prices actuales de Arbitrum One (~0.02 gwei); igual re-chequear balance y gas price antes del broadcast del publish, siguiendo el mismo guard usado en este plan.
- Si se reutiliza la RPC oficial `arb1.arbitrum.io/rpc` en Plan 02-02 conviene mantenerla por consistencia, dado el bug observado en la RPC publicnode para queries de receipt.

---
*Phase: 02-sobrecito-registry*
*Completed: 2026-08-20*
