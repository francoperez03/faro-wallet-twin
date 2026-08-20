import { CHAIN_IDS, EXPLORER_TX_URL, type ChainKey } from "@/lib/config/tokens";
import type { CutHistoryEntry } from "@/lib/sobrecito/use-registry";

function explorerTxUrl(chainId: number, txHash: string): string | null {
  const key = (Object.keys(CHAIN_IDS) as ChainKey[]).find((k) => CHAIN_IDS[k] === chainId);
  return key ? `${EXPLORER_TX_URL[key]}${txHash}` : null;
}

export function CutHistory({ history, chainId }: { history: CutHistoryEntry[]; chainId: number }) {
  if (history.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay cortes publicados.</p>;
  }

  return (
    <ul className="flex flex-col gap-2 lg:grid lg:grid-cols-2 lg:gap-4">
      {[...history].reverse().map((entry) => {
        const txUrl = explorerTxUrl(chainId, entry.transactionHash);
        const publishedAt = new Date(Number(entry.publishedAt) * 1000);
        return (
          <li key={entry.corteId} className="rounded-lg border border-border bg-card p-3 text-sm">
            <p className="font-mono text-xs text-muted-foreground">{entry.corteId}</p>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-foreground/80">{publishedAt.toLocaleString("es-AR")}</span>
              {txUrl && (
                <a href={txUrl} target="_blank" rel="noopener noreferrer" className="text-gold">
                  Ver tx
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
