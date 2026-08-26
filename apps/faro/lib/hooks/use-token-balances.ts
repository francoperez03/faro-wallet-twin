"use client";

import { useMemo } from "react";
import { useReadContracts } from "wagmi";
import { CHAINS, CHAIN_IDS, TOKENS, type ChainKey, type TokenKey } from "@/lib/config/tokens";

const ERC20_BALANCE_OF_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

/**
 * Balance del token por chain vía multicall, más el total.
 * Si una chain falla, su entry queda en `errors` y las demás siguen mostrando su balance.
 */
export function useTokenBalances(address: `0x${string}` | undefined, token: TokenKey = "ARGt") {
  const { data, isLoading, refetch } = useReadContracts({
    contracts: CHAINS.map((chain) => ({
      address: TOKENS[token].addresses[chain],
      abi: ERC20_BALANCE_OF_ABI,
      functionName: "balanceOf",
      args: address ? [address] : undefined,
      chainId: CHAIN_IDS[chain],
    })),
    query: { enabled: Boolean(address) },
  });

  return useMemo(() => {
    const perChain = {} as Record<ChainKey, bigint>;
    const errors = {} as Partial<Record<ChainKey, boolean>>;
    let total = BigInt(0);

    CHAINS.forEach((chain, i) => {
      const result = data?.[i];
      if (result?.status === "success") {
        const value = result.result as bigint;
        perChain[chain] = value;
        total += value;
      } else {
        perChain[chain] = BigInt(0);
        if (data) errors[chain] = true;
      }
    });

    return { perChain, total, errors, isLoading, refetch };
  }, [data, isLoading, refetch]);
}
