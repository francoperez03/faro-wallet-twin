# Phase 2: Sobrecito Registry - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-20
**Phase:** 2-sobrecito-registry
**Mode:** `--auto` — todas las áreas restantes auto-seleccionadas, cada pregunta resuelta con la opción recomendada. Las decisiones de la discusión conjunta del 19-08 (deployer M2, fondeo, deploy desde Sobrecito, fixture publish, Registry-mini diferido) entraron como LOCKED y no se rediscutieron.
**Areas discussed:** Carga de la clave, Preflight de gas, RPC del deploy, Verificación en Arbiscan, Registro y handoff de addresses, Mecanismo del publish, Caso negativo

---

## Carga de la clave (~/.wakeup-m2-arb1.key)

| Option | Description | Selected |
|--------|-------------|----------|
| Inline por command substitution: `--private-key "$(cat ~/.wakeup-m2-arb1.key)"` | Alternativa D-10 del README de Sobrecito; no interactiva, la clave nunca se imprime ni se versiona | ✓ |
| Keystore cifrado (`cast wallet import --interactive`) | El camino recomendado del README, pero exige un paso interactivo que el executor autónomo no puede correr | |
| Exportar la clave a un `.env` | Riesgo de commit accidental y de quedar en el árbol del repo | |

**Choice:** Recomendada (inline). **Notes:** reglas duras en D-03: jamás imprimir, loguear ni commitear la clave. El keystore queda ofrecido al usuario como upgrade manual.

## Preflight de gas y ensayo

| Option | Description | Selected |
|--------|-------------|----------|
| `cast balance` con umbral ~0.002 ETH + `forge test` + `dry-run-anvil.sh` antes del broadcast | Aborta temprano con mensaje claro; el dry-run ya existe en el repo | ✓ |
| Deployar directo y dejar que falle por fondos | Tx parcial posible (verifier sí, Registry no) y diagnóstico confuso | |

**Choice:** Recomendada. **Notes:** el top-up es acción del usuario (locked D-02).

## RPC del deploy

| Option | Description | Selected |
|--------|-------------|----------|
| publicnode: `https://arbitrum-one-rpc.publicnode.com` | Mismo criterio que Phase 1 (D-03); sin API key | ✓ |
| RPC con API key (Alchemy/Infura) | No hay key disponible (confirmado en la discusión del 19-08) | |

**Choice:** Recomendada. **Notes:** configurable por env por si aparece una key.

## Verificación de source en Arbiscan

| Option | Description | Selected |
|--------|-------------|----------|
| Best-effort: sin `--verify` salvo que exista `ETHERSCAN_API_KEY`; `forge verify-contract` a posteriori si aparece | Los success criteria solo piden visibilidad en el explorer; txs y logs se ven sin source verificado | ✓ |
| `--verify` obligatorio en el deploy | Bloquea el deploy si no hay key, contra deadline | |
| No verificar nunca | Pierde el upgrade gratis si la key existe | |

**Choice:** Recomendada. **Notes:** diferido a post-submission si no hay key (ver deferred).

## Registro y handoff de addresses

| Option | Description | Selected |
|--------|-------------|----------|
| `record-deployment.sh` en Sobrecito + `deployments.json` propio en twin + config module de Phase 1 + env `NEXT_PUBLIC_*` | Cada repo registra lo suyo con su herramienta; Phase 4 lee las addresses desde el config module | ✓ |
| Solo env vars en twin | Se pierde la trazabilidad (tx hashes, key_hash, links) para el disclosure y el pitch | |
| Copiar ops/deployments.json de Sobrecito a mano | Duplica un archivo generado y se desincroniza | |

**Choice:** Recomendada. **Notes:** base locked del 19-08 (env + deployments.json propio); acá se resolvió el detalle.

## Mecanismo del publish on-chain

| Option | Description | Selected |
|--------|-------------|----------|
| `Publish.s.sol` mínimo en `contracts/script/` de Sobrecito, reusando el patrón de `Fixture.sol` | Foundry ya tiene fs_permissions a las fixtures; struct CutInput + proof de 10KB se arman en Solidity, y el script queda reusable para el pipeline real de Phase 4 | ✓ |
| `cast send` armando la calldata a mano | Frágil: struct anidado + bytes de 10688; un error de encoding quema gas de verify | |
| Script de publish en el repo twin (viem) | Contradice la decisión locked de no copiar código de Sobrecito al twin y duplica la carga de fixtures | |

**Choice:** Recomendada. **Notes:** única pieza nueva de código de la fase; vive en Sobrecito, junto al resto del stack de contratos.

## Caso negativo (publish inválido revierte)

| Option | Description | Selected |
|--------|-------------|----------|
| Simulación `eth_call` contra el contrato deployado en mainnet con la proof adulterada (revert `ProofRejected`/`CLMismatch`), tests de Foundry como respaldo | Prueba el revert contra el deploy real sin quemar ~800k gas en una tx fallida a propósito | ✓ |
| Tx fallida real en mainnet para que quede en Arbiscan | Evidencia en explorer, pero gasta gas y ensucia el historial del publisher | |
| Solo citar los 22 tests de Foundry | No toca el contrato deployado; el success criterion habla del deploy real | |

**Choice:** Recomendada. **Notes:** los 5 negativos con selector exacto del test suite quedan citados como respaldo documentado.

## Claude's Discretion

- Valores exactos del `CutInput` (copiar el caso positivo de `SobrecitoRegistry.t.sol`; corteId alternativo solo si hiciera falta).
- Naming de env vars y schema del `deployments.json` del twin.
- Gas price, reintentos de RPC, orden fino del runbook.

## Deferred Ideas

- Segundo Registry para el circuito "corte mini" — Phase 4.
- Pipeline real CSV → orchestrate_tree.py → publish — Phase 4 (SOL-06, stretch).
- Verificación de source en Arbiscan sin key — post-submission.
- Multisig 2-de-2 del publisher — v2 (SOL-V2-02).
