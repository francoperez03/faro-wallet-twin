"use client";

import { useAccount, useReadContract } from "wagmi";
import { arbitrum } from "viem/chains";
import { VAULT_ARGT_PRIME } from "@/lib/config/tokens";

// ponytail: slice ERC-4626 mínimo que usa la app (lecturas, deposit/withdraw/redeem y sus eventos).
export const vaultAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "convertToAssets",
    stateMutability: "view",
    inputs: [{ name: "shares", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "maxWithdraw",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "deposit",
    stateMutability: "nonpayable",
    inputs: [
      { name: "assets", type: "uint256" },
      { name: "receiver", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [
      { name: "assets", type: "uint256" },
      { name: "receiver", type: "address" },
      { name: "owner", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "redeem",
    stateMutability: "nonpayable",
    inputs: [
      { name: "shares", type: "uint256" },
      { name: "receiver", type: "address" },
      { name: "owner", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "Deposit",
    inputs: [
      { name: "sender", type: "address", indexed: true },
      { name: "owner", type: "address", indexed: true },
      { name: "assets", type: "uint256", indexed: false },
      { name: "shares", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Withdraw",
    inputs: [
      { name: "sender", type: "address", indexed: true },
      { name: "receiver", type: "address", indexed: true },
      { name: "owner", type: "address", indexed: true },
      { name: "assets", type: "uint256", indexed: false },
      { name: "shares", type: "uint256", indexed: false },
    ],
  },
] as const;

/** Posición del user en el vault ARGt Prime: shares (balanceOf) valuadas en ARGt (convertToAssets). */
export function useVaultPosition(addressOverride?: `0x${string}`) {
  const { address: connected } = useAccount();
  const address = addressOverride ?? connected;

  const {
    data: shares,
    isLoading: isLoadingShares,
    refetch: refetchShares,
  } = useReadContract({
    address: VAULT_ARGT_PRIME.address,
    abi: vaultAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: arbitrum.id,
    query: { enabled: Boolean(address) },
  });

  const {
    data: valueInArgt,
    isLoading: isLoadingValue,
    refetch: refetchValue,
  } = useReadContract({
    address: VAULT_ARGT_PRIME.address,
    abi: vaultAbi,
    functionName: "convertToAssets",
    args: shares !== undefined ? [shares] : undefined,
    chainId: arbitrum.id,
    query: { enabled: shares !== undefined },
  });

  return {
    shares: shares ?? BigInt(0),
    valueInArgt: valueInArgt ?? BigInt(0),
    isLoading: isLoadingShares || isLoadingValue,
    refetch: () => {
      refetchShares();
      refetchValue();
    },
  };
}
