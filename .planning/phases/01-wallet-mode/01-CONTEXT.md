# Phase 1 · Wallet Mode — Context

Discutido 2026-08-19 (discusión conjunta de las 5 fases).

## Decisiones

- **Fondos**: el usuario TIENE ARGt real y gas en las 3 chains (sus wallets). La demo es 100 % mainnet.
- **RPCs**: familia publicnode mainnet: `arbitrum-one-rpc.publicnode.com`, `base-rpc.publicnode.com`, `polygon-bor-rpc.publicnode.com`. (Se buscó el RPC de wakeup/vault-aggregator: era Arbitrum Sepolia, no sirve. No hay key de Alchemy disponible; si aparece una, se enchufa por env.)
- **UI**: neobanco pulido con identidad propia (dark, look fintech). Nombre propio a elegir en fase 5; la fase 1 arranca con design tokens neutros pero cuidados.
- **BOLt (M1-03)**: bonus no bloqueante, gateado por addresses que hay que pedir en Discord de Twin.
- **Bridge ABI**: `bridge-adapter-abi.ts` hay que bajarlo a mano del Notion (attachment, no accesible por fetch). Bloqueante solo para M3.

## Restricciones heredadas

- Stack fijado: Next.js App Router + `@privy-io/react-auth` + `@privy-io/wagmi` + wagmi/viem (importar `WagmiProvider`/`createConfig` desde `@privy-io/wagmi`). Orden de providers: Privy > QueryClient > Wagmi.
- Falta crear la app en dashboard.privy.io y setear `NEXT_PUBLIC_PRIVY_APP_ID` (input del usuario).
- Addresses verificadas en `SPEC.md` §2.
