import { createPublicClient, http, parseAbiItem } from "viem";
import { arbitrum } from "viem/chains";
import type { PoolClient } from "@neondatabase/serverless";
import { withTx } from "@/lib/db/client";
import { RPC_URLS, TOKENS } from "@/lib/config/tokens";
import { OMNIBUS_VAULT_ADDRESS, DEPOSIT_CHAIN } from "@/lib/config/cuenta";

const TRANSFER_EVENT = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)"
);

const LAST_BLOCK_KEY = "last_processed_block";
// ponytail: sin bloque de deploy conocido a mano, arranca 5000 bloques atrás en el primer run.
const DEFAULT_LOOKBACK_BLOCKS = BigInt(5000);

const publicClient = createPublicClient({ chain: arbitrum, transport: http(RPC_URLS[DEPOSIT_CHAIN]) });

async function readLastProcessedBlock(client: PoolClient): Promise<string | null> {
  const { rows } = await client.query("SELECT value FROM sync_state WHERE key = $1", [LAST_BLOCK_KEY]);
  return rows[0]?.value ?? null;
}

async function writeLastProcessedBlock(client: PoolClient, value: string): Promise<void> {
  await client.query(
    "INSERT INTO sync_state (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
    [LAST_BLOCK_KEY, value]
  );
}

/**
 * Detecta depósitos a la bóveda omnibus (D-06/D-08/D-09): getLogs de Transfer(to=bóveda) en
 * Arbitrum desde el último bloque procesado, matchea `from` contra wallets conocidas y acredita
 * en una sola transacción SQL junto con el avance de last_processed_block. Idempotente por el
 * índice único parcial sobre tx_hash (D-03).
 */
export async function syncDeposits(): Promise<{ credited: number }> {
  const latest = await publicClient.getBlockNumber();

  return withTx(async (client) => {
    const lastProcessedStr = await readLastProcessedBlock(client);
    const fromBlock = lastProcessedStr
      ? BigInt(lastProcessedStr) + BigInt(1)
      : latest > DEFAULT_LOOKBACK_BLOCKS
        ? latest - DEFAULT_LOOKBACK_BLOCKS
        : BigInt(0);

    if (fromBlock > latest) return { credited: 0 };

    const logs = await publicClient.getLogs({
      address: TOKENS.ARGt.addresses[DEPOSIT_CHAIN],
      event: TRANSFER_EVENT,
      args: { to: OMNIBUS_VAULT_ADDRESS },
      fromBlock,
      toBlock: latest,
    });

    let credited = 0;
    for (const log of logs) {
      const from = (log.args.from as string).toLowerCase();
      const value = log.args.value as bigint;

      const { rows: accountRows } = await client.query(
        "SELECT user_id FROM accounts WHERE lower(wallet_address) = $1",
        [from]
      );
      if (accountRows.length === 0) continue; // no es una wallet de Cuenta conocida

      const userId = accountRows[0].user_id as string;
      const { rows: inserted } = await client.query(
        `INSERT INTO movements (user_id, type, token, amount, chain, tx_hash, status)
         VALUES ($1, 'deposit', 'ARGt', $2, $3, $4, 'confirmed')
         ON CONFLICT (tx_hash) WHERE type = 'deposit' DO NOTHING
         RETURNING id`,
        [userId, value.toString(), DEPOSIT_CHAIN, log.transactionHash]
      );
      if (inserted.length === 0) continue; // tx_hash ya acreditado

      await client.query(
        "UPDATE accounts SET argt_balance = argt_balance + $1, updated_at = now() WHERE user_id = $2",
        [value.toString(), userId]
      );
      credited++;
    }

    await writeLastProcessedBlock(client, latest.toString());
    return { credited };
  });
}
