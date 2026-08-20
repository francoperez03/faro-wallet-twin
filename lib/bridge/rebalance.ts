import type { ChainKey } from "@/lib/config/tokens";

export type Leg = { from: ChainKey; to: ChainKey; amount: bigint };

// Polvo: deltas por debajo de esto no generan una pata (0.01 ARGt, 18 decimales).
export const MIN_LEG = BigInt("10000000000000000");

/**
 * Excedentes (current > target) y déficits (current < target) ordenados desc, matching greedy:
 * la pata más grande de cada lado se cruza primero. Con 3 chains salen a lo sumo 2 patas.
 * Asume sum(current) == sum(target) (garantizado por las reglas de absorción de la UI).
 */
export function computeRebalance(
  current: Record<ChainKey, bigint>,
  target: Record<ChainKey, bigint>
): Leg[] {
  const chains = Object.keys(current) as ChainKey[];

  const surplus = chains
    .map((chain) => ({ chain, amount: current[chain] - target[chain] }))
    .filter((s) => s.amount > MIN_LEG)
    .sort((a, b) => (b.amount > a.amount ? 1 : b.amount < a.amount ? -1 : 0));

  const deficit = chains
    .map((chain) => ({ chain, amount: target[chain] - current[chain] }))
    .filter((d) => d.amount > MIN_LEG)
    .sort((a, b) => (b.amount > a.amount ? 1 : b.amount < a.amount ? -1 : 0));

  const legs: Leg[] = [];
  let si = 0;
  let di = 0;
  while (si < surplus.length && di < deficit.length) {
    const s = surplus[si];
    const d = deficit[di];
    const amount = s.amount < d.amount ? s.amount : d.amount;
    if (amount > MIN_LEG) {
      legs.push({ from: s.chain, to: d.chain, amount });
    }
    s.amount -= amount;
    d.amount -= amount;
    if (s.amount <= MIN_LEG) si++;
    if (d.amount <= MIN_LEG) di++;
  }

  return legs;
}
