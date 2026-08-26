"use client";

import { useQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";
import { getPublicClient } from "wagmi/actions";
import { CHAIN_IDS, SWAP, type SwapToken } from "@/lib/config/tokens";
import { pmmAbi, routerAbi } from "@/lib/config/swap-abi";

export const SLIPPAGE_BPS = BigInt(50); // 0,5 %

export type SwapQuote = {
  amountOut: bigint;
  minOut: bigint;
  usdtMid: bigint;
  /** ARGt por MEXt efectivo de esta cotización (1e18). */
  effectiveArgtPerMext: bigint;
  /** ARGt por MEXt de referencia: precio del pool de Curve × oráculo Pyth (1e18). */
  referenceArgtPerMext: bigint;
  /** Desvío de la cotización respecto de la referencia, en bps (positivo = peor para el usuario). */
  impactBps: number;
  oracleAge: number;
  /** Tope por operación del PMM en USDT0 (6 dec); 0 = sin tope. */
  maxTradeUsdt: bigint;
  /** true si esta operación supera el tope. */
  overCap: boolean;
};

/** Cotización en vivo ARGt ↔ MEXt vía FaroRouter (Curve + PMM). `amountIn` en unidades base del token de origen. */
export function useSwapQuote(from: SwapToken, amountIn: bigint | null) {
  const config = useConfig();
  return useQuery({
    queryKey: ["swap-quote", from, amountIn?.toString() ?? "0"],
    enabled: Boolean(amountIn && amountIn > BigInt(0)),
    staleTime: 10_000,
    refetchInterval: 15_000,
    queryFn: async (): Promise<SwapQuote> => {
      const client = getPublicClient(config, {
        chainId: CHAIN_IDS[SWAP.chain],
      });
      if (!client || !amountIn) throw new Error("sin cliente");
      const argtToMext = from === "ARGt";
      const [quote, ref, maxTradeQuote] = await Promise.all([
        client.readContract({
          address: SWAP.router,
          abi: routerAbi,
          functionName: argtToMext ? "quoteArgtToMext" : "quoteMextToArgt",
          args: [amountIn],
        }),
        client.readContract({
          address: SWAP.router,
          abi: routerAbi,
          functionName: "referenceArgtPerMext",
        }),
        client.readContract({
          address: SWAP.pmm,
          abi: pmmAbi,
          functionName: "maxTradeQuote",
        }),
      ]);
      const [amountOut, usdtMid, , oracleAge] = quote;
      const [referenceArgtPerMext] = ref;
      const ONE = BigInt(10) ** BigInt(18);
      const effectiveArgtPerMext = argtToMext
        ? amountOut > BigInt(0)
          ? (amountIn * ONE) / amountOut
          : BigInt(0)
        : (amountOut * ONE) / amountIn;
      // Comprando MEXt: pagar más ARGt por MEXt es peor; vendiendo MEXt: recibir menos ARGt por MEXt es peor.
      const diff = argtToMext
        ? effectiveArgtPerMext - referenceArgtPerMext
        : referenceArgtPerMext - effectiveArgtPerMext;
      const impactBps =
        referenceArgtPerMext > BigInt(0)
          ? Number((diff * BigInt(10_000)) / referenceArgtPerMext)
          : 0;
      return {
        amountOut,
        minOut: (amountOut * (BigInt(10_000) - SLIPPAGE_BPS)) / BigInt(10_000),
        usdtMid,
        effectiveArgtPerMext,
        referenceArgtPerMext,
        impactBps,
        oracleAge: Number(oracleAge),
        maxTradeUsdt: maxTradeQuote / BigInt(10) ** BigInt(12),
        overCap:
          maxTradeQuote > BigInt(0) &&
          usdtMid * BigInt(10) ** BigInt(12) > maxTradeQuote,
      };
    },
  });
}
