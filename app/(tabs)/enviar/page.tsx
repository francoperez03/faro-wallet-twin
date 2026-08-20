"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { CHAINS, CHAIN_IDS, TOKENS, type ChainKey } from "@/lib/config/tokens";
import { useTokenBalances } from "@/lib/hooks/use-token-balances";
import { cn } from "@/lib/utils";

const ERC20_TRANSFER_ABI = [
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

const CHAIN_LABELS: Record<ChainKey, string> = {
  arbitrum: "Arbitrum",
  base: "Base",
  polygon: "Polygon",
};

const ADDRESS_ERROR = "Esa dirección no es válida. Revisala y probá de nuevo.";
const TX_ERROR =
  "No pudimos completar la operación. Revisá tu conexión o el saldo disponible y volvé a intentar.";

function isValidAddress(value: string): value is `0x${string}` {
  return /^0x[0-9a-fA-F]{40}$/.test(value);
}

export default function EnviarPage() {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address as `0x${string}` | undefined;
  const { chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { perChain, refetch } = useTokenBalances(walletAddress);

  const [chain, setChain] = useState<ChainKey>("arbitrum");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);

  useWaitForTransactionReceipt({
    hash,
    query: { enabled: Boolean(hash) },
  });

  const decimals = TOKENS.ARGt.decimals;
  const balanceOnChain = perChain[chain] ?? BigInt(0);

  const addressError = to.length > 0 && !isValidAddress(to) ? ADDRESS_ERROR : undefined;

  let amountError: string | undefined;
  if (amount.length > 0) {
    let amountBigInt: bigint | undefined;
    try {
      amountBigInt = parseUnits(amount, decimals);
    } catch {
      amountBigInt = undefined;
    }
    if (amountBigInt === undefined || amountBigInt <= BigInt(0)) {
      amountError = "Ingresá un monto válido.";
    } else if (amountBigInt > balanceOnChain) {
      amountError = "El monto supera tu saldo disponible en esta red.";
    }
  }

  const canSubmit = Boolean(
    !isSubmitting &&
      walletAddress &&
      isValidAddress(to) &&
      !addressError &&
      amount.length > 0 &&
      !amountError
  );

  async function onSubmit() {
    if (!canSubmit || !isValidAddress(to)) return;
    setIsSubmitting(true);
    try {
      if (chainId !== CHAIN_IDS[chain]) {
        await switchChainAsync({ chainId: CHAIN_IDS[chain] });
      }
      const txHash = await writeContractAsync({
        address: TOKENS.ARGt.addresses[chain],
        abi: ERC20_TRANSFER_ABI,
        functionName: "transfer",
        args: [to, parseUnits(amount, decimals)],
        chainId: CHAIN_IDS[chain],
      });
      setHash(txHash);
      toast.success("Transferencia enviada");
      setTo("");
      setAmount("");
      await refetch();
    } catch {
      toast.error(TX_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold text-zinc-900">Enviar</h1>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-zinc-500">Red</span>
        <div className="flex gap-2">
          {CHAINS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setChain(c)}
              className={cn(
                "min-h-11 flex-1 rounded-md border text-sm",
                chain === c
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-zinc-200 bg-white text-zinc-900"
              )}
            >
              {CHAIN_LABELS[c]}
            </button>
          ))}
        </div>
        <p className="text-sm text-zinc-500">
          Disponible: <span className="tabular-nums">{formatUnits(balanceOnChain, decimals)}</span>{" "}
          {TOKENS.ARGt.symbol}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-zinc-500">Dirección de destino</span>
        <Input
          value={to}
          onChange={(e) => setTo(e.target.value.trim())}
          placeholder="0x..."
          className="font-mono"
        />
        {addressError && <p className="text-sm text-red-600">{addressError}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-zinc-500">Monto</span>
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          placeholder="0.0"
        />
        {amountError && <p className="text-sm text-red-600">{amountError}</p>}
      </div>

      <Button
        onClick={onSubmit}
        disabled={!canSubmit}
        className="bg-blue-600 hover:bg-blue-700"
      >
        {isSubmitting ? "Enviando..." : "Enviar ARGt"}
      </Button>

      <Toaster />
    </div>
  );
}
