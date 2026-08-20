"use client";

import { useId, useState } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatUnits } from "viem";
import { CHAINS, CHAIN_LABELS, EXPLORER_TX_URL, TOKENS, type ChainKey, type TokenKey } from "@/lib/config/tokens";
import { useActivity } from "@/lib/hooks/use-activity";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, truncateAddress } from "@/lib/utils";

/** Movimientos ARGt del usuario por red. Misma card y mismo segmented control dorado que el resto de Home. */
export function ActivityCard({
  walletAddress,
  token = "ARGt",
  className,
}: {
  walletAddress: `0x${string}` | undefined;
  token?: TokenKey;
  className?: string;
}) {
  const titleId = useId();
  const [chain, setChain] = useState<ChainKey>("arbitrum");
  const { data: entries, isLoading } = useActivity(walletAddress, chain, token);

  return (
    <section aria-labelledby={titleId} className={cn("rounded-lg border border-border bg-card p-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 id={titleId} className="text-sm text-muted-foreground">
          Actividad <span aria-hidden="true">{TOKENS[token].flag}</span> {TOKENS[token].symbol}
        </h2>
        <div role="tablist" aria-label="Red" className="flex gap-1 rounded-lg border border-border bg-background p-1">
          {CHAINS.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={chain === c}
              onClick={() => setChain(c)}
              className={cn(
                "min-h-9 rounded-md px-3 text-xs font-semibold transition-colors",
                chain === c ? "bg-gold-dim text-gold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {CHAIN_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-border">
        {isLoading && (
          <div className="flex flex-col gap-3 pt-4">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        )}

        {!isLoading && (!entries || entries.length === 0) && (
          <div className="flex flex-col items-center gap-1 py-10 text-center">
            <p className="text-sm font-semibold text-foreground">Todavía no hay movimientos</p>
            <p className="text-sm text-muted-foreground">
              Cuando envíes o recibas {TOKENS[token].symbol} en {CHAIN_LABELS[chain]}, lo vas a ver acá.
            </p>
          </div>
        )}

        {!isLoading && entries && entries.length > 0 && (
          <ul className="divide-y divide-border">
            {entries.map((entry) => {
              const sent = entry.direction === "sent";
              const Icon = sent ? ArrowUpRight : ArrowDownLeft;
              return (
                <li key={entry.hash} className="flex min-h-14 items-center gap-3 py-3">
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full",
                      sent ? "bg-secondary text-foreground" : "bg-green-dim text-green"
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">{sent ? "Enviado" : "Recibido"}</p>
                    <a
                      href={`${EXPLORER_TX_URL[chain]}${entry.hash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-muted-foreground underline-offset-2 hover:text-gold hover:underline"
                    >
                      {sent ? "a" : "de"} {truncateAddress(entry.counterparty)}
                    </a>
                  </div>
                  <span className={cn("shrink-0 tabular-nums text-sm", sent ? "text-foreground" : "text-green")}>
                    {sent ? "-" : "+"}
                    {formatUnits(entry.amount, TOKENS[token].decimals)} {TOKENS[token].symbol}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
