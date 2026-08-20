"use client";

import Link from "next/link";
import { useAccount, useReadContracts } from "wagmi";
import { base, polygon } from "viem/chains";
import { formatUnits } from "viem";
import { TOKENS, VAULT_ARGT_PRIME } from "@/lib/config/tokens";
import { useVaultPosition } from "@/lib/hooks/use-vault-position";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const erc20BalanceAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

const MORPHO_VAULT_URL = `https://app.morpho.org/arbitrum/vault/${VAULT_ARGT_PRIME.address}`;

export function VaultCard() {
  const { address } = useAccount();
  const { shares, valueInArgt, isLoading } = useVaultPosition();

  // Lectura local (D-06/D-07): si el user tiene ARGt en Base/Polygon, sugerir bridgear.
  // No se reusa hook de 01-02 (archivos disjuntos entre planes en paralelo).
  const { data: otherChainBalances } = useReadContracts({
    contracts: address
      ? [
          {
            address: TOKENS.ARGt.addresses.base,
            abi: erc20BalanceAbi,
            functionName: "balanceOf",
            args: [address],
            chainId: base.id,
          },
          {
            address: TOKENS.ARGt.addresses.polygon,
            abi: erc20BalanceAbi,
            functionName: "balanceOf",
            args: [address],
            chainId: polygon.id,
          },
        ]
      : [],
    query: { enabled: Boolean(address) },
  });

  const hasArgtElsewhere = (otherChainBalances ?? []).some(
    (result) => result.status === "success" && (result.result as bigint) > BigInt(0)
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col gap-2 p-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-40" />
        </CardContent>
      </Card>
    );
  }

  if (shares === BigInt(0)) {
    return (
      <Card>
        <CardContent className="flex flex-col gap-2 p-4">
          <h2 className="text-lg font-semibold text-foreground">
            Todavía no tenés ARGt en la bóveda
          </h2>
          <p className="text-sm text-muted-foreground">Depositá ARGt y empezá a generar rendimiento.</p>
          {hasArgtElsewhere && (
            <p className="text-sm text-muted-foreground">
              Tenés ARGt en otra red. Bridgeá a Arbitrum para depositar.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-2 p-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Tu posición</p>
        <p className="tabular-nums font-serif text-2xl text-gold">
          {formatUnits(valueInArgt, TOKENS.ARGt.decimals)} ARGt
        </p>
        <Link href={MORPHO_VAULT_URL} target="_blank" className="text-sm text-gold">
          Ver en Morpho
        </Link>
        {hasArgtElsewhere && (
          <p className="text-sm text-muted-foreground">
            Tenés ARGt en otra red. Bridgeá a Arbitrum para depositar más.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
