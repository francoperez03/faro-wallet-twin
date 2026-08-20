"use client";

import { useId, useState } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatUnits } from "viem";
import {
  CHAINS,
  CHAIN_LABELS,
  EXPLORER_TX_URL,
  TOKENS,
  TOKEN_KEYS,
  type ChainKey,
  type TokenKey,
} from "@/lib/config/tokens";
import { SlidersHorizontal } from "lucide-react";
import { useActivity } from "@/lib/hooks/use-activity";
import { useRevealAnimation } from "@/lib/hooks/use-reveal-animation";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, truncateAddress } from "@/lib/utils";

const ALL = "all";
const CHIP =
  "min-h-8 rounded-md px-2 text-[11px] font-semibold transition-colors";
const CHIP_ON = "bg-gold-dim text-gold";
const CHIP_OFF = "text-muted-foreground hover:text-foreground";

function formatWhen(timestamp: number) {
  if (!timestamp) return "";
  return new Date(timestamp * 1000).toLocaleString("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Historial único de movimientos: todas las monedas y redes mezcladas, filtrable por cada una. */
export function ActivityCard({
  walletAddress,
  className,
}: {
  walletAddress: `0x${string}` | undefined;
  className?: string;
}) {
  const titleId = useId();
  const [token, setToken] = useState<TokenKey | typeof ALL>(ALL);
  const [chain, setChain] = useState<ChainKey | typeof ALL>(ALL);
  const { data, isLoading } = useActivity(walletAddress);
  const [showFilters, setShowFilters] = useState(false);
  const filtersRef = useRevealAnimation<HTMLDivElement>(showFilters);
  const filterCount = (token === ALL ? 0 : 1) + (chain === ALL ? 0 : 1);

  const failed = data?.failedChains ?? [];
  const entries = (data?.entries ?? []).filter(
    (e) =>
      (token === ALL || e.token === token) &&
      (chain === ALL || e.chain === chain),
  );

  return (
    <section
      aria-labelledby={titleId}
      className={cn("rounded-lg border border-border bg-card p-4", className)}
    >
      <div className="flex items-center justify-between">
        <h2 id={titleId} className="text-sm text-muted-foreground">
          Actividad
        </h2>
        <button
          type="button"
          aria-expanded={showFilters}
          aria-label="Filtros de actividad"
          onClick={() => setShowFilters((v) => !v)}
          className={cn(
            "flex min-h-11 items-center gap-1.5 rounded-md px-2 text-xs font-semibold transition-colors",
            showFilters || filterCount > 0
              ? "text-gold"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Filtrar
          {filterCount > 0 && (
            <span className="rounded-[3px] bg-gold-dim px-1 font-mono text-[11px] text-gold">
              {filterCount}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div ref={filtersRef} className="mt-2 flex flex-wrap gap-2">
          <div
            role="tablist"
            aria-label="Moneda"
            className="flex gap-1 rounded-lg border border-border bg-background p-1"
          >
            {([ALL, ...TOKEN_KEYS] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={token === key}
                aria-label={
                  key === ALL ? "Todas las monedas" : TOKENS[key].name
                }
                onClick={() => setToken(key)}
                className={cn(CHIP, token === key ? CHIP_ON : CHIP_OFF)}
              >
                {key === ALL ? (
                  "Todo"
                ) : (
                  <>
                    <span aria-hidden="true">{TOKENS[key].flag}</span>{" "}
                    {TOKENS[key].symbol}
                  </>
                )}
              </button>
            ))}
          </div>
          <div
            role="tablist"
            aria-label="Red"
            className="flex gap-1 rounded-lg border border-border bg-background p-1"
          >
            {([ALL, ...CHAINS] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={chain === key}
                onClick={() => setChain(key)}
                className={cn(CHIP, chain === key ? CHIP_ON : CHIP_OFF)}
              >
                {key === ALL ? "Todas" : CHAIN_LABELS[key]}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 border-t border-border">
        {failed.length > 0 && (
          <p className="pt-3 text-xs text-amber">
            Sin datos de {failed.map((c) => CHAIN_LABELS[c]).join(", ")} por
            ahora. Reintentá en un rato.
          </p>
        )}
        {isLoading && (
          <div className="flex flex-col gap-3 pt-4">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        )}

        {!isLoading && entries.length === 0 && (
          <div className="flex flex-col items-center gap-1 py-10 text-center">
            <p className="text-sm font-semibold text-foreground">
              Todavía no hay movimientos
            </p>
            <p className="text-sm text-muted-foreground">
              Cuando envíes o recibas{" "}
              {token === ALL ? "ARGt o BOLt" : TOKENS[token].symbol}
              {chain === ALL ? "" : ` en ${CHAIN_LABELS[chain]}`}, lo vas a ver
              acá.
            </p>
          </div>
        )}

        {!isLoading && entries.length > 0 && (
          <ul className="divide-y divide-border">
            {entries.map((entry) => {
              const sent = entry.direction === "sent";
              const Icon = sent ? ArrowUpRight : ArrowDownLeft;
              const t = TOKENS[entry.token];
              return (
                <li
                  key={`${entry.chain}-${entry.hash}-${entry.direction}-${entry.token}`}
                  className="flex min-h-14 items-center gap-3 py-3"
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full",
                      sent
                        ? "bg-secondary text-foreground"
                        : "bg-green-dim text-green",
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-x-2 text-sm text-foreground">
                      <span>{sent ? "Enviado" : "Recibido"}</span>
                      <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        <span aria-hidden="true">{t.flag}</span> {t.symbol} ·{" "}
                        {CHAIN_LABELS[entry.chain]}
                      </span>
                    </p>
                    <a
                      href={`${EXPLORER_TX_URL[entry.chain]}${entry.hash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-muted-foreground underline-offset-2 hover:text-gold hover:underline"
                    >
                      {sent ? "a" : "de"} {truncateAddress(entry.counterparty)}
                      {entry.timestamp
                        ? ` · ${formatWhen(entry.timestamp)}`
                        : ""}
                    </a>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 tabular-nums text-sm",
                      sent ? "text-foreground" : "text-green",
                    )}
                  >
                    {sent ? "-" : "+"}
                    {formatUnits(entry.amount, t.decimals)} {t.symbol}
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
