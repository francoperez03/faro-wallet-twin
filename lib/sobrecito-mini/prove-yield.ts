import { Noir } from "@noir-lang/noir_js";
import { UltraHonkBackend, Barretenberg } from "@aztec/bb.js";
import { randomBytes } from "crypto";
import {
  createPublicClient,
  createWalletClient,
  http,
  keccak256,
  toBytes,
  toHex,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrum } from "viem/chains";
import { sql } from "@/lib/db/client";
import { RPC_URLS, REGISTRIES } from "@/lib/config/tokens";
import { recomputeCommitment } from "@/lib/poseidon2/commit";
import { deriveSalt } from "@/lib/poseidon2/salt";
import { registryAbi } from "@/lib/sobrecito/registry-abi";
import { accrueInterest, type AccrueInterestResult } from "@/lib/cuenta/interest";
import circuitArtifact from "@/circuits-mini/yield_cut.json";

// Mismo K y patron de key_hash que lib/sobrecito-mini/prove.ts (circuito hermano), anclas
// distintas: circuits-mini/yield_cut/src/params.nr::KEY_HASH ("FARO/YIELD/v1").
const K = 64;
const KEY_HASH: Hex = "0x4641524f2f5949454c442f7631";

// BN254 Fr, mismo módulo que Poseidon2/commit_totals dentro del circuito.
const BN254_FR = BigInt(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617",
);

// Registry #3 (pivote de yield), configurado por lib/config/tokens.ts (REGISTRIES[2]).
function getYieldRegistry() {
  const registry = REGISTRIES[2];
  if (!registry) throw new Error("REGISTRIES[2] (rendimiento) no configurado");
  return registry;
}

function getPublisherAccount() {
  const key = process.env.PUBLISHER_PRIVATE_KEY;
  if (!key) throw new Error("PUBLISHER_PRIVATE_KEY no configurada");
  return privateKeyToAccount((key.startsWith("0x") ? key : `0x${key}`) as Hex);
}

export type YieldCutResult = {
  corteId: Hex;
  cL: Hex;
  delta: bigint;
  txHash: Hex;
  usersIncluded: number;
};

/**
 * Corte de rendimiento (pivote de yield, ver circuits-mini/yield_cut): prueba que los
 * rewards acreditados por accrueInterest() son exactamente el rendimiento de Morpho
 * repartido pro rata, sin revelar balance_i. Encadenado DESPUES de accrueInterest en el
 * MISMO handler (app/api/account/interest/route.ts): usa `result.entries`/`result.delta`
 * tal cual salieron de esa corrida, nunca reconstruidos por timestamp (D-diseño del plan).
 * Devuelve null si no hubo delta>0 en el periodo (nada que probar, idempotente).
 */
export async function runYieldCut(result: AccrueInterestResult): Promise<YieldCutResult | null> {
  if (result.delta <= BigInt(0) || result.entries.length === 0) return null;
  if (result.entries.length > K) {
    throw new Error(`ledger tiene ${result.entries.length} usuarios, el circuito de yield soporta K=${K}`);
  }

  type UserRow = { userId: string; balance: bigint; reward: bigint; salt: bigint; commitment: bigint };
  const users: UserRow[] = result.entries.map((e) => {
    const salt = deriveSalt(e.userId);
    const commitment = recomputeCommitment([e.balance, e.reward], salt);
    return { userId: e.userId, balance: e.balance, reward: e.reward, salt, commitment };
  });

  // Inputs del circuito: usuarios reales primero, padding con balance/reward/salt=0 hasta K.
  const circuitUsers = users.map((u) => ({
    balance: u.balance.toString(),
    reward: u.reward.toString(),
    salt: u.salt.toString(),
  }));
  while (circuitUsers.length < K) {
    circuitUsers.push({ balance: "0", reward: "0", salt: "0" });
  }

  const r = BigInt("0x" + randomBytes(31).toString("hex")) % BN254_FR;

  const noir = new Noir(circuitArtifact as never);
  const { witness, returnValue } = await noir.execute({
    users: circuitUsers,
    r: r.toString(),
    key_hash: KEY_HASH,
    delta: result.delta.toString(),
  });
  const [cLWitness, deltaWitness] = returnValue as [Hex, Hex];

  const api = await Barretenberg.new({ threads: 1 });
  let proof: Hex;
  let publicInputs: readonly Hex[];
  try {
    const backend = new UltraHonkBackend(circuitArtifact.bytecode, api);
    const proofData = await backend.generateProof(witness, { verifierTarget: "evm" });
    proof = `0x${Buffer.from(proofData.proof).toString("hex")}` as Hex;
    publicInputs = proofData.publicInputs as readonly Hex[];
  } finally {
    await api.destroy();
  }

  // Layout [key_hash, cL, delta] (ver circuits-mini/yield_cut/src/main.nr): publicInputs[1]
  // es cL, publicInputs[2] es delta. Ambos tienen que coincidir con el returnValue del
  // witness (bug de la libreria si no coinciden, nunca del prover honesto).
  const cL = publicInputs[1];
  const deltaOut = publicInputs[2];
  if (!cL || BigInt(cL) !== BigInt(cLWitness)) {
    throw new Error("C_L de la proof no coincide con el returnValue del witness (bug)");
  }
  if (!deltaOut || BigInt(deltaOut) !== BigInt(deltaWitness) || BigInt(deltaOut) !== result.delta) {
    throw new Error("delta de la proof no coincide con el delta acreditado (bug)");
  }

  const corteId = keccak256(toBytes(`corte-yield-${new Date().toISOString().slice(0, 10)}`));

  const registry = getYieldRegistry();
  const publicClient = createPublicClient({ chain: arbitrum, transport: http(RPC_URLS.arbitrum) });
  const account = getPublisherAccount();
  const walletClient = createWalletClient({ account, chain: arbitrum, transport: http(RPC_URLS.arbitrum) });

  // cR = delta (PROBADO en esta version, publicInputs[2] == cR, ver contracts-yield/src/FaroYieldRegistry.sol).
  // verdicts/coverageBps/attestationHash: DECLARADOS, mismo criterio que lib/sobrecito-mini/prove.ts.
  const cutInput = {
    corteId,
    cL,
    cR: toHex(result.delta, { size: 32 }),
    blockB: result.blockB2,
    verdicts: [1] as const, // ARGt: cubierto (declarado)
    coverageBps: [10000] as const, // un bucket, 100% (declarado)
    attestationHash: keccak256(toBytes("corte-yield-attestation-declarada")),
  };

  const txHash = await walletClient.writeContract({
    address: registry.address,
    abi: registryAbi,
    functionName: "publish",
    args: [cutInput, proof, publicInputs as Hex[]],
  });
  await publicClient.waitForTransactionReceipt({ hash: txHash });

  // Vision publica (D-diseño): B1/B2 del corte publicado, para que /status recompute
  // Δ = convertToAssets(B2) - convertToAssets(B1) con dos eth_call historicos.
  await sql`
    insert into sync_state (key, value) values ('yield_last_block_b1', ${result.blockB1?.toString() ?? ""})
    on conflict (key) do update set value = excluded.value
  `;
  await sql`
    insert into sync_state (key, value) values ('yield_last_block_b2', ${result.blockB2.toString()})
    on conflict (key) do update set value = excluded.value
  `;
  await sql`
    insert into sync_state (key, value) values ('yield_last_corte_id', ${corteId})
    on conflict (key) do update set value = excluded.value
  `;

  // Una fila por usuario real en `openings` (D-09, misma tabla que el corte mini,
  // balances=[balance, reward] en vez de [argt_balance, bolt_balance]).
  for (const u of users) {
    await sql`
      insert into openings (corte_id, user_id, balances, commitment)
      values (${corteId}, ${u.userId}, ${JSON.stringify([u.balance.toString(), u.reward.toString()])}, ${u.commitment.toString()})
      on conflict (corte_id, user_id) do nothing
    `;
  }

  return { corteId, cL, delta: result.delta, txHash, usersIncluded: users.length };
}

export type InterestAndYieldCutResult = {
  interest: { deltaAccrued: string; usersCredited: number };
  yieldCut:
    | { corteId: Hex; cL: Hex; delta: string; txHash: Hex; usersIncluded: number }
    | { skipped: true; reason: string };
};

/**
 * Orquesta la corrida diaria completa (D-diseño del plan de yield, "un solo cron 06:00 que
 * hace interes + corte, mas simple y evita carreras"): accrueInterest() primero, despues
 * runYieldCut() ENCADENADO con el MISMO resultado. Usado por app/api/account/interest
 * (cron automatico) y app/api/account/yield-cut (boton manual "correr corte ahora" del demo):
 * mismo codigo, dos rutas de entrada. Si el corte falla, el interes YA se acredito (commit de
 * DB independiente): el error de corte se reporta pero nunca revierte el credito real.
 */
export async function runInterestAndYieldCut(): Promise<InterestAndYieldCutResult> {
  const result = await accrueInterest();

  let yieldCut: InterestAndYieldCutResult["yieldCut"];
  if (result.delta <= BigInt(0) || result.entries.length === 0) {
    yieldCut = { skipped: true, reason: "sin delta>0 en el periodo, nada que probar" };
  } else {
    try {
      const cut = await runYieldCut(result);
      yieldCut = cut
        ? { corteId: cut.corteId, cL: cut.cL, delta: cut.delta.toString(), txHash: cut.txHash, usersIncluded: cut.usersIncluded }
        : { skipped: true, reason: "runYieldCut devolvio null" };
    } catch (err) {
      const message = err instanceof Error ? err.message : "error desconocido en el corte de yield";
      yieldCut = { skipped: true, reason: message };
    }
  }

  return {
    interest: { deltaAccrued: result.deltaAccrued.toString(), usersCredited: result.usersCredited },
    yieldCut,
  };
}
