// Aplica schema.sql contra DATABASE_URL. Correr con:
// npx dotenv -e .env.local -- npx tsx lib/db/apply-schema.ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Client, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no configurada");
  const schema = readFileSync(join(import.meta.dirname, "schema.sql"), "utf-8");
  // Client (WebSocket, protocolo simple) soporta el schema.sql completo (varias
  // sentencias separadas por ";") en un solo query, a diferencia del driver HTTP.
  const client = new Client(url);
  await client.connect();
  try {
    await client.query(schema);
    console.log("schema.sql aplicado.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
