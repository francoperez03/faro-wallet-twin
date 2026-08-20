"use client";

import { CHAIN_LABELS, type ChainKey } from "@/lib/config/tokens";
import { cn } from "@/lib/utils";

/** Fila de botones planos para elegir una red, extraída de bridge/page.tsx (usada en "Desde",
 * "Hacia" y, en Rebalanceo, en los presets "Todo en X"). */
export function ChainPicker({
  chains,
  value,
  onChange,
  disabled,
}: {
  chains: readonly ChainKey[];
  value: ChainKey;
  onChange: (chain: ChainKey) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-2">
      {chains.map((c) => (
        <button
          key={c}
          type="button"
          disabled={disabled}
          onClick={() => onChange(c)}
          className={cn(
            "min-h-11 flex-1 rounded-md border text-sm",
            value === c
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-foreground"
          )}
        >
          {CHAIN_LABELS[c]}
        </button>
      ))}
    </div>
  );
}
