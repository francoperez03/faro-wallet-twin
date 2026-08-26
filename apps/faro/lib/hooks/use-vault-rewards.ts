"use client";

import { useQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";
import { getPublicClient } from "wagmi/actions";
import { arbitrum } from "viem/chains";
import { VAULT_ARGT_PRIME } from "@/lib/config/tokens";
import { vaultAbi } from "@/lib/hooks/use-vault-position";

// ~0,25 s por bloque en Arbitrum.
const BLOCKS_PER_DAY = BigInt(345_600);
// ponytail: 30 días de eventos alcanzan para la demo; arb1 acepta el rango en una llamada.
const PRINCIPAL_WINDOW = BLOCKS_PER_DAY * BigInt(30);
const APY_WINDOW_DAYS = 7;
const ONE = BigInt(10) ** BigInt(18);

export type VaultRewards = {
  /** Depositado neto por el usuario (Σ Deposit.assets − Σ Withdraw.assets), en ARGt base units. */
  principal: bigint;
  /** APY anualizado del precio de la share en los últimos 7 días, o null si el RPC no sirve históricos. */
  apy: number | null;
  /** convertToAssets(1 ARGt) actual. */
  sharePrice: bigint;
};

/** Principal y APY del vault ARGt Prime leídos on-chain (eventos + dos convertToAssets). */
export function useVaultRewards(address: `0x${string}` | undefined) {
  const config = useConfig();

  return useQuery({
    queryKey: ["vault-rewards", address],
    enabled: Boolean(address),
    queryFn: async (): Promise<VaultRewards> => {
      const client = getPublicClient(config, { chainId: arbitrum.id });
      if (!client || !address)
        return { principal: BigInt(0), apy: null, sharePrice: ONE };

      const latest = await client.getBlockNumber();
      const fromBlock =
        latest > PRINCIPAL_WINDOW ? latest - PRINCIPAL_WINDOW : BigInt(0);
      const common = {
        address: VAULT_ARGT_PRIME.address,
        abi: vaultAbi,
        fromBlock,
        toBlock: "latest" as const,
      };

      const [deposits, withdrawals, sharePrice] = await Promise.all([
        client.getContractEvents({
          ...common,
          eventName: "Deposit",
          args: { owner: address },
        }),
        client.getContractEvents({
          ...common,
          eventName: "Withdraw",
          args: { owner: address },
        }),
        client.readContract({
          address: VAULT_ARGT_PRIME.address,
          abi: vaultAbi,
          functionName: "convertToAssets",
          args: [ONE],
        }),
      ]);

      const sum = (logs: { args: { assets?: bigint } }[]) =>
        logs.reduce((acc, l) => acc + (l.args.assets ?? BigInt(0)), BigInt(0));
      const principal = sum(deposits) - sum(withdrawals);

      let apy: number | null = null;
      try {
        const then = await client.readContract({
          address: VAULT_ARGT_PRIME.address,
          abi: vaultAbi,
          functionName: "convertToAssets",
          args: [ONE],
          blockNumber: latest - BLOCKS_PER_DAY * BigInt(APY_WINDOW_DAYS),
        });
        apy = (Number(sharePrice) / Number(then) - 1) * (365 / APY_WINDOW_DAYS);
      } catch {
        // RPC sin eth_call histórico: el panel oculta el APY.
      }

      return {
        principal: principal > BigInt(0) ? principal : BigInt(0),
        apy,
        sharePrice,
      };
    },
  });
}
