"use client";

import { usePrivy } from "@privy-io/react-auth";
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

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function HomePage() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  if (!ready) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">Twin Neobank</h1>
        <Button onClick={() => login()} className="bg-blue-600 hover:bg-blue-700">
          Ingresar con email o Google
        </Button>
      </div>
    );
  }

  const walletAddress = user?.wallet?.address;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <p className="text-sm text-zinc-500">Saldo total</p>
        <Skeleton className="mt-2 h-10 w-48" />
      </div>

      <div className="rounded-lg bg-zinc-100 p-4">
        <p className="text-sm text-zinc-500">Tu wallet</p>
        <p className="mt-1 font-mono text-base text-zinc-900">
          {walletAddress ? truncateAddress(walletAddress) : "Sin embedded wallet"}
        </p>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="self-start text-red-600 hover:text-red-600">
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
  );
}
