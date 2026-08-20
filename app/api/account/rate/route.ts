import { NextResponse } from "next/server";
import { sql } from "@/lib/db/client";

/** GET APY anualizado a partir de los últimos dos snapshots de convertToAssets (D-12). */
export async function GET() {
  const rows = await sql`
    SELECT key, value FROM sync_state
    WHERE key IN ('convertToAssets_prev_value', 'convertToAssets_prev_at', 'convertToAssets_snapshot_value', 'convertToAssets_snapshot_at')
  `;
  const state = Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string | undefined>;
  const { convertToAssets_prev_value, convertToAssets_prev_at, convertToAssets_snapshot_value, convertToAssets_snapshot_at } =
    state;

  if (!convertToAssets_prev_value || !convertToAssets_prev_at || !convertToAssets_snapshot_value || !convertToAssets_snapshot_at) {
    return NextResponse.json({ apy: null });
  }

  const prev = Number(convertToAssets_prev_value);
  const actual = Number(convertToAssets_snapshot_value);
  const intervaloDias = (new Date(convertToAssets_snapshot_at).getTime() - new Date(convertToAssets_prev_at).getTime()) / 86400000;

  if (!(prev > 0) || !(intervaloDias > 0)) {
    return NextResponse.json({ apy: null });
  }

  const tasaPeriodica = (actual - prev) / prev;
  const apy = Math.pow(1 + tasaPeriodica, 365 / intervaloDias) - 1;

  if (!Number.isFinite(apy)) {
    return NextResponse.json({ apy: null });
  }

  return NextResponse.json({ apy, asOf: convertToAssets_snapshot_at });
}
