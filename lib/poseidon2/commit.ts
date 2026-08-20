import { permute } from "@zkpassport/poseidon2";

// ponytail: `@zkpassport/poseidon2` expone `permute` (la permutación cruda de Poseidon2
// sobre BN254, misma primitiva que `std::hash::poseidon2_permutation` de Noir), validada
// contra un vector real de `commitment_lib` (ver commit.test.ts). Se probó primero porque
// D-08 pide una lib JS que pase el vector antes de recurrir al fallback de witness
// execution con noir_js/bb.js; esta lib lo pasa exacto, así que el fallback no se necesitó.

const DOMAIN_USER_COMMITMENT = BigInt("0x534f4252454349544f2f555345522f7631");
const IV_LEN_SHIFT = BigInt(1) << BigInt(64);
const RATE = 3; // capacidad=1, state width=4, espejo de commitment_lib::Poseidon2

function ivFor(domain: bigint, nAbsorbed: number): bigint {
  return domain * IV_LEN_SHIFT + BigInt(nAbsorbed);
}

/** Reimplementa commitment_lib::commit (sponge duplex, rate=3/capacidad=1, IV = domain*2^64+n). */
export function recomputeCommitment(balances: bigint[], salt: bigint): bigint {
  const state = [BigInt(0), BigInt(0), BigInt(0), ivFor(DOMAIN_USER_COMMITMENT, balances.length + 1)];
  const cache = [BigInt(0), BigInt(0), BigInt(0)];
  let cacheSize = 0;

  const absorb = (input: bigint) => {
    if (cacheSize === RATE) {
      for (let j = 0; j < RATE; j++) state[j] += cache[j];
      const permuted = permute(state);
      for (let j = 0; j < 4; j++) state[j] = permuted[j];
      cache[0] = input;
      cacheSize = 1;
    } else {
      cache[cacheSize] = input;
      cacheSize += 1;
    }
  };

  for (const balance of balances) absorb(balance);
  absorb(salt);

  for (let j = 0; j < RATE; j++) {
    if (j < cacheSize) state[j] += cache[j];
  }
  const permuted = permute(state);
  for (let j = 0; j < 4; j++) state[j] = permuted[j];
  return state[0];
}
