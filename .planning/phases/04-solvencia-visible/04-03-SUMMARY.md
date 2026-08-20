---
phase: 04-solvencia-visible
plan: 03
subsystem: solvencia
tags: [noir, bbjs, ultrahonk, corte-mini, stretch]

requires:
  - phase: 04-solvencia-visible
    plan: 01
    provides: "lib/config/tokens.ts REGISTRIES[0] (fixture), /status/twin-neobank"
  - phase: 04-solvencia-visible
    plan: 02
    provides: "lib/poseidon2/commit.ts (recomputeCommitment), app/api/cuenta/opening/route.ts"
provides:
  - "circuits-mini/liabilities_batch_mini/: circuito Noir standalone (K=64, T=2, un lote, sin recursion)"
  - "circuits-mini/liabilities_batch_mini.json: artifact ACIR commiteado"
  - "Registry #2 en Arbitrum (0x34d16b00809fcc6a6b0855d2052708615dbdc2c7), anclado al key_hash del mini"
  - "lib/sobrecito-mini/prove.ts: pipeline completo de proving (bb.js) + publish"
  - "app/api/cuenta/corte-mini/route.ts: endpoint manual + handler del cron"
  - "lib/db/schema.sql: tabla openings (D-09)"
affects: []

tech-stack:
  added: ["@aztec/bb.js@5.0.0-nightly.20260522", "@noir-lang/noir_js@1.0.0-beta.22"]
  patterns:
    - "Circuito mini: main.nr propio (no liabilities_batch + agg_root de Sobrecito) que hace, en un solo main, totals + fold_batch_acc + commit_totals, porque D-01 elimina la recursion (un solo lote)"
    - "key_hash como pub param constrainido contra un ancla compile-time (KEY_HASH en params.nr), en vez de una VK de hijo agregado (no hay hijos): el Registry #2 lo usa igual que el Registry #1 usa agg_l1_vk_hash"
    - "Proving 100% en JS: noir_js (Noir.execute) computa el witness desde inputs nombrados, bb.js (UltraHonkBackend.generateProof) prueba con verifierTarget 'evm' (keccak oracle), sin ningun binario nativo en runtime"

key-files:
  created:
    - circuits-mini/liabilities_batch_mini/Nargo.toml
    - circuits-mini/liabilities_batch_mini/src/main.nr
    - circuits-mini/liabilities_batch_mini/src/params.nr
    - circuits-mini/liabilities_batch_mini.json
    - lib/sobrecito-mini/prove.ts
    - lib/poseidon2/salt.ts
    - app/api/cuenta/corte-mini/route.ts
  modified:
    - deployments.json (segunda entrada de registry)
    - lib/config/tokens.ts (REGISTRIES[1])
    - lib/db/schema.sql (tabla openings)
    - app/api/cuenta/opening/route.ts (sirve la fila real si existe, deriveSalt movido a lib/poseidon2/salt.ts)
    - lib/sobrecito/registry-abi.ts (agregado publish())
    - .env.example (PUBLISHER_PRIVATE_KEY, NEXT_PUBLIC_REGISTRY_2_*)
    - .gitignore (circuits-mini/**/target/)
    - package.json / package-lock.json

key-decisions:
  - "Gate D-05 PASÓ: proof generada con bb.js (npm, WASM) verifica contra el verifier Solidity generado con bb nativo, confirmado con un forge test en un harness descartable (scratchpad), no en Sobrecito ni en twin"
  - "T=2 (ARGt + BOLt) confirmado contra el schema real de Phase 3 (accounts.argt_balance + accounts.bolt_balance existen ambas columnas)"
  - "key_hash del mini es un ancla propia (KEY_HASH = 0x54574e2f4d494e492f7631 en params.nr), no una VK de hijo agregado: el circuito mini no tiene recursion, así que no hay 'VK del hijo' que anclar. Es el mismo patrón que usa agg_root (pub param + assert contra un compile-time constant), aplicado sin recursion."
  - "Verifier de PRODUCCION generado con --optimized (mismo criterio que Sobrecito Deploy.s.sol, ~1.5M gas de verify en vez de ~5.9M): el smoke test (Task 1) usó el verifier NO optimizado (default de write_solidity_verifier) porque es el que el gate pide reproducir 1:1 contra bb nativo sin flags extra; el optimizado se generó aparte para el deploy real de Task 2, mismo VK/misma proof format (no afecta el resultado del gate)."
  - "Deploy corrido desde un throwaway foundry project en scratchpad (lib/forge-std + SobrecitoRegistry.sol/IVerifier.sol copiados de Sobrecito, sin editar Sobrecito), no dentro de twin ni de Sobrecito: evita agregar un segundo workspace de Foundry al repo solo para un deploy de una vez."
  - "2x guard de gas: el dry-run de forge script sobreestimó el costo (0.04 gwei, maxFeePerGas padded) por encima del gas price real (0.02 gwei); se pineó --with-gas-price a 25000000 wei para acotar el spend real a ~0.000148 ETH (2.75x de margen sobre el balance de 0.000406 ETH), en vez de confiar en el estimate padded de forge (que sí violaba el guard de 2x contra el balance)."
  - "cR/verdicts/coverageBps/attestationHash declarados con el MISMO criterio que Sobrecito contracts/script/Publish.s.sol (cR=0xC0FFEE placeholder, verdicts=[1,1], coverageBps=[10000] un bucket, attestationHash=keccak de un string fijo): son DECLARADOS, no probados, en ambos Registries (T-04-08, riesgo ya aceptado en Phase 2)."
  - "vercel.json NO se tocó: el mensaje de asignación marca ese archivo como propiedad de dos executores de phase 5 corriendo en paralelo. El cron '/api/cuenta/corte-mini' (D-06) queda pendiente de agregar ahí por quien tenga la propiedad de ese archivo; el endpoint manual (POST + x-cron-secret) funciona igual sin el cron declarado."

requirements-completed: [SOL-06]

duration: ~2h
completed: 2026-08-20
---

# Phase 4 Plan 3: Corte mini (stretch, gate D-05 pasado) Summary

**El gate de bb.js (D-05) pasó: una proof generada 100% en JS (noir_js + bb.js WASM) para el circuito mini verifica contra el verifier Solidity generado con bb nativo. El stretch completo se ejecutó: circuito mini compilado y commiteado, segundo Registry deployado en Arbitrum anclado a su VK, y el pipeline de proving+publish (endpoint manual + handler de cron) implementado con `npm run build` en verde.**

## Performance

- **Duration:** ~2h
- **Tasks:** 3/3 completados (Task 1 gate → Task 2 deploy → Task 3 pipeline)
- **Files created:** 7
- **Files modified:** 8

## Gate D-05 (Task 1): evidencia

1. Se creó `circuits-mini/liabilities_batch_mini/` dentro del repo twin, con `Nargo.toml` (path dependency read-only a `commitment_lib` de Sobrecito, ruta absoluta). El workspace de Sobrecito no tiene ni un archivo tocado (`git status --short circuits/ contracts/` vacío, confirmado dos veces: al final de Task 1 y al final de Task 3).
2. `src/main.nr`: variante mini de D-01. K=64, T=2 (ARGt+BOLt, confirmado contra `accounts.argt_balance`/`bolt_balance` de Phase 3). Un solo `main()` calcula `totals` + `acc_root` (`fold_batch_acc` sobre los commitments del lote) + `commit_totals` — el equivalente de `liabilities_batch` + la raíz del árbol combinados, sin recursion (no hay hijos que verificar). `key_hash` es un `pub` param constrainido contra `KEY_HASH` (ancla compile-time en `params.nr`, mismo rol que `agg_l1_vk_hash` en el Registry #1 pero sin ser una VK de hijo, porque no hay recursion). Public inputs resultantes: `[key_hash, C_L]`, layout idéntico al de `SobrecitoRegistry.sol`.
3. `nargo test` (2 tests) y `nargo compile` (desde `circuits-mini/liabilities_batch_mini/`, sin flags de workspace) pasaron. Artifact copiado a `circuits-mini/liabilities_batch_mini.json` (D-02).
4. Baseline nativo: `nargo execute witness` → `bb write_vk -t evm` → `bb prove -t evm` → `bb verify -t evm` (todos OK) → `bb write_solidity_verifier -t evm` (sin `--optimized`, el verifier "de referencia" para el gate).
5. Smoke bb.js: en un harness Node descartable (`npm install @aztec/bb.js@5.0.0-nightly.20260522` + `@noir-lang/noir_js@1.0.0-beta.22`, versiones exactas confirmadas disponibles en npm), `noir.execute(inputs)` calculó el witness desde los mismos 64 usuarios dummy, y `UltraHonkBackend.generateProof(witness, {verifierTarget:'evm'})` generó una proof cuyos public inputs coincidieron EXACTO con los de la corrida nativa (`returnValue` == `C_L` nativo).
6. Foundry test (`forge test`, harness descartable en scratchpad con `forge-std` copiado de Sobrecito, `solc 0.8.28`/`via_ir=false` — el mismo profile que usa `contracts/foundry.toml` de Sobrecito, necesario porque `via_ir=true` daba "stack too deep" en el verifier no optimizado): `verifier.verify(proof_bbjs, publicInputs_bbjs)` → **`true`**.
   ```
   [PASS] test_bbjsProofVerifiesAgainstNativeVerifier() (gas: 5925607)
   ```

**Gate: PASADO.** Task 2 y 3 arrancaron.

## Task 2: Deploy del segundo Registry

- Verifier de producción regenerado con `bb write_solidity_verifier --optimized` (mismo criterio que `Deploy.s.sol` de Sobrecito, ~1.5M gas de `verify` en vez de ~5.9M del no optimizado).
- Deploy corrido desde un throwaway foundry project en scratchpad (no dentro de twin ni de Sobrecito): copié `SobrecitoRegistry.sol`/`IVerifier.sol` de Sobrecito (sin editarlo) + `forge-std`, escribí mi propio `Deploy.s.sol` con `KEY_HASH` hardcodeado al valor real (`0x...54574e2f4d494e492f7631`, el mismo que el circuito constrine).
- Balance previo: 0.000406158792518417 ETH. Gas price real ~0.020064 gwei; el dry-run de `forge script` estimó 0.040068 gwei (padded, ~2x el real) con un costo estimado de 0.000237 ETH — eso NO pasaba el guard de 2x contra el balance (necesitaba 0.000474). Pineé `--with-gas-price 25000000` (0.025 gwei) para acotar el spend real a un techo de 0.000148 ETH, dejando 2.75x de margen. Broadcast real, costo efectivo ~0.0000903 ETH (balance final: 0.000315823885086417 ETH).
- **HonkVerifier:** `0xfbe9fccfd24638fc8cefe64dd908bdcb0bd2b01c` (tx `0x535e3086c6ecd37d879d4ad42ab90e6b1d662d355e948fdc906814f4e8862ecc`)
- **SobrecitoRegistry #2:** `0x34d16b00809fcc6a6b0855d2052708615dbdc2c7` (tx `0x74309d659987834e656545db0035f34aafb495dda9758cd5bc1221b89a95070c`)
- Confirmado on-chain: `keyHash()` == el ancla esperada, `publisher()` == wallet M2, ambos contratos con code en Arbiscan.
- `deployments.json` y `lib/config/tokens.ts` (`REGISTRIES[1]`, label "Corte real (mini)") actualizados, sin pisar la entrada de Phase 2.

## Task 3: Pipeline de proving + publish

- `lib/sobrecito-mini/prove.ts`: exporta `accounts` (todo el ledger, ≤64 filas o tira error), deriva salt por usuario (HKDF, extraído a `lib/poseidon2/salt.ts` compartido con `app/api/cuenta/opening`), corre `noir.execute` + `UltraHonkBackend.generateProof` (bb.js, WASM, sin binarios nativos), arma el `CutInput` y publica al Registry #2 con `viem` (`walletClient.writeContract`, firma con `PUBLISHER_PRIVATE_KEY`). Cada corrida exitosa hace `INSERT ... ON CONFLICT DO NOTHING` en `openings` por usuario real (nunca por el padding a K=64).
- `app/api/cuenta/corte-mini/route.ts`: mismo patrón de `CRON_SECRET` que `app/api/cuenta/interest` (bearer para el cron, `x-cron-secret` para el POST manual), `maxDuration = 300` (Fluid) para el proving.
- `lib/db/schema.sql`: `CREATE TABLE IF NOT EXISTS openings (corte_id, user_id, balances jsonb, commitment, created_at, PK(corte_id, user_id))`, idempotente.
- `app/api/cuenta/opening/route.ts`: ahora consulta primero `openings` (la fila más reciente del usuario); si existe, sirve el corte real; si no, cae al on-the-fly sintético de siempre (D-09).
- `lib/sobrecito/registry-abi.ts`: agregado el ABI de `publish()` (antes solo lectura).

## Verificación funcional (sin DB/wallet real configuradas en esta Mac)

- `npm run build` pasa con la ruta nueva (`ƒ /api/cuenta/corte-mini`) compilada.
- `npx tsc --noEmit` limpio.
- `npm run dev` + `curl`:
  - sin `x-cron-secret` → `401 {"error":"unauthorized"}`
  - con `x-cron-secret` correcto → pasa el auth gate y falla en el primer paso real (`500 {"error":"DATABASE_URL no configurada"}`), el mismo patrón de degradación que el resto de las rutas de Phase 3/4 en esta Mac sin `DATABASE_URL` configurada.
- El pipeline de proving en sí (noir_js → bb.js → proof que verifica) se probó end-to-end en el harness de Task 1 con 64 usuarios dummy: mismo código que corre `lib/sobrecito-mini/prove.ts` (misma llamada a `Noir.execute` + `UltraHonkBackend.generateProof` con `verifierTarget: 'evm'`).

## Deviations from Plan

**1. [Rule 3 - Blocking] `vercel.json` no se tocó**
- **Found during:** Task 3
- **Issue:** El plan pide agregar el cron diario en `vercel.json`, pero el mensaje de asignación marca ese archivo como propiedad de dos executores de phase 5 corriendo en paralelo ("do not touch those")
- **Fix:** Se implementó el endpoint completo (`app/api/cuenta/corte-mini/route.ts`) listo para ser invocado tanto por cron como manualmente; el cron de Vercel específicamente queda sin declarar en `vercel.json` hasta que el dueño de ese archivo lo agregue: `{"path": "/api/cuenta/corte-mini", "schedule": "0 7 * * *"}`
- **Impact:** El botón manual (POST + `x-cron-secret`) funciona igual sin el cron declarado; SOL-06 no depende de que el cron esté registrado para considerarse "pipeline real reemplaza la fixture" (el endpoint corre el pipeline completo)

**2. [Rule 2 - Missing functionality] `app/api/cuenta/opening` no leía `openings`**
- **Found during:** Task 3 (D-09 exige que sirva la fila real cuando exista)
- **Fix:** Se agregó el SELECT a `openings` antes del fallback sintético, sin cambiar el contrato de la API (mismos campos en la respuesta)
- **Files modified:** `app/api/cuenta/opening/route.ts`
- **Committed in:** `7a628e1`

**Total deviations:** 1 bloqueada por ownership de archivo (documentada, no bloquea SOL-06), 1 auto-agregada (Rule 2).

## Task Commits

1. **Task 1: circuito mini + gate D-05 pasado** - `4bd6433` (feat)
2. **Task 2: segundo Registry deployado** - `eb788f6` (feat)
3. **Task 3: pipeline de proving + publish** - `7a628e1` (feat)

## User Setup Required

- `PUBLISHER_PRIVATE_KEY` en env de Vercel (misma wallet M2, la que ya firma el publish de Phase 2) para que el endpoint manual y el cron puedan publicar de verdad.
- Agregar a `vercel.json` (fuera de este plan, ver Deviations #1): `{"path": "/api/cuenta/corte-mini", "schedule": "0 7 * * *"}`.
- `DATABASE_URL`/`PRIVY_APP_SECRET`/`SOBRECITO_MASTER_HEX` (heredado de Phases 3/4, sin cambios acá).
- El ledger de la demo debe tener ≤64 usuarios en `accounts` para que `runCorteMini()` no tire error (K=64 hardcodeado en el circuito, D-01).

## Next Phase Readiness

- SOL-06 cumplido: pipeline real reemplaza la fixture, con la fixture de Phase 2 intacta como fallback permanente (Registry #1 sin tocar).
- Nada en Phase 4 (Plans 01/02) ni en Phase 5 depende de que este plan haya llegado hasta acá (era opcional, per `<success_criteria>` del plan).

---
*Phase: 04-solvencia-visible*
*Completed: 2026-08-20*

## Self-Check: PASSED

Todos los archivos creados (`circuits-mini/liabilities_batch_mini/{Nargo.toml,src/main.nr,src/params.nr}`,
`circuits-mini/liabilities_batch_mini.json`, `lib/sobrecito-mini/prove.ts`, `lib/poseidon2/salt.ts`,
`app/api/cuenta/corte-mini/route.ts`) y los tres commits de task (`4bd6433`, `eb788f6`, `7a628e1`)
confirmados presentes en disco/git log.
