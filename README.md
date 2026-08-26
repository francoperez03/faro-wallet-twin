# Faro

**Your money in digital pesos, in your pocket, with nobody holding it for you.**

Live: **https://faro-wallet.vercel.app**

Built in 24 hours for the *Twin your Neobank* hackathon at the LATAM Digital Assets Conference.

---

## The pitch

Faro is a wallet on Twin stablecoins. Sign in with your email or Google and you have an account in ARGt and BOLt that works on Arbitrum, Base, Polygon and Ethereum. Send, receive, see every movement in one history, and when you want your money to earn, deposit it with two taps into the ARGt Prime vault on Morpho.

The difference from a bank or an exchange: Faro never touches your funds. The wallet is yours, the vault shares sit in your name in the contract, and anyone can verify it on-chain. Faro puts the experience of a neobank on top of infrastructure that is transparent by design.

- **What it is:** a neobank on Twin stablecoins, fully self-custodial, with balances, transfers, a Morpho vault and a bridge across four networks.
- **What sets it apart:** the feel of a banking app (email login, one balance, one history) on funds that always stay in the user's wallet, even while they earn.
- **Hackathon scope:** milestones 1, 2 and 3 as specified, plus BOLt and Ethereum as a bonus.

### Demo script (2 minutes)

1. **Sign in** (10 s). Email or Google, no seed phrase, no extension. Privy creates the wallet on first login. The lighthouse beam sweeps on the welcome screen.
2. **Home** (20 s). Total balance, split between wallet and invested. Pick the currency by flag: Argentine pesos, Bolivianos. Expand *Por red* to see each chain with its native gas.
3. **Send** (20 s). Any currency, any network. The app switches chains on its own and confirms on-chain. Send 1 ARGt on Arbitrum, show the toast and the explorer link.
4. **Activity** (15 s). One history, currencies and networks interleaved, sorted by real block time, filterable. Point at the transfer just made and at an *Inversión en Rewards* entry.
5. **Rewards** (30 s). The core of it. Deposit ARGt into the ARGt Prime vault on Morpho from your own wallet: one signature approves, one deposits. Balance, earnings and APY are read from the contract, never from a database of ours. Withdraw part or all at any time. Deposit 10 ARGt and watch the balance update in Rewards and in Home.
6. **Move between networks** (15 s). Bridge ARGt between Arbitrum, Base and Polygon through Twin's adapters, fee quoted before signing. The rebalance planner turns a target split into the minimum set of legs. Show a quote.
7. **Close** (10 s). Milestones 1, 2 and 3, plus BOLt and Ethereum. Open source, running at faro-wallet.vercel.app. Nobody holds your money: Faro only lights the way.

---

## What it does

Sign in with email or Google. A wallet is created for you on first sign-in, no seed phrase, no extension.

- **Balances** of ARGt, BOLt, COLt and MEXt across Arbitrum, Base, Polygon and Ethereum. Pick the currency by flag, expand any network to see the balance there and the native gas available.
- **Send** any supported token on any supported network. The app switches chains for you and confirms the transfer on-chain.
- **Receive** with your wallet address, ready to copy.
- **Activity**: one history of every transfer, all currencies and networks interleaved and sorted by time. Filter by currency, by network, or both; each entry links to the block explorer.
- **Rewards**: deposit ARGt straight from your wallet into the ARGt Prime vault on Arbitrum (Morpho, ERC-4626). Your balance, what you have earned and the current APY are read from the vault itself; withdraw part or all at any time.
- **Exchange** (ARGt ↔ MEXt on Arbitrum): one transaction routes ARGt → USDT0 through Twin's Curve pool and USDT0 → MEXt through Faro's own market maker, `FaroPMM`. The quote shows the effective rate, the reference rate (Curve × Pyth USD/MXN) and the deviation before you sign. See [`packages/pmm`](packages/pmm).
- **Move between networks**: bridge ARGt between Arbitrum, Base and Polygon through Twin's adapters. The fee is quoted on-chain before you confirm, and the app watches the destination until the funds arrive. A rebalance planner turns a target split across networks into the minimum set of bridge legs.

## Stack

| Layer | Choice |
|---|---|
| App | Next.js 16 (App Router), React 19, Tailwind v4, shadcn/ui, anime.js |
| Sign-in and wallets | Privy (email, Google, embedded wallet) via `@privy-io/wagmi` |
| Chain access | wagmi 3 + viem, public RPCs with env overrides |
| Hosting | Vercel |

## Supported assets

| Token | Arbitrum | Base | Polygon | Ethereum |
|---|---|---|---|---|
| ARGt | `0x5986…2214` | `0xf016…bdDD` | `0x5046…E056` | `0x5986…2214` |
| BOLt | `0x1edF…28eA` | `0x1d2E…4995` | `0x20EC…ed55` | `0x619F…8a56` |
| COLt | `0xa16d…d558` | `0xD70a…3216` | `0x1EA0…e93d` | `0xf016…bdDD` |
| MEXt | `0xb96a…5a25` | `0x5986…2214` | `0xb9A8…8D62` | `0x25DF…F8E5` |

Full addresses, the vault, the bridge adapters and the exchange contracts live in [`apps/faro/lib/config/tokens.ts`](apps/faro/lib/config/tokens.ts). Adding a stablecoin is one entry in `TOKENS`; adding a network is one entry in `CHAINS` plus its transport in `lib/wagmi-config.ts`.

## Run it locally

This is an npm workspaces monorepo: the app lives in `apps/faro`, the exchange contracts in `packages/pmm` (Foundry).

```bash
npm install
cp apps/faro/.env.example apps/faro/.env.local   # set NEXT_PUBLIC_PRIVY_APP_ID
npm run dev                                       # http://localhost:3000
```

A Privy App ID from [dashboard.privy.io](https://dashboard.privy.io) is the only required setting. The rest of [`apps/faro/.env.example`](apps/faro/.env.example) is optional: custom RPC endpoints.

```bash
npm run lint
npm test
npm run build
```

## Project layout

```
apps/faro/                 the wallet (Next.js)
  app/(tabs)/              home, activity, bridge
  components/              balance list, send / receive / swap panels, rewards, activity, faro
  lib/config/              tokens, chains, vault, adapters, exchange contracts (SWAP)
  lib/hooks/               balances, activity, bridge, vault, swap quote
packages/pmm/              exchange contracts (Foundry, Arbitrum)
  src/FaroPMM.sol          oracle-anchored market maker (DODO v2 PMM port) for MEXt / USDT0, Pyth USD/MXN
  src/FaroRouter.sol       ARGt ↔ USDT0 (Curve) ↔ MEXt (PMM) in one transaction
  test/                    unit tests with MockPyth, fork test against Arbitrum
  script/                  Deploy and Status
  deployments/arbitrum.json
```

## Exchange contracts (Arbitrum)

| Contract | Address |
|---|---|
| FaroRouter | `0x01faAC04441078cBe93EdE36345CeFB96A1d4830` |
| FaroPMM | `0xe83292925846082EB93e47AcaEaf7f64cB53Cee2` |
| Curve ARGt/USDT0 (Twin) | `0x356D349dA9ADd7Efb56a35fAB939A2c6D852f853` |
| Pyth (USD/MXN feed) | `0xff1a0f4744e8582DF1aE09D5611b887B6a12925C` |

Faro seeds the PMM with MEXt only; the USD leg comes from the Curve pool. Price = Pyth oracle, adjusted by how far the MEXt inventory is from its target (`k`), plus a fee that stays in the pool. Unaudited and running in paper mode with a small inventory.

## Notes

Unaudited hackathon code. Public RPC endpoints are used by default; set your own in `.env.local` for anything beyond a demo. No secrets are committed: `.env*` is ignored and `.env.example` documents every variable.
