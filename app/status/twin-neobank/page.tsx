"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CutHistory } from "@/components/status/cut-history";
import { DeclaredMask } from "@/components/status/declared-mask";
import { REGISTRIES } from "@/lib/config/tokens";
import { useLatestCut, useCutHistory } from "@/lib/sobrecito/use-registry";

const SYNTHETIC_LABEL_RE = /fixture|sint(é|e)tic/i;

function StatusForRegistry({ registry }: { registry: (typeof REGISTRIES)[number] }) {
  const { cut, hoursAgo, status, isLoading } = useLatestCut(registry);
  const { history, isLoading: isLoadingHistory } = useCutHistory(registry);
  const isSynthetic = SYNTHETIC_LABEL_RE.test(registry.label);

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  return (
    <div className="flex flex-col gap-6">
      {isSynthetic && (
        <Badge variant="outline" className="w-fit text-zinc-500">
          Datos sintéticos
        </Badge>
      )}

      {status === "none" || !cut ? (
        <p className="text-sm text-zinc-500">Todavía no hay un corte publicado para este registry.</p>
      ) : (
        <>
          <div className="rounded-lg bg-zinc-100 p-4">
            <p className="text-sm text-zinc-500">Frescura</p>
            <p className="mt-1 text-lg font-semibold text-zinc-900">
              Último corte hace {Math.max(0, Math.round(hoursAgo ?? 0))} h
              {status === "amber" && <span className="ml-2 text-sm font-normal text-[#D97706]">vencido</span>}
            </p>
          </div>

          <div className="rounded-lg bg-zinc-100 p-4">
            <p className="text-sm text-zinc-500">Veredictos</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {cut.verdicts.map((v, i) => (
                <Badge key={i} className={v ? "border-transparent bg-[#16A34A] text-white" : "border-transparent bg-[#DC2626] text-white"}>
                  Token {i}: {v ? "cubierto" : "no cubierto"}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-zinc-100 p-4">
            <p className="text-sm text-zinc-500">Cobertura por bucket</p>
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
        <p className="mb-2 text-sm text-zinc-500">Historial de cortes</p>
        {isLoadingHistory ? <Skeleton className="h-24 w-full" /> : <CutHistory history={history} chainId={registry.chainId} />}
      </div>
    </div>
  );
}

export default function StatusPage() {
  const [selected, setSelected] = useState(0);
  const registry = REGISTRIES[selected] ?? REGISTRIES[0];

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 p-6">
      <div>
        <h1 className="text-[20px] font-semibold text-zinc-900">Solvencia de Faro</h1>
        <p className="mt-1 text-sm text-zinc-500">
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
        <p className="text-sm text-zinc-500">No hay ningún registry configurado.</p>
      )}
    </div>
  );
}
