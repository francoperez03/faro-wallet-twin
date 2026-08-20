"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount, usePublicClient, useSwitchChain, useWriteContract } from "wagmi";
import { pad } from "viem";
import { BRIDGE_ADAPTERS, CHAIN_IDS, TOKENS, type ChainKey } from "@/lib/config/tokens";
import { bridgeAdapterAbi } from "@/lib/config/bridge-adapter-abi";

const ERC20_ABI = [
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
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

// EIDs de LayerZero V2, verificados on-chain: peers(30184) y peers(30109) del adapter de
// Arbitrum devuelven exactamente BRIDGE_ADAPTERS.base y BRIDGE_ADAPTERS.polygon (ver
// 01-04-SUMMARY.md).
const LZ_EIDS: Record<ChainKey, number> = {
  arbitrum: 30110,
  base: 30184,
  polygon: 30109,
  ethereum: 30101,
};

function adapterOf(chain: ChainKey): `0x${string}` {
  const adapter = BRIDGE_ADAPTERS[chain];
  if (!adapter) throw new Error(`Sin adapter de bridge en ${chain}`);
  return adapter;
}

const POLL_INTERVAL_MS = 10_000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

export type BridgeStatus =
  | "idle"
  | "cotizando"
  | "confirmando"
  | "en_transito"
  | "completado"
  | "timeout"
  | "error";

function buildSendParam(toChain: ChainKey, receiver: `0x${string}`, amount: bigint) {
  return {
    dstEid: LZ_EIDS[toChain],
    to: pad(receiver, { size: 32 }),
    amountLD: amount,
    minAmountLD: amount,
    extraOptions: "0x" as const,
    composeMsg: "0x" as const,
    oftCmd: "0x" as const,
  };
}

/**
 * Bridge de ARGt entre Arbitrum/Base/Polygon vía el adapter LayerZero OFT (D-09):
 * approve(adapter, amount) + send(sendParam, fee, refundAddress) con value=fee, luego
 * polling del balance de ARGt en destino hasta que sube (timeout ~5min, T-04-02).
 */
export function useBridge() {
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const clients = {
    arbitrum: usePublicClient({ chainId: CHAIN_IDS.arbitrum }),
    base: usePublicClient({ chainId: CHAIN_IDS.base }),
    polygon: usePublicClient({ chainId: CHAIN_IDS.polygon }),
    ethereum: usePublicClient({ chainId: CHAIN_IDS.ethereum }),
  };

  const [status, setStatus] = useState<BridgeStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, []);

  async function quoteFee(fromChain: ChainKey, toChain: ChainKey, amount: bigint) {
    if (!address) throw new Error("Wallet no conectada");
    const client = clients[fromChain];
    if (!client) throw new Error("No se pudo conectar a la red de origen");
    const sendParam = buildSendParam(toChain, address, amount);
    const fee = await client.readContract({
      address: adapterOf(fromChain),
      abi: bridgeAdapterAbi,
      functionName: "quoteSend",
      args: [sendParam, false],
    });
    return { sendParam, fee };
  }

  function startPolling(toChain: ChainKey, before: bigint) {
    const client = clients[toChain];
    const deadline = Date.now() + POLL_TIMEOUT_MS;
    if (pollTimer.current) clearInterval(pollTimer.current);
    setStatus("en_transito");
    pollTimer.current = setInterval(async () => {
      if (Date.now() > deadline) {
        if (pollTimer.current) clearInterval(pollTimer.current);
        setStatus("timeout");
        return;
      }
      if (!client || !address) return;
      try {
        const bal = await client.readContract({
          address: TOKENS.ARGt.addresses[toChain],
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [address],
        });
        if (bal > before) {
          if (pollTimer.current) clearInterval(pollTimer.current);
          setStatus("completado");
        }
      } catch {
        // RPC de destino momentáneamente no disponible, reintenta en el próximo tick
      }
    }, POLL_INTERVAL_MS);
  }

  async function bridge({
    fromChain,
    toChain,
    amount,
  }: {
    fromChain: ChainKey;
    toChain: ChainKey;
    amount: bigint;
  }) {
    if (!address) throw new Error("Wallet no conectada");
    setError(null);
    try {
      setStatus("cotizando");
      const { sendParam, fee } = await quoteFee(fromChain, toChain, amount);

      setStatus("confirmando");
      if (chainId !== CHAIN_IDS[fromChain]) {
        await switchChainAsync({ chainId: CHAIN_IDS[fromChain] });
      }

      await writeContractAsync({
        address: TOKENS.ARGt.addresses[fromChain],
        abi: ERC20_ABI,
        functionName: "approve",
        args: [adapterOf(fromChain), amount],
        chainId: CHAIN_IDS[fromChain],
      });

      const toClient = clients[toChain];
      const before = toClient
        ? await toClient.readContract({
            address: TOKENS.ARGt.addresses[toChain],
            abi: ERC20_ABI,
            functionName: "balanceOf",
            args: [address],
          })
        : BigInt(0);

      await writeContractAsync({
        address: adapterOf(fromChain),
        abi: bridgeAdapterAbi,
        functionName: "send",
        args: [sendParam, fee, address],
        value: fee.nativeFee,
        chainId: CHAIN_IDS[fromChain],
      });

      startPolling(toChain, before);
      return { feeNative: fee.nativeFee };
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Error desconocido");
      throw e;
    }
  }

  return { status, error, quoteFee, bridge };
}
