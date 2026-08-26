// ABIs mínimos del cambio (FaroRouter, FaroPMM, Pyth). Fuente: packages/pmm/src.
export const routerAbi = [
  {
    type: "function",
    name: "swapArgtToMext",
    stateMutability: "payable",
    inputs: [
      { name: "argtIn", type: "uint256" },
      { name: "minMextOut", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "pythUpdate", type: "bytes[]" },
    ],
    outputs: [{ name: "mextOut", type: "uint256" }],
  },
  {
    type: "function",
    name: "swapMextToArgt",
    stateMutability: "payable",
    inputs: [
      { name: "mextIn", type: "uint256" },
      { name: "minArgtOut", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "pythUpdate", type: "bytes[]" },
    ],
    outputs: [{ name: "argtOut", type: "uint256" }],
  },
  {
    type: "function",
    name: "quoteArgtToMext",
    stateMutability: "view",
    inputs: [{ name: "argtIn", type: "uint256" }],
    outputs: [
      { name: "mextOut", type: "uint256" },
      { name: "usdtMid", type: "uint256" },
      { name: "oraclePrice", type: "uint256" },
      { name: "oracleAge", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "quoteMextToArgt",
    stateMutability: "view",
    inputs: [{ name: "mextIn", type: "uint256" }],
    outputs: [
      { name: "argtOut", type: "uint256" },
      { name: "usdtMid", type: "uint256" },
      { name: "oraclePrice", type: "uint256" },
      { name: "oracleAge", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "referenceArgtPerMext",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "argtPerMext", type: "uint256" },
      { name: "oracleAge", type: "uint256" },
    ],
  },
] as const;

export const pmmAbi = [
  {
    type: "function",
    name: "state",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "base", type: "uint256" },
      { name: "quoteRaw", type: "uint256" },
      { name: "baseTarget", type: "uint256" },
      { name: "quoteTargetRaw", type: "uint256" },
      { name: "r", type: "uint8" },
    ],
  },
  {
    type: "function",
    name: "paused",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "maxTradeQuote",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const pythAbi = [
  {
    type: "function",
    name: "getUpdateFee",
    stateMutability: "view",
    inputs: [{ name: "updateData", type: "bytes[]" }],
    outputs: [{ name: "feeAmount", type: "uint256" }],
  },
] as const;
