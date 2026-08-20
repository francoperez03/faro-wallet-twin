"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { formatEther, formatUnits, parseUnits } from "viem";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CHAINS, TOKENS, type ChainKey } from "@/lib/config/tokens";
import { useTokenBalances } from "@/lib/hooks/use-token-balances";
import { useBridge, type BridgeStatus } from "@/lib/hooks/use-bridge";
import { cn } from "@/lib/utils";

const CHAIN_LABELS: Record<ChainKey, string> = {
  arbitrum: "Arbitrum",
  base: "Base",
  polygon: "Polygon",
};

const NATIVE_SYMBOL: Record<ChainKey, string> = {
  arbitrum: "ETH",
  base: "ETH",
  polygon: "POL",
};

const TX_ERROR =
  "No pudimos completar la operación. Revisá tu conexión o el saldo disponible y volvé a intentar.";

const STATUS_PILL: Partial<Record<BridgeStatus, { label: string; className: string }>> = {
  cotizando: { label: "Cotizando fee...", className: "bg-zinc-100 text-zinc-900" },
  confirmando: { label: "Confirmando...", className: "bg-zinc-100 text-zinc-900" },
  en_transito: { label: "En tránsito", className: "bg-blue-600 text-white" },
  completado: { label: "Completado", className: "bg-blue-600 text-white" },
  timeout: { label: "Sin confirmar todavía", className: "bg-zinc-100 text-zinc-900" },
  error: { label: "Error", className: "bg-red-600 text-white" },
};

export default function BridgePage() {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address as `0x${string}` | undefined;
  const { perChain, refetch } = useTokenBalances(walletAddress);
  const { status, error, quoteFee, bridge } = useBridge();

  const [fromChain, setFromChain] = useState<ChainKey>("arbitrum");
  const [toChain, setToChain] = useState<ChainKey>("base");
  const [amount, setAmount] = useState("");
  const [fee, setFee] = useState<bigint | null>(null);
  const [feeError, setFeeError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const decimals = TOKENS.ARGt.decimals;
  const balanceOnChain = perChain[fromChain] ?? BigInt(0);

  let amountBigInt: bigint | undefined;
  let amountError: string | undefined;
  if (amount.length > 0) {
    try {
      amountBigInt = parseUnits(amount, decimals);
    } catch {
      amountBigInt = undefined;
    }
    if (amountBigInt === undefined || amountBigInt <= BigInt(0)) {
      amountError = "Ingresá un monto válido.";
    } else if (amountBigInt > balanceOnChain) {
      amountError = "El monto supera tu saldo disponible en esta red.";
    }
  }

  // Cotiza el fee cada vez que cambia monto/red; D-09: siempre leído on-chain (quoteSend),
  // nunca hardcodeado. Se muestra antes de confirmar (UI-SPEC).
  useEffect(() => {
    let cancelled = false;
    setFee(null);
    setFeeError(null);
    if (!walletAddress || !amountBigInt || amountError) return;
    quoteFee(fromChain, toChain, amountBigInt)
      .then(({ fee: quoted }) => {
        if (!cancelled) setFee(quoted.nativeFee);
      })
      .catch(() => {
        if (!cancelled) setFeeError("No pudimos cotizar el fee. Probá de nuevo.");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, fromChain, toChain, amount]);

  const canSubmit = Boolean(
    !isSubmitting &&
      walletAddress &&
      amountBigInt &&
      !amountError &&
      fee !== null &&
      fromChain !== toChain
  );

  async function onSubmit() {
    if (!canSubmit || !amountBigInt) return;
    setIsSubmitting(true);
    try {
      await bridge({ fromChain, toChain, amount: amountBigInt });
      toast.success("Bridge enviado");
      setAmount("");
      setFee(null);
      await refetch();
    } catch {
      toast.error(TX_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  }

  const pill = STATUS_PILL[status];
  const destChains = CHAINS.filter((c) => c !== fromChain);

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold text-zinc-900">Mover entre redes</h1>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-zinc-500">Desde</span>
        <div className="flex gap-2">
          {CHAINS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setFromChain(c);
                if (toChain === c) {
                  const fallback = CHAINS.find((other) => other !== c);
                  if (fallback) setToChain(fallback);
                }
              }}
              className={cn(
                "min-h-11 flex-1 rounded-md border text-sm",
                fromChain === c
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-zinc-200 bg-white text-zinc-900"
              )}
            >
              {CHAIN_LABELS[c]}
            </button>
          ))}
        </div>
        <p className="text-sm text-zinc-500">
          Disponible: <span className="tabular-nums">{formatUnits(balanceOnChain, decimals)}</span>{" "}
          {TOKENS.ARGt.symbol}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-zinc-500">Hacia</span>
        <div className="flex gap-2">
          {destChains.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setToChain(c)}
              className={cn(
                "min-h-11 flex-1 rounded-md border text-sm",
                toChain === c
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-zinc-200 bg-white text-zinc-900"
              )}
            >
              {CHAIN_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-zinc-500">Monto</span>
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          placeholder="0.0"
        />
        {amountError && <p className="text-sm text-red-600">{amountError}</p>}
      </div>

      {amountBigInt && !amountError && (
        <div className="rounded-md bg-zinc-100 p-4 text-sm text-zinc-900">
          {fee !== null ? (
            <p>
              Fee de mensajería estimado:{" "}
              <span className="tabular-nums">{formatEther(fee)}</span> {NATIVE_SYMBOL[fromChain]}
            </p>
          ) : feeError ? (
            <p className="text-red-600">{feeError}</p>
          ) : (
            <p className="text-zinc-500">Cotizando fee...</p>
          )}
        </div>
      )}

      <Button onClick={onSubmit} disabled={!canSubmit} className="bg-blue-600 hover:bg-blue-700">
        {isSubmitting ? "Bridgeando..." : "Bridgear ARGt"}
      </Button>

      {pill && (
        <Badge className={cn("w-fit rounded-full px-3 py-1 text-sm", pill.className)}>
          {pill.label}
        </Badge>
      )}
      {status === "timeout" && (
        <p className="text-sm text-zinc-500">
          Todavía no vemos el balance actualizado en destino. Puede tardar unos minutos más;
          revisá el explorer de la red destino si querés confirmar el estado.
        </p>
      )}
      {error && <p className="text-sm text-red-600">{TX_ERROR}</p>}
    </div>
  );
}
