import { formatUnits } from "viem";
import type { ChainKey } from "@/lib/config/tokens";

const CHAIN_LABELS: Record<ChainKey, string> = {
  arbitrum: "Arbitrum",
  base: "Base",
  polygon: "Polygon",
};

export function TokenRow({
  chain,
  balance,
  decimals,
  symbol,
  error,
}: {
  chain: ChainKey;
  balance: bigint;
  decimals: number;
  symbol: string;
  error?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {CHAIN_LABELS[chain]}
      </span>
      {error ? (
        <span className="text-sm text-destructive">no se pudo leer el saldo en {CHAIN_LABELS[chain]}</span>
      ) : (
        <span className="tabular-nums text-base text-foreground">
          {formatUnits(balance, decimals)} {symbol}
        </span>
      )}
    </div>
  );
}
