"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useReadContract, useSwitchChain, useWriteContract } from "wagmi";
import { arbitrum } from "viem/chains";
import { formatUnits, parseUnits } from "viem";
import { toast } from "sonner";
import { TOKENS, CHAIN_IDS } from "@/lib/config/tokens";
import { DEPOSIT_CHAIN, OMNIBUS_VAULT_ADDRESS } from "@/lib/config/cuenta";
import { vaultAbi } from "@/lib/hooks/use-vault-position";
import { VAULT_ARGT_PRIME } from "@/lib/config/tokens";
import { useTokenBalances } from "@/lib/hooks/use-token-balances";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRevealAnimation } from "@/lib/hooks/use-reveal-animation";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

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

const ERROR_COPY =
  "No pudimos completar la operación. Revisá tu conexión o el saldo disponible y volvé a intentar.";
const POLL_INTERVAL_MS = 5000;
const POLL_MAX_ATTEMPTS = 12;

type AccountData = { argtBalance: bigint; interestAccrued: bigint };
type RewardsAction = "depositar" | "retirar";

const NONE = "none";
const TAB_TRIGGER =
  "min-h-11 flex-1 gap-1.5 rounded-md text-sm font-semibold text-muted-foreground data-[state=active]:bg-gold-dim data-[state=active]:text-gold";
type DepositStatus = "idle" | "sending" | "confirming" | "acreditado" | "timeout";

export function RewardsPanel() {
  const { getAccessToken } = usePrivy();
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { perChain } = useTokenBalances(address);

  const [account, setAccount] = useState<AccountData | null>(null);
  const [action, setAction] = useState<RewardsAction | null>(null);
  const actionRef = useRevealAnimation<HTMLDivElement>(action !== null);
  const [apy, setApy] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Posición del pool omnibus: dato público informativo (convertToAssets es lectura pública,
  // no expone balances individuales), mismo patrón que use-vault-position.
  const { data: omnibusValue } = useReadContract({
    address: VAULT_ARGT_PRIME.address,
    abi: vaultAbi,
    functionName: "convertToAssets",
    args: [BigInt(1) * BigInt(10) ** BigInt(TOKENS.ARGt.decimals)],
    chainId: arbitrum.id,
  });

  const loadAccount = useCallback(async () => {
    const token = await getAccessToken();
    const [accountRes, rateRes] = await Promise.all([
      fetch("/api/account/account", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("/api/account/rate"),
    ]);
    if (accountRes.ok) {
      const data = await accountRes.json();
      setAccount({ argtBalance: BigInt(data.argtBalance), interestAccrued: BigInt(data.interestAccrued) });
    }
    if (rateRes.ok) {
      const data = await rateRes.json();
      setApy(data.apy);
    }
    setIsLoading(false);
  }, [getAccessToken]);

  useEffect(() => {
    loadAccount();
  }, [loadAccount]);

  const decimals = TOKENS.ARGt.decimals;

  // --- Depositar: transfer ARGt al omnibus + polling de sync-deposits (flujo de account/deposit) ---
  const [depositAmount, setDepositAmount] = useState("");
  const [depositStatus, setDepositStatus] = useState<DepositStatus>("idle");
  const balanceOnArbitrum = perChain[DEPOSIT_CHAIN] ?? BigInt(0);

  async function pollForCredit(hash: `0x${string}`) {
    setDepositStatus("confirming");
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
          if (movements.some((m) => m.txHash?.toLowerCase() === hash.toLowerCase())) {
            setDepositStatus("acreditado");
            await loadAccount();
            return;
          }
        }
      } catch {
        // red intermitente, seguimos intentando en el próximo tick
      }
    }
    setDepositStatus("timeout");
  }

  async function handleDeposit() {
    if (!address || !depositAmount) return;
    let assets: bigint;
    try {
      assets = parseUnits(depositAmount, decimals);
    } catch {
      return;
    }
    if (assets <= BigInt(0) || assets > balanceOnArbitrum) return;

    setDepositStatus("sending");
    try {
      if (chainId !== CHAIN_IDS[DEPOSIT_CHAIN]) {
        await switchChainAsync({ chainId: CHAIN_IDS[DEPOSIT_CHAIN] });
      }
      const hash = await writeContractAsync({
        address: TOKENS.ARGt.addresses[DEPOSIT_CHAIN],
        abi: ERC20_TRANSFER_ABI,
        functionName: "transfer",
        args: [OMNIBUS_VAULT_ADDRESS, assets],
        chainId: CHAIN_IDS[DEPOSIT_CHAIN],
      });
      setDepositAmount("");
      await pollForCredit(hash);
    } catch (error) {
      console.error(error);
      toast.error(ERROR_COPY);
      setDepositStatus("idle");
    }
  }

  // --- Retirar: POST /api/account/withdraw (flujo de account/withdraw) ---
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  async function handleWithdraw() {
    if (!withdrawAmount) return;
    let assets: bigint;
    try {
      assets = parseUnits(withdrawAmount, decimals);
    } catch {
      return;
    }
    if (assets <= BigInt(0) || (account && assets > account.argtBalance)) return;

    setIsWithdrawing(true);
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/account/withdraw", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ amount: assets.toString(), chain: "arbitrum" }),
      });
      const data = await res.json();
      if (res.ok && data.status === "sent") {
        toast.success("Retiro confirmado");
        setWithdrawAmount("");
        await loadAccount();
      } else {
        toast.error(data.reason ?? ERROR_COPY);
      }
    } catch (error) {
      console.error(error);
      toast.error(ERROR_COPY);
    } finally {
      setIsWithdrawing(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const isDepositing = depositStatus === "sending" || depositStatus === "confirming";
  const saldo = account?.argtBalance ?? BigInt(0);
  const rewards = account?.interestAccrued ?? BigInt(0);
  const rate =
    omnibusValue !== undefined ? Number(formatUnits(omnibusValue, decimals)).toFixed(4) : null;

  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="font-serif text-3xl text-foreground">Rewards</h1>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Saldo en Rewards</p>
          {apy != null && (
            <span className="inline-flex items-center gap-1.5 rounded-[3px] bg-green-dim px-1.5 py-0.5 font-mono text-[11px] text-green">
              <span className="size-1.5 rounded-full bg-green" aria-hidden="true" />
              APY {(apy * 100).toFixed(2).replace(".", ",")}%
            </span>
          )}
        </div>
        <p
          className="mt-1 text-[28px] font-serif leading-tight tracking-tight text-gold tabular-nums"
          style={{ minWidth: "8ch" }}
        >
          {formatUnits(saldo, decimals)} {TOKENS.ARGt.symbol}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Rewards acumulados{" "}
          <span className="font-semibold text-green tabular-nums">
            +{formatUnits(rewards, decimals)} {TOKENS.ARGt.symbol}
          </span>
        </p>

        <Tabs
          value={action ?? NONE}
          onValueChange={(next) => setAction(next === NONE ? null : (next as RewardsAction))}
          className="mt-4 gap-3 border-t border-border pt-4"
        >
          <TabsList className="h-11 w-full gap-1 rounded-lg border border-border bg-background p-1">
            <TabsTrigger value="depositar" className={TAB_TRIGGER}>
              <ArrowDownLeft className="size-4" aria-hidden="true" />
              Depositar
            </TabsTrigger>
            <TabsTrigger value="retirar" className={TAB_TRIGGER}>
              <ArrowUpRight className="size-4" aria-hidden="true" />
              Retirar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="depositar">
            <div ref={action === "depositar" ? actionRef : undefined} className="flex flex-col gap-3">
              <Input
                type="number"
                inputMode="decimal"
                aria-label="Monto a depositar en ARGt"
                placeholder="Monto en ARGt"
                value={depositAmount}
                onChange={(event) => setDepositAmount(event.target.value)}
                disabled={isDepositing}
                className="min-h-11"
              />
              <p className="text-sm text-muted-foreground">
                Disponible:{" "}
                <span className="tabular-nums">{formatUnits(balanceOnArbitrum, decimals)}</span>{" "}
                {TOKENS.ARGt.symbol}
              </p>
              <Button onClick={handleDeposit} disabled={!address || isDepositing || !depositAmount}>
                {depositStatus === "sending" && "Enviando..."}
                {depositStatus === "confirming" && "Confirmando..."}
                {(depositStatus === "idle" ||
                  depositStatus === "acreditado" ||
                  depositStatus === "timeout") &&
                  "Depositar"}
              </Button>
              {depositStatus === "acreditado" && <p className="text-sm text-green">Acreditado</p>}
              {depositStatus === "timeout" && (
                <p className="text-sm text-muted-foreground">
                  Puede tardar unos minutos, va a aparecer arriba.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="retirar">
            <div ref={action === "retirar" ? actionRef : undefined} className="flex flex-col gap-3">
              <Input
                type="number"
                inputMode="decimal"
                aria-label="Monto a retirar en ARGt"
                placeholder="Monto en ARGt"
                value={withdrawAmount}
                onChange={(event) => setWithdrawAmount(event.target.value)}
                disabled={isWithdrawing}
                className="min-h-11"
              />
              <Button onClick={handleWithdraw} disabled={isWithdrawing || !withdrawAmount}>
                {isWithdrawing ? "Retirando..." : "Retirar"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          {rate !== null ? (
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              1 ARGt <span aria-hidden="true">&rarr;</span>{" "}
              <span className="tabular-nums normal-case">{rate}</span> ARGt en Morpho
            </p>
          ) : (
            <span />
          )}
          <Link
            href="/account/verify"
            className="min-h-11 content-center text-sm text-gold underline-offset-4 hover:underline"
          >
            Verificar mis rewards
          </Link>
        </div>
      </div>
    </div>
  );
}
