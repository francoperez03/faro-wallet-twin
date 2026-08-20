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
      <span className="text-sm text-zinc-500">{CHAIN_LABELS[chain]}</span>
      {error ? (
        <span className="text-sm text-red-600">no se pudo leer el saldo en {CHAIN_LABELS[chain]}</span>
      ) : (
        <span className="tabular-nums text-base text-zinc-900">
          {formatUnits(balance, decimals)} {symbol}
        </span>
      )}
    </div>
  );
}
