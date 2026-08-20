import { createPublicClient, createWalletClient, http, erc20Abi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrum, base, mainnet, polygon } from "viem/chains";
import { withTx, sql } from "@/lib/db/client";
import { RPC_URLS, TOKENS, type ChainKey } from "@/lib/config/tokens";
import { OMNIBUS_VAULT_ADDRESS, DAILY_WITHDRAW_LIMIT_BASE_UNITS } from "@/lib/config/cuenta";
import { withChainLock } from "@/lib/cuenta/chain-mutex";

export type WithdrawResult =
  | { status: "sent"; txHash: `0x${string}` }
  | { status: "failed"; reason: string };

const VIEM_CHAINS = { arbitrum, base, polygon, ethereum: mainnet } as const;

function getVaultPrivateKey(): `0x${string}` {
  const key = process.env.VAULT_PRIVATE_KEY;
  if (!key) throw new Error("VAULT_PRIVATE_KEY no configurada");
  return (key.startsWith("0x") ? key : `0x${key}`) as `0x${string}`;
}

async function revertDebit(movementId: number, userId: string, amountBaseUnits: bigint): Promise<void> {
  await withTx(async (client) => {
    await client.query("UPDATE movements SET status = 'failed' WHERE id = $1", [movementId]);
    await client.query(
      "UPDATE accounts SET argt_balance = argt_balance + $1, updated_at = now() WHERE user_id = $2",
      [amountBaseUnits.toString(), userId]
    );
  });
}

async function sendWithdrawal(
  movementId: number,
  userId: string,
  walletAddress: `0x${string}`,
  amountBaseUnits: bigint,
  chain: ChainKey
): Promise<WithdrawResult> {
  const viemChain = VIEM_CHAINS[chain];
  const publicClient = createPublicClient({ chain: viemChain, transport: http(RPC_URLS[chain]) });
  const account = privateKeyToAccount(getVaultPrivateKey());
  const tokenAddress = TOKENS.ARGt.addresses[chain];

  try {
    const [vaultBalance, nativeBalance, gasPrice] = await Promise.all([
      publicClient.readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [OMNIBUS_VAULT_ADDRESS],
      }),
      publicClient.getBalance({ address: account.address }),
      publicClient.getGasPrice(),
    ]);

    if (vaultBalance < amountBaseUnits) {
      const reason = "sin fondos en la bóveda para esta chain, probá retirar por Arbitrum";
      await revertDebit(movementId, userId, amountBaseUnits);
      return { status: "failed", reason };
    }

    // ponytail: margen fijo de 100k gas para un transfer ERC20 (~65k reales); si el gas token
    // varía mucho por chain esto puede subestimar, ajustar si algún transfer falla por fondos.
    const estimatedGasCost = gasPrice * BigInt(100000);
    if (nativeBalance < estimatedGasCost) {
      const reason = "sin gas en la bóveda para esta chain, probá retirar por Arbitrum";
      await revertDebit(movementId, userId, amountBaseUnits);
      return { status: "failed", reason };
    }

    const walletClient = createWalletClient({ account, chain: viemChain, transport: http(RPC_URLS[chain]) });
    const txHash = await walletClient.writeContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "transfer",
      args: [walletAddress, amountBaseUnits],
    });

    await sql`update movements set status = 'sent', tx_hash = ${txHash} where id = ${movementId}`;
    return { status: "sent", txHash };
  } catch (err) {
    const reason = err instanceof Error ? err.message : "error firmando/enviando el retiro";
    await revertDebit(movementId, userId, amountBaseUnits);
    return { status: "failed", reason };
  }
}

/**
 * Retira ARGt de la bóveda omnibus a la wallet del usuario (D-13/D-14/D-16): debita y registra
 * `pending` dentro de una tx con advisory lock por chain (D-15), luego firma y envía serializado
 * por chain vía `withChainLock`. Cualquier fallo tras el débito revierte el balance.
 */
export async function withdraw(
  userId: string,
  amountBaseUnits: bigint,
  chain: ChainKey
): Promise<WithdrawResult> {
  if (amountBaseUnits <= BigInt(0)) return { status: "failed", reason: "monto inválido" };

  const debit = await withTx(async (client) => {
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [chain]);

    const { rows: accountRows } = await client.query(
      "SELECT wallet_address, argt_balance FROM accounts WHERE user_id = $1 FOR UPDATE",
      [userId]
    );
    const account = accountRows[0];
    if (!account || !account.wallet_address) {
      return { ok: false as const, reason: "cuenta sin wallet vinculada" };
    }

    const { rows: recentRows } = await client.query(
      `SELECT coalesce(sum(amount), 0) as total FROM movements
       WHERE user_id = $1 AND type = 'withdraw' AND created_at > now() - interval '24 hours'`,
      [userId]
    );
    const withdrawnLast24h = BigInt(recentRows[0].total);
    if (withdrawnLast24h + amountBaseUnits > DAILY_WITHDRAW_LIMIT_BASE_UNITS) {
      return { ok: false as const, reason: "supera el límite diario de retiro" };
    }

    const balance = BigInt(account.argt_balance);
    if (balance < amountBaseUnits) {
      return { ok: false as const, reason: "saldo insuficiente" };
    }

    await client.query(
      "UPDATE accounts SET argt_balance = argt_balance - $1, updated_at = now() WHERE user_id = $2",
      [amountBaseUnits.toString(), userId]
    );
    const { rows: movementRows } = await client.query(
      `INSERT INTO movements (user_id, type, token, amount, chain, status)
       VALUES ($1, 'withdraw', 'ARGt', $2, $3, 'pending')
       RETURNING id`,
      [userId, amountBaseUnits.toString(), chain]
    );

    return {
      ok: true as const,
      movementId: movementRows[0].id as number,
      walletAddress: account.wallet_address as `0x${string}`,
    };
  });

  if (!debit.ok) return { status: "failed", reason: debit.reason };

  return withChainLock(chain, () =>
    sendWithdrawal(debit.movementId, userId, debit.walletAddress, amountBaseUnits, chain)
  );
}
