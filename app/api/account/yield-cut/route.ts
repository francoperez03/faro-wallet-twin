import { NextRequest, NextResponse } from "next/server";
import { runInterestAndYieldCut } from "@/lib/sobrecito-mini/prove-yield";

// Fluid compute (D-diseño del plan de yield): proving con bb.js (WASM) para K=64 puede
// tardar, sin binarios nativos. 300s es el techo de una función Fluid de Vercel.
export const maxDuration = 300;

/**
 * Boton manual "correr corte ahora" del demo en vivo: protegido por CRON_SECRET, misma logica
 * que el cron de app/api/account/interest (runInterestAndYieldCut encadena accrueInterest() +
 * el corte de yield), expuesto en su propia ruta para poder disparar la corrida completa
 * on-demand sin esperar al cron de las 06:00.
 */
async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const bearerOk = secret && req.headers.get("authorization") === `Bearer ${secret}`;
  const customOk = secret && req.headers.get("x-cron-secret") === secret;
  if (!secret || (!bearerOk && !customOk)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const result = await runInterestAndYieldCut();
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
