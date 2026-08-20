---
phase: 02-sobrecito-registry
verified: 2026-08-20T05:15:00Z
status: passed
score: 3/3 success criteria verified, 2/2 requirements satisfied
---

# Phase 2: Sobrecito Registry Verification Report

**Phase Goal:** La infraestructura de solvencia vive on-chain, lista para que el modo Cuenta publique cortes.
**Verified:** 2026-08-20
**Status:** PASSED
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths / Success Criteria (ROADMAP.md, Phase 2)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | SobrecitoRegistry y HonkVerifier están desplegados en Arbitrum via Deploy.s.sol con el key_hash de la fixture | VERIFIED | Live `eth_getCode` on Arbitrum One (`arb1.arbitrum.io/rpc`, chainId 42161) returns non-empty bytecode at both addresses: Registry `0x89ec9bf3cd42a037a2d004813733fc0d6e2ab03d` (8692 bytes) and HonkVerifier `0x9e2af6688b7ac79f506f0d61efb030843218d159` (34866 bytes). `cast call keyHash()` returns `0x0a3d8cb59f79a9cea1389fcd41eb5e5a65ea70f89be2ec030f6b2d35b5bd8f9c`, matching the fixture's `agg_l1_vk_hash`. `cast call publisher()` returns `0x13B56eA93CB18ae90d7Ff6E01Cb97C1AbFB2B992` (wallet M2, per D-01). Deploy done via `contracts/script/Deploy.s.sol` in commit `ab5242e` on the Sobrecito repo (`landing-en` branch). |
| 2 | Un publish con la prueba de la fixture commiteada se acepta on-chain y queda visible en el explorer | VERIFIED | `cast call cutCount()` returns `1`. `cast call latestCorteId()` returns `0xdff809cfa2e350aa5e82057774920a140d993b09a3835c9e2690a6b92f82fe32`, which equals `keccak256("fixture-reducida")` (independently recomputed with `cast keccak`). `getCut(latestCorteId)` returns `publishedAt = 1787200302` (non-zero, i.e. the cut exists) with `cL`, `attestationHash`, `blockB`, `verdicts=[1,1,1,1]`, `coverageBps=[10000,9800,10000]` all matching the values documented in 02-02-SUMMARY.md. Publish tx `0xba83e39d39e0ec4d5657445358e5e0c56d5c0438ef601145551cdb1e8b6e8408` is visible on Arbiscan and its data is reflected in the live contract state read directly from the chain (not just claimed by the summary). |
| 3 | Un publish inválido (prueba que no corresponde) revierte | VERIFIED | Re-ran the negative case independently (not trusting the summary's claim): `forge script script/Publish.s.sol --rpc-url arb1.arbitrum.io/rpc --sender 0x13B56eA93CB18ae90d7Ff6E01Cb97C1AbFB2B992` with `TAMPER_PROOF=true` and a fresh `CORTE_ID`, no `--broadcast` (pure `eth_call` simulation against the real deployed contract, zero gas spent). Result: reverts with `ProofRejected(0x4c64e641a32569ffdcbdd9c22f3bf9148764b36fbf27e75c82d1b065fc394f3d)` — same error selector class documented in the summary, confirmed live against the mainnet contract, not just via the pre-existing Foundry test suite. |

**Score:** 3/3 success criteria verified

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|--------------|--------|----------|
| SOL-01 | 02-01-PLAN.md | SobrecitoRegistry + HonkVerifier deployed on Arbitrum via Deploy.s.sol with the fixture's key_hash | SATISFIED | See Truth #1 above; confirmed on-chain, not from summary text alone |
| SOL-02 | 02-02-PLAN.md | A cut is published on-chain (fixture proof) and rejected publishes revert | SATISFIED | See Truths #2 and #3 above; both re-verified live against Arbitrum One |

No orphaned requirements — both SOL-01/SOL-02 mapped to this phase in REQUIREMENTS.md are covered by the two plans.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `deployments.json` (twin repo root) | Parses, `registries[]` with `{label, address, verifierAddress, chainId, ...}` matching what Phase 4 plans expect | VERIFIED | Parses as valid JSON. `registries[0]` has `label`, `address`, `verifierAddress`, `chainId`, `deployTx`, `keyHash`, `explorer`, plus extra `publishTx`/`corteId` fields (additive, non-breaking). Schema matches 04-01-PLAN.md's expectation of `registries[]` and 04-03-PLAN.md's expectation of a second entry appended later without replacing this one. |
| `lib/config/tokens.ts` — `REGISTRIES` export | Exists, typechecks, read by env with fallback | VERIFIED | `export const REGISTRIES: { label: string; address: \`0x${string}\`; chainId: number }[]` present at line 43-50, reads `NEXT_PUBLIC_REGISTRY_1_*` env vars with fallback to the real deployed addresses. Isolated `tsc --noEmit` on the file (skipping a full `next build` to avoid clobbering other executors' `.next`) compiles with zero errors. Shape exactly matches the `{label, address, chainId}[]` signature 04-01-PLAN.md's task description names. |
| `.env.example` | `NEXT_PUBLIC_REGISTRY_1_*` entries present | VERIFIED | `NEXT_PUBLIC_REGISTRY_1_LABEL`, `_ADDRESS`, `_CHAIN_ID` present with the real deployed values as example (public addresses, no secrets). |
| `contracts/script/Publish.s.sol` (Sobrecito repo) | Committed on branch `landing-en` | VERIFIED | Committed in `c17b0a3` ("feat: add Publish.s.sol script for fixture cut publishing"), present on `landing-en` (current branch), compiles (independently re-invoked via `forge script` twice during this verification). |

### On-chain State (independently re-queried, not taken from summaries)

```
RPC: https://arb1.arbitrum.io/rpc (chainId 42161)
Registry:  0x89ec9bf3cd42a037a2d004813733fc0d6e2ab03d — code present (8692 bytes)
Verifier:  0x9e2af6688b7ac79f506f0d61efb030843218d159 — code present (34866 bytes)
keyHash():        0x0a3d8cb59f79a9cea1389fcd41eb5e5a65ea70f89be2ec030f6b2d35b5bd8f9c
publisher():      0x13B56eA93CB18ae90d7Ff6E01Cb97C1AbFB2B992
cutCount():       1
latestCorteId():  0xdff809cfa2e350aa5e82057774920a140d993b09a3835c9e2690a6b92f82fe32 (== keccak256("fixture-reducida"))
getCut(latestCorteId): publishedAt=1787200302 (!=0), cL, attestationHash, blockB=25793955,
  verdicts=[1,1,1,1], coverageBps=[10000,9800,10000] — all match 02-02-SUMMARY.md verbatim
```

### Secret Hygiene (Sobrecito repo, 3 new commits: ab5242e, c17b0a3, 7db0ab3)

Grepped the literal content of `~/.wakeup-m2-arb1.key` against the full diff of these three commits: **0 matches**. No private key material committed. `Publish.s.sol` reads the key exclusively via `--private-key`/`--account` CLI flags at invocation time, never hardcoded.

### Anti-Patterns Found

None. No TODO/placeholder/stub patterns in the touched files (`deployments.json`, `lib/config/tokens.ts`, `.env.example`, `Publish.s.sol`, `Deploy.s.sol` usage). Both twin-repo artifacts are static config, not runtime logic requiring wiring verification beyond the typecheck already performed.

### Human Verification Required

None. All success criteria are on-chain, programmatically verifiable facts (contract code presence, getter values, revert behavior) and were independently re-queried against the live Arbitrum One RPC rather than trusted from SUMMARY.md text.

### Gaps Summary

No gaps. All three ROADMAP success criteria for Phase 2 hold against live on-chain state, independently re-verified (not just re-read from the summaries): both contracts are deployed with the correct key_hash and publisher, the fixture cut is published and readable via `getCut`, and a tampered proof reverts with `ProofRejected` when simulated against the real deployed contract. The twin-repo handoff artifacts (`deployments.json`, `REGISTRIES`, `.env.example`) match the schema Phase 4's plans already assume, and are committed cleanly with no secret material in the new Sobrecito commits.

---

_Verified: 2026-08-20T05:15:00Z_
_Verifier: Claude (gsd-verifier)_
