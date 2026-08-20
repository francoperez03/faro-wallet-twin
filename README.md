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

- **Balances** of ARGt and BOLt across Arbitrum, Base, Polygon and Ethereum. Pick the currency by flag, expand any network to see the balance there and the native gas available.
- **Send** any supported token on any supported network. The app switches chains for you and confirms the transfer on-chain.
- **Receive** with your wallet address, ready to copy.
- **Activity**: one history of every transfer, all currencies and networks interleaved and sorted by time. Filter by currency, by network, or both; each entry links to the block explorer.
- **Rewards**: deposit ARGt straight from your wallet into the ARGt Prime vault on Arbitrum (Morpho, ERC-4626). Your balance, what you have earned and the current APY are read from the vault itself; withdraw part or all at any time.
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

Full addresses, the vault and the bridge adapters live in [`lib/config/tokens.ts`](lib/config/tokens.ts). Adding a stablecoin is one entry in `TOKENS`; adding a network is one entry in `CHAINS` plus its transport in `lib/wagmi-config.ts`.

## Run it locally

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_PRIVY_APP_ID
npm run dev                  # http://localhost:3000
```

A Privy App ID from [dashboard.privy.io](https://dashboard.privy.io) is the only required setting. The rest of [`.env.example`](.env.example) is optional: custom RPC endpoints.

```bash
npm run lint
npm test
npm run build
```

## Project layout

```
app/(tabs)/      home, rewards, bridge, activity
components/      balance list, send and receive panels, activity, rebalance, faro
lib/config/      tokens, chains, vault, adapters
lib/hooks/       balances, activity, bridge, vault position
lib/bridge/      rebalance planner (tested)
```

## Notes

Unaudited hackathon code. Public RPC endpoints are used by default; set your own in `.env.local` for anything beyond a demo. No secrets are committed: `.env*` is ignored and `.env.example` documents every variable.
