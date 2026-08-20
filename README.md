# Faro

**A wallet for Twin stablecoins.**

Live: **https://faro-wallet.vercel.app**

Built in 24 hours for the *Twin your Neobank* hackathon at the LATAM Digital Assets Conference.

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
