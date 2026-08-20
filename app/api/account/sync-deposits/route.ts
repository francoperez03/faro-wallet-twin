import { NextRequest, NextResponse } from "next/server";
import { verifyPrivyToken } from "@/lib/privy-server";
import { syncDeposits } from "@/lib/cuenta/deposits";
import { sql } from "@/lib/db/client";

export async function POST(req: NextRequest) {
  let identity;
  try {
    identity = await verifyPrivyToken(req.headers.get("authorization"));
  } catch (err) {
    const message = err instanceof Error ? err.message : "401";
    const detail = message === "configurar Privy" ? "configurar Privy" : "no autorizado";
    return NextResponse.json({ error: detail }, { status: 401 });
  }

  const { credited } = await syncDeposits();

  const myMovements = await sql`
    select id, amount, tx_hash, chain, created_at
    from movements
    where user_id = ${identity.userId} and type = 'deposit'
    order by created_at desc
    limit 10
  `;

  return NextResponse.json({
    credited,
    myNewMovements: myMovements.map((m) => ({
      id: m.id,
      amount: BigInt(m.amount).toString(),
      txHash: m.tx_hash,
      chain: m.chain,
      createdAt: m.created_at,
    })),
  });
}
