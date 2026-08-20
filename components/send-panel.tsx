"use client";

import { useEffect, useState } from "react";
import { useAccount, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { TxButton, type TxButtonStage } from "@/components/tx-button";
import { CHAINS, CHAIN_IDS, CHAIN_LABELS, TOKENS, type ChainKey, type TokenKey } from "@/lib/config/tokens";
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

const ADDRESS_ERROR = "Esa dirección no es válida. Revisala y probá de nuevo.";
const TX_ERROR =
  "No pudimos completar la operación. Revisá tu conexión o el saldo disponible y volvé a intentar.";

function isValidAddress(value: string): value is `0x${string}` {
  return /^0x[0-9a-fA-F]{40}$/.test(value);
}

export function SendPanel({
  walletAddress,
  token = "ARGt",
  perChain,
  refetch,
  initialChain,
  onDone,
}: {
  walletAddress: `0x${string}` | undefined;
  token?: TokenKey;
  perChain: Record<ChainKey, bigint>;
  refetch: () => void | Promise<unknown>;
  initialChain?: ChainKey;
  onDone?: () => void;
}) {
  const { chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  const [chain, setChain] = useState<ChainKey>(initialChain ?? CHAINS[0]);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [stage, setStage] = useState<TxButtonStage>("idle");
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);

  useEffect(() => {
    if (initialChain) setChain(initialChain);
  }, [initialChain]);

  const receipt = useWaitForTransactionReceipt({
    hash,
    query: { enabled: Boolean(hash) },
  });

  useEffect(() => {
    if (!hash) return;
    if (receipt.isSuccess) {
      setStage("success");
      toast.success("Transferencia enviada");
      setTo("");
      setAmount("");
      void refetch();
      onDone?.();
    } else if (receipt.isError) {
      setStage("error");
      toast.error(TX_ERROR);
    } else if (receipt.isLoading) {
      setStage("pending");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, receipt.isSuccess, receipt.isError, receipt.isLoading]);

  const decimals = TOKENS[token].decimals;
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

  const busy = stage === "confirming" || stage === "pending";
  const canSubmit = Boolean(
    !busy &&
      walletAddress &&
      isValidAddress(to) &&
      !addressError &&
      amount.length > 0 &&
      !amountError
  );

  async function onSubmit() {
    if (!canSubmit || !isValidAddress(to)) return;
    setStage("confirming");
    try {
      if (chainId !== CHAIN_IDS[chain]) {
        await switchChainAsync({ chainId: CHAIN_IDS[chain] });
      }
      const txHash = await writeContractAsync({
        address: TOKENS[token].addresses[chain],
        abi: ERC20_TRANSFER_ABI,
        functionName: "transfer",
        args: [to, parseUnits(amount, decimals)],
        chainId: CHAIN_IDS[chain],
      });
      setHash(txHash);
      setStage("pending");
    } catch {
      setStage("error");
      toast.error(TX_ERROR);
    }
  }

  return (
    <div className="flex flex-col gap-4 pt-1">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Red</span>
        <div className="flex gap-2">
          {CHAINS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setChain(c)}
              disabled={busy}
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
          {TOKENS[token].symbol}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Dirección de destino</span>
        <Input
          value={to}
          onChange={(e) => setTo(e.target.value.trim())}
          placeholder="0x..."
          className="font-mono"
          disabled={busy}
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
          disabled={busy}
        />
        {amountError && <p className="text-sm text-destructive">{amountError}</p>}
      </div>

      <TxButton
        label={`Enviar ${TOKENS[token].symbol}`}
        stage={stage}
        disabled={!canSubmit}
        onClick={onSubmit}
        onSettled={() => setStage("idle")}
      />
    </div>
  );
}
