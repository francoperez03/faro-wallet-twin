import { createPublicClient, http } from "viem";
import { arbitrum } from "viem/chains";
import type { PoolClient } from "@neondatabase/serverless";
import { withTx } from "@/lib/db/client";
import { RPC_URLS, VAULT_ARGT_PRIME } from "@/lib/config/tokens";
import { OMNIBUS_VAULT_ADDRESS, SPREAD_BPS } from "@/lib/config/cuenta";
import { vaultAbi } from "@/lib/hooks/use-vault-position";

const publicClient = createPublicClient({ chain: arbitrum, transport: http(RPC_URLS.arbitrum) });

async function readSyncState(client: PoolClient, key: string): Promise<string | null> {
  const { rows } = await client.query("SELECT value FROM sync_state WHERE key = $1", [key]);
  return rows[0]?.value ?? null;
}

async function writeSyncState(client: PoolClient, key: string, value: string): Promise<void> {
  await client.query(
    "INSERT INTO sync_state (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
    [key, value]
  );
}

/**
 * Devenga interés real desde el vault ARGt Prime (D-10/D-11): lee convertToAssets(shares de la
 * bóveda), compara contra el snapshot previo en sync_state y reparte el delta pro rata por
 * argt_balance, bigint floor. Idempotente: sin yield nuevo, delta <= 0 y no acredita nada.
 */
export async function accrueInterest(): Promise<{ deltaAccrued: bigint; usersCredited: number }> {
  // D-08(c): barrido de respaldo de depositos pendientes en cada corrida del cron.
  // Si falla no bloquea el devengo (el sync tiene sus propios triggers en la UI).
  try {
    const { syncDeposits } = await import("./deposits");
    await syncDeposits();
  } catch {
    // barrido best-effort
  }
  const vaultShares = await publicClient.readContract({
    address: VAULT_ARGT_PRIME.address,
    abi: vaultAbi,
    functionName: "balanceOf",
    args: [OMNIBUS_VAULT_ADDRESS],
  });
  const actual = await publicClient.readContract({
    address: VAULT_ARGT_PRIME.address,
    abi: vaultAbi,
    functionName: "convertToAssets",
    args: [vaultShares],
  });

  return withTx(async (client) => {
    const snapshotStr = await readSyncState(client, "convertToAssets_snapshot_value");
    const snapshotAtStr = await readSyncState(client, "convertToAssets_snapshot_at");
    const now = new Date().toISOString();

    if (snapshotStr === null) {
      // Primera corrida: solo establece el snapshot inicial, no acredita nada.
      await writeSyncState(client, "convertToAssets_snapshot_value", actual.toString());
      await writeSyncState(client, "convertToAssets_snapshot_at", now);
      return { deltaAccrued: BigInt(0), usersCredited: 0 };
    }

    const snapshotPrevio = BigInt(snapshotStr);
    let delta = actual - snapshotPrevio;
    delta = delta > BigInt(0) ? (delta * BigInt(10000 - SPREAD_BPS)) / BigInt(10000) : delta;

    // Mueve el snapshot actual a "prev" para el cálculo de APY, guarda el nuevo snapshot.
    await writeSyncState(client, "convertToAssets_prev_value", snapshotStr);
    await writeSyncState(client, "convertToAssets_prev_at", snapshotAtStr ?? now);
    await writeSyncState(client, "convertToAssets_snapshot_value", actual.toString());
    await writeSyncState(client, "convertToAssets_snapshot_at", now);

    if (delta <= BigInt(0)) {
      return { deltaAccrued: BigInt(0), usersCredited: 0 };
    }

    const { rows } = await client.query(
      "SELECT user_id, argt_balance FROM accounts WHERE argt_balance > 0"
    );
    const totalBalances = rows.reduce((sum: bigint, row) => sum + BigInt(row.argt_balance), BigInt(0));
    if (totalBalances <= BigInt(0)) {
      return { deltaAccrued: BigInt(0), usersCredited: 0 };
    }

    let usersCredited = 0;
    let creditedTotal = BigInt(0);
    for (const row of rows) {
      const balance = BigInt(row.argt_balance);
      const share = (delta * balance) / totalBalances;
      if (share <= BigInt(0)) continue;
      await client.query(
        "INSERT INTO movements (user_id, type, token, amount, status) VALUES ($1, 'interest', 'ARGt', $2, 'confirmed')",
        [row.user_id, share.toString()]
      );
      await client.query("UPDATE accounts SET argt_balance = argt_balance + $1, updated_at = now() WHERE user_id = $2", [
        share.toString(),
        row.user_id,
      ]);
      usersCredited += 1;
      creditedTotal += share;
    }

    return { deltaAccrued: creditedTotal, usersCredited };
  });
}
