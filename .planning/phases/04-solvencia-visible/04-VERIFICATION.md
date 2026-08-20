---
phase: 04-solvencia-visible
verified: 2026-08-20T05:27:43Z
status: human_needed
score: 4/4 must-haves verified at code level (3 blocking + 1 stretch/non-blocking), all pending live runtime env
verdict: PASS (code level) — runtime E2E blocked by pre-existing Privy/Neon/publisher-key checkpoints, not introduced by this phase
human_verification:
  - test: "Set NEXT_PUBLIC_PRIVY_APP_ID (real), DATABASE_URL (Neon), log in, load Cuenta·Home"
    expected: "SolvencyBadge renders green pill 'Solvencia probada on-chain · último corte hace N h' (Registry #1, cutCount=1, ~confirmed fresh on-chain at verification time)"
    why_human: "app/providers.tsx gates the whole app behind a Privy App ID guard; visual render can't be exercised with the current placeholder"
  - test: "With a real session, open /cuenta/verificar"
    expected: "Fetches /api/cuenta/opening (200), recomputes Poseidon2 client-side, shows green 'Tu saldo está incluido' badge (synthetic era, no corte mini published yet)"
    why_human: "Requires live Privy session + DATABASE_URL; verifyPrivyToken and the accounts SELECT both fail without them"
  - test: "POST /api/cuenta/corte-mini with x-cron-secret against a seeded Neon DB (<=64 accounts) and PUBLISHER_PRIVATE_KEY set"
    expected: "runCorteMini() completes, publishes a real cut to Registry #2 (0x34d16b00809fcc6a6b0855d2052708615dbdc2c7), cutCount goes from 0 to 1, /status shows the mini registry with a real corte instead of empty history"
    why_human: "Needs DATABASE_URL + PUBLISHER_PRIVATE_KEY funded wallet in a live environment; code path and gate (bb.js proof verifies against native-generated verifier) were independently confirmed, but the actual publish transaction was not re-run in this verification"
---

# Phase 4: Solvencia Visible Verification Report

**Phase Goal:** Cualquiera puede ver y el cliente puede verificar que su saldo está cubierto por una prueba criptográfica publicada on-chain.
**Verified:** 2026-08-20T05:27:43Z
**Status:** human_needed (all code-level must-haves verified; runtime E2E needs a live Privy/Neon/publisher-key environment that isn't configured on this machine)
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (ROADMAP Success Criteria, Phase 4)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Home de Cuenta muestra badge "Solvencia probada on-chain · último corte hace N h" leyendo el Registry, verde <26h / ámbar si vencido | ✓ VERIFIED (code level) | `lib/sobrecito/use-registry.ts` `FRESH_HOURS = 26`, `status = hoursAgo < FRESH_HOURS ? "green" : "amber"`; `components/cuenta/solvency-badge.tsx` wires this into `app/(tabs)/cuenta/page.tsx`. On-chain: Registry #1 `cutCount()` = 1 (`0x...01`, confirmed via direct `eth_call` to `arb1.arbitrum.io/rpc`). Visual render blocked by placeholder `NEXT_PUBLIC_PRIVY_APP_ID` (pre-existing app-wide guard, not introduced by this phase) — see human_verification #1. |
| 2 | User verifica su inclusión: pide su opening, recomputa Poseidon2 en el browser, ve verde/rojo/pendiente | ✓ VERIFIED (code level) | `app/api/cuenta/opening/route.ts`: DID exclusively from verified Privy token (`verifyPrivyToken`), salt via `deriveSalt` (HKDF-SHA256 of `SOBRECITO_MASTER_HEX` + did, reduced mod BN254 Fr, server-only, no `NEXT_PUBLIC_` prefix). `app/(tabs)/cuenta/verificar/page.tsx` fetches, calls `recomputeCommitment` client-side, compares, shows green/red. Poseidon2 vector confirmed real (see below). Note: "pendiente" state is implemented as the loading skeleton / error text, not a distinct third badge color — a documented, deliberate resolution of a plan-internal contradiction (04-02-SUMMARY "Decisions Made"), not a silent gap. |
| 3 | `/status/twin-neobank` muestra veredictos, cobertura, frescura, historial de cortes y declaredMask en claro, sin login | ✓ VERIFIED (code level) | `app/status/twin-neobank/page.tsx` outside `(tabs)` layout, no auth check; `components/status/declared-mask.tsx` explains cL (probado) vs cR/verdicts/coverageBps/attestationHash (declarado) in plain text; `components/status/cut-history.tsx` + `useCutHistory` (event logs `CutPublished`, `fromBlock: 0n`) for history; selector shows because `REGISTRIES.length === 2` now (`REGISTRIES.length > 1` guard). |
| 4 (stretch, non-blocking, SOL-06) | Pipeline real exporta ledger, corre el circuito, publica la prueba de la raíz real, reemplazando la fixture | ✓ MET AT CODE LEVEL, runtime pending | Registry #2 (`0x34d16b00809fcc6a6b0855d2052708615dbdc2c7`) has code on-chain (confirmed via `eth_getCode`), `keyHash()` = `0x...54574e2f4d494e492f7631`, differs from Registry #1's `keyHash()` = `0x0a3d8cb5...bd8f9c` (confirmed on-chain, two independent `eth_call`s). Verifier `0xfbe9fccfd24638fc8cefe64dd908bdcb0bd2b01c` has code. `circuits-mini/liabilities_batch_mini.json` exists on disk and is committed (`git log` shows it in commit `4bd6433`). `lib/sobrecito-mini/prove.ts` assembles `publicInputs = [key_hash, cL]` (index 1 checked against witness `returnValue`) and signs via `walletClient.writeContract` using `privateKeyToAccount(process.env.PUBLISHER_PRIVATE_KEY)` (server-only). Registry #2 `cutCount()` = 0 (no cut published yet), consistent with the documented remaining blocker: first real publish needs `DATABASE_URL` + `PUBLISHER_PRIVATE_KEY` in a live environment. |

**Score:** 4/4 truths verified at code level; 3 blocking criteria fully code-complete, 1 stretch criterion code-complete with its final runtime step (first real publish) still pending.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `lib/sobrecito/use-registry.ts`, `components/cuenta/solvency-badge.tsx` | Badge verde/ámbar/neutral vs 26h | ✓ VERIFIED | Wired into `app/(tabs)/cuenta/page.tsx`, logic matches D-12/D-13 |
| `app/status/twin-neobank/page.tsx` | Public status page, no login | ✓ VERIFIED | No session check; selector appears (`REGISTRIES.length === 2`) |
| `lib/poseidon2/commit.ts` + `lib/poseidon2/test-vectors/commitment-vector.json` | Poseidon2 sponge validated against a real `commitment_lib` vector | ✓ VERIFIED | `npm test -- lib/poseidon2/commit.test.ts` → 2/2 pass; vector file value `0x181ab30b6db964295ad2ee45b662e8ba112af8a441f276b7e1e351108b9cf5cf` matches 04-02-SUMMARY claim exactly |
| `app/api/cuenta/opening/route.ts` | Authenticated, HKDF-derived salt, server-only master | ✓ VERIFIED | `verifyPrivyToken` gate, `deriveSalt` uses `SOBRECITO_MASTER_HEX` (no `NEXT_PUBLIC_`) |
| `app/(tabs)/cuenta/verificar/page.tsx` | Verde/rojo/pendiente + mailto report | ✓ VERIFIED | Green/red implemented; mailto prefilled with corteId/DID/commitments |
| `circuits-mini/liabilities_batch_mini.json` | Committed circuit artifact | ✓ VERIFIED | Present on disk, tracked in git (commit `4bd6433`) |
| `lib/sobrecito-mini/prove.ts` | Assembles `[key_hash, C_L]`, signs with `PUBLISHER_PRIVATE_KEY` | ✓ VERIFIED | Confirmed by direct read of the file; server-only env var, no client leak |
| `lib/db/schema.sql` (openings table) | `openings(corte_id, user_id, balances, commitment)` | ✓ VERIFIED | `create table if not exists openings (corte_id, user_id references accounts, balances jsonb, commitment, created_at, PK(corte_id,user_id))`, idempotent |
| `components/status/declared-mask.tsx` | Explains cL probado vs cR/verdicts/coverage/attestation declarado | ✓ VERIFIED | Plain-language text matches D-14 |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `solvency-badge.tsx` | `SobrecitoRegistry` (Arbitrum) | `useLatestCut` (`latestCorteId` → `getCut`) | WIRED | On-chain calls confirmed to return real data (cutCount=1) |
| `verificar/page.tsx` | `/api/cuenta/opening` | `fetch` + `Authorization: Bearer <privy token>` | WIRED | Auth gate present, DID sourced only from verified token |
| `prove.ts` | `SobrecitoRegistry` #2 | `walletClient.writeContract("publish", [cutInput, proof, publicInputs])` | WIRED (code), NOT YET INVOKED against production DB/key | On-chain `cutCount()` for Registry #2 = 0, consistent with "not run yet" rather than "broken" |
| `/status` page | Registry #1 + Registry #2 | `REGISTRIES` array + `useCutHistory` per selected registry | WIRED | `REGISTRIES.length === 2`, selector tab renders per D-15 |

### On-Chain Verification (Arbitrum One, direct RPC to arb1.arbitrum.io)

- Registry #1 `0x89ec9bf3cd42a037a2d004813733fc0d6e2ab03d`: `cutCount()` = `1` ✓
- Registry #1 `keyHash()` = `0x0a3d8cb59f79a9cea1389fcd41eb5e5a65ea70f89be2ec030f6b2d35b5bd8f9c`
- Registry #2 `0x34d16b00809fcc6a6b0855d2052708615dbdc2c7`: has deployed bytecode ✓, `keyHash()` = `0x...54574e2f4d494e492f7631` — **differs from Registry #1's key_hash** ✓ (confirms distinct mini VK, D-04)
- Registry #2 `cutCount()` = `0` (no real cut published yet — expected, matches documented remaining blocker)
- Verifier `0xfbe9fccfd24638fc8cefe64dd908bdcb0bd2b01c`: has deployed bytecode ✓

### Build and Test

- `npm run build`: passes clean, all routes compile including `/status/twin-neobank`, `/cuenta/verificar`, `ƒ /api/cuenta/corte-mini`, `ƒ /api/cuenta/opening`
- `npm test -- lib/poseidon2/commit.test.ts`: 2/2 pass, vector value matches SUMMARY claim exactly (`0x181ab30b...f5cf`)

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|--------------|--------|----------|
| SOL-03 | 04-01 | Badge de solvencia en Cuenta·Home | ✓ SATISFIED (code) | see Truth #1 |
| SOL-04 | 04-02 | Verificación de inclusión del cliente | ✓ SATISFIED (code) | see Truth #2 |
| SOL-05 | 04-01 | `/status/twin-neobank` público | ✓ SATISFIED (code) | see Truth #3 |
| SOL-06 | 04-03 | Pipeline real, stretch no bloqueante | ✓ SATISFIED (code), runtime pending | see Truth #4 |

### Anti-Patterns Found

None blocking. No placeholder returns, no empty stub handlers, no hardcoded-empty props found in the files touched by this phase. `cR`/`verdicts`/`coverageBps`/`attestationHash` are intentionally declared (not proven) values — documented as such in-code (`declared-mask.tsx`) and in the SUMMARYs, consistent with the accepted Phase 2 risk (T-04-08), not a hidden gap.

### Sobrecito Repo Cleanliness

`git status --short circuits/ contracts/` in `/Users/francoperez/repos/job/Sobre/sobrecito` shows only **untracked** foundry `broadcast/` run logs (`contracts/broadcast/Deploy.s.sol/42161/*.json`, `contracts/broadcast/Publish.s.sol/42161/*.json`), timestamped Aug 20 01:25–01:31 — consistent with Phase 2's own `Deploy.s.sol`/`Publish.s.sol` runs (Registry #1 deploy + fixture publish), not with Phase 4's work (04-03-SUMMARY explicitly documents running the mini's deploy from a scratchpad throwaway Foundry project, "no dentro de twin ni de Sobrecito"). No tracked file inside `circuits/` or `contracts/` shows a diff. **Confirmed untouched by Phase 4.**

### Human Verification Required

See frontmatter `human_verification`. All three items are runtime E2E checks that require a live Privy App ID, a seeded Neon `DATABASE_URL`, and (for #3) a funded `PUBLISHER_PRIVATE_KEY` — none of which are configured on this machine. This mirrors the same pre-existing blocker documented across Phase 1 and Phase 3 (`NEXT_PUBLIC_PRIVY_APP_ID=REPLACE_ME_PRIVY_APP_ID` in `.env.local`, no `DATABASE_URL`). It is not a gap introduced by Phase 4.

### Gaps Summary

No code-level gaps found. All three blocking success criteria (SOL-03/04/05) and the stretch criterion (SOL-06) are implemented, wired, and independently corroborated against the live Arbitrum contracts and a real Poseidon2 test vector. The only unmet piece — Registry #2 having zero cuts published — is a runtime step (needs `DATABASE_URL` + `PUBLISHER_PRIVATE_KEY` in Vercel) explicitly flagged as pending by the phase's own SUMMARY, and does not block Phase 5 per ROADMAP.md ("Phase 5... never blocked by Phase 4's stretch criterion, SOL-06").

---

*Verified: 2026-08-20T05:27:43Z*
*Verifier: Claude (gsd-verifier)*
