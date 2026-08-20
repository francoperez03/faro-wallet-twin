// ABI mínima de SobrecitoRegistry (Sobrecito, read-only), ver <interfaces> de 04-01-PLAN.md.
export const registryAbi = [
  {
    type: "function",
    name: "getCut",
    stateMutability: "view",
    inputs: [{ name: "corteId", type: "bytes32" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "cL", type: "bytes32" },
          { name: "cR", type: "bytes32" },
          { name: "attestationHash", type: "bytes32" },
          { name: "blockB", type: "uint64" },
          { name: "publishedAt", type: "uint64" },
          { name: "verdicts", type: "uint8[]" },
          { name: "coverageBps", type: "uint16[]" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "cutExists",
    stateMutability: "view",
    inputs: [{ name: "corteId", type: "bytes32" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "cutCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "latestCorteId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bytes32" }],
  },
  {
    type: "event",
    name: "CutPublished",
    inputs: [
      { name: "corteId", type: "bytes32", indexed: true },
      { name: "cL", type: "bytes32", indexed: false },
      { name: "cR", type: "bytes32", indexed: false },
      { name: "blockB", type: "uint64", indexed: false },
      { name: "attestationHash", type: "bytes32", indexed: false },
      { name: "verdicts", type: "uint8[]", indexed: false },
      { name: "coverageBps", type: "uint16[]", indexed: false },
      { name: "publishedAt", type: "uint64", indexed: false },
      { name: "declaredMask", type: "uint8", indexed: false },
    ],
  },
] as const;

/** Struct `Cut` de SobrecitoRegistry (ver <interfaces> de 04-01-PLAN.md). */
export type Cut = {
  cL: `0x${string}`;
  cR: `0x${string}`;
  attestationHash: `0x${string}`;
  blockB: bigint;
  publishedAt: bigint;
  verdicts: readonly number[];
  coverageBps: readonly number[];
};
