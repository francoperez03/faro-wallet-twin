"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { registryAbi, type Cut } from "@/lib/sobrecito/registry-abi";
import { withRpcFallback } from "@/lib/sobrecito/rpc-fallback";

type RegistryConfig = { label: string; address: `0x${string}`; chainId: number; deployBlock?: bigint };

const FRESH_HOURS = 26;

/** Corte vigente del registry (badge de Cuenta·Home y semáforo de /status), patrón de use-vault-position.ts.
 * Via useQuery + withRpcFallback (no useReadContract) para poder reintentar con un client
 * de fallback si el RPC por defecto de wagmi falla. */
export function useLatestCut(registry: RegistryConfig | undefined) {
  const publicClient = usePublicClient({ chainId: registry?.chainId });

  const { data, isLoading } = useQuery({
    queryKey: ["latest-cut", registry?.address, registry?.chainId],
    enabled: Boolean(registry),
    queryFn: async () => {
      const corteId = await withRpcFallback(publicClient, (client) =>
        client.readContract({
          address: registry!.address,
          abi: registryAbi,
          functionName: "latestCorteId",
        }),
      );
      const cut = await withRpcFallback(publicClient, (client) =>
        client.readContract({
          address: registry!.address,
          abi: registryAbi,
          functionName: "getCut",
          args: [corteId],
        }),
      );
      return { corteId, cut };
    },
  });
  const corteId = data?.corteId;
  const cut = data?.cut;

  return useMemo(() => {
    const typedCut = cut as Cut | undefined;
    // publishedAt === 0 <=> no existe ningún corte todavía.
    if (isLoading || !typedCut || typedCut.publishedAt === BigInt(0)) {
      return { cut: null, corteId: corteId ?? null, hoursAgo: null, status: "none" as const, isLoading };
    }
    const hoursAgo = (Date.now() / 1000 - Number(typedCut.publishedAt)) / 3600;
    const status = hoursAgo < FRESH_HOURS ? ("green" as const) : ("amber" as const);
    return { cut: typedCut, corteId: corteId ?? null, hoursAgo, status, isLoading };
  }, [cut, corteId, isLoading]);
}

export type CutHistoryEntry = Cut & { corteId: `0x${string}`; declaredMask: number; transactionHash: `0x${string}` };

/** Historial completo de cortes (página /status), vía event logs CutPublished. */
export function useCutHistory(registry: RegistryConfig | undefined) {
  const publicClient = usePublicClient({ chainId: registry?.chainId });

  const { data, isLoading, error } = useQuery({
    queryKey: ["cut-history", registry?.address, registry?.chainId],
    enabled: Boolean(registry),
    queryFn: async (): Promise<CutHistoryEntry[]> => {
      const logs = await withRpcFallback(publicClient, (client) =>
        client.getContractEvents({
          address: registry!.address,
          abi: registryAbi,
          eventName: "CutPublished",
          fromBlock: registry!.deployBlock ?? BigInt(0),
          toBlock: "latest",
        }),
      );
      return logs
        .map((log) => ({ ...log.args, transactionHash: log.transactionHash }) as CutHistoryEntry)
        .sort((a, b) => Number(a.publishedAt - b.publishedAt));
    },
  });

  return { history: data ?? [], isLoading, error };
}
