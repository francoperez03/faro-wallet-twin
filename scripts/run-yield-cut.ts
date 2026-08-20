// Corre interes + corte de yield desde consola (mismo codigo que /api/account/interest y
// /api/account/yield-cut).
import { runInterestAndYieldCut } from "../lib/sobrecito-mini/prove-yield";

runInterestAndYieldCut()
  .then((r) => {
    console.log(JSON.stringify(r, (_k, v) => (typeof v === "bigint" ? v.toString() : v), 2));
  })
  .catch((e) => {
    console.error("ERROR:", e?.message ?? e);
    process.exit(1);
  });
