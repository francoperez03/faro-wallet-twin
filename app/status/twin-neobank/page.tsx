"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CutHistory } from "@/components/status/cut-history";
import { DeclaredMask } from "@/components/status/declared-mask";
import { YieldComparison } from "@/components/status/yield-comparison";
import { REGISTRIES } from "@/lib/config/tokens";
import { useLatestCut, useCutHistory } from "@/lib/sobrecito/use-registry";

const SYNTHETIC_LABEL_RE = /fixture|sint(é|e)tic/i;
const YIELD_LABEL_RE = /rendimiento|yield/i;

function StatusForRegistry({ registry }: { registry: (typeof REGISTRIES)[number] }) {
  const { cut, corteId, hoursAgo, status, isLoading } = useLatestCut(registry);
  const { history, isLoading: isLoadingHistory } = useCutHistory(registry);
  const isSynthetic = SYNTHETIC_LABEL_RE.test(registry.label);
  const isYield = YIELD_LABEL_RE.test(registry.label);

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  return (
    <div className="flex flex-col gap-6">
      {isSynthetic && (
        <Badge variant="outline" className="w-fit text-muted-foreground">
          Datos sintéticos
        </Badge>
      )}

      {status === "none" || !cut ? (
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

          {isYield && corteId && (
            <YieldComparison cut={cut} corteId={corteId} history={history} />
          )}

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

export default function StatusPage() {
  const [selected, setSelected] = useState(0);
  const registry = REGISTRIES[selected] ?? REGISTRIES[0];

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-6 lg:max-w-3xl lg:p-8">
      <div>
        <h1 className="font-serif text-3xl text-foreground">Solvencia de Faro</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Verificable por cualquiera, sin login, directo desde el SobrecitoRegistry on-chain.
        </p>
      </div>

      {REGISTRIES.length > 1 && (
        <Tabs value={String(selected)} onValueChange={(v) => setSelected(Number(v))}>
          <TabsList>
            {REGISTRIES.map((r, i) => (
              <TabsTrigger key={r.address} value={String(i)}>
                {r.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {registry ? (
        <StatusForRegistry registry={registry} />
      ) : (
        <p className="text-sm text-muted-foreground">No hay ningún registry configurado.</p>
      )}
    </div>
  );
}
