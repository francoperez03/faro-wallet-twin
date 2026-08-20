# Faro

**A neobank on Twin stablecoins, with daily zero-knowledge proof of solvency published on-chain.**

Live: **https://faro-wallet.vercel.app**

Built in 24 hours for the *Twin your Neobank* hackathon at the LATAM Digital Assets Conference.

---

## What it does

Faro has two modes that share one login (email or Google via Privy, with an embedded wallet created on first sign-in).

### Wallet (self-custody)

- **Balances** of ARGt and BOLt across Arbitrum, Base, Polygon and Ethereum, with a per-network breakdown and native gas at a glance.
- **Send** any supported token on any supported network, with automatic chain switching.
- **Receive** with your embedded wallet address, ready to copy.
- **Activity**: one unified history of every transfer, all currencies and networks interleaved, sorted by block time, filterable by currency and by network.
- **Rewards**: deposit ARGt into the ARGt Prime vault on Arbitrum (Morpho, ERC-4626), see your position valued in ARGt, redeem.
- **Move between networks**: bridge ARGt between Arbitrum, Base and Polygon through Twin's LayerZero OFT adapters (approve + `send`, fee quoted on-chain, balance polling on the destination), plus a rebalance planner that splits a target allocation into the minimum set of bridge legs.

### Account (custodial, proven solvent)

An internal balance that earns daily interest from the vault, backed by an omnibus treasury. Every day the neobank publishes a **zero-knowledge proof that its assets cover every client balance** to a `SobrecitoRegistry` contract on Arbitrum, without revealing who holds what or the total. Any client can verify that their own balance was included in the cut, and anyone can audit the registry at `/status/twin-neobank`.

> The Account mode is currently hidden from the navigation while the Wallet mode is being polished for the demo. The routes (`/account`, `/status/twin-neobank`) and the API remain live.

## How the solvency proof works

The proof stack comes from Sobrecito, a ZK proof-of-solvency toolkit for custodians built by the same author.

1. Each client balance is committed with Poseidon2 as `commit(user_id, token, amount, salt)`, where `user_id` is the Privy DID and `salt` is derived per user with HKDF from a master secret held only in the server environment.
2. A Noir circuit (`circuits-mini/liabilities_batch_mini`, K = 64 users × T = 2 tokens) checks range constraints on every balance, sums liabilities per token, and exposes a single public commitment of the totals. Proofs are generated with Barretenberg (UltraHonk) in a Vercel function.
3. `SobrecitoRegistry.sol` on Arbitrum only accepts a cut if `HonkVerifier.sol` accepts the proof. Cuts are immutable; each one records the liabilities commitment, the on-chain reserves and the resulting coverage in basis points.
4. The app reads the registry directly with viem and renders the coverage, the age of the last cut and the verifier address. The "verify my inclusion" flow recomputes the client's commitment in the browser and checks it against the published batch.

Two registries are configured: a synthetic fixture and the real daily "mini" cut driven by a Vercel Cron (`/api/account/cut-mini`).

## Stack

| Layer | Choice |
|---|---|
| App | Next.js 16 (App Router), React 19, Tailwind v4, shadcn/ui, anime.js |
| Auth and wallets | Privy (email, Google, embedded wallet) via `@privy-io/wagmi` |
| Chain access | wagmi 3 + viem, public RPCs with env overrides |
| Ledger (Account mode) | Neon Postgres through the Vercel Marketplace |
| ZK | Noir 1.0.0-beta.22, Barretenberg `bb.js` 5.0 nightly, Poseidon2 |
| Contracts | `SobrecitoRegistry` + generated `HonkVerifier` on Arbitrum (Foundry) |
| Hosting | Vercel (Fluid Compute, Cron) |

## Supported assets

| Token | Arbitrum | Base | Polygon | Ethereum |
|---|---|---|---|---|
| ARGt | `0x5986…2214` | `0xf016…bdDD` | `0x5046…E056` | `0x5986…2214` |
| BOLt | `0x1edF…28eA` | `0x1d2E…4995` | `0x20EC…ed55` | `0x619F…8a56` |

Full addresses, the vault, the bridge adapters and the registries live in [`lib/config/tokens.ts`](lib/config/tokens.ts) and [`deployments.json`](deployments.json). Adding a stablecoin is one entry in `TOKENS`; adding a network is one entry in `CHAINS` plus its transport in `lib/wagmi-config.ts`.

## Run it locally

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_PRIVY_APP_ID at minimum
npm run dev                  # http://localhost:3000
```

The Wallet mode only needs a Privy App ID. The Account mode additionally needs `DATABASE_URL`, `PRIVY_APP_SECRET`, `VAULT_PRIVATE_KEY`, `CRON_SECRET`, `SOBRECITO_MASTER_HEX` and `PUBLISHER_PRIVATE_KEY`; see the comments in [`.env.example`](.env.example). Apply the schema with `npm run db:apply-schema`.

```bash
npm run lint
npm test          # node:test via tsx (e.g. the bridge rebalance planner)
npm run build
```

## Project layout

```
app/(tabs)/        home, rewards, bridge, activity, account/*   (client pages)
app/api/account/   ledger, interest cron, withdrawals, opening, daily ZK cut
app/status/        public solvency page for the registry
components/        UI: balance list, send/receive panels, activity, rebalance, faro
lib/config/        tokens, chains, vault, adapters, registries
lib/hooks/         balances, activity, bridge, vault position
lib/cuenta/        custodial ledger: deposits, withdrawals, interest, chain mutex
lib/sobrecito*/    registry ABI and reader, proof pipeline for the daily cut
lib/poseidon2/     commitment and salt derivation, must match the circuit
circuits-mini/     Noir circuit and compiled artifact for the mini cut
```

## Security and disclosure

This is an unaudited proof of concept built for a hackathon.

- The treasury key used for custodial withdrawals lives in a server environment variable. That is acceptable for a demo and nothing else; a real deployment needs an HSM or MPC signer and withdrawal limits.
- The solvency proof covers the liabilities side with full cryptographic guarantees. Reserves are read from public chain state at cut time; coverage, verdicts and which liabilities are in scope (`declaredMask`) are declared on-chain alongside each cut.
- No private keys, salts or proofs with real user data are committed to this repository. `.env*` is ignored; `.env.example` documents every variable.
- Public RPC endpoints are used by default. Set your own in `.env.local` for anything beyond a demo.
