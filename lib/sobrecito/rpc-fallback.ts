import { createPublicClient, http, type PublicClient } from "viem";
import { arbitrum } from "viem/chains";
import { RPC_URLS } from "@/lib/config/tokens";

// ponytail: un solo fallback fijo a arb1.arbitrum.io/rpc, todos los registries/vaults
// leidos por esta app viven en Arbitrum. Si se agrega otra chain, parametrizar por chainId.
let fallbackClient: PublicClient | undefined;
function getFallbackClient(): PublicClient {
  if (!fallbackClient) {
    fallbackClient = createPublicClient({ chain: arbitrum, transport: http(RPC_URLS.arbitrum) });
  }
  return fallbackClient;
}

/**
 * Corre `fn` con el client primario (wagmi, puede estar undefined o apuntar a un RPC menos
 * confiable); si tira, reintenta una vez con un client de viem sobre arb1.arbitrum.io/rpc.
 * Usado por useCutHistory/useLatestCut y YieldComparison para que un RPC publico caido no
 * rompa el historial de cortes ni el semaforo de /status.
 */
export async function withRpcFallback<T>(
  primaryClient: PublicClient | undefined,
  fn: (client: PublicClient) => Promise<T>,
): Promise<T> {
  if (primaryClient) {
    try {
      return await fn(primaryClient);
    } catch {
      // cae al fallback
    }
  }
  return fn(getFallbackClient());
}
