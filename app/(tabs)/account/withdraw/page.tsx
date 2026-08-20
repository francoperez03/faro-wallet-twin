"use client";

import { useCallback, useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { formatUnits, parseUnits } from "viem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CHAINS, CHAIN_LABELS, EXPLORER_TX_URL, TOKENS, type ChainKey } from "@/lib/config/tokens";
import { DAILY_WITHDRAW_LIMIT_BASE_UNITS } from "@/lib/config/cuenta";
import { cn } from "@/lib/utils";

const ERROR_COPY =
  "No pudimos completar la operación. Revisá tu conexión o el saldo disponible y volvé a intentar.";

type Status = "idle" | "processing" | "sent" | "failed";

export default function RetirarPage() {
  const { ready, authenticated, getAccessToken } = usePrivy();
  const [argtBalance, setArgtBalance] = useState<bigint | null>(null);
  const [chain, setChain] = useState<ChainKey>("arbitrum");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [failReason, setFailReason] = useState<string | null>(null);

  const loadBalance = useCallback(async () => {
    const token = await getAccessToken();
    const res = await fetch("/api/account/account", { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      setArgtBalance(BigInt(data.argtBalance));
    }
  }, [getAccessToken]);

  useEffect(() => {
    if (ready && authenticated) loadBalance();
  }, [ready, authenticated, loadBalance]);

  const decimals = TOKENS.ARGt.decimals;

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
    } else if (argtBalance != null && amountBigInt > argtBalance) {
      amountError = "El monto supera tu saldo en la Cuenta.";
      // ponytail: solo chequea el tope diario fijo (1000 ARGt), no el consumo de las
      // últimas 24h del usuario (eso requeriría un endpoint nuevo). El servidor sigue
      // siendo la fuente de verdad del límite real (D-14); si lo excede ahí, vuelve
      // como status:"failed" con reason y se muestra igual.
    } else if (amountBigInt > DAILY_WITHDRAW_LIMIT_BASE_UNITS) {
      amountError = `El límite diario es ${formatUnits(DAILY_WITHDRAW_LIMIT_BASE_UNITS, decimals)} ${TOKENS.ARGt.symbol}.`;
    }
  }

  const isBusy = status === "processing";
  const canSubmit = Boolean(!isBusy && amount.length > 0 && !amountError && argtBalance != null);

  async function onSubmit() {
    if (!canSubmit || !amountBigInt) return;
    setStatus("processing");
    setTxHash(null);
    setFailReason(null);
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/account/withdraw", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountBigInt.toString(), chain }),
      });
      const data = await res.json();
      if (res.ok && data.status === "sent") {
        setStatus("sent");
        setTxHash(data.txHash);
        setAmount("");
        await loadBalance();
      } else {
        setStatus("failed");
        setFailReason(data.reason ?? ERROR_COPY);
      }
    } catch {
      setStatus("failed");
      setFailReason(ERROR_COPY);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-6 lg:max-w-xl lg:p-8">
      <div>
        <h1 className="font-serif text-3xl text-foreground">Retirar</h1>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Red de destino</span>
        <div className="flex gap-2">
          {CHAINS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setChain(c)}
              disabled={isBusy}
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
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Monto</span>
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          placeholder="0.0"
          disabled={isBusy}
        />
        <p className="text-sm text-muted-foreground">
          Saldo en tu Cuenta:{" "}
          <span className="tabular-nums">
            {argtBalance != null ? formatUnits(argtBalance, decimals) : "..."}
          </span>{" "}
          {TOKENS.ARGt.symbol}
        </p>
        {amountError && <p className="text-sm text-destructive">{amountError}</p>}
      </div>

      <Button onClick={onSubmit} disabled={!canSubmit}>
        {status === "processing" ? "Procesando..." : "Retirar"}
      </Button>

      {status === "sent" && txHash && (
        <div className="rounded-md border border-border bg-card p-4">
          <p className="text-sm font-medium text-gold">Enviado</p>
          <a
            href={`${EXPLORER_TX_URL[chain]}${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block text-sm text-gold"
          >
            Ver en el explorer
          </a>
        </div>
      )}
      {status === "failed" && (
        <p className="text-sm text-destructive">{failReason ?? ERROR_COPY}</p>
      )}
    </div>
  );
}
