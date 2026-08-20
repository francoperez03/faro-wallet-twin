"use client";

import { useState } from "react";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "wagmi/actions";
import { arbitrum } from "viem/chains";
import { parseUnits } from "viem";
import { toast } from "sonner";
import { TOKENS, VAULT_ARGT_PRIME } from "@/lib/config/tokens";
import { useVaultPosition, vaultAbi } from "@/lib/hooks/use-vault-position";
import { VaultCard } from "@/components/vault-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const erc20Abi = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

const ARGT_ARBITRUM = TOKENS.ARGt.addresses.arbitrum;
const ERROR_COPY =
  "No pudimos completar la operación. Revisá tu conexión o el saldo disponible y volvé a intentar.";

export default function RewardsPage() {
  const { address } = useAccount();
  const config = useConfig();
  const { writeContractAsync } = useWriteContract();
  const { shares, refetch } = useVaultPosition();

  const [depositAmount, setDepositAmount] = useState("");
  const [depositStatus, setDepositStatus] = useState<string | null>(null);
  const [isDepositing, setIsDepositing] = useState(false);

  const [withdrawMode, setWithdrawMode] = useState<"parcial" | "todo">("parcial");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawStatus, setWithdrawStatus] = useState<string | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  async function handleDeposit() {
    if (!address || !depositAmount) return;
    const assets = parseUnits(depositAmount, TOKENS.ARGt.decimals);
    if (assets <= BigInt(0)) return;

    setIsDepositing(true);
    try {
      const allowance = await readContract(config, {
        address: ARGT_ARBITRUM,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, VAULT_ARGT_PRIME.address],
        chainId: arbitrum.id,
      });

      if (allowance < assets) {
        setDepositStatus("Aprobando...");
        const approveHash = await writeContractAsync({
          address: ARGT_ARBITRUM,
          abi: erc20Abi,
          functionName: "approve",
          args: [VAULT_ARGT_PRIME.address, assets],
          chainId: arbitrum.id,
        });
        await waitForTransactionReceipt(config, { hash: approveHash, chainId: arbitrum.id });
      }

      setDepositStatus("Depositando...");
      const depositHash = await writeContractAsync({
        address: VAULT_ARGT_PRIME.address,
        abi: vaultAbi,
        functionName: "deposit",
        args: [assets, address],
        chainId: arbitrum.id,
      });
      await waitForTransactionReceipt(config, { hash: depositHash, chainId: arbitrum.id });

      setDepositStatus("Listo");
      toast.success("Depósito confirmado");
      setDepositAmount("");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(ERROR_COPY);
    } finally {
      setDepositStatus(null);
      setIsDepositing(false);
    }
  }

  async function executeWithdraw() {
    if (!address) return;

    setIsWithdrawing(true);
    try {
      let sharesToRedeem: bigint;

      if (withdrawMode === "todo") {
        sharesToRedeem = shares;
      } else {
        if (!withdrawAmount) return;
        const assets = parseUnits(withdrawAmount, TOKENS.ARGt.decimals);
        if (assets <= BigInt(0)) return;
        sharesToRedeem = await readContract(config, {
          address: VAULT_ARGT_PRIME.address,
          abi: vaultAbi,
          functionName: "previewWithdraw",
          args: [assets],
          chainId: arbitrum.id,
        });
      }

      if (sharesToRedeem <= BigInt(0)) return;

      setWithdrawStatus("Retirando...");
      const hash = await writeContractAsync({
        address: VAULT_ARGT_PRIME.address,
        abi: vaultAbi,
        functionName: "redeem",
        args: [sharesToRedeem, address, address],
        chainId: arbitrum.id,
      });
      await waitForTransactionReceipt(config, { hash, chainId: arbitrum.id });

      setWithdrawStatus("Listo");
      toast.success("Retiro confirmado");
      setWithdrawAmount("");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(ERROR_COPY);
    } finally {
      setWithdrawStatus(null);
      setIsWithdrawing(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-6 lg:max-w-5xl lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-8 lg:p-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Rewards</h1>
        </div>

        <VaultCard />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium text-foreground">Depositar</p>
          <Input
            type="number"
            inputMode="decimal"
            placeholder="Monto en ARGt"
            value={depositAmount}
            onChange={(event) => setDepositAmount(event.target.value)}
            disabled={isDepositing}
          />
          <Button
            onClick={handleDeposit}
            disabled={!address || isDepositing || !depositAmount}
          >
            {isDepositing ? (depositStatus ?? "Depositando...") : "Depositar en la bóveda"}
          </Button>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium text-foreground">Retirar</p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={withdrawMode === "parcial" ? "default" : "outline"}
              onClick={() => setWithdrawMode("parcial")}
            >
              Monto parcial
            </Button>
            <Button
              type="button"
              variant={withdrawMode === "todo" ? "default" : "outline"}
              onClick={() => setWithdrawMode("todo")}
            >
              Retirar todo
            </Button>
          </div>

          {withdrawMode === "parcial" ? (
            <>
              <Input
                type="number"
                inputMode="decimal"
                placeholder="Monto en ARGt"
                value={withdrawAmount}
                onChange={(event) => setWithdrawAmount(event.target.value)}
                disabled={isWithdrawing}
              />
              <Button
                onClick={executeWithdraw}
                disabled={!address || isWithdrawing || !withdrawAmount}
              >
                {isWithdrawing ? (withdrawStatus ?? "Retirando...") : "Retirar parcial"}
              </Button>
            </>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={!address || isWithdrawing || shares === BigInt(0)}
                >
                  {isWithdrawing ? (withdrawStatus ?? "Retirando...") : "Retirar todo"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Retirar todo</DialogTitle>
                  <DialogDescription>
                    Vas a retirar toda tu posición de la bóveda. Esta acción no se puede deshacer.
                    Confirmar retiro.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="destructive" onClick={executeWithdraw}>
                      Confirmar retiro
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}
