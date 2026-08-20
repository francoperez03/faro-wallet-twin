import { NextRequest, NextResponse } from "next/server";
import { verifyPrivyToken } from "@/lib/privy-server";
import { sql } from "@/lib/db/client";
import { deriveSalt } from "@/lib/poseidon2/salt";

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
    });
  }

  // Sin fila de openings todavía no hay corte de yield publicado que incluya a este
  // usuario: no hay nada que recomputar, la UI muestra el estado "sin corte".
  return NextResponse.json({ noCut: true });
}
