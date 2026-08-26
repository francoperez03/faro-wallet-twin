import { NextResponse } from "next/server";

// Hermes exige API key desde el 26/08/2026 (Pyth Terminal: https://pythdata.app/signup). La key vive
// en el server, por eso el browser pasa por acá. HERMES_URL permite apuntar a otro proveedor.
const HERMES =
  process.env.HERMES_URL ?? "https://pyth.dourolabs.app/hermes/v2/updates/price/latest";

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id || !/^0x[0-9a-fA-F]{64}$/.test(id)) {
    return NextResponse.json({ error: "feed id inválido" }, { status: 400 });
  }
  const key = process.env.PYTH_API_KEY;
  const res = await fetch(`${HERMES}?ids[]=${id}&encoding=hex`, {
    cache: "no-store",
    headers: key ? { Authorization: `Bearer ${key}` } : undefined,
  });
  if (!res.ok) {
    return NextResponse.json(
      { error: key ? `Hermes ${res.status}` : "Falta PYTH_API_KEY" },
      { status: 502 },
    );
  }
  return NextResponse.json(await res.json(), {
    headers: { "Cache-Control": "no-store" },
  });
}
