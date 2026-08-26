// Vía nuestro proxy (app/api/pyth): Hermes no manda CORS para el origen de la app.
const HERMES = "/api/pyth";

/** Trae el update firmado más reciente de Pyth para `feedId` (se publica on-chain en la misma tx del cambio). */
export async function fetchPythUpdate(
  feedId: `0x${string}`,
): Promise<`0x${string}`[]> {
  const res = await fetch(`${HERMES}?id=${feedId}`);
  if (!res.ok) throw new Error(`Hermes ${res.status}`);
  const json = (await res.json()) as { binary: { data: string[] } };
  return json.binary.data.map(
    (d) => (d.startsWith("0x") ? d : `0x${d}`) as `0x${string}`,
  );
}

/** Precio actual de Hermes para `feedId` como número (price · 10^expo), sin tocar la cadena. */
export async function fetchPythPrice(feedId: `0x${string}`): Promise<number> {
  const res = await fetch(`${HERMES}?id=${feedId}`);
  if (!res.ok) throw new Error(`Hermes ${res.status}`);
  const json = (await res.json()) as {
    parsed: { price: { price: string; expo: number } }[];
  };
  const p = json.parsed[0].price;
  return Number(p.price) * 10 ** p.expo;
}
