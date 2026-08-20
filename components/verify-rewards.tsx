"use client";

import { useCallback, useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Info, RotateCw } from "lucide-react";
import { formatUnits } from "viem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingPhrases } from "@/components/loading-phrases";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { recomputeCommitment } from "@/lib/poseidon2/commit";

// ponytail: verde/rojo no están en 01-UI-SPEC.md; extensión mínima sobre los tokens gold/green.
const STATUS_STYLES = {
  verde: "border-transparent bg-green-dim text-green",
  rojo: "border-transparent bg-destructive/10 text-destructive",
} as const;

type Opening = {
  balances: string[];
  salt: string;
  corteId: string;
  commitment: string;
};

type Status = "loading" | "match" | "mismatch" | "error" | "noCut";

const REPORT_EMAIL = "soporte@twin-neobank.example";

const LOADING_PHRASES = [
  "Pidiendo tu último corte…",
  "Recalculando tu huella en este navegador…",
  "Comparando con la huella que Faro publicó…",
] as const;

function argt(value: string | undefined) {
  return Number(formatUnits(BigInt(value ?? "0"), 8)).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function VerifyRewards() {
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
      const data: Opening | { noCut: true } = await res.json();
      if ("noCut" in data) {
        setStatus("noCut");
        return;
      }
      setOpening(data);

      const balances = data.balances.map((b) => BigInt(b));
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

  const mailto = opening
    ? `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(`Discrepancia de inclusión · ${opening.corteId}`)}&body=${encodeURIComponent(
        `corte_id: ${opening.corteId}\nDID: ${user?.id ?? ""}\ncommitment esperado (servidor): ${opening.commitment}\ncommitment recomputado (browser): ${recomputed?.toString() ?? ""}`,
      )}`
    : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1">
        <h2 className="text-sm font-semibold text-foreground">
          Verificá tus rewards
        </h2>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Qué verifica Faro"
                className="flex size-11 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
              >
                <Info className="size-4" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-pretty">
              En cada corte, Faro registra una huella de tu saldo y tu reward.
              Acá tu navegador vuelve a calcular esa huella con tus números y tu
              clave personal, y la compara con la registrada. Si coinciden, tus
              ARGt entraron en el corte tal cual los ves.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {(!ready || status === "loading") && (
        <div className="flex min-h-16 items-center py-2">
          <LoadingPhrases phrases={LOADING_PHRASES} />
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm text-muted-foreground">
            No pudimos traer tu corte. Reintentá en un momento.
          </p>
          <Button variant="outline" size="sm" onClick={load}>
            <RotateCw className="size-4" aria-hidden="true" />
            Reintentar
          </Button>
        </div>
      )}

      {status === "noCut" && (
        <div className="flex flex-col gap-2">
          <Badge className="border-transparent bg-muted text-muted-foreground">
            Todavía no hay un corte que te incluya
          </Badge>
          <p className="text-sm text-muted-foreground">
            Los rewards se calculan en cada corte. Cuando se publique el primero
            con tu saldo, vas a poder verificarlo acá.
          </p>
        </div>
      )}

      {opening && status === "match" && (
        <div className="flex flex-col gap-3">
          <Badge className={STATUS_STYLES.verde}>
            Verificado: tu saldo está en el corte
          </Badge>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-semibold text-foreground">
              Qué verificamos
            </p>
            <p className="mt-1 text-sm text-muted-foreground tabular-nums">
              Que tu saldo base de {argt(opening.balances[0])} ARGt y tu reward
              de {argt(opening.balances[1])} ARGt, en el corte {opening.corteId}
              , producen exactamente la huella que Faro registró para vos.
            </p>
            <p className="mt-3 text-sm font-semibold text-foreground">
              Qué significa para vos
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Faro contó tus ARGt completos al repartir el rendimiento: tu
              reward es tu parte exacta del vault en el período. Si algún día te
              omitieran o te acreditaran de menos, esta verificación daría
              error, y vos tendrías los datos para reclamar.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Tus números no se publican: solo el total del corte. La verificación
            corre en tu navegador.
          </p>
        </div>
      )}

      {opening && status === "mismatch" && (
        <div className="flex flex-col gap-3">
          <Badge className={STATUS_STYLES.rojo}>La huella no coincide</Badge>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground tabular-nums">
              Tu saldo base de {argt(opening.balances[0])} ARGt y tu reward de{" "}
              {argt(opening.balances[1])} ARGt, en el corte {opening.corteId},
              producen una huella distinta de la que Faro registró para vos.
              Puede ser un error de carga o un problema real en el corte:
              conviene reportarlo, el mail ya lleva los datos para auditarlo.
            </p>
          </div>
          {mailto && (
            <Button
              asChild
              variant="outline"
              className="w-fit border-destructive text-destructive hover:text-destructive"
            >
              <a href={mailto}>Reportar discrepancia</a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
