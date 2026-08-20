"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { formatEther, formatUnits, parseUnits } from "viem";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChainPicker } from "@/components/chain-picker";
import { RebalancePanel } from "@/components/rebalance-panel";
import { BRIDGE_CHAINS, TOKENS, type ChainKey } from "@/lib/config/tokens";
import { useTokenBalances } from "@/lib/hooks/use-token-balances";
import { useBridge, type BridgeStatus } from "@/lib/hooks/use-bridge";
import { cn } from "@/lib/utils";

const QUOTE_DEBOUNCE_MS = 400;

const NATIVE_SYMBOL: Record<ChainKey, string> = {
  arbitrum: "ETH",
  base: "ETH",
  polygon: "POL",
  ethereum: "ETH",
};

const TX_ERROR =
  "No pudimos completar la operación. Revisá tu conexión o el saldo disponible y volvé a intentar.";

const STATUS_PILL: Partial<Record<BridgeStatus, { label: string; className: string }>> = {
  cotizando: {
    label: "Cotizando fee...",
    className: "border border-border bg-card text-foreground",
  },
  confirmando: {
    label: "Confirmando...",
    className: "border border-border bg-card text-foreground",
  },
  en_transito: { label: "En tránsito", className: "bg-green-dim text-green" },
  completado: { label: "Completado", className: "bg-green-dim text-green" },
  timeout: {
    label: "Sin confirmar todavía",
    className: "border border-border bg-card text-foreground",
  },
  error: { label: "Error", className: "bg-destructive/10 text-destructive" },
};

export default function BridgePage() {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address as `0x${string}` | undefined;
  const balances = useTokenBalances(walletAddress);
  const { perChain, refetch } = balances;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-6 lg:max-w-xl lg:p-8">
      <div>
        <h1 className="font-serif text-3xl text-foreground">Redes</h1>
      </div>
      <Tabs defaultValue="mover">
        <TabsList className="w-full">
          <TabsTrigger value="mover" className="flex-1">
            Mover
          </TabsTrigger>
          <TabsTrigger value="rebalanceo" className="flex-1">
            Rebalanceo
          </TabsTrigger>
        </TabsList>
        <TabsContent value="mover" className="pt-4">
          <MoverPanel
            walletAddress={walletAddress}
            perChain={perChain}
            refetch={refetch}
          />
        </TabsContent>
        <TabsContent value="rebalanceo" className="pt-4">
          <RebalancePanel walletAddress={walletAddress} balances={balances} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MoverPanel({
  walletAddress,
  perChain,
  refetch,
}: {
  walletAddress: `0x${string}` | undefined;
  perChain: Record<ChainKey, bigint>;
  refetch: () => void | Promise<unknown>;
}) {
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

  // Cotiza el fee cada vez que cambia monto/red, con debounce (~400ms) para no disparar una
  // lectura on-chain por cada tecla; D-09: siempre leído on-chain (quoteSend), nunca
  // hardcodeado. Se muestra antes de confirmar (UI-SPEC).
  useEffect(() => {
    let cancelled = false;
    setFee(null);
    setFeeError(null);
    if (!walletAddress || !amountBigInt || amountError) return;
    const timer = setTimeout(() => {
      quoteFee(fromChain, toChain, amountBigInt)
        .then(({ fee: quoted }) => {
          if (!cancelled) setFee(quoted.nativeFee);
        })
        .catch(() => {
          if (!cancelled) setFeeError("No pudimos cotizar el fee. Probá de nuevo.");
        });
    }, QUOTE_DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
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
  const destChains = BRIDGE_CHAINS.filter((c) => c !== fromChain);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Desde</span>
        <ChainPicker
          chains={BRIDGE_CHAINS}
          value={fromChain}
          onChange={(c) => {
            setFromChain(c);
            if (toChain === c) {
              const fallback = BRIDGE_CHAINS.find((other) => other !== c);
              if (fallback) setToChain(fallback);
            }
          }}
        />
        <p className="text-sm text-muted-foreground">
          Disponible: <span className="tabular-nums">{formatUnits(balanceOnChain, decimals)}</span>{" "}
          {TOKENS.ARGt.symbol}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Hacia</span>
        <ChainPicker chains={destChains} value={toChain} onChange={setToChain} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Monto</span>
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          placeholder="0.0"
        />
        {amountError && <p className="text-sm text-destructive">{amountError}</p>}
      </div>

      {amountBigInt && !amountError && (
        <div className="rounded-md border border-border bg-card p-4 text-sm text-foreground">
          {fee !== null ? (
            <p>
              Fee de mensajería estimado:{" "}
              <span className="tabular-nums">{formatEther(fee)}</span> {NATIVE_SYMBOL[fromChain]}
            </p>
          ) : feeError ? (
            <p className="text-destructive">{feeError}</p>
          ) : (
            <p className="text-muted-foreground">Cotizando fee...</p>
          )}
        </div>
      )}

      <Button onClick={onSubmit} disabled={!canSubmit}>
        {isSubmitting ? "Bridgeando..." : "Bridgear ARGt"}
      </Button>

      {pill && (
        <Badge
          className={cn(
            "w-fit rounded-[3px] px-1.5 py-0.5 font-mono text-[11px]",
            pill.className
          )}
        >
          {pill.label}
        </Badge>
      )}
      {status === "timeout" && (
        <p className="text-sm text-muted-foreground">
          Todavía no vemos el balance actualizado en destino. Puede tardar unos minutos más;
          revisá el explorer de la red destino si querés confirmar el estado.
        </p>
      )}
      {error && <p className="text-sm text-destructive">{TX_ERROR}</p>}
    </div>
  );
}
