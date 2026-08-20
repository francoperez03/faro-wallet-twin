# Phase 2: Sobrecito Registry - Context

**Gathered:** 2026-08-20 (decisiones base de la discusión conjunta del 19-08; gaps operativos resueltos en esta pasada)
**Status:** Ready for planning
**Mode:** `--auto` (áreas restantes auto-seleccionadas con la opción recomendada, revisables en 02-DISCUSSION-LOG.md)

<domain>
## Phase Boundary

La infraestructura de solvencia vive on-chain: SobrecitoRegistry y HonkVerifier deployados en Arbitrum One via `Deploy.s.sol` con el key_hash de la fixture, un publish con la proof commiteada aceptado y visible en el explorer, y la demostración de que un publish inválido revierte. Requirements SOL-01 y SOL-02. El badge de la app, la verificación del cliente, el semáforo público y el pipeline real pertenecen a Phase 4. No se copia código de Sobrecito al repo twin.

</domain>

<decisions>
## Implementation Decisions

### Deployer, clave y fondeo
- **D-01:** Deployer y publisher: la wallet M2 de wakeup, `0x13B56eA93CB18ae90d7Ff6E01Cb97C1AbFB2B992`, clave en `~/.wakeup-m2-arb1.key`. Ya deployó a mainnet Arbitrum (vault-aggregator). Publisher single-sig, igual que Sobrecito hoy; no se pasa `PUBLISHER_ADDRESS` (el default del script deja al deployer como publisher y lo assertea). [Locked 19-08]
- **D-02:** Fondeo pendiente: balance actual 0.00053 ETH en Arbitrum (0 en Base/Polygon). Sumar ~0.002 ETH en Arbitrum antes del deploy (verifier grande + Registry + publish de ~1,8M gas). Acción del usuario. [Locked 19-08]
- **D-03:** Carga de la clave en Foundry: inline por command substitution, `--private-key "$(cat ~/.wakeup-m2-arb1.key)"` (la alternativa D-10 documentada en el README de contracts de Sobrecito). Reglas duras: jamás imprimir la clave, jamás escribirla en logs, env files ni archivos del repo, jamás commitearla. El keystore cifrado (`cast wallet import --interactive`) queda como opción preferida si el usuario quiere correr ese paso interactivo a mano; el executor no puede hacerlo solo.
- **D-04:** Preflight obligatorio antes de cualquier broadcast: (1) `cast balance 0x13B5...B992 --rpc-url <arb1>` y abortar con mensaje claro si el balance queda por debajo de ~0.002 ETH; (2) `forge test` verde en el workspace de Sobrecito; (3) `bash script/dry-run-anvil.sh` como ensayo end-to-end local sin fondos.

### Ejecución del deploy
- **D-05:** Deploy desde el repo Sobrecito (`/Users/francoperez/repos/job/Sobre/sobrecito/contracts`) con `script/Deploy.s.sol`, que lee el key_hash de `circuits/fixtures/manifest.json` en runtime y se autoverifica contra los getters. [Locked 19-08]
- **D-06:** RPC para `forge script` y `cast`: `https://arbitrum-one-rpc.publicnode.com` (chainId 42161), el mismo criterio de familia publicnode que fijó Phase 1 (D-03 de esa fase). Configurable por env por si aparece una key dedicada.
- **D-07:** Verificación de source en Arbiscan: best-effort, nunca bloqueante. El deploy corre sin `--verify` salvo que exista `ETHERSCAN_API_KEY` en el entorno; si aparece la key después, `forge verify-contract` a posteriori. El success criterion pide que el publish quede visible en el explorer, y las txs y los logs se ven sin verificar el source.

### Registro y handoff de addresses al repo twin
- **D-08:** Después del broadcast se corre `ops/record-deployment.sh --chain-id 42161 --network arbitrum-one --rpc-url <rpc> --explorer-base https://arbiscan.io`, que genera `ops/deployments.json` en Sobrecito desde artefactos medidos (broadcast, manifest, gas-snapshot). En el repo twin se registran: (a) un `deployments.json` propio en la raíz con chainId, addresses de Registry y verifier, tx hashes, key_hash y links a Arbiscan; (b) las addresses en el módulo de config único que creó Phase 1 (D-10 de esa fase), porque Phase 4 lee el Registry desde la app; (c) env vars `NEXT_PUBLIC_*` para las addresses que consume el frontend. [Base locked 19-08: env + deployments.json propio; detalle resuelto acá]

### Publish de la fixture y caso negativo
- **D-09:** Publish inicial con la proof commiteada `circuits/fixtures/full_cut/root` (target evm, proof de 10688 bytes, ya verificada por los 22 tests de Foundry). [Locked 19-08]
- **D-10:** Mecanismo del publish: un `Publish.s.sol` mínimo agregado en `contracts/script/` del repo Sobrecito, que reusa las `fs_permissions` del foundry.toml y el patrón de carga de `test/Fixture.sol` (readFileBinary de proof y public_inputs). Armar la calldata a mano con `cast send` es frágil: `publish` recibe un struct `CutInput` más un proof de 10KB. Es la única pieza nueva de código de la fase y queda reusable para el pipeline real de Phase 4 (SOL-06). El `CutInput` copia los valores del caso positivo del test suite.
- **D-11:** Caso negativo (SOL-02, "un publish inválido revierte") demostrado contra el contrato deployado en mainnet via simulación `eth_call` (`cast call` o el mismo `Publish.s.sol` sin `--broadcast`) con la proof adulterada del test suite: debe revertir con `ProofRejected` (o `CLMismatch` según qué byte se adultere). Así se prueba el revert contra el deploy real sin quemar ~800k gas en una tx fallida a propósito. Los 22 tests de Foundry (fixture positiva + 5 negativos con selector exacto) quedan como respaldo documentado.

### Registry-mini (contexto para Phase 4)
- **D-12:** El keyHash es immutable; cuando exista el circuito "corte mini" se deploya un SEGUNDO Registry anclado a su VK. Este deploy de Phase 2 no lo bloquea ni lo espera. [Locked 19-08]

### Claude's Discretion
- Valores exactos del `CutInput` (corteId, cR, verdicts, coverageBps, attestationHash): copiar el caso positivo de `SobrecitoRegistry.t.sol`; elegir otro corteId solo si hiciera falta evitar `CutExists`.
- Nombres exactos de las env vars y schema del `deployments.json` del twin.
- Manejo de gas price, reintentos de RPC y orden fino de los comandos dentro del runbook.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Sobrecito (repo externo, se consume desde ahí)
- `/Users/francoperez/repos/job/Sobre/sobrecito/contracts/README.md` — Runbook de deploy (keystore vs private key, D-10), números de gas medidos, probado vs declarado, disclosure
- `/Users/francoperez/repos/job/Sobre/sobrecito/contracts/script/Deploy.s.sol` — Deploy reproducible: lee key_hash del manifest, `PUBLISHER_ADDRESS` opcional, autoverificación
- `/Users/francoperez/repos/job/Sobre/sobrecito/contracts/script/dry-run-anvil.sh` — Ensayo del deploy sin red ni fondos (paso de preflight D-04)
- `/Users/francoperez/repos/job/Sobre/sobrecito/contracts/test/Fixture.sol` — Cómo se cargan proof (10688 bytes) y public_inputs de `circuits/fixtures/full_cut/root` (patrón para D-10)
- `/Users/francoperez/repos/job/Sobre/sobrecito/contracts/test/SobrecitoRegistry.t.sol` — Caso positivo (valores del CutInput) y los 5 negativos con selector exacto (base de D-11)
- `/Users/francoperez/repos/job/Sobre/sobrecito/contracts/src/SobrecitoRegistry.sol` — Firma de `publish(CutInput, bytes, bytes32[])`, errores custom, declaredMask
- `/Users/francoperez/repos/job/Sobre/sobrecito/ops/record-deployment.sh` — Genera `ops/deployments.json` desde el broadcast (D-08)
- `/Users/francoperez/repos/job/Sobre/sobrecito/circuits/fixtures/manifest.json` — Ancla `anchors.agg_l1_vk_hash` (key_hash) y toolchain pineado

### Spec y planning (repo twin)
- `SPEC.md` §6 — Qué es Sobrecito, qué existe y funciona, decisión 6.A
- `.planning/REQUIREMENTS.md` — SOL-01, SOL-02 (los 2 requirements de esta fase)
- `.planning/ROADMAP.md` — Success criteria de Phase 2

</canonical_refs>

<code_context>
## Existing Code Insights

En el repo twin esta fase casi no toca código: los entregables viven on-chain y en el repo Sobrecito. Lo que sí aterriza en twin: `deployments.json`, addresses en el módulo de config único de Phase 1 y env vars.

### Reusable Assets (en Sobrecito)
- `Deploy.s.sol`: deploy completo, autoverificado, con dry-run contra anvil ya escrito.
- `Fixture.sol` + `circuits/fixtures/full_cut/root`: carga de proof y public_inputs lista para copiar al `Publish.s.sol`.
- 22 tests verdes (`forge test`) que cubren el happy path y los 5 negativos; `.gas-snapshot` con los números medidos.
- `record-deployment.sh`: registro reproducible del deploy sin tipear addresses a mano.

### Established Patterns
- Foundry con solc 0.8.28, `via_ir = false` (el verifier optimizado rompe el pipeline de Yul), `fs_permissions` de lectura a `../circuits/fixtures`. El `Publish.s.sol` nuevo debe respetar esa config tal cual.
- Cero secretos en archivos del repo: la clave llega por flag o keystore, jamás versionada.

### Integration Points
- Módulo de config único del twin (Phase 1, D-10): ahí entran `REGISTRY_ADDRESS` y `VERIFIER_ADDRESS`; Phase 4 lee `CutPublished` y los getters desde la app.
- `corteId` y el evento `CutPublished` del publish de esta fase son los datos que el badge y `/status/twin-neobank` de Phase 4 van a mostrar.

</code_context>

<specifics>
## Specific Ideas

- Esta fase corre en paralelo con Phase 1: no depende de nada de la app.
- El deadline es hoy (jueves 20/08 18 h): el runbook completo (preflight, deploy, record, publish, negativo simulado) debería ser una sesión corta; el único bloqueo externo es el top-up de ETH (D-02, acción del usuario).
- Disclosure heredado de Sobrecito: PoC no auditado, verifier generado por bb sin revisión externa, solo `cL` probado criptográficamente; `cR`, verdicts, coverage y attestation van declarados (declaredMask 0x0F). Ese texto alimenta el disclosure de Phase 5.
- La proof de la fixture es 100 % sintética (256 usuarios × 4 tokens): perfecta para el primer publish, y el pipeline real de Phase 4 la reemplaza si llega.

</specifics>

<deferred>
## Deferred Ideas

- Segundo Registry anclado a la VK del circuito "corte mini": Phase 4 (D-12).
- Pipeline real (CSV → orchestrate_tree.py → publish de la raíz real): Phase 4, SOL-06, stretch.
- Verificación de source en Arbiscan si no hay `ETHERSCAN_API_KEY` a tiempo: retomar post-submission (D-07 la deja best-effort).
- Multisig 2-de-2 del publisher: v2 (SOL-V2-02), fuera del hackathon.

</deferred>

---

*Phase: 02-sobrecito-registry*
*Context gathered: 2026-08-20*
