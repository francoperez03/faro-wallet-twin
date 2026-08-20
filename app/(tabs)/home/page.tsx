"use client";

import { useEffect, useRef, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { animate } from "animejs";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import { formatUnits } from "viem";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityCard } from "@/components/activity-card";
import { BalanceList } from "@/components/balance-list";
import { Faro } from "@/components/faro";
import { SendPanel } from "@/components/send-panel";
import { ReceivePanel } from "@/components/receive-panel";
import { RewardsPanel } from "@/components/rewards-panel";
import { useTokenBalances } from "@/lib/hooks/use-token-balances";
import { useRewardsBalance } from "@/lib/hooks/use-rewards-balance";
import { useRevealAnimation } from "@/lib/hooks/use-reveal-animation";
import { TOKENS, TOKEN_KEYS, type TokenKey } from "@/lib/config/tokens";
import { cn } from "@/lib/utils";
import { PAGE_WIDTH } from "@/lib/config/app";

/** Radix Tabs necesita un value; este no matchea ningún trigger, así el panel arranca colapsado
 * (patrón vault-aggregator/lemon-account-card.tsx). */
const NONE = "none";

function fmt(value: bigint, decimals: number) {
  return Number(formatUnits(value, decimals)).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
type PanelKey = "enviar" | "recibir";

type Step = "home" | "rewards";
const STEP_INDEX: Record<Step, number> = { home: 0, rewards: 1 };

const TAB_TRIGGER =
  "min-h-11 flex-1 gap-1.5 rounded-md text-sm font-semibold text-muted-foreground data-[state=active]:bg-gold-dim data-[state=active]:text-gold";

export default function HomePage() {
  const { ready, authenticated, user, login } = usePrivy();
  // Hooks siempre antes de los returns condicionales (React #310).
  const walletAddress = user?.wallet?.address as `0x${string}` | undefined;
  const [token, setToken] = useState<TokenKey>("ARGt");
  const { symbol, decimals } = TOKENS[token];
  const {
    perChain,
    total: walletTotal,
    errors,
    isLoading: isLoadingWallet,
    refetch,
  } = useTokenBalances(walletAddress, token);
  // Saldo total = wallet en todas las redes + lo invertido en Rewards (ledger, solo ARGt).
  const rewards = useRewardsBalance();
  const invested =
    token === "ARGt" ? (rewards.data?.total ?? BigInt(0)) : BigInt(0);
  const total = walletTotal + invested;
  const isLoading = isLoadingWallet || (token === "ARGt" && rewards.isLoading);

  const [panel, setPanel] = useState<PanelKey | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const breakdownRef = useRevealAnimation<HTMLDivElement>(showBreakdown);

  // Deep link (/home?view=rewards, desde el redirect de /rewards): arranca en el paso Rewards
  // sin animación, patrón "carga" del rail vault-aggregator (prev === null => sin choreography).
  const [step, setStep] = useState<Step>(() =>
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("view") === "rewards"
      ? "rewards"
      : "home",
  );

  const heroRef = useRef<HTMLParagraphElement>(null);
  const heroState = useRef({ value: 0 });
  const heroFirstPaint = useRef(true);

  useEffect(() => {
    if (isLoading) return;
    const el = heroRef.current;
    if (!el) return;
    const target = Number(formatUnits(total, decimals));

    const paint = () => {
      el.textContent = `${heroState.current.value.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} ${symbol}`;
    };

    if (heroFirstPaint.current) {
      heroFirstPaint.current = false;
      heroState.current.value = target;
      paint();
      return;
    }
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      heroState.current.value = target;
      paint();
      return;
    }
    const animation = animate(heroState.current, {
      value: target,
      duration: 600,
      ease: "outQuint",
      onUpdate: paint,
    });
    return () => {
      animation.pause();
    };
  }, [total, isLoading, decimals, symbol]);

  // Rail: dos pasos lado a lado (home / rewards), patrón vault-aggregator page.tsx:255-291.
  const railRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<Record<Step, HTMLDivElement | null>>({
    home: null,
    rewards: null,
  });
  const prevStepRef = useRef<Step | null>(null);

  useEffect(() => {
    const rail = railRef.current;
    // El primer paint del rail (incluido el deep link) es una carga, no un cambio de paso: solo
    // posiciona sin animar (el estado inicial de opacidad ya lo resuelve la clase por `step`).
    const prev = prevStepRef.current;
    if (rail) prevStepRef.current = step;
    if (!rail) return;
    if (prev === null) {
      if (step !== "home")
        rail.style.transform = `translateX(${-(STEP_INDEX[step] * 100) / 2}%)`;
      return;
    }
    if (prev === step) return;
    const outgoing = colRefs.current[prev];
    const incoming = colRefs.current[step];
    if (!outgoing || !incoming) return;
    const to = -(STEP_INDEX[step] * 100) / 2;
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      rail.style.transform = `translateX(${to}%)`;
      outgoing.style.opacity = "0";
      incoming.style.opacity = "1";
      incoming.style.transform = "";
      return;
    }
    const slide = animate(rail, {
      translateX: `${to}%`,
      duration: 600,
      ease: "outExpo",
    });
    const leave = animate(outgoing, {
      opacity: 0,
      scale: 0.98,
      duration: 260,
      ease: "outQuad",
    });
    const arrive = animate(incoming, {
      opacity: [0, 1],
      translateY: [14, 0],
      scale: [0.985, 1],
      delay: 120,
      duration: 480,
      ease: "outQuint",
    });
    return () => {
      slide.pause();
      leave.pause();
      arrive.pause();
    };
  }, [step]);

  // "Volver" aparece sobre el rail cuando el paso es Rewards; la fila mantiene su alto en
  // ambos pasos para que nada salte (patrón vault-aggregator page.tsx:293-311).
  const backRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const el = backRef.current;
    if (!el) return;
    const show = step !== "home";
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      el.style.opacity = show ? "1" : "0";
      return;
    }
    const animation = animate(el, {
      opacity: show ? 1 : 0,
      translateY: show ? 0 : -6,
      duration: 350,
      ease: "outQuad",
    });
    return () => {
      animation.pause();
    };
  }, [step]);

  if (!ready) {
    return (
      <div className={cn(PAGE_WIDTH, "flex flex-col gap-4 p-6 lg:p-8")}>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div
        className={cn(
          PAGE_WIDTH,
          "flex min-h-full flex-1 flex-col items-center justify-center gap-6 p-6 text-center lg:p-8",
        )}
      >
        <Faro size={160} />
        <h1 className="font-serif text-3xl text-foreground">Faro</h1>
        <Button onClick={() => login()}>Ingresar</Button>
      </div>
    );
  }

  return (
    <div className={cn(PAGE_WIDTH, "flex flex-1 flex-col p-6 lg:p-8")}>
      <button
        ref={backRef}
        type="button"
        onClick={() => setStep("home")}
        tabIndex={step === "home" ? -1 : 0}
        aria-hidden={step === "home"}
        className={cn(
          "flex min-h-11 items-center gap-2 pb-4 text-sm text-muted-foreground opacity-0",
          step === "home" && "pointer-events-none hidden",
        )}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Volver
      </button>

      <div className="flex-1 overflow-hidden">
        <div ref={railRef} className="flex w-[200%]">
          <div
            ref={(el) => {
              colRefs.current.home = el;
            }}
            className={cn("w-1/2", step !== "home" && "opacity-0")}
            aria-hidden={step !== "home"}
          >
            <div className="flex w-full flex-col gap-6">
              <div className="flex flex-col gap-6">
                {/* Filtro de moneda por bandera (pelotitas), arriba de la card de saldo */}
                <div
                  role="tablist"
                  aria-label="Moneda"
                  className="flex items-center gap-3"
                >
                  {TOKEN_KEYS.map((key) => {
                    const active = token === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-label={TOKENS[key].name}
                        onClick={() => {
                          setToken(key);
                          setPanel(null);
                        }}
                        className={`flex min-h-11 items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-xs font-semibold transition-colors ${
                          active
                            ? "border-gold bg-gold-dim text-gold"
                            : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`flex size-9 items-center justify-center rounded-full bg-secondary text-lg leading-none transition-opacity ${
                            active ? "opacity-100" : "opacity-60"
                          }`}
                        >
                          {TOKENS[key].flag}
                        </span>
                        {TOKENS[key].symbol}
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Saldo total</p>
                    <button
                      type="button"
                      onClick={() => setStep("rewards")}
                      className="flex min-h-11 items-center gap-1.5 text-sm font-semibold text-gold"
                    >
                      <TrendingUp className="size-4" aria-hidden="true" />
                      Rewards
                    </button>
                  </div>
                  {isLoading ? (
                    <Skeleton className="mt-2 h-10 w-48" />
                  ) : (
                    <p
                      ref={heroRef}
                      style={{ minWidth: "8ch" }}
                      className="mt-2 text-[32px] font-serif leading-tight tracking-tight text-gold tabular-nums"
                    >
                      0,00 {symbol}
                    </p>
                  )}
                  {!isLoading && (
                    <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                      En wallet {fmt(walletTotal, decimals)} {symbol}
                      {invested > BigInt(0) && (
                        <>
                          {" "}
                          · En Rewards {fmt(invested, decimals)} {symbol}
                        </>
                      )}
                    </p>
                  )}

                  {!isLoading && (
                    <Tabs
                      value={panel ?? NONE}
                      onValueChange={(next) => {
                        if (next === NONE) {
                          setPanel(null);
                        } else {
                          setPanel(next as PanelKey);
                        }
                      }}
                      className="mt-4 gap-3 border-t border-border pt-4"
                    >
                      <TabsList className="h-11 w-full gap-1 rounded-lg border border-border bg-background p-1">
                        <TabsTrigger value="enviar" className={TAB_TRIGGER}>
                          <ArrowUpRight className="size-4" aria-hidden="true" />
                          Enviar
                        </TabsTrigger>
                        <TabsTrigger value="recibir" className={TAB_TRIGGER}>
                          <ArrowDownLeft
                            className="size-4"
                            aria-hidden="true"
                          />
                          Recibir
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="enviar">
                        <SendPanel
                          walletAddress={walletAddress}
                          token={token}
                          perChain={perChain}
                          refetch={refetch}
                          onDone={() => setPanel(null)}
                        />
                      </TabsContent>
                      <TabsContent value="recibir">
                        {walletAddress && (
                          <ReceivePanel address={walletAddress} />
                        )}
                      </TabsContent>
                    </Tabs>
                  )}

                  {!isLoading && (
                    <div className="mt-4 border-t border-border pt-1">
                      <button
                        type="button"
                        aria-expanded={showBreakdown}
                        onClick={() => setShowBreakdown((v) => !v)}
                        className="flex min-h-11 w-full items-center justify-between text-left"
                      >
                        <span className="text-sm font-semibold text-foreground">Por red</span>
                        <ChevronDown
                          aria-hidden="true"
                          className={`size-5 text-gold transition-transform duration-300 ${showBreakdown ? "rotate-180" : ""}`}
                        />
                      </button>
                      {showBreakdown && (
                        <div ref={breakdownRef} className="pb-2">
                          <BalanceList
                            perChain={perChain}
                            errors={errors}
                            decimals={decimals}
                            symbol={symbol}
                            address={walletAddress}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <ActivityCard walletAddress={walletAddress} />
              </div>
            </div>
          </div>

          <div
            ref={(el) => {
              colRefs.current.rewards = el;
            }}
            className={cn("w-1/2", step !== "rewards" && "opacity-0")}
            aria-hidden={step !== "rewards"}
          >
            <RewardsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
