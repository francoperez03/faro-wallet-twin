import { NextRequest, NextResponse } from "next/server";
import { hkdfSync } from "crypto";
import { verifyPrivyToken } from "@/lib/privy-server";
import { sql } from "@/lib/db/client";
import { recomputeCommitment } from "@/lib/poseidon2/commit";

// Orden del subgrupo escalar de BN254 (Fr), el field que usa Poseidon2 en commitment_lib.
const BN254_FR = BigInt(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617",
);

// D-09: no hay corte real en la era fixture, la API sirve un opening on-the-fly con un
// corte_id sintético fijo. Cuando exista el corte mini, esto pasa a leer una fila real
// de `openings(corte_id, ...)` (el salt se sigue derivando on-the-fly, es determinístico).
const SYNTHETIC_CORTE_ID = "fixture-sintetico";

/** D-07: salt = HKDF-SHA256(SOBRECITO_MASTER_HEX, did), reducido al field de Poseidon2. Server-only. */
function deriveSalt(did: string): bigint {
  const masterHex = process.env.SOBRECITO_MASTER_HEX;
  if (!masterHex) throw new Error("configurar SOBRECITO_MASTER_HEX");
  const ikm = Buffer.from(masterHex, "hex");
  const okm = hkdfSync("sha256", ikm, Buffer.alloc(0), Buffer.from(did, "utf8"), 32);
  return BigInt("0x" + Buffer.from(okm).toString("hex")) % BN254_FR;
}

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

  // T-04-04: el DID viene exclusivamente del access token verificado arriba, nunca de un
  // param de la request, así que este SELECT nunca puede devolver el balance de otro usuario.
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
