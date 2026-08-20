"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { formatUnits } from "viem";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TOKENS, VAULT_ARGT_PRIME } from "@/lib/config/tokens";
import { SolvencyBadge } from "@/components/cuenta/solvency-badge";

const MORPHO_VAULT_URL = `https://app.morpho.org/arbitrum/vault/${VAULT_ARGT_PRIME.address}`;

type AccountData = { argtBalance: bigint; interestAccrued: bigint };

export default function CuentaPage() {
  const { ready, authenticated, getAccessToken } = usePrivy();
  const [account, setAccount] = useState<AccountData | null>(null);
  const [apy, setApy] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    const token = await getAccessToken();
    // ponytail: D-08(a) gap del verifier de fase 3 — dispara el sweep de depósitos al
    // entrar a Home por si el usuario cerró /cuenta/pasar antes de que termine su polling.
    // Best-effort, no bloquea el render de la cuenta.
    fetch("/api/cuenta/sync-deposits", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
    const [accountRes, rateRes] = await Promise.all([
      fetch("/api/cuenta/account", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("/api/cuenta/rate"),
    ]);
    if (accountRes.ok) {
      const data = await accountRes.json();
      setAccount({
        argtBalance: BigInt(data.argtBalance),
        interestAccrued: BigInt(data.interestAccrued),
      });
    }
    if (rateRes.ok) {
      const data = await rateRes.json();
      setApy(data.apy);
    }
    setIsLoading(false);
  }, [getAccessToken]);

  useEffect(() => {
    if (ready && authenticated) load();
  }, [ready, authenticated, load]);

  if (!ready || isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 p-6 lg:max-w-5xl lg:p-8">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  const decimals = TOKENS.ARGt.decimals;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-6 lg:max-w-5xl lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-8 lg:p-8">
      <div className="flex flex-col gap-6">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          // FARO / CUENTA
        </p>

        <div>
          <p className="text-sm text-muted-foreground">Saldo en tu Cuenta</p>
          <p className="mt-2 text-[32px] font-serif leading-tight tracking-tight text-gold tabular-nums">
            {formatUnits(account?.argtBalance ?? BigInt(0), decimals)} {TOKENS.ARGt.symbol}
          </p>
        </div>

        <SolvencyBadge />

        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Interés acumulado</p>
          <p className="mt-1 text-lg font-semibold text-foreground tabular-nums">
            {formatUnits(account?.interestAccrued ?? BigInt(0), decimals)} {TOKENS.ARGt.symbol}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Tasa actual</p>
          {apy != null ? (
            <p className="mt-1 text-lg font-semibold text-foreground">{(apy * 100).toFixed(2)}% anual</p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Todavía no hay tasa calculada.{" "}
              <Link href={MORPHO_VAULT_URL} target="_blank" className="text-gold">
                Ver en Morpho
              </Link>
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 lg:flex-col">
        <Button asChild className="flex-1">
          <Link href="/cuenta/pasar">Pasar a Cuenta</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href="/cuenta/retirar">Retirar</Link>
        </Button>
      </div>
    </div>
  );
}
