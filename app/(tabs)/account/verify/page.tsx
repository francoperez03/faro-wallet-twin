"use client";

import { PAGE_WIDTH } from "@/lib/config/app";
import { cn } from "@/lib/utils";

import { useCallback, useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { recomputeCommitment } from "@/lib/poseidon2/commit";

// ponytail: verde/rojo no están en 01-UI-SPEC.md; misma extensión mínima que
// components/cuenta/solvency-badge.tsx (SOL-03), ahora sobre los tokens gold/green.
const STATUS_STYLES = {
  verde: "border-transparent bg-green-dim text-green",
  rojo: "border-transparent bg-destructive/10 text-destructive",
} as const;

type Opening = {
  balances: string[];
  salt: string;
  corteId: string;
  commitment: string;
  synthetic: boolean;
};

type Status = "loading" | "match" | "mismatch" | "error";

const REPORT_EMAIL = "soporte@twin-neobank.example";

export default function VerificarPage() {
  const { ready, authenticated, getAccessToken, user } = usePrivy();
  const [opening, setOpening] = useState<Opening | null>(null);
  const [recomputed, setRecomputed] = useState<bigint | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/account/opening", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const data: Opening = await res.json();
      setOpening(data);

      const balances = data.balances.map((b) => BigInt(b));
      // arity [balance, reward]: fallback sintético también la respeta (ver route.ts).
      const salt = BigInt(data.salt);
      const mine = recomputeCommitment(balances, salt);
      setRecomputed(mine);

      if (mine === BigInt(data.commitment)) {
        setStatus("match");
      } else {
        setStatus("mismatch");
        console.error("Discrepancia de inclusión", {
          corteId: data.corteId,
          did: user?.id,
          expected: data.commitment,
          recomputed: mine.toString(),
        });
      }
    } catch {
      setStatus("error");
    }
  }, [getAccessToken, user?.id]);

  useEffect(() => {
    if (ready && authenticated) load();
  }, [ready, authenticated, load]);

  if (!ready || status === "loading") {
    return (
      <div className={cn(PAGE_WIDTH, "flex flex-col gap-4 p-6 lg:p-8")}>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const mailto = opening
    ? `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(`Discrepancia de inclusión · ${opening.corteId}`)}&body=${encodeURIComponent(
        `corte_id: ${opening.corteId}\nDID: ${user?.id ?? ""}\ncommitment esperado (servidor): ${opening.commitment}\ncommitment recomputado (browser): ${recomputed?.toString() ?? ""}`,
      )}`
    : undefined;

  return (
    <div className={cn(PAGE_WIDTH, "flex flex-col gap-6 p-6 lg:p-8")}>
      <div>
        <h1 className="font-serif text-3xl text-foreground">
          Verificá tu inclusión
        </h1>
      </div>

      {status === "error" && (
        <p className="text-sm text-muted-foreground">
          No pudimos pedir tu opening. Reintentá.
        </p>
      )}

      {(status === "match" || status === "mismatch") && (
        <Badge className={STATUS_STYLES[status === "match" ? "verde" : "rojo"]}>
          {status === "match"
            ? "Tu saldo está incluido"
            : "Discrepancia detectada"}
        </Badge>
      )}

      {opening && (status === "match" || status === "mismatch") && (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-foreground tabular-nums">
            Tu balance base: {opening.balances[0] ?? "0"} · Tu reward:{" "}
            {opening.balances[1] ?? "0"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tu reward es tu parte exacta del rendimiento del vault en el
            período.
          </p>
        </div>
      )}

      {status === "mismatch" && mailto && (
        <Button
          asChild
          variant="outline"
          className="w-fit border-destructive text-destructive hover:text-destructive"
        >
          <a href={mailto}>Reportar discrepancia</a>
        </Button>
      )}

      {opening?.synthetic && (
        <p className="text-sm text-muted-foreground">
          Corte sintético (era fixture, sin corte real todavía).
        </p>
      )}

      <div className="rounded-lg border border-border bg-card p-4 text-sm text-foreground/80">
        Verificás que tu opening abre contra tu commitment servido por el
        backend. Los commitments individuales no están on-chain (solo el
        acumulado del corte), así que la garantía contra omisión la da el
        binding del auditor, no la cadena sola.
      </div>
    </div>
  );
}
