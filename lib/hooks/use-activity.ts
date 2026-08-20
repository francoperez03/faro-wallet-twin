"use client";

import { useQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";
import { getPublicClient } from "wagmi/actions";
import { parseAbiItem, type Log } from "viem";
import {
  CHAINS,
  CHAIN_IDS,
  LOG_RANGE,
  TOKENS,
  TOKEN_KEYS,
  type ChainKey,
  type TokenKey,
} from "@/lib/config/tokens";

const TRANSFER_EVENT = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)",
);
type TransferLog = Log<bigint, number, false, typeof TRANSFER_EVENT>;

// ponytail: ventana de ~48 h por red leída en chunks del span máximo que acepta el RPC
// (LOG_RANGE), sin indexer. Para más historial: RPC con API key en NEXT_PUBLIC_RPC_* y
// subir `window`.
function chunks(latest: bigint, chain: ChainKey) {
  const { window, maxSpan } = LOG_RANGE[chain];
  const floor = latest > window ? latest - window : BigInt(0);
  const out: { fromBlock: bigint; toBlock: bigint }[] = [];
  for (let toBlock = latest; toBlock > floor; toBlock -= maxSpan) {
    const start = toBlock - maxSpan + BigInt(1);
    out.push({ fromBlock: start > floor ? start : floor, toBlock });
  }
  return out;
}

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

export type ActivityResult = {
  entries: ActivityEntry[];
  failedChains: ChainKey[];
};

/**
 * Historial único del usuario: logs `Transfer` de todos los tokens en todas las redes
 * (el par es moneda + red), ordenado por timestamp de bloque desc. Una red caída no tumba
 * al resto: queda en `failedChains` para avisarlo en la UI en vez de mostrar "sin movimientos".
 */
export function useActivity(address: `0x${string}` | undefined) {
  const config = useConfig();

  return useQuery({
    queryKey: ["activity", address],
    enabled: Boolean(address),
    queryFn: async (): Promise<ActivityResult> => {
      if (!address) return { entries: [], failedChains: [] };

      const perChain = await Promise.all(
        CHAINS.map(async (chain): Promise<ActivityEntry[] | null> => {
          const client = getPublicClient(config, { chainId: CHAIN_IDS[chain] });
          if (!client) return null;
          try {
            const latest = await client.getBlockNumber();
            const addresses = TOKEN_KEYS.map(
              (token) => TOKENS[token].addresses[chain],
            );
            const tokenByAddress = new Map(
              TOKEN_KEYS.map((token) => [
                TOKENS[token].addresses[chain].toLowerCase(),
                token,
              ]),
            );
            const toEntry =
              (direction: "sent" | "received") => (log: TransferLog) => ({
                hash: log.transactionHash,
                token:
                  tokenByAddress.get(log.address.toLowerCase()) ??
                  TOKEN_KEYS[0],
                chain,
                direction,
                counterparty: (direction === "sent"
                  ? log.args.to
                  : log.args.from) as `0x${string}`,
                amount: log.args.value as bigint,
                blockNumber: log.blockNumber,
              });
            // Chunks en secuencia (2 llamadas cada uno): los RPC públicos cortan por rate limit
            // si se disparan todos juntos. El primer chunk usa "latest" porque el head de los
            // nodos balanceados puede ir detrás del getBlockNumber.
            const raw: Omit<ActivityEntry, "timestamp">[][] = [];
            for (const [i, { fromBlock, toBlock }] of chunks(
              latest,
              chain,
            ).entries()) {
              const common = {
                address: addresses,
                event: TRANSFER_EVENT,
                fromBlock,
                ...(i === 0 ? { toBlock: "latest" as const } : { toBlock }),
              };
              const [sent, received] = await Promise.all([
                client.getLogs({ ...common, args: { from: address } }),
                client.getLogs({ ...common, args: { to: address } }),
              ]);
              raw.push(
                sent.map(toEntry("sent")),
                received.map(toEntry("received")),
              );
            }
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
            return null;
          }
        }),
      );

      return {
        entries: perChain
          .flatMap((r) => r ?? [])
          .sort((a, b) => b.timestamp - a.timestamp),
        failedChains: CHAINS.filter((_, i) => perChain[i] === null),
      };
    },
  });
}
