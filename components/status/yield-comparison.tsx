"use client";

import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { arbitrum } from "viem/chains";
import { formatUnits } from "viem";
import { Badge } from "@/components/ui/badge";
import { TOKENS, VAULT_ARGT_PRIME } from "@/lib/config/tokens";
import { OMNIBUS_VAULT_ADDRESS } from "@/lib/config/cuenta";
import { vaultAbi } from "@/lib/hooks/use-vault-position";
import type { Cut } from "@/lib/sobrecito/registry-abi";
import type { CutHistoryEntry } from "@/lib/sobrecito/use-registry";

// Escala de FaroYieldRegistry: cR publica el delta en las mismas unidades que el circuito
// (BAL_SCALE 1e10, 8 decimales) — ver "Diseño" del plan de yield. El vault ARGt tiene 18
// decimales, así que el delta on-chain (wei) se floorea a esta escala antes de comparar.
const BAL_SCALE = BigInt(10) ** BigInt(10);

async function vaultAssetsAt(
  publicClient: NonNullable<ReturnType<typeof usePublicClient>>,
  blockNumber: bigint,
) {
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
    queryKey: ["yield-delta", b1?.toString(), b2.toString()],
    enabled: Boolean(publicClient && b1 !== undefined),
    queryFn: async () => {
      const [assetsAtB1, assetsAtB2] = await Promise.all([
        vaultAssetsAt(publicClient!, b1!),
        vaultAssetsAt(publicClient!, b2),
      ]);
      return (assetsAtB2 - assetsAtB1) / BAL_SCALE;
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
  const matches = data !== undefined ? data === proven : null;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        Rendimiento de Faro: el yield entra y sale completo
      </p>
      {isLoading ? (
        <p className="mt-2 text-sm text-muted-foreground">Recomputando...</p>
      ) : error || data === undefined ? (
        <p className="mt-2 text-sm text-muted-foreground">No se pudo recomputar on-chain.</p>
      ) : (
        <>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary">Δ vault: {formatUnits(data * BAL_SCALE, decimals)} ARGt</Badge>
            <Badge variant="secondary">Σ probado: {formatUnits(proven * BAL_SCALE, decimals)} ARGt</Badge>
          </div>
          <Badge
            className={
              matches
                ? "mt-2 border-transparent bg-green-dim text-green"
                : "mt-2 border-transparent bg-destructive text-white"
            }
          >
            {matches ? "Coincide" : "No coincide"}
          </Badge>
        </>
      )}
    </div>
  );
}
