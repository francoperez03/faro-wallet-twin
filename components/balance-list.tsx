import { CHAINS, type ChainKey } from "@/lib/config/tokens";
import { TokenRow } from "@/components/token-row";

export function BalanceList({
  perChain,
  errors,
  decimals,
  symbol,
}: {
  perChain: Record<ChainKey, bigint>;
  errors: Partial<Record<ChainKey, boolean>>;
  decimals: number;
  symbol: string;
}) {
  return (
    <div className="rounded-lg bg-zinc-100 px-4">
      {CHAINS.map((chain) => (
        <TokenRow
          key={chain}
          chain={chain}
          balance={perChain[chain] ?? BigInt(0)}
          decimals={decimals}
          symbol={symbol}
          error={errors[chain]}
        />
      ))}
    </div>
  );
}
