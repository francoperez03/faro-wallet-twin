import { neon, neonConfig, Pool, type PoolClient } from "@neondatabase/serverless";
import ws from "ws";

// Pool (WebSocket) necesita un ws constructor fuera de Cloudflare Workers/edge.
neonConfig.webSocketConstructor = ws;

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no configurada");
  return url;
}

// ponytail: getDb() lazy, nunca se conecta en module-eval (build time), solo en el primer query real.
let _httpSql: ReturnType<typeof neon> | null = null;
function getDb() {
  if (!_httpSql) _httpSql = neon(getDatabaseUrl());
  return _httpSql;
}

/** Tagged template para queries sueltas de lectura (HTTP driver, sin transacción interactiva). */
export const sql = ((strings: TemplateStringsArray, ...values: unknown[]) =>
  getDb()(strings, ...values)) as ReturnType<typeof neon>;

/**
 * Sesión interactiva real (WebSocket): BEGIN -> fn(client) -> COMMIT, o ROLLBACK si fn tira.
 * Necesario para flujos con branching sobre una lectura intermedia (retiro: lock -> sumar 24h ->
 * rechazar/debitar; interés: leer delta -> if/else) que el driver HTTP no puede expresar como batch.
 */
export async function withTx<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const pool = new Pool({ connectionString: getDatabaseUrl() });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}
