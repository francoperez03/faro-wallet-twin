"use client";

import { useEffect, useState } from "react";
import { formatEther, formatUnits, parseUnits } from "viem";
import { useBalance } from "wagmi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TxButton, type TxButtonStage } from "@/components/tx-button";
import { CHAIN_IDS, BRIDGE_CHAINS, CHAIN_LABELS, TOKENS, type ChainKey } from "@/lib/config/tokens";
import { computeRebalance, type Leg } from "@/lib/bridge/rebalance";
import { useBridge, type BridgeStatus } from "@/lib/hooks/use-bridge";
import type { useTokenBalances } from "@/lib/hooks/use-token-balances";
import { cn } from "@/lib/utils";

const NATIVE_SYMBOL: Record<ChainKey, string> = {
  arbitrum: "ETH",
  base: "ETH",
  polygon: "POL",
  ethereum: "ETH",
};

const TX_ERROR =
  "No pudimos completar la operación. Revisá tu conexión o el saldo disponible y volvé a intentar.";

const decimals = TOKENS.ARGt.decimals;
const zero = BigInt(0);

function stageFromStatus(status: BridgeStatus): TxButtonStage {
  if (status === "cotizando" || status === "confirmando") return "confirming";
  if (status === "en_transito") return "pending";
  if (status === "completado") return "success";
  if (status === "error" || status === "timeout") return "error";
  return "idle";
}

type LegState = "pendiente" | "en_curso" | "completada" | "error";

const LEG_STATE_LABEL: Record<LegState, string> = {
  pendiente: "Pendiente",
  en_curso: "En curso",
  completada: "Completada",
  error: "Error",
};

/** Reparte `remaining` entre dos chains flexibles, proporcional a su balance actual (50/50 si
 * ambas están en 0). Suma exacta garantizada: la segunda parte es el resto. */
function splitProportional(remaining: bigint, a: bigint, b: bigint): [bigint, bigint] {
  const denom = a + b;
  if (denom === zero) {
    const half = remaining / BigInt(2);
    return [half, remaining - half];
  }
  const shareA = (remaining * a) / denom;
  return [shareA, remaining - shareA];
}

/** Reglas de absorción: filas sin tocar (flexibles) se reparten lo que no cubren las editadas
 * (fijas), de forma que target siempre sume `total`. */
function computeTargets(
  current: Record<ChainKey, bigint>,
  editedText: Partial<Record<ChainKey, string>>
): { targets: Record<ChainKey, bigint>; error?: string } {
  const total = BRIDGE_CHAINS.reduce((acc, c) => acc + current[c], zero);
  const parsed: Partial<Record<ChainKey, bigint>> = {};
  for (const chain of BRIDGE_CHAINS) {
    const text = editedText[chain];
    if (!text) continue;
    try {
      parsed[chain] = parseUnits(text, decimals);
    } catch {
      return { targets: current, error: "Ingresá un monto válido." };
    }
  }

  const editedChains = BRIDGE_CHAINS.filter((c) => parsed[c] !== undefined);
  const flexChains = BRIDGE_CHAINS.filter((c) => parsed[c] === undefined);
  const sumEdited = editedChains.reduce((acc, c) => acc + (parsed[c] ?? zero), zero);

  if (flexChains.length === 0) {
    if (sumEdited !== total) {
      return {
        targets: current,
        error: "La suma de los objetivos no coincide con el total disponible.",
      };
    }
    return { targets: parsed as Record<ChainKey, bigint> };
  }

  if (sumEdited > total) {
    return { targets: current, error: "Los objetivos superan el total disponible." };
  }
  const remaining = total - sumEdited;

  const targets = { ...current };
  editedChains.forEach((c) => {
    targets[c] = parsed[c] as bigint;
  });

  if (flexChains.length === 1) {
    targets[flexChains[0]] = remaining;
  } else {
    const [a, b] = flexChains;
    const [shareA, shareB] = splitProportional(remaining, current[a], current[b]);
    targets[a] = shareA;
    targets[b] = shareB;
  }

  return { targets };
}

function pct(value: bigint, total: bigint): number {
  if (total === zero) return 0;
  return Number((value * BigInt(10000)) / total) / 100;
}

export function RebalancePanel({
  walletAddress,
  balances,
}: {
  walletAddress: `0x${string}` | undefined;
  balances: ReturnType<typeof useTokenBalances>;
}) {
  const { perChain, errors, refetch } = balances;
  const { status, quoteFee, bridge } = useBridge();

  const current = BRIDGE_CHAINS.reduce<Record<ChainKey, bigint>>(
    (acc, c) => ({ ...acc, [c]: perChain[c] ?? zero }),
    {} as Record<ChainKey, bigint>
  );
  const total = BRIDGE_CHAINS.reduce((acc, c) => acc + current[c], zero);
  const hasErrors = BRIDGE_CHAINS.some((c) => errors[c]);

  const [editedText, setEditedText] = useState<Partial<Record<ChainKey, string>>>({});
  const [preset, setPreset] = useState<string | null>(null);

  const { targets, error: targetError } = computeTargets(current, editedText);

  const [plan, setPlan] = useState<{ leg: Leg; fee: bigint }[] | null>(null);
  const [planError, setPlanError] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);

  const [legIndex, setLegIndex] = useState(-1);
  const [legStates, setLegStates] = useState<LegState[]>([]);
  const [startedLeg, setStartedLeg] = useState(-1);

  const executing = legIndex >= 0 && plan !== null && legIndex < plan.length;

  // Gas del nativo en cada origen del plan, lectura lazy (solo cuando esa chain es origen de
  // alguna pata del plan armado).
  const originsInPlan = new Set(plan?.map((p) => p.leg.from) ?? []);
  const gasArbitrum = useBalance({
    address: walletAddress,
    chainId: CHAIN_IDS.arbitrum,
    query: { enabled: Boolean(walletAddress) && originsInPlan.has("arbitrum") },
  });
  const gasBase = useBalance({
    address: walletAddress,
    chainId: CHAIN_IDS.base,
    query: { enabled: Boolean(walletAddress) && originsInPlan.has("base") },
  });
  const gasPolygon = useBalance({
    address: walletAddress,
    chainId: CHAIN_IDS.polygon,
    query: { enabled: Boolean(walletAddress) && originsInPlan.has("polygon") },
  });
  const gasBalances: Partial<Record<ChainKey, typeof gasArbitrum>> = {
    arbitrum: gasArbitrum,
    base: gasBase,
    polygon: gasPolygon,
  };

  // Arranca la pata activa una sola vez (guard por startedLeg); use-bridge es single-flight, así
  // que la próxima pata solo arranca cuando la anterior llega a "completado" (efecto de abajo).
  useEffect(() => {
    if (!executing || !plan || startedLeg === legIndex) return;
    setStartedLeg(legIndex);
    setLegStates((s) => s.map((st, i) => (i === legIndex ? "en_curso" : st)));
    const leg = plan[legIndex].leg;
    bridge({ fromChain: leg.from, toChain: leg.to, amount: leg.amount }).catch(() => {
      setLegStates((s) => s.map((st, i) => (i === legIndex ? "error" : st)));
      setLegIndex(-1);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [executing, legIndex, startedLeg, plan]);

  useEffect(() => {
    if (!executing || legStates[legIndex] !== "en_curso") return;
    if (status === "completado") {
      setLegStates((s) => s.map((st, i) => (i === legIndex ? "completada" : st)));
      const next = legIndex + 1;
      if (plan && next < plan.length) {
        setLegIndex(next);
      } else {
        setLegIndex(-1);
        void refetch();
        toast.success("Rebalanceo completado");
      }
    } else if (status === "error" || status === "timeout") {
      setLegStates((s) => s.map((st, i) => (i === legIndex ? "error" : st)));
      setLegIndex(-1);
      if (status === "error") toast.error(TX_ERROR);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, executing, legIndex]);

  const canRebalance = Boolean(
    !hasErrors && total > zero && !targetError && !executing && !previewing && walletAddress
  );

  function setChainText(chain: ChainKey, text: string) {
    setPreset(null);
    setEditedText((prev) => ({ ...prev, [chain]: text }));
  }

  function applyPreset(id: string, values: Record<ChainKey, bigint>) {
    if (preset === id) return;
    setPreset(id);
    const text: Partial<Record<ChainKey, string>> = {};
    BRIDGE_CHAINS.forEach((c) => {
      text[c] = formatUnits(values[c], decimals);
    });
    setEditedText(text);
  }

  async function handlePreview() {
    const legs = computeRebalance(current, targets);
    if (legs.length === 0) {
      toast("No hay nada para rebalancear con estos objetivos.");
      return;
    }
    setPreviewing(true);
    setPlanError(null);
    try {
      const fees = await Promise.all(
        legs.map(async (leg) => (await quoteFee(leg.from, leg.to, leg.amount)).fee.nativeFee)
      );
      setPlan(legs.map((leg, i) => ({ leg, fee: fees[i] })));
      setLegStates(legs.map(() => "pendiente"));
      setStartedLeg(-1);
    } catch {
      setPlanError(
        "No pudimos cotizar una de las patas. Puede que esa ruta todavía no esté soportada."
      );
    } finally {
      setPreviewing(false);
    }
  }

  function handleConfirm() {
    if (!plan) return;
    setLegIndex(0);
  }

  function discardPlan() {
    setPlan(null);
    setPlanError(null);
    setLegStates([]);
    setStartedLeg(-1);
  }

  const activeStage = executing ? stageFromStatus(status) : "idle";
  const alreadyRan = startedLeg !== -1;

  const feesBySymbol: Record<string, bigint> = {};
  plan?.forEach(({ leg, fee }) => {
    const symbol = NATIVE_SYMBOL[leg.from];
    feesBySymbol[symbol] = (feesBySymbol[symbol] ?? zero) + fee;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        {BRIDGE_CHAINS.map((chain) => {
          const targetPct = pct(targets[chain], total);
          const isEdited = Boolean(editedText[chain]);
          return (
            <div key={chain} className="border-b border-border py-1.5 last:border-b-0">
              <div className="flex min-h-11 w-full items-center justify-between gap-3">
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {CHAIN_LABELS[chain]}
                </span>
                <span className="flex items-center gap-2">
                  <span className="tabular-nums text-sm text-foreground">
                    {formatUnits(current[chain], decimals)} {TOKENS.ARGt.symbol}
                  </span>
                  <input
                    value={editedText[chain] ?? ""}
                    onChange={(e) => setChainText(chain, e.target.value)}
                    disabled={executing}
                    inputMode="decimal"
                    placeholder={formatUnits(current[chain], decimals)}
                    aria-label={`Objetivo en ${CHAIN_LABELS[chain]}`}
                    className="h-9 w-24 rounded-md border border-border bg-card px-2 text-right font-mono text-xs tabular-nums text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring disabled:opacity-50"
                  />
                </span>
              </div>
              <div className="mb-1 h-1 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
                <div
                  className={cn(
                    "h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none",
                    isEdited ? "bg-green" : "bg-gold"
                  )}
                  style={{ width: `${targetPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {targetError && <p className="text-sm text-destructive">{targetError}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={executing}
          onClick={() => {
            // Corte a 2 decimales para que el input quede legible; el resto exacto va a la primera red.
            const centUnit = BigInt(10) ** BigInt(decimals - 2);
            const share = (total / BigInt(BRIDGE_CHAINS.length) / centUnit) * centUnit;
            const rest = total - share * BigInt(BRIDGE_CHAINS.length);
            applyPreset(
              "equal",
              BRIDGE_CHAINS.reduce<Record<ChainKey, bigint>>(
                (acc, c, i) => ({ ...acc, [c]: share + (i === 0 ? rest : zero) }),
                {} as Record<ChainKey, bigint>
              )
            );
          }}
          className="min-h-11 flex-1 rounded-md border border-border bg-card px-2 text-xs text-foreground disabled:opacity-50"
        >
          Partes iguales
        </button>
        {BRIDGE_CHAINS.map((chain) => (
          <button
            key={chain}
            type="button"
            disabled={executing}
            onClick={() =>
              applyPreset(
                `all-${chain}`,
                BRIDGE_CHAINS.reduce<Record<ChainKey, bigint>>(
                  (acc, c) => ({ ...acc, [c]: c === chain ? total : zero }),
                  {} as Record<ChainKey, bigint>
                )
              )
            }
            className="min-h-11 flex-1 rounded-md border border-border bg-card px-2 text-xs text-foreground disabled:opacity-50"
          >
            Todo en {CHAIN_LABELS[chain]}
          </button>
        ))}
      </div>

      {!plan && (
        <Button onClick={handlePreview} disabled={!canRebalance}>
          {previewing ? "Cotizando plan..." : "Rebalancear"}
        </Button>
      )}

      {planError && <p className="text-sm text-destructive">{planError}</p>}

      {plan && (
        <div className="flex flex-col gap-3 rounded-md border border-border bg-card p-4 text-sm text-foreground">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Plan de rebalanceo
          </p>
          <ol className="flex flex-col gap-2">
            {plan.map(({ leg, fee }, i) => {
              const gas = gasBalances[leg.from];
              const shortGas =
                gas?.data && gas.data.value < fee
                  ? `Gas insuficiente en ${CHAIN_LABELS[leg.from]}: necesitás ~${formatEther(fee)} ${NATIVE_SYMBOL[leg.from]}, tenés ${formatEther(gas.data.value)}.`
                  : null;
              return (
                <li key={i} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span>
                      {i + 1}. {CHAIN_LABELS[leg.from]} → {CHAIN_LABELS[leg.to]}:{" "}
                      <span className="tabular-nums">{formatUnits(leg.amount, decimals)}</span>{" "}
                      {TOKENS.ARGt.symbol} · fee ~
                      <span className="tabular-nums">{formatEther(fee)}</span>{" "}
                      {NATIVE_SYMBOL[leg.from]}
                    </span>
                    {legStates[i] && (
                      <span
                        className={cn(
                          "font-mono text-[11px] uppercase tracking-widest",
                          legStates[i] === "completada" && "text-green",
                          legStates[i] === "error" && "text-destructive",
                          legStates[i] === "en_curso" && "text-foreground",
                          legStates[i] === "pendiente" && "text-muted-foreground"
                        )}
                      >
                        {LEG_STATE_LABEL[legStates[i]]}
                      </span>
                    )}
                  </div>
                  {shortGas && <p className="text-xs text-destructive">{shortGas}</p>}
                </li>
              );
            })}
          </ol>
          {Object.entries(feesBySymbol).map(([symbol, fee]) => (
            <p key={symbol} className="text-muted-foreground">
              Total fees: <span className="tabular-nums">{formatEther(fee)}</span> {symbol}
            </p>
          ))}
          <TxButton
            label="Confirmar rebalanceo"
            stage={activeStage}
            disabled={alreadyRan && !executing}
            onClick={handleConfirm}
          />
          {!alreadyRan && (
            <button
              type="button"
              onClick={discardPlan}
              className="text-sm text-muted-foreground underline"
            >
              Descartar plan
            </button>
          )}
        </div>
      )}
    </div>
  );
}
