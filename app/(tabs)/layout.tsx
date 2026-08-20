"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { LogOut } from "lucide-react";
import { PRODUCT_NAME } from "@/lib/config/app";
import { truncateAddress } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  const { authenticated, user, logout } = usePrivy();
  const walletAddress = user?.wallet?.address;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <Link href="/home" className="font-serif text-2xl text-gold">
          {PRODUCT_NAME}
        </Link>
        <div className="flex items-center gap-2">
          {authenticated && walletAddress && (
            <span className="rounded-full border border-border px-3 py-1.5 font-mono text-xs text-foreground">
              {truncateAddress(walletAddress)}
            </span>
          )}
          {authenticated && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Cerrar sesión"
                  className="min-h-11 min-w-11 text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="size-4" aria-hidden="true" />
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
          )}
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
