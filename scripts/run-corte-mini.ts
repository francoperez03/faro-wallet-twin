// Corre el corte mini desde consola (mismo código que el endpoint /api/cuenta/corte-mini).
import { runCorteMini } from "../lib/sobrecito-mini/prove";

runCorteMini()
  .then((r) => {
    console.log(JSON.stringify(r, (_k, v) => (typeof v === "bigint" ? v.toString() : v), 2));
  })
  .catch((e) => {
    console.error("ERROR:", e?.message ?? e);
    process.exit(1);
  });
