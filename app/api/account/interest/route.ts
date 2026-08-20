import { NextRequest, NextResponse } from "next/server";
import { accrueInterest } from "@/lib/cuenta/interest";

/**
 * Protegido por CRON_SECRET (D-10): Vercel Cron invoca con GET y firma
 * `Authorization: Bearer $CRON_SECRET` automáticamente; el header `x-cron-secret`
 * es el path manual alternativo para curl/demo (POST, más natural para un trigger manual).
 * ponytail: Vercel Cron Jobs disparan GET, no POST (a diferencia de lo asumido en el plan);
 * se exponen ambos métodos con la misma lógica para que el cron real no 405.
 */
async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const bearerOk = secret && req.headers.get("authorization") === `Bearer ${secret}`;
  const customOk = secret && req.headers.get("x-cron-secret") === secret;
  if (!secret || (!bearerOk && !customOk)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await accrueInterest();
  return NextResponse.json({
    deltaAccrued: result.deltaAccrued.toString(),
    usersCredited: result.usersCredited,
  });
}

export const GET = handle;
export const POST = handle;
