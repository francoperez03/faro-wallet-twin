import { hkdfSync } from "crypto";

// Orden del subgrupo escalar de BN254 (Fr), el field que usa Poseidon2 en commitment_lib.
const BN254_FR = BigInt(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617",
);

/**
 * D-07: salt = HKDF-SHA256(SOBRECITO_MASTER_HEX, did), reducido al field de Poseidon2.
 * Server-only (usa SOBRECITO_MASTER_HEX, jamás expuesto al browser). Compartido entre
 * app/api/cuenta/opening (Plan 02) y lib/sobrecito-mini/prove (Plan 03): mismo salt para
 * el mismo DID, determinístico, así que un corte real puede reusar el mismo derive.
 */
export function deriveSalt(did: string): bigint {
  const masterHex = process.env.SOBRECITO_MASTER_HEX;
  if (!masterHex) throw new Error("configurar SOBRECITO_MASTER_HEX");
  const ikm = Buffer.from(masterHex, "hex");
  const okm = hkdfSync("sha256", ikm, Buffer.alloc(0), Buffer.from(did, "utf8"), 32);
  return BigInt("0x" + Buffer.from(okm).toString("hex")) % BN254_FR;
}
