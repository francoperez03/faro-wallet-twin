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
    process.env.NEXT_PUBLIC_RPC_ARBITRUM || "https://arb1.arbitrum.io/rpc",
  base: process.env.NEXT_PUBLIC_RPC_BASE || "https://mainnet.base.org",
  polygon:
    process.env.NEXT_PUBLIC_RPC_POLYGON ||
    "https://polygon-bor-rpc.publicnode.com",
  ethereum: process.env.NEXT_PUBLIC_RPC_ETHEREUM || "https://eth.drpc.org",
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
  COLt: {
    symbol: "COLt",
    name: "Peso colombiano",
    flag: "🇨🇴",
    decimals: 18,
    addresses: {
      arbitrum: "0xa16d5DB80A45157E0e451750B81FF0CC0b61d558",
      base: "0xD70ad085684b2A9f4B5d54D7BDB2ecA37a273216",
      polygon: "0x1EA02bA45fC146F534b371c49fBB2a4c86dce93d",
      ethereum: "0xf016413834E6D1A14F3D628B11D6Ef725a6bdbDD",
    } satisfies Record<ChainKey, `0x${string}`>,
  },
  MEXt: {
    symbol: "MEXt",
    name: "Peso mexicano",
    flag: "🇲🇽",
    decimals: 18,
    addresses: {
      arbitrum: "0xb96aA6babCcD738d6644ADd4912fE5eFbEBF5a25",
      base: "0x59863989d080B22476DB95656d0C3CC18be92214",
      polygon: "0xb9A848a8E1AFf1a16A27F1AD3B66D873d5C38D62",
      ethereum: "0x25DF36D0ec7D26EC791316167A5E949e65c9F8E5",
    } satisfies Record<ChainKey, `0x${string}`>,
  },
} as const;

// Cambio ARGt ↔ MEXt en Arbitrum: Curve ARGt/USDT0 (Twin) + FaroPMM (packages/pmm, deployments/arbitrum.json).
export const SWAP = {
  chain: "arbitrum" as ChainKey,
  router: "0x01faAC04441078cBe93EdE36345CeFB96A1d4830" as `0x${string}`,
  pmm: "0xe83292925846082EB93e47AcaEaf7f64cB53Cee2" as `0x${string}`,
  curvePool: "0x356D349dA9ADd7Efb56a35fAB939A2c6D852f853" as `0x${string}`,
  usdt0: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" as `0x${string}`,
  pyth: "0xff1a0f4744e8582DF1aE09D5611b887B6a12925C" as `0x${string}`,
  feedId:
    "0xe13b1c1ffb32f34e1be9545583f01ef385fde7f42ee66049d30570dc866b77ca" as `0x${string}`,
  pairs: ["ARGt", "MEXt"] as const,
};
export type SwapToken = (typeof SWAP.pairs)[number];

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
  // base: "0xe80Af1d12426dB4394b147e04f179a38e7C5Dfe7", // fuera del rebalance/bridge por ahora
  polygon: "0xD70ad085684b2A9f4B5d54D7BDB2ecA37a273216",
};
export const BRIDGE_CHAINS = CHAINS.filter((c) => Boolean(BRIDGE_ADAPTERS[c]));
