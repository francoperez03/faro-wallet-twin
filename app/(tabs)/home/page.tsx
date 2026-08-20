"use client";

import { usePrivy } from "@privy-io/react-auth";
import { formatUnits } from "viem";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { BalanceList } from "@/components/balance-list";
import { useTokenBalances } from "@/lib/hooks/use-token-balances";
import { TOKENS } from "@/lib/config/tokens";

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function HomePage() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  // Hooks siempre antes de los returns condicionales (React #310).
  const walletAddress = user?.wallet?.address as `0x${string}` | undefined;
  const { perChain, total, errors, isLoading } = useTokenBalances(walletAddress);

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
        <h1 className="font-serif text-3xl text-foreground">Faro</h1>
        <Button onClick={() => login()}>Ingresar con email o Google</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-6 lg:max-w-5xl lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-8 lg:p-8">
      <div className="flex flex-col gap-6">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          // FARO / HOME
        </p>

        <div>
          <p className="text-sm text-muted-foreground">Saldo total</p>
          {isLoading ? (
            <Skeleton className="mt-2 h-10 w-48" />
          ) : (
            <p className="mt-2 text-[32px] font-serif leading-tight tracking-tight text-gold tabular-nums">
              {formatUnits(total, TOKENS.ARGt.decimals)} {TOKENS.ARGt.symbol}
            </p>
          )}
        </div>

        {!isLoading && (
          <BalanceList
            perChain={perChain}
            errors={errors}
            decimals={TOKENS.ARGt.decimals}
            symbol={TOKENS.ARGt.symbol}
          />
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Tu wallet</p>
          <p className="mt-1 font-mono text-base text-foreground">
            {walletAddress ? truncateAddress(walletAddress) : "Sin embedded wallet"}
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="self-start text-destructive hover:text-destructive">
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
