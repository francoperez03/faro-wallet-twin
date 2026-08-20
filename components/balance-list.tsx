"use client";

import { useState } from "react";
import { CHAINS, type ChainKey } from "@/lib/config/tokens";
import { TokenRow } from "@/components/token-row";

export function BalanceList({
  perChain,
  errors,
  decimals,
  symbol,
  address,
  onSend,
}: {
  perChain: Record<ChainKey, bigint>;
  errors: Partial<Record<ChainKey, boolean>>;
  decimals: number;
  symbol: string;
  address: `0x${string}` | undefined;
  onSend: (chain: ChainKey) => void;
}) {
  const [expanded, setExpanded] = useState<ChainKey | null>(null);

  return (
    <div className="rounded-lg border border-border bg-card px-4">
      {CHAINS.map((chain) => (
        <TokenRow
          key={chain}
          chain={chain}
          balance={perChain[chain] ?? BigInt(0)}
          decimals={decimals}
          symbol={symbol}
          error={errors[chain]}
          address={address}
          expanded={expanded === chain}
          onToggle={() => setExpanded((current) => (current === chain ? null : chain))}
          onSend={() => onSend(chain)}
        />
      ))}
    </div>
  );
}
