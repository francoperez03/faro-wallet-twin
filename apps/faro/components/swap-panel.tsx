"use client";

import { useDeferredValue, useState } from "react";
import {
  useAccount,
  useConfig,
  useReadContract,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { getPublicClient } from "wagmi/actions";
import { erc20Abi, formatUnits, maxUint256, parseUnits } from "viem";
import { toast } from "sonner";
import { ArrowLeftRight } from "lucide-react";
import { CHAIN_IDS, SWAP, TOKENS, type SwapToken } from "@/lib/config/tokens";
import { pmmAbi, pythAbi, routerAbi } from "@/lib/config/swap-abi";
import { fetchPythUpdate } from "@/lib/pyth";
import { useSwapQuote } from "@/lib/hooks/use-swap-quote";
import { useTokenBalances } from "@/lib/hooks/use-token-balances";
import { Input } from "@/components/ui/input";
import { TxButton, type TxButtonStage } from "@/components/tx-button";
import { cn } from "@/lib/utils";

const ERROR_COPY =
  "No pudimos completar el cambio. Revisá tu conexión o el saldo disponible y volvé a intentar.";
const CHAIN_ID = CHAIN_IDS[SWAP.chain];

const fmt = (v: bigint, decimals: number, max = 2) =>
  Number(formatUnits(v, decimals)).toLocaleString("es-AR", {
    minimumFractionDigits: Math.min(2, max),
    maximumFractionDigits: max,
  });

function other(t: SwapToken): SwapToken {
  return t === "ARGt" ? "MEXt" : "ARGt";
}

/**
 * Cambio ARGt ↔ MEXt en una sola transacción: Curve (ARGt/USDT0, Twin) + FaroPMM (USDT0/MEXt, Faro).
 * El precio fresco de Pyth viaja dentro de la misma tx; el fee de Pyth va en `value`.
 */
export function SwapPanel({
  walletAddress,
  initialFrom = "ARGt",
  onDone,
}: {
  walletAddress: `0x${string}` | undefined;
  initialFrom?: SwapToken;
  onDone?: () => void;
}) {
  const config = useConfig();
  const { chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const [from, setFrom] = useState<SwapToken>(initialFrom);
  const to = other(from);
  const [amount, setAmount] = useState("");
  const [stage, setStage] = useState<TxButtonStage>("idle");
  const [step, setStep] = useState<"aprobar" | "cambiar" | null>(null);

  // Inventario del pool: MEXt disponible y USDT0 acumulado. "Sano" = hasta 10 % del inventario en una operación.
  const pool = useReadContract({
    address: SWAP.pmm,
    abi: pmmAbi,
    functionName: "state",
    chainId: CHAIN_ID,
    query: { refetchInterval: 30_000 },
  });
  const poolMext = pool.data?.[0] ?? BigInt(0);
  const poolUsdt = pool.data?.[1] ?? BigInt(0);
  const fromBalances = useTokenBalances(walletAddress, from);
  const toBalances = useTokenBalances(walletAddress, to);
  const available = fromBalances.perChain[SWAP.chain] ?? BigInt(0);
  const decimals = TOKENS[from].decimals;

  let amountIn: bigint | null = null;
  let amountError: string | undefined;
  if (amount) {
    try {
      amountIn = parseUnits(amount, decimals);
      if (amountIn <= BigInt(0)) amountError = "Ingresá un monto válido.";
      else if (amountIn > available)
        amountError = "El monto supera tu saldo en Arbitrum.";
    } catch {
      amountError = "Ingresá un monto válido.";
    }
  }
  const deferredAmount = useDeferredValue(amountError ? null : amountIn);
  const quote = useSwapQuote(from, deferredAmount);
  const busy = stage === "confirming" || stage === "pending";
  const noInventory = quote.isError;

  async function onSwap() {
    if (!walletAddress || !amountIn || amountError || !quote.data) return;
    const client = getPublicClient(config, { chainId: CHAIN_ID });
    if (!client) return;
    setStage("confirming");
    try {
      if (chainId !== CHAIN_ID) await switchChainAsync({ chainId: CHAIN_ID });
      const tokenIn = TOKENS[from].addresses[SWAP.chain];
      const allowance = await client.readContract({
        address: tokenIn,
        abi: erc20Abi,
        functionName: "allowance",
        args: [walletAddress, SWAP.router],
      });
      if (allowance < amountIn) {
        setStep("aprobar");
        const approveHash = await writeContractAsync({
          address: tokenIn,
          abi: erc20Abi,
          functionName: "approve",
          args: [SWAP.router, maxUint256], // una sola aprobación; el router nunca retiene fondos
          chainId: CHAIN_ID,
        });
        setStage("pending");
        await client.waitForTransactionReceipt({ hash: approveHash });
        setStage("confirming");
      }
      setStep("cambiar");
      const update = await fetchPythUpdate(SWAP.feedId);
      const fee = await client.readContract({
        address: SWAP.pyth,
        abi: pythAbi,
        functionName: "getUpdateFee",
        args: [update],
      });
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 120);
      const hash = await writeContractAsync({
        address: SWAP.router,
        abi: routerAbi,
        functionName: from === "ARGt" ? "swapArgtToMext" : "swapMextToArgt",
        args: [amountIn, quote.data.minOut, deadline, update],
        value: fee,
        chainId: CHAIN_ID,
        // Arbitrum suma el calldata de L1 al gas intrínseco y el update de Pyth pesa varios KB:
        // el estimador del wallet queda corto ("intrinsic gas too low"). Límite explícito; solo se cobra lo usado.
        gas: BigInt(2_000_000),
      });
      setStage("pending");
      const receipt = await client.waitForTransactionReceipt({ hash });
      if (receipt.status !== "success") throw new Error("swap reverted");
      setStage("success");
      toast.success(`Cambio confirmado: recibiste ${TOKENS[to].symbol}`);
      setAmount("");
      void fromBalances.refetch();
      void toBalances.refetch();
      onDone?.();
    } catch (error) {
      console.error(error);
      setStage("error");
      toast.error(ERROR_COPY);
    } finally {
      setStep(null);
    }
  }

  const q = quote.data;
  return (
    <div className="flex flex-col gap-4 pt-1">
      <div className="flex items-center gap-2">
        <span className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm">
          <span aria-hidden="true">{TOKENS[from].flag}</span>{" "}
          {TOKENS[from].symbol}
        </span>
        <button
          type="button"
          aria-label="Invertir el sentido del cambio"
          onClick={() => {
            setFrom(to);
            setAmount("");
          }}
          disabled={busy}
          className="flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-gold"
        >
          <ArrowLeftRight className="size-4" aria-hidden="true" />
        </button>
        <span className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-right text-sm">
          <span aria-hidden="true">{TOKENS[to].flag}</span> {TOKENS[to].symbol}
        </span>
      </div>

      <p className="text-xs text-muted-foreground tabular-nums">
        En el pool: {fmt(poolMext, 18, 0)} MEXt · {fmt(poolUsdt, 6, 0)} USDT0
        {poolMext > BigInt(0) && (
          <>
            {" "}
            · sano hasta ≈ {fmt(poolMext / BigInt(10), 18, 0)} MEXt por
            operación (10 % del pool)
          </>
        )}
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">
          Monto en {TOKENS[from].symbol}
        </span>
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          placeholder="0.0"
          disabled={busy}
          className="min-h-11"
        />
        <p className="text-sm text-muted-foreground">
          Disponible en Arbitrum:{" "}
          <span className="tabular-nums">{fmt(available, decimals)}</span>{" "}
          {TOKENS[from].symbol}
        </p>
        {amountError && (
          <p className="text-sm text-destructive">{amountError}</p>
        )}
      </div>

      {deferredAmount && (
        <div className="rounded-lg border border-border bg-background p-3 text-sm">
          {quote.isLoading && (
            <p className="text-muted-foreground">Cotizando…</p>
          )}
          {noInventory && (
            <p className="text-amber">
              Sin inventario de {TOKENS[to].symbol} por ahora. Probá más tarde.
            </p>
          )}
          {q && (
            <div className="flex flex-col gap-1">
              <p className="text-base text-foreground tabular-nums">
                Recibís{" "}
                <span className="font-semibold text-gold">
                  {fmt(q.amountOut, TOKENS[to].decimals)}
                </span>{" "}
                {TOKENS[to].symbol}
              </p>
              <p className="text-muted-foreground tabular-nums">
                1 MEXt = {fmt(q.effectiveArgtPerMext, 18)} ARGt · referencia{" "}
                {fmt(q.referenceArgtPerMext, 18)}
              </p>
              <p
                className={cn(
                  "tabular-nums",
                  q.impactBps > 100 ? "text-amber" : "text-muted-foreground",
                )}
              >
                Desvío {(q.impactBps / 100).toFixed(2).replace(".", ",")} % ·
                mínimo {fmt(q.minOut, TOKENS[to].decimals)} {TOKENS[to].symbol}{" "}
                (0,5 % de tolerancia)
              </p>
              {q.impactBps > 150 && !q.overCap && (
                <p className="text-amber">
                  Conviene partirla en dos operaciones.
                </p>
              )}
              {to === "MEXt" &&
                poolMext > BigInt(0) &&
                q.amountOut > poolMext / BigInt(10) &&
                !q.overCap && (
                  <p className="text-amber">
                    Se lleva más del 10 % del MEXt del pool: el precio se
                    encarece rápido. Mejor en partes.
                  </p>
                )}
              {q.overCap && (
                <p className="text-amber">
                  Supera el máximo por operación (≈ US${" "}
                  {fmt(q.maxTradeUsdt, 6, 0)}). Hacelo en partes.
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Ruta: {TOKENS[from].symbol} → USDT0 (Curve) →{" "}
                {TOKENS[to].symbol} (Faro)
                {q.oracleAge > 60
                  ? " · el precio del oráculo se actualiza al confirmar"
                  : ""}
              </p>
            </div>
          )}
        </div>
      )}

      <TxButton
        label={
          step === "aprobar"
            ? "Aprobando…"
            : step === "cambiar"
              ? "Cambiando…"
              : "Cambiar"
        }
        stage={stage}
        disabled={
          !walletAddress || busy || !amountIn || Boolean(amountError) || !q
        }
        onClick={onSwap}
        onSettled={() => setStage("idle")}
      />
      <p className="text-xs text-muted-foreground">
        El cambio se hace en una sola transacción en Arbitrum; la primera vez
        pide una firma extra para autorizar el token.
      </p>
    </div>
  );
}
