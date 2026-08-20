import { NextRequest, NextResponse } from "next/server";
import { verifyPrivyToken } from "@/lib/privy-server";
import { withdraw } from "@/lib/cuenta/withdrawals";
import { CHAINS, type ChainKey } from "@/lib/config/tokens";

export async function POST(req: NextRequest) {
  let identity;
  try {
    identity = await verifyPrivyToken(req.headers.get("authorization"));
  } catch (err) {
    const message = err instanceof Error ? err.message : "401";
    const detail = message === "configurar Privy" ? "configurar Privy" : "no autorizado";
    return NextResponse.json({ error: detail }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const amount = body?.amount;
  const chain = body?.chain;

  if (typeof amount !== "string" && typeof amount !== "number") {
    return NextResponse.json({ error: "amount inválido" }, { status: 400 });
  }
  let amountBaseUnits: bigint;
  try {
    amountBaseUnits = BigInt(amount);
  } catch {
    return NextResponse.json({ error: "amount inválido" }, { status: 400 });
  }
  if (amountBaseUnits <= BigInt(0)) {
    return NextResponse.json({ error: "amount debe ser mayor a 0" }, { status: 400 });
  }
  if (typeof chain !== "string" || !CHAINS.includes(chain as ChainKey)) {
    return NextResponse.json({ error: "chain no soportada" }, { status: 400 });
  }

  const result = await withdraw(identity.userId, amountBaseUnits, chain as ChainKey);

  if (result.status === "failed") {
    return NextResponse.json(result, { status: 422 });
  }
  return NextResponse.json(result);
}
