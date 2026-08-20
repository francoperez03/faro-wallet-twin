"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCuentaMode, type CuentaMode } from "@/lib/hooks/use-cuenta-mode";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "wallet" as const, label: "Wallet", ariaLabel: "Modo Wallet" },
  { value: "cuenta" as const, label: "Cuenta", ariaLabel: "Modo Cuenta" },
];

export function ModeToggle() {
  const { mode, setMode } = useCuentaMode();
  const router = useRouter();
  const pathname = usePathname();

  function selectMode(value: CuentaMode) {
    setMode(value);
    // El toggle solo cambiaba localStorage y no se sentía como navegación; en /home y /cuenta
    // el modo también define la ruta, así que acá lo lleva a la home correspondiente.
    if (pathname === "/home" || pathname === "/account") {
      router.push(value === "cuenta" ? "/account" : "/home");
    }
  }

  return (
    <div className="flex gap-1 rounded-lg bg-secondary p-1" role="tablist">
      {OPTIONS.map(({ value, label, ariaLabel }) => (
        <button
          key={value}
          type="button"
          role="tab"
          aria-selected={mode === value}
          aria-label={ariaLabel}
          onClick={() => selectMode(value)}
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
