"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ReceivePanel({ address }: { address: `0x${string}` }) {
  async function copy() {
    await navigator.clipboard.writeText(address);
    toast.success("Dirección copiada");
  }

  return (
    <div className="flex flex-col gap-3 pt-1">
      <p className="break-all rounded-md border border-border bg-card p-3 font-mono text-sm text-foreground">
        {address}
      </p>
      <Button type="button" size="lg" className="w-full" onClick={copy}>
        <Copy aria-hidden="true" />
        Copiar dirección
      </Button>
      <p className="text-xs text-muted-foreground">
        La misma dirección recibe ARGt en Arbitrum, Base y Polygon.
      </p>
    </div>
  );
}
