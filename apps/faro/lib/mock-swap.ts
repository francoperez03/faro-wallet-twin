import { parseUnits } from "viem";
import type { SwapToken } from "@/lib/config/tokens";
import type { SwapQuote } from "@/lib/hooks/use-swap-quote";

/** TEMPORAL: solo para ver la UI de Cambiar sin saldo. Sacar: borrar este archivo y `grep MOCK_SWAP`. */
export const MOCK_SWAP = process.env.NEXT_PUBLIC_MOCK_SWAP === "1";
export const MOCK_AVAILABLE = parseUnits("20", 18);

const ONE = BigInt(10) ** BigInt(18);
const PRICE = parseUnits("94.63", 18); // ARGt por MEXt

export function mockQuote(
  from: SwapToken,
  amountIn: bigint,
  slippageBps: bigint,
): SwapQuote {
  const argtToMext = from === "ARGt";
  const units = Number(amountIn) / 1e18;
  const impactBps = Math.round(30 + units * 4);
  const mid = argtToMext ? (amountIn * ONE) / PRICE : (amountIn * PRICE) / ONE;
  const amountOut = (mid * BigInt(10_000 - impactBps)) / BigInt(10_000);
  return {
    amountOut,
    minOut: (amountOut * (BigInt(10_000) - slippageBps)) / BigInt(10_000),
    usdtMid: BigInt(0),
    effectiveArgtPerMext: argtToMext
      ? (amountIn * ONE) / amountOut
      : (amountOut * ONE) / amountIn,
    referenceArgtPerMext: PRICE,
    impactBps,
    oracleAge: 90,
    maxTradeUsdt: BigInt(1_000_000_000),
    overCap: units > 1000,
  };
}
