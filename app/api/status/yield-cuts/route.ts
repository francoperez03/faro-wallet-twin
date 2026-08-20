import { NextResponse } from "next/server";
import { sql } from "@/lib/db/client";

/**
 * GET publico (sin auth, datos publicos): todos los cortes de yield persistidos por
 * lib/sobrecito-mini/prove-yield.ts (B1/B2 y las dos lecturas convertToAssets de cada corte).
 * Fallback de YieldComparison (components/status/yield-comparison.tsx) cuando el recompute
 * on-chain en vivo no esta disponible (nodo de archivo caido) — valores como texto, exceden
 * Number.MAX_SAFE_INTEGER.
 */
export async function GET() {
  const rows = await sql`
    SELECT corte_id, block_b1::text, block_b2::text, value_b1::text, value_b2::text, created_at
    FROM yield_cuts
    ORDER BY created_at ASC
  `;
  return NextResponse.json(rows);
}
