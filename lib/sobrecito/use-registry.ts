"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReadContract, usePublicClient } from "wagmi";
import { registryAbi, type Cut } from "@/lib/sobrecito/registry-abi";

type RegistryConfig = { label: string; address: `0x${string}`; chainId: number };

const FRESH_HOURS = 26;

/** Corte vigente del registry (badge de Cuenta·Home y semáforo de /status), patrón de use-vault-position.ts. */
export function useLatestCut(registry: RegistryConfig | undefined) {
  const { data: corteId, isLoading: isLoadingId } = useReadContract({
    address: registry?.address,
    abi: registryAbi,
    functionName: "latestCorteId",
    chainId: registry?.chainId,
    query: { enabled: Boolean(registry) },
  });

  const { data: cut, isLoading: isLoadingCut } = useReadContract({
    address: registry?.address,
    abi: registryAbi,
    functionName: "getCut",
    args: corteId ? [corteId] : undefined,
    chainId: registry?.chainId,
    query: { enabled: Boolean(registry && corteId) },
  });

  return useMemo(() => {
    const isLoading = isLoadingId || isLoadingCut;
    const typedCut = cut as Cut | undefined;
    // publishedAt === 0 <=> no existe ningún corte todavía.
    if (isLoading || !typedCut || typedCut.publishedAt === BigInt(0)) {
      return { cut: null, corteId: corteId ?? null, hoursAgo: null, status: "none" as const, isLoading };
    }
    const hoursAgo = (Date.now() / 1000 - Number(typedCut.publishedAt)) / 3600;
    const status = hoursAgo < FRESH_HOURS ? ("green" as const) : ("amber" as const);
    return { cut: typedCut, corteId: corteId ?? null, hoursAgo, status, isLoading };
  }, [cut, corteId, isLoadingId, isLoadingCut]);
}

export type CutHistoryEntry = Cut & { corteId: `0x${string}`; declaredMask: number; transactionHash: `0x${string}` };

/** Historial completo de cortes (página /status), vía event logs CutPublished. */
export function useCutHistory(registry: RegistryConfig | undefined) {
  const publicClient = usePublicClient({ chainId: registry?.chainId });

  const { data, isLoading, error } = useQuery({
    queryKey: ["cut-history", registry?.address, registry?.chainId],
    enabled: Boolean(registry && publicClient),
    queryFn: async (): Promise<CutHistoryEntry[]> => {
      const logs = await publicClient!.getContractEvents({
        address: registry!.address,
        abi: registryAbi,
        eventName: "CutPublished",
        fromBlock: BigInt(0),
        toBlock: "latest",
      });
      return logs
        .map((log) => ({ ...log.args, transactionHash: log.transactionHash }) as CutHistoryEntry)
        .sort((a, b) => Number(a.publishedAt - b.publishedAt));
    },
  });

  return { history: data ?? [], isLoading, error };
}
