"use client";

import { useState } from "react";
import { useAccount, useConfig, useSwitchChain, useWriteContract } from "wagmi";
import { getPublicClient } from "wagmi/actions";
import { erc20Abi, formatUnits, parseUnits } from "viem";
import { toast } from "sonner";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { CHAIN_IDS, TOKENS, VAULT_ARGT_PRIME } from "@/lib/config/tokens";
import { useTokenBalances } from "@/lib/hooks/use-token-balances";
import { useVaultPosition, vaultAbi } from "@/lib/hooks/use-vault-position";
import { useVaultRewards } from "@/lib/hooks/use-vault-rewards";
import { useRevealAnimation } from "@/lib/hooks/use-reveal-animation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TxButton, type TxButtonStage } from "@/components/tx-button";

const ERROR_COPY =
  "No pudimos completar la operación. Revisá tu conexión o el saldo disponible y volvé a intentar.";
const MORPHO_VAULT_URL = `https://app.morpho.org/arbitrum/vault/${VAULT_ARGT_PRIME.address}`;

type RewardsAction = "depositar" | "retirar";
const NONE = "none";
const TAB_TRIGGER =
  "min-h-11 flex-1 gap-1.5 rounded-md text-sm font-semibold text-muted-foreground data-[state=active]:bg-gold-dim data-[state=active]:text-gold";

const VAULT_CHAIN = VAULT_ARGT_PRIME.chain;
const VAULT_CHAIN_ID = CHAIN_IDS[VAULT_CHAIN];
const ARGT_ON_VAULT_CHAIN = TOKENS.ARGt.addresses[VAULT_CHAIN];
const decimals = TOKENS.ARGt.decimals;

const fmt2 = (v: bigint) =>
  Number(formatUnits(v, decimals)).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
// Rewards acumulados con 8 decimales: el yield diario es chico y se quiere ver crecer.
const fmtFull = (v: bigint) => {
  const [int, frac = ""] = formatUnits(v, decimals).split(".");
  return `${int},${frac.slice(0, 8).padEnd(8, "0")}`;
};

function parseAmount(value: string): bigint | null {
  try {
    const n = parseUnits(value, decimals);
    return n > BigInt(0) ? n : null;
  } catch {
    return null;
  }
}

/**
 * Rewards = el usuario deposita ARGt directo en el vault ARGt Prime (ERC-4626, Morpho, Arbitrum)
 * desde su propia wallet. Saldo = convertToAssets(shares); acumulado = saldo − depositado neto.
 */
export function RewardsPanel() {
  const config = useConfig();
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { perChain, refetch: refetchBalances } = useTokenBalances(address);
  const position = useVaultPosition(address);
  const rewards = useVaultRewards(address);

  const [action, setAction] = useState<RewardsAction | null>(null);
  const actionRef = useRevealAnimation<HTMLDivElement>(action !== null);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositStage, setDepositStage] = useState<TxButtonStage>("idle");
  const [depositStep, setDepositStep] = useState<
    "aprobar" | "depositar" | null
  >(null);
  const [withdrawStage, setWithdrawStage] = useState<TxButtonStage>("idle");

  const saldo = position.valueInArgt;
  const principal = rewards.data?.principal ?? BigInt(0);
  const earned = saldo > principal ? saldo - principal : BigInt(0);
  const apy = rewards.data?.apy ?? null;
  const sharePrice = rewards.data?.sharePrice;
  const balanceOnVaultChain = perChain[VAULT_CHAIN] ?? BigInt(0);

  const depositAssets = depositAmount ? parseAmount(depositAmount) : null;
  const depositError =
    depositAmount && !depositAssets
      ? "Ingresá un monto válido."
      : depositAssets && depositAssets > balanceOnVaultChain
        ? "El monto supera tu saldo en Arbitrum."
        : undefined;
  const withdrawAssets = withdrawAmount ? parseAmount(withdrawAmount) : null;
  const withdrawError =
    withdrawAmount && !withdrawAssets
      ? "Ingresá un monto válido."
      : withdrawAssets && withdrawAssets > saldo
        ? "El monto supera tu saldo en Rewards."
        : undefined;

  const busyDeposit =
    depositStage === "confirming" || depositStage === "pending";
  const busyWithdraw =
    withdrawStage === "confirming" || withdrawStage === "pending";

  async function ensureVaultChain() {
    if (chainId !== VAULT_CHAIN_ID)
      await switchChainAsync({ chainId: VAULT_CHAIN_ID });
  }

  function refreshAll() {
    position.refetch();
    void rewards.refetch();
    void refetchBalances();
  }

  async function handleDeposit() {
    if (!address || !depositAssets || depositError) return;
    const client = getPublicClient(config, { chainId: VAULT_CHAIN_ID });
    if (!client) return;
    setDepositStage("confirming");
    try {
      await ensureVaultChain();
      const allowance = await client.readContract({
        address: ARGT_ON_VAULT_CHAIN,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, VAULT_ARGT_PRIME.address],
      });
      if (allowance < depositAssets) {
        setDepositStep("aprobar");
        const approveHash = await writeContractAsync({
          address: ARGT_ON_VAULT_CHAIN,
          abi: erc20Abi,
          functionName: "approve",
          args: [VAULT_ARGT_PRIME.address, depositAssets],
          chainId: VAULT_CHAIN_ID,
        });
        setDepositStage("pending");
        await client.waitForTransactionReceipt({ hash: approveHash });
        setDepositStage("confirming");
      }
      setDepositStep("depositar");
      const hash = await writeContractAsync({
        address: VAULT_ARGT_PRIME.address,
        abi: vaultAbi,
        functionName: "deposit",
        args: [depositAssets, address],
        chainId: VAULT_CHAIN_ID,
      });
      setDepositStage("pending");
      const receipt = await client.waitForTransactionReceipt({ hash });
      if (receipt.status !== "success") throw new Error("deposit reverted");
      setDepositStage("success");
      toast.success("Inversión confirmada");
      setDepositAmount("");
      refreshAll();
    } catch (error) {
      console.error(error);
      setDepositStage("error");
      toast.error(ERROR_COPY);
    } finally {
      setDepositStep(null);
    }
  }

  async function handleWithdraw(all = false) {
    if (!address) return;
    if (!all && (!withdrawAssets || withdrawError)) return;
    const client = getPublicClient(config, { chainId: VAULT_CHAIN_ID });
    if (!client) return;
    setWithdrawStage("confirming");
    try {
      await ensureVaultChain();
      // "Retirar todo" redime las shares completas para no dejar polvo por redondeo.
      const hash = all
        ? await writeContractAsync({
            address: VAULT_ARGT_PRIME.address,
            abi: vaultAbi,
            functionName: "redeem",
            args: [position.shares, address, address],
            chainId: VAULT_CHAIN_ID,
          })
        : await writeContractAsync({
            address: VAULT_ARGT_PRIME.address,
            abi: vaultAbi,
            functionName: "withdraw",
            args: [withdrawAssets!, address, address],
            chainId: VAULT_CHAIN_ID,
          });
      setWithdrawStage("pending");
      const receipt = await client.waitForTransactionReceipt({ hash });
      if (receipt.status !== "success") throw new Error("withdraw reverted");
      setWithdrawStage("success");
      toast.success("Retiro confirmado");
      setWithdrawAmount("");
      refreshAll();
    } catch (error) {
      console.error(error);
      setWithdrawStage("error");
      toast.error(ERROR_COPY);
    }
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="font-serif text-3xl text-foreground">Rewards</h1>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Saldo en Rewards</p>
          {apy != null && (
            <span className="inline-flex items-center gap-1.5 rounded-[3px] bg-green-dim px-1.5 py-0.5 font-mono text-[11px] text-green">
              <span
                className="size-1.5 rounded-full bg-green"
                aria-hidden="true"
              />
              APY {(apy * 100).toFixed(2).replace(".", ",")}%
            </span>
          )}
        </div>
        <p
          className="mt-1 text-[28px] font-serif leading-tight tracking-tight text-gold tabular-nums"
          style={{ minWidth: "8ch" }}
        >
          {position.isLoading ? "…" : `${fmt2(saldo)} ${TOKENS.ARGt.symbol}`}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Rewards acumulados{" "}
          <span className="font-semibold text-green tabular-nums">
            +{fmtFull(earned)} {TOKENS.ARGt.symbol}
          </span>
        </p>

        <Tabs
          value={action ?? NONE}
          onValueChange={(next) =>
            setAction(next === NONE ? null : (next as RewardsAction))
          }
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
            <div
              ref={action === "depositar" ? actionRef : undefined}
              className="flex flex-col gap-3"
            >
              <Input
                type="number"
                inputMode="decimal"
                aria-label="Monto a depositar en ARGt"
                placeholder="Monto en ARGt"
                value={depositAmount}
                onChange={(event) => setDepositAmount(event.target.value)}
                disabled={busyDeposit}
                className="min-h-11"
              />
              <p className="text-sm text-muted-foreground">
                Disponible en Arbitrum:{" "}
                <span className="tabular-nums">
                  {fmt2(balanceOnVaultChain)}
                </span>{" "}
                {TOKENS.ARGt.symbol}
              </p>
              {depositError && (
                <p className="text-sm text-destructive">{depositError}</p>
              )}
              <TxButton
                label={
                  depositStep === "aprobar"
                    ? "Aprobando ARGt…"
                    : depositStep === "depositar"
                      ? "Depositando…"
                      : "Depositar"
                }
                stage={depositStage}
                disabled={
                  !address ||
                  busyDeposit ||
                  !depositAssets ||
                  Boolean(depositError)
                }
                onClick={handleDeposit}
                onSettled={() => setDepositStage("idle")}
              />
              <p className="text-xs text-muted-foreground">
                Dos firmas la primera vez: una autoriza al vault a tomar tus
                ARGt, la otra deposita.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="retirar">
            <div
              ref={action === "retirar" ? actionRef : undefined}
              className="flex flex-col gap-3"
            >
              <Input
                type="number"
                inputMode="decimal"
                aria-label="Monto a retirar en ARGt"
                placeholder="Monto en ARGt"
                value={withdrawAmount}
                onChange={(event) => setWithdrawAmount(event.target.value)}
                disabled={busyWithdraw}
                className="min-h-11"
              />
              {withdrawError && (
                <p className="text-sm text-destructive">{withdrawError}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <TxButton
                  label="Retirar"
                  stage={withdrawStage}
                  disabled={
                    !address ||
                    busyWithdraw ||
                    !withdrawAssets ||
                    Boolean(withdrawError)
                  }
                  onClick={() => handleWithdraw(false)}
                  onSettled={() => setWithdrawStage("idle")}
                />
                <Button
                  variant="outline"
                  disabled={
                    !address || busyWithdraw || position.shares === BigInt(0)
                  }
                  onClick={() => handleWithdraw(true)}
                >
                  Retirar todo
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          {sharePrice !== undefined ? (
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              1 ARGt <span aria-hidden="true">&rarr;</span>{" "}
              <span className="tabular-nums normal-case">
                {Number(formatUnits(sharePrice, decimals)).toFixed(4)}
              </span>{" "}
              ARGt en Morpho
            </p>
          ) : (
            <span />
          )}
          <a
            href={MORPHO_VAULT_URL}
            target="_blank"
            rel="noreferrer"
            className="min-h-11 text-sm leading-[44px] text-gold underline-offset-4 hover:underline"
          >
            Ver en Morpho
          </a>
        </div>
      </div>
    </div>
  );
}
