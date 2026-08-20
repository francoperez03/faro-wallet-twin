"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { formatUnits } from "viem";
import { CHAINS, TOKENS, type ChainKey } from "@/lib/config/tokens";
import { useActivity } from "@/lib/hooks/use-activity";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const CHAIN_LABELS: Record<ChainKey, string> = {
  arbitrum: "Arbitrum",
  base: "Base",
  polygon: "Polygon",
};

const EXPLORER_TX_URL: Record<ChainKey, string> = {
  arbitrum: "https://arbiscan.io/tx/",
  base: "https://basescan.org/tx/",
  polygon: "https://polygonscan.com/tx/",
};

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function ActividadPage() {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address as `0x${string}` | undefined;
  const [chain, setChain] = useState<ChainKey>("arbitrum");
  const { data: entries, isLoading } = useActivity(walletAddress, chain);

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold text-zinc-900">Actividad</h1>

      <div className="flex gap-2">
        {CHAINS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setChain(c)}
            className={cn(
              "min-h-11 flex-1 rounded-md border text-sm",
              chain === c
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-zinc-200 bg-white text-zinc-900"
            )}
          >
            {CHAIN_LABELS[c]}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      )}

      {!isLoading && entries && entries.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="text-base font-semibold text-zinc-900">Todavía no hay movimientos</p>
          <p className="text-sm text-zinc-500">
            Cuando envíes o recibas ARGt en esta red, lo vas a ver acá.
          </p>
        </div>
      )}

      {!isLoading && entries && entries.length > 0 && (
        <ul className="flex flex-col gap-2">
          {entries.map((entry) => (
            <li key={entry.hash} className="rounded-lg bg-zinc-100 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">
                  {entry.direction === "sent" ? "Enviado a" : "Recibido de"}{" "}
                  <span className="font-mono">{truncateAddress(entry.counterparty)}</span>
                </span>
                <span className="tabular-nums text-base text-zinc-900">
                  {entry.direction === "sent" ? "-" : "+"}
                  {formatUnits(entry.amount, TOKENS.ARGt.decimals)} {TOKENS.ARGt.symbol}
                </span>
              </div>
              <a
                href={`${EXPLORER_TX_URL[chain]}${entry.hash}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-sm text-blue-600"
              >
                Ver en el explorer
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
