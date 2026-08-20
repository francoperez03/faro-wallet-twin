"use client";

import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { arbitrum } from "viem/chains";
import { formatUnits, type PublicClient } from "viem";
import { Badge } from "@/components/ui/badge";
import { TOKENS, VAULT_ARGT_PRIME } from "@/lib/config/tokens";
import { OMNIBUS_VAULT_ADDRESS } from "@/lib/config/cuenta";
import { vaultAbi } from "@/lib/hooks/use-vault-position";
import { withRpcFallback } from "@/lib/sobrecito/rpc-fallback";
import type { Cut } from "@/lib/sobrecito/registry-abi";
import type { CutHistoryEntry } from "@/lib/sobrecito/use-registry";

// Escala de FaroYieldRegistry: cR publica el delta en las mismas unidades que el circuito
// (BAL_SCALE 1e10, 8 decimales) — ver "Diseño" del plan de yield. El vault ARGt tiene 18
// decimales, así que el delta on-chain (wei) se floorea a esta escala antes de comparar.
const BAL_SCALE = BigInt(10) ** BigInt(10);

async function vaultAssetsAt(publicClient: PublicClient, blockNumber: bigint) {
  const shares = await publicClient.readContract({
    address: VAULT_ARGT_PRIME.address,
    abi: vaultAbi,
    functionName: "balanceOf",
    args: [OMNIBUS_VAULT_ADDRESS],
    blockNumber,
  });
  return publicClient.readContract({
    address: VAULT_ARGT_PRIME.address,
    abi: vaultAbi,
    functionName: "convertToAssets",
    args: [shares],
    blockNumber,
  });
}

type YieldCutRow = { corte_id: string; block_b1: string | null; block_b2: string | null; value_b1: string | null; value_b2: string | null };

/** Fallback (b): dato informado por el operador al momento del corte (/api/status/yield-cuts),
 * usado cuando el recompute on-chain en vivo falla (nodo de archivo no disponible). */
async function fetchOperatorReported(corteId: `0x${string}`): Promise<bigint | null> {
  const res = await fetch("/api/status/yield-cuts");
  if (!res.ok) return null;
  const rows: YieldCutRow[] = await res.json();
  const row = rows.find((r) => r.corte_id === corteId);
  if (!row?.value_b1 || !row.value_b2) return null;
  return (BigInt(row.value_b2) - BigInt(row.value_b1)) / BAL_SCALE;
}

/** Semáforo de la visión pública: Δ vault recomputado on-chain vs Σ rewards probado (cR). */
export function YieldComparison({
  cut,
  corteId,
  history,
}: {
  cut: Cut;
  corteId: `0x${string}`;
  history: CutHistoryEntry[];
}) {
  const publicClient = usePublicClient({ chainId: arbitrum.id });

  const sorted = [...history].sort((a, b) => Number(a.publishedAt - b.publishedAt));
  const idx = sorted.findIndex((h) => h.corteId === corteId);
  const previous = idx > 0 ? sorted[idx - 1] : undefined;
  const b1 = previous?.blockB;
  const b2 = cut.blockB;

  const { data, isLoading, error } = useQuery({
    queryKey: ["yield-delta", corteId, b1?.toString(), b2.toString()],
    enabled: b1 !== undefined,
    queryFn: async (): Promise<{ value: bigint; source: "onchain" | "operator" }> => {
      // (a) intento en vivo on-chain en B1/B2, con reintento vía RPC de fallback.
      try {
        const [assetsAtB1, assetsAtB2] = await withRpcFallback(publicClient, (client) =>
          Promise.all([vaultAssetsAt(client, b1!), vaultAssetsAt(client, b2)]),
        );
        return { value: (assetsAtB2 - assetsAtB1) / BAL_SCALE, source: "onchain" };
      } catch {
        // (b) sin nodo de archivo: dato informado por el operador al momento del corte.
        const reported = await fetchOperatorReported(corteId);
        if (reported === null) throw new Error("sin recompute on-chain ni dato informado");
        return { value: reported, source: "operator" };
      }
    },
  });

  if (b1 === undefined) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Rendimiento de Faro: el yield entra y sale completo
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Todavía no hay un corte anterior para recomputar el período.
        </p>
      </div>
    );
  }

  const decimals = TOKENS.ARGt.decimals;
  const proven = BigInt(cut.cR);
  const matches = data !== undefined ? data.value === proven : null;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        Rendimiento de Faro: el yield entra y sale completo
      </p>
      {isLoading ? (
        <p className="mt-2 text-sm text-muted-foreground">Recomputando...</p>
      ) : error || data === undefined ? (
        // (c) ni recompute on-chain ni dato informado disponibles.
        <p className="mt-2 text-sm text-muted-foreground">No se pudo recomputar on-chain.</p>
      ) : (
        <>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary">Δ vault: {formatUnits(data.value * BAL_SCALE, decimals)} ARGt</Badge>
            <Badge variant="secondary">Σ probado: {formatUnits(proven * BAL_SCALE, decimals)} ARGt</Badge>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge
              className={
                data.source === "onchain" && matches
                  ? "border-transparent bg-green-dim text-green"
                  : data.source === "onchain"
                    ? "border-transparent bg-destructive text-white"
                    : "border-transparent bg-amber/10 text-amber"
              }
            >
              {matches ? "Coincide" : "No coincide"}
            </Badge>
            {data.source === "onchain" ? (
              <span className="font-mono text-[11px] text-muted-foreground">Recomputado on-chain</span>
            ) : (
              <span className="font-mono text-[11px] text-amber">
                Informado por el operador · recomputable con un nodo de archivo
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
