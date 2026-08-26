// ABI verificado doblemente: reconstruido por sondeo on-chain y CONFIRMADO contra el
// bridge-adapter-abi.ts oficial del Notion de Twin (2026-08-20): TwinBridgeAdapter
// extiende OFTCore (LayerZero V2), quoteSend/send con las mismas tuplas SendParam y fee.
//
// Evidencia (ver 01-04-SUMMARY.md para el detalle completo):
// - eth_call a 0x4821FBf47B261F0D52Ba0F941CF67b8648f82691 (adapter Arbitrum) vía
//   https://arb1.arbitrum.io/rpc, 20/08/2026.
// - Los 13 selectores del bytecode on-chain coinciden exactamente con los 13 selectores
//   de la interfaz estándar LayerZero V2 OFT (IOFT): quoteSend, quoteOFT, send, token,
//   endpoint, peers, setPeer, oftVersion, sharedDecimals, approvalRequired, owner,
//   transferOwnership, renounceOwnership.
// - `quoteSend((30184, <bytes32>, 1e18, 1e18, 0x, 0x, 0x), false)` no revierte y devuelve
//   un fee plausible (nativeFee = 26913340299921 wei ≈ 0.0000269 ETH, lzTokenFee = 0).
// - `token()` devuelve exactamente la address de ARGt en Arbitrum
//   (0x59863989d080B22476DB95656d0C3CC18be92214).
// - `approvalRequired()` devuelve true → confirma que el flujo D-09 (approve + bridge)
//   aplica.
// - `peers(30184)` (EID de Base) y `peers(30109)` (EID de Polygon) devuelven exactamente
//   BRIDGE_ADAPTERS.base y BRIDGE_ADAPTERS.polygon de lib/config/tokens.ts.
//
// Esta combinación (13/13 selectores + 4 lecturas de estado consistentes con el registry
// del proyecto) es evidencia fuerte de que el adapter implementa IOFT sin desviaciones.
// Coincide con el ABI oficial del Notion (quoteSend y send idénticos).
export const bridgeAdapterAbi = [
  {
    type: "function",
    name: "quoteSend",
    stateMutability: "view",
    inputs: [
      {
        name: "_sendParam",
        type: "tuple",
        components: [
          { name: "dstEid", type: "uint32" },
          { name: "to", type: "bytes32" },
          { name: "amountLD", type: "uint256" },
          { name: "minAmountLD", type: "uint256" },
          { name: "extraOptions", type: "bytes" },
          { name: "composeMsg", type: "bytes" },
          { name: "oftCmd", type: "bytes" },
        ],
      },
      { name: "_payInLzToken", type: "bool" },
    ],
    outputs: [
      {
        name: "msgFee",
        type: "tuple",
        components: [
          { name: "nativeFee", type: "uint256" },
          { name: "lzTokenFee", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "send",
    stateMutability: "payable",
    inputs: [
      {
        name: "_sendParam",
        type: "tuple",
        components: [
          { name: "dstEid", type: "uint32" },
          { name: "to", type: "bytes32" },
          { name: "amountLD", type: "uint256" },
          { name: "minAmountLD", type: "uint256" },
          { name: "extraOptions", type: "bytes" },
          { name: "composeMsg", type: "bytes" },
          { name: "oftCmd", type: "bytes" },
        ],
      },
      {
        name: "_fee",
        type: "tuple",
        components: [
          { name: "nativeFee", type: "uint256" },
          { name: "lzTokenFee", type: "uint256" },
        ],
      },
      { name: "_refundAddress", type: "address" },
    ],
    outputs: [
      {
        name: "msgReceipt",
        type: "tuple",
        components: [
          { name: "guid", type: "bytes32" },
          { name: "nonce", type: "uint64" },
          {
            name: "fee",
            type: "tuple",
            components: [
              { name: "nativeFee", type: "uint256" },
              { name: "lzTokenFee", type: "uint256" },
            ],
          },
        ],
      },
      {
        name: "oftReceipt",
        type: "tuple",
        components: [
          { name: "amountSentLD", type: "uint256" },
          { name: "amountReceivedLD", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "token",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "approvalRequired",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;
