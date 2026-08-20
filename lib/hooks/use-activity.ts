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

// ponytail: ~24 h de historia por red (bloques/día aproximados), sin indexer. Si el RPC
// público rechaza el rango, se reintenta con ventanas más chicas (÷4, ÷16).
const BLOCK_RANGE: Record<ChainKey, bigint> = {
  arbitrum: BigInt(350000),
  base: BigInt(45000),
  polygon: BigInt(45000),
  ethereum: BigInt(7500),
};

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
            const fetchRange = async (range: bigint) => {
              const fromBlock = latest > range ? latest - range : BigInt(0);
              return Promise.all(
              TOKEN_KEYS.flatMap((token) => {
                const tokenAddress = TOKENS[token].addresses[chain];
                if (!tokenAddress) return [];
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
            };
            // Reintento con ventanas más chicas si el RPC rechaza el rango grande.
            let raw: Awaited<ReturnType<typeof fetchRange>> | null = null;
            for (const divisor of [BigInt(1), BigInt(4), BigInt(16)]) {
              try {
                raw = await fetchRange(BLOCK_RANGE[chain] / divisor);
                break;
              } catch {
                // probar la siguiente ventana
              }
            }
            if (!raw) return [];
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
