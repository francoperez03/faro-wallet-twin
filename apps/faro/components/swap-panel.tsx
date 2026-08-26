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
import { ChevronDown } from "lucide-react";
import {
  CHAIN_IDS,
  SWAP,
  TOKENS,
  type SwapToken,
  type TokenKey,
} from "@/lib/config/tokens";
import { pmmAbi, pythAbi, routerAbi } from "@/lib/config/swap-abi";
import { fetchPythUpdate } from "@/lib/pyth";
import { useSwapQuote } from "@/lib/hooks/use-swap-quote";
import { useTokenBalances } from "@/lib/hooks/use-token-balances";
import { TxButton, type TxButtonStage } from "@/components/tx-button";
import { SwapQuoteCard } from "@/components/swap-quote-card";
import { SlidingNumber } from "@/components/animate-ui/primitives/texts/sliding-number";
import { MotionConfig } from "motion/react";
import { MOCK_AVAILABLE, MOCK_SWAP } from "@/lib/mock-swap";
import { cn } from "@/lib/utils";

const ERROR_COPY =
  "No pudimos completar el cambio. Revisá tu conexión o el saldo disponible y volvé a intentar.";
const CHAIN_ID = CHAIN_IDS[SWAP.chain];

const fmt = (v: bigint, decimals: number, max = 2) =>
  Number(formatUnits(v, decimals)).toLocaleString("es-AR", {
    minimumFractionDigits: Math.min(2, max),
    maximumFractionDigits: max,
  });

const isSwapToken = (t: TokenKey): t is SwapToken =>
  (SWAP.pairs as readonly string[]).includes(t);

/** Contenedor de las dos cards grandes (doy / recibo). */
const BIG_CARD =
  "flex min-h-[88px] items-center gap-3 rounded-lg border border-border bg-background px-4 transition-colors";
const BIG_NUM = "min-w-0 flex-1 font-serif text-[28px] leading-none tabular-nums";

/**
 * Cambio ARGt ↔ MEXt en una sola transacción: Curve (ARGt/USDT0, Twin) + FaroPMM (USDT0/MEXt, Faro).
 * El precio fresco de Pyth viaja dentro de la misma tx; el fee de Pyth va en `value`.
 */
export function SwapPanel({
  walletAddress,
  token,
  onDone,
}: {
  walletAddress: `0x${string}` | undefined;
  /** Moneda seleccionada en la home: siempre es el origen del cambio. */
  token: TokenKey;
  onDone?: () => void;
}) {
  if (!isSwapToken(token)) {
    return (
      <p className="pt-1 text-sm text-muted-foreground">
        Todavía no hay cambio para {TOKENS[token].symbol}.
      </p>
    );
  }
  return <Swap walletAddress={walletAddress} from={token} onDone={onDone} />;
}

function Swap({
  walletAddress,
  from,
  onDone,
}: {
  walletAddress: `0x${string}` | undefined;
  from: SwapToken;
  onDone?: () => void;
}) {
  const config = useConfig();
  const { chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  // ponytail: un solo par hoy; el dropdown queda listo para más destinos sin estado extra.
  const targets = SWAP.pairs.filter((t) => t !== from);
  const [to, setTo] = useState<SwapToken>(targets[0]);
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
  const fromBalances = useTokenBalances(walletAddress, from);
  const toBalances = useTokenBalances(walletAddress, to);
  const available = MOCK_SWAP
    ? MOCK_AVAILABLE
    : (fromBalances.perChain[SWAP.chain] ?? BigInt(0));
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
  const [slippage, setSlippage] = useState<number>(50);
  const quote = useSwapQuote(from, deferredAmount, BigInt(slippage));
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
  const toDecimals = TOKENS[to].decimals;

  const outTarget = q ? Number(formatUnits(q.amountOut, toDecimals)) : 0;
  return (
    <div className="grid gap-x-4 gap-y-3 pt-1 sm:grid-cols-[1fr_minmax(0,220px)]">
      <div className="flex items-baseline justify-between text-sm text-muted-foreground sm:col-span-2">
          <span>Cambiás {TOKENS[from].symbol}</span>
          <button
            type="button"
            disabled={busy || available === BigInt(0)}
            onClick={() => setAmount(formatUnits(available, decimals))}
            className="min-h-11 tabular-nums transition-colors hover:text-gold disabled:hover:text-muted-foreground"
          >
            Disponible {fmt(available, decimals)} {TOKENS[from].symbol}
          </button>
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <label
          className={cn(
            BIG_CARD,
            "cursor-text focus-within:border-gold",
            amountError && "border-destructive",
          )}
        >
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            placeholder="0"
            disabled={busy}
            aria-label={`Monto en ${TOKENS[from].symbol}`}
            aria-invalid={Boolean(amountError)}
            className={cn(
              BIG_NUM,
              "bg-transparent text-right text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50",
            )}
          />
          <span className="shrink-0 pl-3 pr-8 text-base font-semibold">
            <span aria-hidden="true">{TOKENS[from].flag}</span>{" "}
            {TOKENS[from].symbol}
          </span>
        </label>
        {amountError && (
          <p className="-mt-1 text-sm text-destructive">{amountError}</p>
        )}

        <div className={BIG_CARD}>
          <p
            aria-live="polite"
            className={cn(
              BIG_NUM,
              "text-right",
              q ? "text-gold" : "text-muted-foreground",
              quote.isLoading && "text-base",
            )}
          >
            {quote.isLoading && !q ? (
              "Cotizando…"
            ) : (
              <MotionConfig reducedMotion="user">
                <SlidingNumber
                  number={outTarget}
                  decimalPlaces={2}
                  decimalSeparator=","
                  thousandSeparator="."
                />
              </MotionConfig>
            )}
          </p>
          <span className="relative shrink-0">
            <select
              value={to}
              onChange={(e) => setTo(e.target.value as SwapToken)}
              disabled={busy}
              aria-label="Moneda a recibir"
              className="min-h-11 appearance-none rounded-md border border-border bg-card py-2 pl-3 pr-8 text-base font-semibold text-foreground outline-none transition-colors hover:border-foreground/30 focus-visible:border-gold disabled:opacity-50"
            >
              {targets.map((t) => (
                <option key={t} value={t}>
                  {TOKENS[t].flag} {TOKENS[t].symbol}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
          </span>
        </div>

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
            !walletAddress || busy || !amountIn || Boolean(amountError) || !q || MOCK_SWAP
          }
          onClick={onSwap}
          onSettled={() => setStage("idle")}
        />
        <p className="text-xs text-muted-foreground">
          La primera vez pide una firma extra para autorizar el token.
        </p>
      </div>

      <SwapQuoteCard
        from={from}
        to={to}
        quote={q}
        isLoading={quote.isLoading}
        noInventory={noInventory}
        hasAmount={Boolean(deferredAmount)}
        poolMext={poolMext}
        slippage={slippage}
        onSlippage={setSlippage}
        disabled={busy}
      />
    </div>
  );
}
