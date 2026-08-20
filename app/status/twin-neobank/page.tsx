"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CutHistory } from "@/components/status/cut-history";
import { DeclaredMask } from "@/components/status/declared-mask";
import { YieldComparison } from "@/components/status/yield-comparison";
import { REGISTRIES } from "@/lib/config/tokens";
import { useLatestCut, useCutHistory } from "@/lib/sobrecito/use-registry";

export default function StatusPage() {
  const registry = REGISTRIES[0];
  const { cut, corteId, hoursAgo, status, isLoading } = useLatestCut(registry);
  const { history, isLoading: isLoadingHistory } = useCutHistory(registry);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-6 lg:max-w-3xl lg:p-8">
      <div>
        <h1 className="font-serif text-3xl text-foreground">Rendimiento de Faro</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Verificable por cualquiera, sin login, directo desde el FaroYieldRegistry on-chain.
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : status === "none" || !cut ? (
        <p className="text-sm text-muted-foreground">Todavía no hay un corte publicado para este registry.</p>
      ) : (
        <>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Frescura</p>
            <p className="mt-1 font-serif text-2xl text-gold">
              Último corte hace {Math.max(0, Math.round(hoursAgo ?? 0))} h
              {status === "amber" && <span className="ml-2 text-sm font-normal text-amber">vencido</span>}
            </p>
          </div>

          {corteId && <YieldComparison cut={cut} corteId={corteId} history={history} />}

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Veredictos</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {cut.verdicts.map((v, i) => (
                <Badge key={i} className={v ? "border-transparent bg-green-dim text-green" : "border-transparent bg-destructive text-white"}>
                  Token {i}: {v ? "cubierto" : "no cubierto"}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Cobertura por bucket</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {cut.coverageBps.map((bps, i) => (
                <Badge key={i} variant="secondary">
                  Bucket {i}: {(bps / 100).toFixed(2)}%
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      <DeclaredMask />

      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Historial de cortes</p>
        {isLoadingHistory ? <Skeleton className="h-24 w-full" /> : <CutHistory history={history} chainId={registry.chainId} />}
      </div>
    </div>
  );
}
