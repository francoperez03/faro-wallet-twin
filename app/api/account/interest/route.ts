import { NextRequest, NextResponse } from "next/server";
import { runInterestAndYieldCut } from "@/lib/sobrecito-mini/prove-yield";

// Fluid compute: la corrida encadena accrueInterest() + el corte de yield con bb.js (WASM,
// proving en runtime, D-diseño del plan de yield). 300s es el techo de una función Fluid de
// Vercel (mismo techo que app/api/account/yield-cut).
export const maxDuration = 300;

/**
 * Protegido por CRON_SECRET (D-10): Vercel Cron invoca con GET y firma
 * `Authorization: Bearer $CRON_SECRET` automáticamente; el header `x-cron-secret`
 * es el path manual alternativo para curl/demo (POST, más natural para un trigger manual).
 * ponytail: Vercel Cron Jobs disparan GET, no POST (a diferencia de lo asumido en el plan);
 * se exponen ambos métodos con la misma lógica para que el cron real no 405.
 *
 * Pivote de yield (D-diseño del plan aprobado): un solo cron a las 06:00 hace interes Y
 * corte, encadenados en la MISMA corrida (runInterestAndYieldCut, lib/sobrecito-mini/prove-yield.ts)
 * en vez de dos crons separados: usa los MISMOS snapshots
 * de sync_state que repartio el interes, sin reconstruir el periodo por timestamp, y evita la
 * carrera de dos crons corriendo sobre el mismo ledger en ventanas distintas. Si el corte
 * falla, el interes YA quedo acreditado (commit de DB independiente); el fallo se reporta en
 * `yieldCut` sin afectar el 200 de esta respuesta.
 */
async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const bearerOk = secret && req.headers.get("authorization") === `Bearer ${secret}`;
  const customOk = secret && req.headers.get("x-cron-secret") === secret;
  if (!secret || (!bearerOk && !customOk)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await runInterestAndYieldCut();
  return NextResponse.json(result);
}

export const GET = handle;
export const POST = handle;
