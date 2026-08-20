import { NextRequest, NextResponse } from "next/server";
import { verifyPrivyToken } from "@/lib/privy-server";
import { sql } from "@/lib/db/client";

export async function GET(req: NextRequest) {
  let identity;
  try {
    identity = await verifyPrivyToken(req.headers.get("authorization"));
  } catch (err) {
    const message = err instanceof Error ? err.message : "401";
    const detail = message === "configurar Privy" ? "configurar Privy" : "no autorizado";
    return NextResponse.json({ error: detail }, { status: 401 });
  }

  const { userId, walletAddress } = identity;

  const [account] = await sql`
    insert into accounts (user_id, wallet_address)
    values (${userId}, ${walletAddress})
    on conflict (user_id) do update
      set wallet_address = excluded.wallet_address, updated_at = now()
    returning user_id, wallet_address, argt_balance, bolt_balance
  `;

  const [{ interest_accrued }] = await sql`
    select coalesce(sum(amount), 0) as interest_accrued
    from movements
    where user_id = ${userId} and type = 'interest'
  `;

  return NextResponse.json({
    userId: account.user_id,
    walletAddress: account.wallet_address,
    argtBalance: BigInt(account.argt_balance).toString(),
    boltBalance: BigInt(account.bolt_balance).toString(),
    interestAccrued: BigInt(interest_accrued).toString(),
  });
}
