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

/** Entrada del corte de yield (pivote de rewards, ver circuits-mini/yield_cut): balance BASE
 * (pre-credito, el denominador real de la division pro rata) y reward acreditado (puede ser
 * 0 si el floor de este usuario redondeo a cero; se incluye igual porque el circuito necesita
 * el MISMO conjunto de usuarios que compuso total_balance, no solo los que recibieron algo). */
export type InterestEntry = { userId: string; balance: bigint; reward: bigint };

export type AccrueInterestResult = {
  /** Suma de los shares floor efectivamente acreditados (== delta - dust de redondeo). */
  deltaAccrued: bigint;
  usersCredited: number;
  /** Delta CRUDO (pre-spread) del vault en el periodo: convertToAssets(B2) - convertToAssets(B1).
   * Es el valor que /status recomputa con dos eth_call historicos (la vision publica). Con
   * SPREAD_BPS=0 (lib/config/cuenta.ts) coincide con `delta`; si el spread deja de ser 0,
   * dejan de coincidir (ver `delta`). */
  deltaRaw: bigint;
  /** Numerador EXACTO de la division pro rata (post-spread): delta = deltaRaw si SPREAD_BPS=0.
   * Este es el valor que el circuito de yield debe recibir como public input "delta" (D-diseño
   * del plan de yield: Sum(reward_i) <= delta, dust < K), porque es el que produjo `entries`. */
  delta: bigint;
  /** Bloque del snapshot ANTERIOR (null en la primera corrida, sin snapshot previo). */
  blockB1: bigint | null;
  /** Bloque del snapshot de ESTA corrida. */
  blockB2: bigint;
  /** convertToAssets en blockB1 (null si blockB1 es null). Persistido por el pivote de yield
   * (lib/sobrecito-mini/prove-yield.ts) en yield_cuts, para que /status pueda mostrar el
   * dato "informado por el operador" sin depender de un nodo de archivo. */
  valueB1: bigint | null;
  /** convertToAssets en blockB2 (== `actual`), misma razon que valueB1. */
  valueB2: bigint;
  /** Todos los usuarios con balance>0 considerados en el reparto (denominador de la pro rata),
   * balance = base pre-credito, reward = share floor (0 incluido). Vacio si no hubo delta>0. */
  entries: InterestEntry[];
};

/**
 * Devenga interés real desde el vault ARGt Prime (D-10/D-11): lee convertToAssets(shares de la
 * bóveda), compara contra el snapshot previo en sync_state y reparte el delta pro rata por
 * argt_balance, bigint floor. Idempotente: sin yield nuevo, delta <= 0 y no acredita nada.
 *
 * Tambien devuelve `entries`/`deltaRaw`/`blockB1`/`blockB2`: el pivote de yield (SOL-06
 * iterado post-hackathon) encadena `runYieldCut` inmediatamente despues de esta funcion
 * (mismo handler, app/api/account/interest/route.ts), usando estos MISMOS valores para que
 * la prueba ZK y el credito real sean, por construccion, la misma corrida (sin reconstruir
 * el periodo por timestamp, que seria fragil).
 */
export async function accrueInterest(): Promise<AccrueInterestResult> {
  // D-08(c): barrido de respaldo de depositos pendientes en cada corrida del cron.
  // Si falla no bloquea el devengo (el sync tiene sus propios triggers en la UI).
  try {
    const { syncDeposits } = await import("./deposits");
    await syncDeposits();
  } catch {
    // barrido best-effort
  }
  const currentBlock = await publicClient.getBlockNumber();
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
    const snapshotBlockStr = await readSyncState(client, "convertToAssets_snapshot_block");
    const now = new Date().toISOString();

    if (snapshotStr === null) {
      // Primera corrida: solo establece el snapshot inicial, no acredita nada.
      await writeSyncState(client, "convertToAssets_snapshot_value", actual.toString());
      await writeSyncState(client, "convertToAssets_snapshot_at", now);
      await writeSyncState(client, "convertToAssets_snapshot_block", currentBlock.toString());
      return {
        deltaAccrued: BigInt(0),
        usersCredited: 0,
        deltaRaw: BigInt(0),
        delta: BigInt(0),
        blockB1: null,
        blockB2: currentBlock,
        valueB1: null,
        valueB2: actual,
        entries: [],
      };
    }

    const snapshotPrevio = BigInt(snapshotStr);
    const deltaRaw = actual - snapshotPrevio;
    const delta = deltaRaw > BigInt(0) ? (deltaRaw * BigInt(10000 - SPREAD_BPS)) / BigInt(10000) : deltaRaw;
    const blockB1 = snapshotBlockStr !== null ? BigInt(snapshotBlockStr) : null;

    // Mueve el snapshot actual a "prev" para el cálculo de APY, guarda el nuevo snapshot.
    await writeSyncState(client, "convertToAssets_prev_value", snapshotStr);
    await writeSyncState(client, "convertToAssets_prev_at", snapshotAtStr ?? now);
    await writeSyncState(client, "convertToAssets_snapshot_value", actual.toString());
    await writeSyncState(client, "convertToAssets_snapshot_at", now);
    await writeSyncState(client, "convertToAssets_snapshot_block", currentBlock.toString());

    if (delta <= BigInt(0)) {
      return {
        deltaAccrued: BigInt(0),
        usersCredited: 0,
        deltaRaw: deltaRaw > BigInt(0) ? deltaRaw : BigInt(0),
        delta: BigInt(0),
        blockB1,
        blockB2: currentBlock,
        valueB1: snapshotPrevio,
        valueB2: actual,
        entries: [],
      };
    }

    const { rows } = await client.query(
      "SELECT user_id, argt_balance FROM accounts WHERE argt_balance > 0"
    );
    const totalBalances = rows.reduce((sum: bigint, row) => sum + BigInt(row.argt_balance), BigInt(0));
    if (totalBalances <= BigInt(0)) {
      return {
        deltaAccrued: BigInt(0),
        usersCredited: 0,
        deltaRaw,
        delta: BigInt(0),
        blockB1,
        blockB2: currentBlock,
        valueB1: snapshotPrevio,
        valueB2: actual,
        entries: [],
      };
    }

    let usersCredited = 0;
    let creditedTotal = BigInt(0);
    const entries: InterestEntry[] = [];
    for (const row of rows) {
      const balance = BigInt(row.argt_balance);
      const share = (delta * balance) / totalBalances;
      entries.push({ userId: row.user_id, balance, reward: share });
      if (share <= BigInt(0)) continue;
      // base_balance (D-09 del plan de yield): el balance BASE pre-credito usado para el
      // pro rata de este movimiento, persistido para poder reconstruir el corte sin
      // depender del retorno en memoria de esta funcion (auditoria/reintentos).
      await client.query(
        "INSERT INTO movements (user_id, type, token, amount, base_balance, status) VALUES ($1, 'interest', 'ARGt', $2, $3, 'confirmed')",
        [row.user_id, share.toString(), balance.toString()]
      );
      await client.query("UPDATE accounts SET argt_balance = argt_balance + $1, updated_at = now() WHERE user_id = $2", [
        share.toString(),
        row.user_id,
      ]);
      usersCredited += 1;
      creditedTotal += share;
    }

    return { deltaAccrued: creditedTotal, usersCredited, deltaRaw, delta, blockB1, blockB2: currentBlock, valueB1: snapshotPrevio, valueB2: actual, entries };
  });
}
