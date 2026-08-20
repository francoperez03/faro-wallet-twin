"use client";

import { useQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";
import { getPublicClient } from "wagmi/actions";
import { parseAbiItem } from "viem";
import {
  CHAINS,
  CHAIN_IDS,
  TOKENS,
  TOKEN_KEYS,
  type ChainKey,
  type TokenKey,
} from "@/lib/config/tokens";

const TRANSFER_EVENT = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)",
);

// ponytail: ~5000 bloques recientes por red, sin indexer. Ajustar si el RPC público limita el rango.
const BLOCK_RANGE = BigInt(5000);

export type ActivityEntry = {
  hash: `0x${string}`;
  token: TokenKey;
  chain: ChainKey;
  direction: "sent" | "received";
  counterparty: `0x${string}`;
  amount: bigint;
  blockNumber: bigint;
  /** Unix seconds del bloque; ordena el historial entre redes. */
  timestamp: number;
};

/**
 * Historial único del usuario: logs `Transfer` de todos los tokens en todas las redes
 * (el par es moneda + red), ordenado por timestamp de bloque desc. Una red caída no tumba al resto.
 */
export function useActivity(address: `0x${string}` | undefined) {
  const config = useConfig();

  return useQuery({
    queryKey: ["activity", address],
    enabled: Boolean(address),
    queryFn: async (): Promise<ActivityEntry[]> => {
      if (!address) return [];

      const perChain = await Promise.all(
        CHAINS.map(async (chain): Promise<ActivityEntry[]> => {
          const client = getPublicClient(config, { chainId: CHAIN_IDS[chain] });
          if (!client) return [];
          try {
            const latest = await client.getBlockNumber();
            const fromBlock =
              latest > BLOCK_RANGE ? latest - BLOCK_RANGE : BigInt(0);
            const raw = await Promise.all(
              TOKEN_KEYS.flatMap((token) => {
                const tokenAddress = TOKENS[token].addresses[chain];
                const common = {
                  address: tokenAddress,
                  event: TRANSFER_EVENT,
                  fromBlock,
                  toBlock: latest,
                };
                return [
                  client
                    .getLogs({ ...common, args: { from: address } })
                    .then((logs) =>
                      logs.map((log) => ({
                        hash: log.transactionHash,
                        token,
                        chain,
                        direction: "sent" as const,
                        counterparty: log.args.to as `0x${string}`,
                        amount: log.args.value as bigint,
                        blockNumber: log.blockNumber,
                      })),
                    ),
                  client
                    .getLogs({ ...common, args: { to: address } })
                    .then((logs) =>
                      logs.map((log) => ({
                        hash: log.transactionHash,
                        token,
                        chain,
                        direction: "received" as const,
                        counterparty: log.args.from as `0x${string}`,
                        amount: log.args.value as bigint,
                        blockNumber: log.blockNumber,
                      })),
                    ),
                ];
              }),
            );
            const entries = raw.flat();
            const blocks = [...new Set(entries.map((e) => e.blockNumber))];
            const stamps = new Map(
              await Promise.all(
                blocks.map(async (blockNumber) => {
                  const block = await client.getBlock({ blockNumber });
                  return [blockNumber, Number(block.timestamp)] as const;
                }),
              ),
            );
            return entries.map((e) => ({
              ...e,
              timestamp: stamps.get(e.blockNumber) ?? 0,
            }));
          } catch {
            return [];
          }
        }),
      );

      return perChain.flat().sort((a, b) => b.timestamp - a.timestamp);
    },
  });
}
