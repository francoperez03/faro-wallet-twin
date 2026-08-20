"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { formatUnits } from "viem";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TOKENS, VAULT_ARGT_PRIME } from "@/lib/config/tokens";

const MORPHO_VAULT_URL = `https://app.morpho.org/arbitrum/vault/${VAULT_ARGT_PRIME.address}`;

type AccountData = { argtBalance: bigint; interestAccrued: bigint };

export default function CuentaPage() {
  const { ready, authenticated, getAccessToken } = usePrivy();
  const [account, setAccount] = useState<AccountData | null>(null);
  const [apy, setApy] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    const token = await getAccessToken();
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
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  const decimals = TOKENS.ARGt.decimals;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <p className="text-sm text-zinc-500">Saldo en tu Cuenta</p>
        <p className="mt-2 text-[32px] font-semibold leading-tight tracking-tight text-zinc-900 tabular-nums">
          {formatUnits(account?.argtBalance ?? BigInt(0), decimals)} {TOKENS.ARGt.symbol}
        </p>
      </div>

      <div className="rounded-lg bg-zinc-100 p-4">
        <p className="text-sm text-zinc-500">Interés acumulado</p>
        <p className="mt-1 text-lg font-semibold text-zinc-900 tabular-nums">
          {formatUnits(account?.interestAccrued ?? BigInt(0), decimals)} {TOKENS.ARGt.symbol}
        </p>
      </div>

      <div className="rounded-lg bg-zinc-100 p-4">
        <p className="text-sm text-zinc-500">Tasa actual</p>
        {apy != null ? (
          <p className="mt-1 text-lg font-semibold text-zinc-900">{(apy * 100).toFixed(2)}% anual</p>
        ) : (
          <p className="mt-1 text-sm text-zinc-500">
            Todavía no hay tasa calculada.{" "}
            <Link href={MORPHO_VAULT_URL} target="_blank" className="text-blue-600">
              Ver en Morpho
            </Link>
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
          <Link href="/cuenta/pasar">Pasar a Cuenta</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href="/cuenta/retirar">Retirar</Link>
        </Button>
      </div>
    </div>
  );
}
