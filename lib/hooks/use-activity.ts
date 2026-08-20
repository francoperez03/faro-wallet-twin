"use client";

import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { CHAIN_IDS, TOKENS, type ChainKey, type TokenKey } from "@/lib/config/tokens";

const TRANSFER_EVENT = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)"
);

// ponytail: ~5000 bloques recientes, no indexer. Ajustar si el RPC público limita el rango
// o si hace falta más historial (D-11: primer candidato a recorte si falta tiempo).
const BLOCK_RANGE = BigInt(5000);

export type ActivityEntry = {
  hash: `0x${string}`;
  direction: "sent" | "received";
  counterparty: `0x${string}`;
  amount: bigint;
  blockNumber: bigint;
};

/** Logs `Transfer` de ARGt (enviados o recibidos) del usuario en la chain activa. */
export function useActivity(address: `0x${string}` | undefined, chain: ChainKey, token: TokenKey = "ARGt") {
  const client = usePublicClient({ chainId: CHAIN_IDS[chain] });

  return useQuery({
    queryKey: ["activity", token, chain, address],
    enabled: Boolean(address && client),
    queryFn: async (): Promise<ActivityEntry[]> => {
      if (!address || !client) return [];
      const tokenAddress = TOKENS[token].addresses[chain];
      const latest = await client.getBlockNumber();
      const fromBlock = latest > BLOCK_RANGE ? latest - BLOCK_RANGE : BigInt(0);

      const [sent, received] = await Promise.all([
        client.getLogs({
          address: tokenAddress,
          event: TRANSFER_EVENT,
          args: { from: address },
          fromBlock,
          toBlock: latest,
        }),
        client.getLogs({
          address: tokenAddress,
          event: TRANSFER_EVENT,
          args: { to: address },
          fromBlock,
          toBlock: latest,
        }),
      ]);

      const entries: ActivityEntry[] = [
        ...sent.map((log) => ({
          hash: log.transactionHash,
          direction: "sent" as const,
          counterparty: log.args.to as `0x${string}`,
          amount: log.args.value as bigint,
          blockNumber: log.blockNumber,
        })),
        ...received.map((log) => ({
          hash: log.transactionHash,
          direction: "received" as const,
          counterparty: log.args.from as `0x${string}`,
          amount: log.args.value as bigint,
          blockNumber: log.blockNumber,
        })),
      ];

      return entries.sort((a, b) => (a.blockNumber > b.blockNumber ? -1 : 1));
    },
  });
}
