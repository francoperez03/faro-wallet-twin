import { NextRequest, NextResponse } from "next/server";
import { verifyPrivyToken } from "@/lib/privy-server";
import { sql } from "@/lib/db/client";
import { recomputeCommitment } from "@/lib/poseidon2/commit";
import { deriveSalt } from "@/lib/poseidon2/salt";

// D-09: no hay corte real en la era fixture, la API sirve un opening on-the-fly con un
// corte_id sintético fijo. Cuando exista el corte mini, esto pasa a leer una fila real
// de `openings(corte_id, ...)` (el salt se sigue derivando on-the-fly, es determinístico).
const SYNTHETIC_CORTE_ID = "fixture-sintetico";

export async function GET(req: NextRequest) {
  let identity;
  try {
    identity = await verifyPrivyToken(req.headers.get("authorization"));
  } catch (err) {
    const message = err instanceof Error ? err.message : "401";
    const detail = message === "configurar Privy" ? "configurar Privy" : "no autorizado";
    return NextResponse.json({ error: detail }, { status: 401 });
  }

  const { userId } = identity;

  let salt: bigint;
  try {
    salt = deriveSalt(userId);
  } catch {
    return NextResponse.json({ error: "configurar SOBRECITO_MASTER_HEX" }, { status: 500 });
  }

  // D-09: si existe una fila de corte mini real para este usuario (la corrida más reciente
  // que lo incluyó), servir esa fila en vez de recomputar sobre el balance actual. El salt
  // se sigue derivando on-the-fly (determinístico por DID, no depende del corte).
  // T-04-04: el DID viene exclusivamente del access token verificado arriba, nunca de un
  // param de la request, así que estos SELECT nunca pueden devolver el balance de otro usuario.
  const openingRows = await sql`
    select corte_id, balances, commitment from openings
    where user_id = ${userId}
    order by created_at desc
    limit 1
  `;
  if (openingRows[0]) {
    const row = openingRows[0];
    return NextResponse.json({
      balances: row.balances,
      salt: salt.toString(),
      corteId: row.corte_id,
      commitment: row.commitment,
      synthetic: false,
    });
  }

  const rows = await sql`select argt_balance from accounts where user_id = ${userId}`;
  const balance = rows[0] ? BigInt(rows[0].argt_balance) : BigInt(0);

  const commitment = recomputeCommitment([balance], salt);

  return NextResponse.json({
    balances: [balance.toString()],
    salt: salt.toString(),
    corteId: SYNTHETIC_CORTE_ID,
    commitment: commitment.toString(),
    synthetic: true,
  });
}
