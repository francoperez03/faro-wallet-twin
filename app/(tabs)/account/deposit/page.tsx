"use client";

import { PAGE_WIDTH } from "@/lib/config/app";
import { cn } from "@/lib/utils";

import { useState } from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CHAIN_IDS,
  CHAIN_LABELS,
  EXPLORER_TX_URL,
  TOKENS,
} from "@/lib/config/tokens";
import { DEPOSIT_CHAIN, OMNIBUS_VAULT_ADDRESS } from "@/lib/config/cuenta";
import { useTokenBalances } from "@/lib/hooks/use-token-balances";

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

const TX_ERROR =
  "No pudimos completar la operación. Revisá tu conexión o el saldo disponible y volvé a intentar.";
const OTHER_CHAINS = ["base", "polygon"] as const;
const POLL_INTERVAL_MS = 5000;
const POLL_MAX_ATTEMPTS = 12;

type Status = "idle" | "sending" | "confirming" | "acreditado" | "timeout";

export default function PasarACuentaPage() {
  const { user, getAccessToken } = usePrivy();
  const walletAddress = user?.wallet?.address as `0x${string}` | undefined;
  const { chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { perChain, refetch } = useTokenBalances(walletAddress);

  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const decimals = TOKENS.ARGt.decimals;
  const balanceOnArbitrum = perChain[DEPOSIT_CHAIN] ?? BigInt(0);

  let amountBigInt: bigint | undefined;
  let amountError: string | undefined;
  if (amount.length > 0) {
    try {
      amountBigInt = parseUnits(amount, decimals);
    } catch {
      amountBigInt = undefined;
    }
    if (amountBigInt === undefined || amountBigInt <= BigInt(0)) {
      amountError = "Ingresá un monto válido.";
    } else if (amountBigInt > balanceOnArbitrum) {
      amountError = "El monto supera tu saldo disponible en Arbitrum.";
    }
  }

  const bridgeSuggestChain = OTHER_CHAINS.find(
    (c) => (perChain[c] ?? BigInt(0)) > BigInt(0),
  );
  const showBridgeSuggestion = Boolean(
    amountBigInt && amountBigInt > balanceOnArbitrum && bridgeSuggestChain,
  );

  const isBusy = status === "sending" || status === "confirming";
  const canSubmit = Boolean(
    !isBusy && walletAddress && amount.length > 0 && !amountError,
  );

  async function pollForCredit(hash: `0x${string}`) {
    setStatus("confirming");
    const token = await getAccessToken();
    for (let attempt = 0; attempt < POLL_MAX_ATTEMPTS; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      try {
        const res = await fetch("/api/account/sync-deposits", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const movements: { txHash?: string }[] = data.myNewMovements ?? [];
          const found = movements.some(
            (m) => m.txHash?.toLowerCase() === hash.toLowerCase(),
          );
          if (found) {
            setStatus("acreditado");
            return;
          }
        }
      } catch {
        // red intermitente, seguimos intentando en el próximo tick
      }
    }
    setStatus("timeout");
  }

  async function onSubmit() {
    if (!canSubmit || !amountBigInt) return;
    setStatus("sending");
    try {
      if (chainId !== CHAIN_IDS[DEPOSIT_CHAIN]) {
        await switchChainAsync({ chainId: CHAIN_IDS[DEPOSIT_CHAIN] });
      }
      const hash = await writeContractAsync({
        address: TOKENS.ARGt.addresses[DEPOSIT_CHAIN],
        abi: ERC20_TRANSFER_ABI,
        functionName: "transfer",
        args: [OMNIBUS_VAULT_ADDRESS, amountBigInt],
        chainId: CHAIN_IDS[DEPOSIT_CHAIN],
      });
      setTxHash(hash);
      setAmount("");
      await refetch();
      await pollForCredit(hash);
    } catch {
      toast.error(TX_ERROR);
      setStatus("idle");
    }
  }

  return (
    <div className={cn(PAGE_WIDTH, "flex flex-col gap-6 p-6 lg:p-8")}>
      <div>
        <h1 className="font-serif text-3xl text-foreground">Pasar a Cuenta</h1>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">
          Monto ({CHAIN_LABELS[DEPOSIT_CHAIN]})
        </span>
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          placeholder="0.0"
          disabled={isBusy}
        />
        <p className="text-sm text-muted-foreground">
          Disponible en {CHAIN_LABELS[DEPOSIT_CHAIN]}:{" "}
          <span className="tabular-nums">
            {formatUnits(balanceOnArbitrum, decimals)}
          </span>{" "}
          {TOKENS.ARGt.symbol}
        </p>
        {amountError && (
          <p className="text-sm text-destructive">{amountError}</p>
        )}
        {showBridgeSuggestion && bridgeSuggestChain && (
          <p className="text-sm text-muted-foreground">
            No te alcanza en {CHAIN_LABELS[DEPOSIT_CHAIN]}, pero tenés ARGt en{" "}
            {CHAIN_LABELS[bridgeSuggestChain]}.{" "}
            <Link href="/bridge" className="text-gold">
              Bridgealo a {CHAIN_LABELS[DEPOSIT_CHAIN]} primero
            </Link>
          </p>
        )}
      </div>

      <Button onClick={onSubmit} disabled={!canSubmit}>
        {status === "sending" ? "Enviando..." : "Pasar a Cuenta"}
      </Button>

      {status === "confirming" && (
        <p className="text-sm text-muted-foreground">Confirmando...</p>
      )}
      {status === "acreditado" && (
        <div className="rounded-md border border-border bg-card p-4">
          <p className="text-sm font-medium text-gold">Acreditado</p>
          {txHash && (
            <a
              href={`${EXPLORER_TX_URL[DEPOSIT_CHAIN]}${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-sm text-gold"
            >
              Ver en el explorer
            </a>
          )}
        </div>
      )}
      {status === "timeout" && (
        <p className="text-sm text-muted-foreground">
          Puede tardar unos minutos, va a aparecer en tu Cuenta.
        </p>
      )}
    </div>
  );
}
