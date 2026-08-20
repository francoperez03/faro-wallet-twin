"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-6 lg:max-w-xl lg:p-8">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          // FARO / ENVIAR
        </p>
        <h1 className="font-serif text-3xl text-foreground">Enviar</h1>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Red</span>
        <div className="flex gap-2">
          {CHAINS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setChain(c)}
              className={cn(
                "min-h-11 flex-1 rounded-md border text-sm",
                chain === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground"
              )}
            >
              {CHAIN_LABELS[c]}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Disponible: <span className="tabular-nums">{formatUnits(balanceOnChain, decimals)}</span>{" "}
          {TOKENS.ARGt.symbol}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Dirección de destino</span>
        <Input
          value={to}
          onChange={(e) => setTo(e.target.value.trim())}
          placeholder="0x..."
          className="font-mono"
        />
        {addressError && <p className="text-sm text-destructive">{addressError}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Monto</span>
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          placeholder="0.0"
        />
        {amountError && <p className="text-sm text-destructive">{amountError}</p>}
      </div>

      <Button onClick={onSubmit} disabled={!canSubmit}>
        {isSubmitting ? "Enviando..." : "Enviar ARGt"}
      </Button>

    </div>
  );
}
