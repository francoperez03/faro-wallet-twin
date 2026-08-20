"use client";

import { useCuentaMode } from "@/lib/hooks/use-cuenta-mode";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "wallet" as const, label: "Wallet", ariaLabel: "Modo Wallet" },
  { value: "cuenta" as const, label: "Cuenta", ariaLabel: "Modo Cuenta" },
];

export function ModeToggle() {
  const { mode, setMode } = useCuentaMode();

  return (
    <div className="flex gap-1 rounded-lg bg-secondary p-1" role="tablist">
      {OPTIONS.map(({ value, label, ariaLabel }) => (
        <button
          key={value}
          type="button"
          role="tab"
          aria-selected={mode === value}
          aria-label={ariaLabel}
          onClick={() => setMode(value)}
          className={cn(
            "min-h-11 flex-1 rounded-md text-sm font-semibold transition-colors",
            mode === value ? "bg-gold-dim text-gold" : "text-muted-foreground"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
