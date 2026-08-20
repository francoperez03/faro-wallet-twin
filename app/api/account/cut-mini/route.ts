import { NextRequest, NextResponse } from "next/server";
import { runCorteMini } from "@/lib/sobrecito-mini/prove";

// Fluid compute (D-03/D-06): proving con bb.js (WASM) para K=64 puede tardar, sin
// binarios nativos. 300s es el techo de una función Fluid de Vercel.
export const maxDuration = 300;

/**
 * Protegido por CRON_SECRET, mismo patrón que app/api/cuenta/interest/route.ts (T-04-07):
 * Vercel Cron dispara GET con `Authorization: Bearer $CRON_SECRET`; el header
 * `x-cron-secret` es el path manual (POST, "correr corte ahora" en la demo en vivo).
 */
async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const bearerOk = secret && req.headers.get("authorization") === `Bearer ${secret}`;
  const customOk = secret && req.headers.get("x-cron-secret") === secret;
  if (!secret || (!bearerOk && !customOk)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const result = await runCorteMini();
    return NextResponse.json({
      corteId: result.corteId,
      cL: result.cL,
      txHash: result.txHash,
      usersIncluded: result.usersIncluded,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
