// Seed sintético e idempotente del ledger (D-17). Correr con:
// npx dotenv -e .env.local -- npx tsx lib/db/seed.ts
import { withTx } from "./client";

const NUM_USERS = 60;
const UNIT = BigInt(10) ** BigInt(18);
const SEED = 20260819; // fijo: misma secuencia de balances/movimientos en cada corrida

// ponytail: PRNG determinista in-process (mulberry32), no amerita una dependencia para 60 usuarios.
function mulberry32(seed: number) {
  return function rand() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Log-normal aproximado, centro ~600 ARGt, clamp [10, 50.000] (D-17: mayoría 100-5.000). */
function randomBalanceArgt(rand: () => number): number {
  const u1 = Math.max(rand(), 1e-9);
  const u2 = rand();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  const value = Math.exp(Math.log(600) + 1.1 * z);
  return Math.min(50000, Math.max(10, Math.round(value)));
}

async function main() {
  const rand = mulberry32(SEED);

  await withTx(async (client) => {
    for (let i = 1; i <= NUM_USERS; i++) {
      const userId = `did:privy:synthetic-${String(i).padStart(3, "0")}`;
      const balanceBase = BigInt(randomBalanceArgt(rand)) * UNIT;

      await client.query(
        `insert into accounts (user_id, wallet_address, argt_balance)
         values ($1, null, $2)
         on conflict (user_id) do update set argt_balance = excluded.argt_balance, updated_at = now()`,
        [userId, balanceBase.toString()],
      );

      // Idempotente: se regeneran los movimientos sintéticos de este usuario en cada corrida.
      await client.query(`delete from movements where user_id = $1`, [userId]);

      const count = 1 + Math.floor(rand() * 3); // 1-3 movimientos históricos, D-17
      let remaining = balanceBase;
      for (let m = 0; m < count; m++) {
        const isLast = m === count - 1;
        const type = m === 0 || rand() < 0.7 ? "deposit" : "interest";
        const amount = isLast
          ? remaining
          : (remaining * BigInt(30 + Math.floor(rand() * 40))) / BigInt(100);
        remaining -= amount;
        const daysAgo = rand() * 14;
        const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

        await client.query(
          `insert into movements (user_id, type, token, amount, chain, tx_hash, status, created_at)
           values ($1, $2, 'ARGt', $3, null, null, 'confirmed', $4)`,
          [userId, type, amount.toString(), createdAt.toISOString()],
        );
      }
    }
  });

  console.log(`Seed listo: ${NUM_USERS} cuentas sintéticas.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
