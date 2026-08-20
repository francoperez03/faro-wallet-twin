"use client";

import { ExternalLink, Send } from "lucide-react";
import { formatUnits } from "viem";
import { useBalance } from "wagmi";
import { Button } from "@/components/ui/button";
import { CHAIN_IDS, CHAIN_LABELS, EXPLORER_TX_URL, type ChainKey } from "@/lib/config/tokens";
import { useRevealAnimation } from "@/lib/hooks/use-reveal-animation";

export function TokenRow({
  chain,
  balance,
  decimals,
  symbol,
  error,
  address,
  expanded,
  onToggle,
  onSend,
}: {
  chain: ChainKey;
  balance: bigint;
  decimals: number;
  symbol: string;
  error?: boolean;
  address: `0x${string}` | undefined;
  expanded: boolean;
  onToggle: () => void;
  onSend: () => void;
}) {
  const panelRef = useRevealAnimation<HTMLDivElement>(expanded);

  const gas = useBalance({
    address,
    chainId: CHAIN_IDS[chain],
    query: { enabled: expanded && Boolean(address) },
  });

  const explorerAddressUrl = EXPLORER_TX_URL[chain].replace("/tx/", "/address/");

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="flex min-h-11 w-full items-center justify-between py-2 text-left"
      >
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {CHAIN_LABELS[chain]}
        </span>
        {error ? (
          <span className="text-sm text-amber">No disponible</span>
        ) : (
          <span className="tabular-nums text-base text-foreground">
            {formatUnits(balance, decimals)} {symbol}
          </span>
        )}
      </button>

      {expanded && (
        <div ref={panelRef} className="flex flex-col gap-3 pb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Gas nativo</span>
            {gas.isLoading ? (
              <span className="text-muted-foreground">Cargando…</span>
            ) : gas.data ? (
              <span className="tabular-nums text-foreground">
                {formatUnits(gas.data.value, gas.data.decimals)} {gas.data.symbol}
              </span>
            ) : (
              <span className="text-amber">No disponible</span>
            )}
          </div>

          {address && (
            <a
              href={`${explorerAddressUrl}${address}`}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              Ver en el explorer
            </a>
          )}

          <Button type="button" variant="outline" size="sm" onClick={onSend} className="self-start">
            <Send className="size-4" aria-hidden="true" />
            Enviar desde {CHAIN_LABELS[chain]}
          </Button>
        </div>
      )}
    </div>
  );
}
