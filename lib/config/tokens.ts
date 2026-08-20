export const CHAINS = ["arbitrum", "base", "polygon"] as const;
export type ChainKey = (typeof CHAINS)[number];

export const CHAIN_IDS: Record<ChainKey, number> = {
  arbitrum: 42161,
  base: 8453,
  polygon: 137,
};

export const RPC_URLS: Record<ChainKey, string> = {
  arbitrum: process.env.NEXT_PUBLIC_RPC_ARBITRUM ?? "https://arbitrum-one-rpc.publicnode.com",
  base: process.env.NEXT_PUBLIC_RPC_BASE ?? "https://base-rpc.publicnode.com",
  polygon: process.env.NEXT_PUBLIC_RPC_POLYGON ?? "https://polygon-bor-rpc.publicnode.com",
};

export const TOKENS = {
  ARGt: {
    symbol: "ARGt",
    decimals: 18,
    addresses: {
      arbitrum: "0x59863989d080B22476DB95656d0C3CC18be92214",
      base: "0xf016413834e6d1a14f3d628b11d6ef725a6bdbdd",
      polygon: "0x50464be58912745447e24eb3bbdedcee10d3e056",
    } satisfies Record<ChainKey, `0x${string}`>,
  },
  // BOLt: agregar entry aquí cuando lleguen las addresses por Discord (M1-03, bonus, no bloqueante)
} as const;

export const VAULT_ARGT_PRIME = {
  chain: "arbitrum" as ChainKey,
  address: "0x9Dd3F844747AB78d616BF76DB92756E17A064aDD" as `0x${string}`,
  asset: "ARGt",
};

export const BRIDGE_ADAPTERS: Record<ChainKey, `0x${string}`> = {
  arbitrum: "0x4821FBf47B261F0D52Ba0F941CF67b8648f82691",
  base: "0xe80Af1d12426dB4394b147e04f179a38e7C5Dfe7",
  polygon: "0xD70ad085684b2A9f4B5d54D7BDB2ecA37a273216",
};
