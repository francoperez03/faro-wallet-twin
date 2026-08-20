export const CHAINS = ["arbitrum", "base", "polygon", "ethereum"] as const;
export type ChainKey = (typeof CHAINS)[number];

export const CHAIN_IDS: Record<ChainKey, number> = {
  arbitrum: 42161,
  base: 8453,
  polygon: 137,
  ethereum: 1,
};

// Defaults: endpoints públicos que responden eth_getLogs (publicnode lo bloquea en Arbitrum,
// Base y Ethereum). Override por env para producción.
export const RPC_URLS: Record<ChainKey, string> = {
  arbitrum:
    process.env.NEXT_PUBLIC_RPC_ARBITRUM ?? "https://arb1.arbitrum.io/rpc",
  base: process.env.NEXT_PUBLIC_RPC_BASE ?? "https://mainnet.base.org",
  polygon:
    process.env.NEXT_PUBLIC_RPC_POLYGON ??
    "https://polygon-bor-rpc.publicnode.com",
  ethereum: process.env.NEXT_PUBLIC_RPC_ETHEREUM ?? "https://eth.drpc.org",
};

// Ventana del historial de actividad: ~48 h por red en bloques, y el span máximo que el RPC
// acepta por llamada a eth_getLogs (10k en los públicos de Base/Polygon/Ethereum; arb1 acepta más).
export const LOG_RANGE: Record<ChainKey, { window: bigint; maxSpan: bigint }> =
  {
    arbitrum: { window: BigInt(691_200), maxSpan: BigInt(691_200) }, // ~0,25 s/bloque
    base: { window: BigInt(86_400), maxSpan: BigInt(10_000) }, // 2 s/bloque
    polygon: { window: BigInt(86_400), maxSpan: BigInt(10_000) }, // 2 s/bloque
    ethereum: { window: BigInt(14_400), maxSpan: BigInt(10_000) }, // 12 s/bloque
  };

export const CHAIN_LABELS: Record<ChainKey, string> = {
  arbitrum: "Arbitrum",
  base: "Base",
  polygon: "Polygon",
  ethereum: "Ethereum",
};

export const EXPLORER_TX_URL: Record<ChainKey, string> = {
  arbitrum: "https://arbiscan.io/tx/",
  base: "https://basescan.org/tx/",
  polygon: "https://polygonscan.com/tx/",
  ethereum: "https://etherscan.io/tx/",
};

export const TOKENS = {
  ARGt: {
    symbol: "ARGt",
    name: "Peso argentino",
    flag: "🇦🇷",
    decimals: 18,
    addresses: {
      arbitrum: "0x59863989d080B22476DB95656d0C3CC18be92214",
      base: "0xf016413834e6d1a14f3d628b11d6ef725a6bdbdd",
      polygon: "0x50464be58912745447e24eb3bbdedcee10d3e056",
      ethereum: "0x59863989d080B22476DB95656d0C3CC18be92214",
    } satisfies Record<ChainKey, `0x${string}`>,
  },
  BOLt: {
    symbol: "BOLt",
    name: "Boliviano",
    flag: "🇧🇴",
    decimals: 18,
    addresses: {
      arbitrum: "0x1edF5E61B6a4Fe19FEf3A695328F61aAa07728eA",
      base: "0x1d2E8C1Fe82ab2AD8dc43eD98A2F507Dfb5b4995",
      polygon: "0x20ECA820D3cd00ed9C9f2861Cdf6429baCD8ed55",
      ethereum: "0x619FB742CB2B77361793DAaEBac8017642178a56",
    } satisfies Record<ChainKey, `0x${string}`>,
  },
} as const;

export type TokenKey = keyof typeof TOKENS;
export const TOKEN_KEYS = Object.keys(TOKENS) as TokenKey[];

export const VAULT_ARGT_PRIME = {
  chain: "arbitrum" as ChainKey,
  address: "0x9Dd3F844747AB78d616BF76DB92756E17A064aDD" as `0x${string}`,
  asset: "ARGt",
};

// Adapters OFT de ARGt. Ethereum no tiene adapter conocido: el bridge solo ofrece BRIDGE_CHAINS.
export const BRIDGE_ADAPTERS: Partial<Record<ChainKey, `0x${string}`>> = {
  arbitrum: "0x4821FBf47B261F0D52Ba0F941CF67b8648f82691",
  base: "0xe80Af1d12426dB4394b147e04f179a38e7C5Dfe7",
  polygon: "0xD70ad085684b2A9f4B5d54D7BDB2ecA37a273216",
};
export const BRIDGE_CHAINS = CHAINS.filter((c) => Boolean(BRIDGE_ADAPTERS[c]));

// SobrecitoRegistry (Phase 2 SOL-01/SOL-02). Fallback = deployments.json (raíz del repo),
// override por env NEXT_PUBLIC_REGISTRY_1_*. Phase 4 (04-03) agrega un segundo entry, el
// pivote de yield (contracts-yield/) agrega un tercero.
export const REGISTRIES: {
  label: string;
  address: `0x${string}`;
  chainId: number;
}[] = [
  {
    label: process.env.NEXT_PUBLIC_REGISTRY_1_LABEL ?? "Fixture sintética",
    address: (process.env.NEXT_PUBLIC_REGISTRY_1_ADDRESS ??
      "0x89ec9bf3cd42a037a2d004813733fc0d6e2ab03d") as `0x${string}`,
    chainId: Number(process.env.NEXT_PUBLIC_REGISTRY_1_CHAIN_ID ?? 42161),
  },
  {
    label: process.env.NEXT_PUBLIC_REGISTRY_2_LABEL ?? "Corte real (mini)",
    address: (process.env.NEXT_PUBLIC_REGISTRY_2_ADDRESS ??
      "0x34d16b00809fcc6a6b0855d2052708615dbdc2c7") as `0x${string}`,
    chainId: Number(process.env.NEXT_PUBLIC_REGISTRY_2_CHAIN_ID ?? 42161),
  },
  {
    label: process.env.NEXT_PUBLIC_REGISTRY_3_LABEL ?? "Rendimiento (yield)",
    address: (process.env.NEXT_PUBLIC_REGISTRY_3_ADDRESS ??
      "0x06282d1a04be98f400387f3965704f8846d7fefb") as `0x${string}`,
    chainId: Number(process.env.NEXT_PUBLIC_REGISTRY_3_CHAIN_ID ?? 42161),
  },
];
