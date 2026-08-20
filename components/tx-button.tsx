"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Ciclo de vida del CTA que dispara una transacción: reposo → firma → en curso → éxito/error →
 * vuelta a reposo. `error` deja el click vivo como reintento; `success` y `error` vuelven solos
 * a `idle` tras un beat (patrón vault-aggregator/tx-button.tsx). */
export type TxButtonStage = "idle" | "confirming" | "pending" | "success" | "error";

const SUCCESS_RESET_MS = 2500;
const ERROR_RESET_MS = 6000;

export function TxButton({
  label,
  successLabel = "¡Listo!",
  stage,
  onClick,
  onSettled,
  disabled = false,
  className,
  variant,
}: {
  label: string;
  successLabel?: string;
  stage: TxButtonStage;
  onClick: () => void;
  onSettled?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: ComponentProps<typeof Button>["variant"];
}) {
  const [held, setHeld] = useState<TxButtonStage>(stage);
  const settleTimer = useRef<number | null>(null);

  useEffect(() => {
    setHeld(stage);
    if (stage !== "success" && stage !== "error") return;
    settleTimer.current = window.setTimeout(
      () => {
        setHeld("idle");
        onSettled?.();
      },
      stage === "success" ? SUCCESS_RESET_MS : ERROR_RESET_MS
    );
    return () => {
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const busy = held === "confirming" || held === "pending";

  return (
    <Button
      type="button"
      size="lg"
      variant={variant}
      className={cn(
        "w-full",
        held === "success" && "border border-green/50 bg-green-dim text-green disabled:opacity-100",
        held === "error" && "border border-destructive/60 text-destructive",
        className
      )}
      disabled={disabled || busy || held === "success"}
      aria-live="polite"
      onClick={onClick}
    >
      {busy && <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
      {held === "success" && <Check aria-hidden="true" />}
      {held === "confirming"
        ? "Confirmá en tu wallet…"
        : held === "pending"
          ? "Esperando la transacción…"
          : held === "success"
            ? successLabel
            : held === "error"
              ? "Falló · Reintentar"
              : label}
    </Button>
  );
}
