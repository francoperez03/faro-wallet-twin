"use client";

import { formatUnits } from "viem";
import { TOKENS, type SwapToken } from "@/lib/config/tokens";
import type { SwapQuote } from "@/lib/hooks/use-swap-quote";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/animate-ui/components/radix/accordion";
import { MotionConfig } from "motion/react";
import { cn } from "@/lib/utils";

export const SLIPPAGES = [10, 50, 100] as const; // bps

const fmt = (v: bigint, decimals: number, max = 2) =>
  Number(formatUnits(v, decimals)).toLocaleString("es-AR", {
    minimumFractionDigits: Math.min(2, max),
    maximumFractionDigits: max,
  });

const pct = (bps: number) =>
  (bps / 100).toLocaleString("es-AR", { maximumFractionDigits: 2 }) + " %";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-9 items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right text-foreground tabular-nums">{children}</span>
    </div>
  );
}

/** Columna derecha de Cambiar: precio, desvío, mínimo, tolerancia y la ruta desplegable. */
export function SwapQuoteCard({
  from,
  to,
  quote,
  isLoading,
  noInventory,
  hasAmount,
  poolMext,
  slippage,
  onSlippage,
  disabled,
}: {
  from: SwapToken;
  to: SwapToken;
  quote: SwapQuote | undefined;
  isLoading: boolean;
  noInventory: boolean;
  hasAmount: boolean;
  poolMext: bigint;
  slippage: number;
  onSlippage: (bps: number) => void;
  disabled?: boolean;
}) {
  const q = hasAmount ? quote : undefined;
  const toDecimals = TOKENS[to].decimals;
  const warning = q
    ? q.overCap
      ? `Supera el máximo por operación (≈ US$ ${fmt(q.maxTradeUsdt, 6, 0)}). Hacelo en partes.`
      : to === "MEXt" && poolMext > BigInt(0) && q.amountOut > poolMext / BigInt(10)
        ? "Se lleva más del 10 % del MEXt del pool: el precio se encarece rápido. Mejor en partes."
        : q.impactBps > 150
          ? "Conviene partirla en dos operaciones."
          : null
    : null;

  return (
    <div className="min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-sm sm:self-start">
      {!hasAmount && (
        <p className="py-1 text-muted-foreground">
          Ingresá un monto para ver la cotización.
        </p>
      )}
      {hasAmount && isLoading && !q && (
        <div className="flex flex-col gap-3 py-2" aria-label="Cotizando">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}
      {hasAmount && noInventory && (
        <p className="py-1 text-amber">
          Sin inventario de {TOKENS[to].symbol} por ahora. Probá más tarde.
        </p>
      )}
      {q && (
        <div className="divide-y divide-border">
          <Row label="Precio">
            1 MEXt = {fmt(q.effectiveArgtPerMext, 18)} ARGt
          </Row>
          <Row label="Desvío">
            <span className={cn(q.impactBps > 100 && "text-amber")}>
              {pct(q.impactBps)}
            </span>
          </Row>
          <Row label="Mínimo">
            {fmt(q.minOut, toDecimals)} {TOKENS[to].symbol}
          </Row>
          <div className="flex flex-col gap-1.5 py-2">
            <span className="text-muted-foreground">Tolerancia</span>
            <div role="radiogroup" aria-label="Tolerancia" className="flex gap-1">
              {SLIPPAGES.map((bps) => (
                <button
                  key={bps}
                  type="button"
                  role="radio"
                  aria-checked={slippage === bps}
                  disabled={disabled}
                  onClick={() => onSlippage(bps)}
                  className={cn(
                    "min-h-8 flex-1 whitespace-nowrap rounded-full border px-2 text-xs tabular-nums transition-colors",
                    slippage === bps
                      ? "border-gold bg-gold-dim text-gold"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {pct(bps)}
                </button>
              ))}
            </div>
          </div>
          {warning && <p className="py-2 text-xs text-amber">{warning}</p>}
          {/* reducedMotion="user": el accordion respeta prefers-reduced-motion */}
          <MotionConfig reducedMotion="user">
          <Accordion type="single" collapsible>
            <AccordionItem value="ruta" className="border-b-0">
              <AccordionTrigger className="min-h-11 py-0 text-xs font-normal text-muted-foreground hover:text-foreground hover:no-underline">
                Cómo se hace el cambio
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <ol className="ml-1 flex flex-col border-l border-border pl-3 text-xs">
                  {[
                    [TOKENS[from].symbol, "sale de tu wallet"],
                    ["USDT0", "paso intermedio en Curve"],
                    [TOKENS[to].symbol, "entra a tu wallet vía Faro"],
                  ].map(([sym, via]) => (
                    <li key={sym} className="relative py-1.5">
                      <span
                        aria-hidden="true"
                        className="absolute -left-[17px] top-1/2 size-2 -translate-y-1/2 rounded-full bg-gold"
                      />
                      <span className="font-semibold text-foreground">{sym}</span>{" "}
                      <span className="text-muted-foreground">· {via}</span>
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          </MotionConfig>
        </div>
      )}
    </div>
  );
}
