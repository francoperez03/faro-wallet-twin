"use client";

import { useEffect, useRef, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { animate } from "animejs";
import { ArrowDownLeft, ArrowUpRight, ChevronDown } from "lucide-react";
import { formatUnits } from "viem";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ActivityCard } from "@/components/activity-card";
import { BalanceList } from "@/components/balance-list";
import { Faro } from "@/components/faro";
import { SendPanel } from "@/components/send-panel";
import { ReceivePanel } from "@/components/receive-panel";
import { useTokenBalances } from "@/lib/hooks/use-token-balances";
import { useRevealAnimation } from "@/lib/hooks/use-reveal-animation";
import { TOKENS, TOKEN_KEYS, type TokenKey } from "@/lib/config/tokens";
import { truncateAddress } from "@/lib/utils";

/** Radix Tabs necesita un value; este no matchea ningún trigger, así el panel arranca colapsado
 * (patrón vault-aggregator/lemon-account-card.tsx). */
const NONE = "none";
type PanelKey = "enviar" | "recibir";

const TAB_TRIGGER =
  "min-h-11 flex-1 gap-1.5 rounded-md text-sm font-semibold text-muted-foreground data-[state=active]:bg-gold-dim data-[state=active]:text-gold";

export default function HomePage() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  // Hooks siempre antes de los returns condicionales (React #310).
  const walletAddress = user?.wallet?.address as `0x${string}` | undefined;
  const [token, setToken] = useState<TokenKey>("ARGt");
  const { symbol, decimals } = TOKENS[token];
  const { perChain, total, errors, isLoading, refetch } = useTokenBalances(
    walletAddress,
    token,
  );

  const [panel, setPanel] = useState<PanelKey | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const breakdownRef = useRevealAnimation<HTMLDivElement>(showBreakdown);

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

  if (!ready) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 p-6 lg:max-w-5xl lg:p-8">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-lg flex-1 flex-col items-center justify-center gap-6 p-6 text-center lg:max-w-5xl lg:p-8">
        <Faro size={160} />
        <h1 className="font-serif text-3xl text-foreground">Faro</h1>
        <Button onClick={() => login()}>Ingresar</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-6 lg:max-w-5xl lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-8 lg:p-8">
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
          <p className="text-sm text-muted-foreground">Saldo total</p>
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
                  <ArrowDownLeft className="size-4" aria-hidden="true" />
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
                {walletAddress && <ReceivePanel address={walletAddress} />}
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
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Por red
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={`size-4 text-muted-foreground transition-transform duration-300 ${showBreakdown ? "rotate-180" : ""}`}
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

      <div className="flex flex-col gap-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Tu wallet</p>
          <p className="mt-1 font-mono text-base text-foreground">
            {walletAddress
              ? truncateAddress(walletAddress)
              : "Sin embedded wallet"}
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="self-start text-destructive hover:text-destructive"
            >
              Cerrar sesión
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cerrar sesión</DialogTitle>
              <DialogDescription>
                Vas a cerrar sesión en este dispositivo. Confirmar.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="destructive" onClick={() => logout()}>
                  Cerrar sesión
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
