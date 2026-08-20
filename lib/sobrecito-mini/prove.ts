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
import circuitArtifact from "@/circuits-mini/liabilities_batch_mini.json";

// D-01: K=64 (ledger de la demo <=64 usuarios, un solo lote), T=2 (ARGt + BOLt), mismo
// key_hash que circuits-mini/liabilities_batch_mini/src/params.nr::KEY_HASH (constrainido
// en el circuito, ver Task 1 del plan).
const K = 64;
const KEY_HASH: Hex = "0x54574e2f4d494e492f7631";

// BN254 Fr, mismo módulo que Poseidon2/commit_totals dentro del circuito.
const BN254_FR = BigInt(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617",
);

// Registry #2 (04-03 Task 2), configurado por lib/config/tokens.ts (REGISTRIES[1]).
function getMiniRegistry() {
  const registry = REGISTRIES[1];
  if (!registry) throw new Error("REGISTRIES[1] (corte mini) no configurado");
  return registry;
}

function getPublisherAccount() {
  const key = process.env.PUBLISHER_PRIVATE_KEY;
  if (!key) throw new Error("PUBLISHER_PRIVATE_KEY no configurada");
  return privateKeyToAccount((key.startsWith("0x") ? key : `0x${key}`) as Hex);
}

export type CorteMiniResult = {
  corteId: Hex;
  cL: Hex;
  txHash: Hex;
  usersIncluded: number;
};

/**
 * Pipeline completo del corte mini (D-06): exporta el ledger, prueba con bb.js (WASM,
 * sin binarios nativos) el circuito de circuits-mini/liabilities_batch_mini.json, arma
 * el CutInput y publica al segundo Registry firmando con la wallet publisher (M2). Cada
 * corrida exitosa persiste una fila por usuario en `openings` (D-09).
 */
export async function runCorteMini(): Promise<CorteMiniResult> {
  const rows = await sql`
    select user_id, argt_balance, bolt_balance from accounts order by user_id
  `;
  if (rows.length === 0) throw new Error("ledger vacío, nada que probar");
  if (rows.length > K) {
    throw new Error(`ledger tiene ${rows.length} usuarios, el circuito mini soporta K=${K}`);
  }

  type UserRow = { userId: string; argt: bigint; bolt: bigint; salt: bigint; commitment: bigint };
  const users: UserRow[] = rows.map((row) => {
    const argt = BigInt(row.argt_balance);
    const bolt = BigInt(row.bolt_balance);
    const salt = deriveSalt(row.user_id);
    const commitment = recomputeCommitment([argt, bolt], salt);
    return { userId: row.user_id, argt, bolt, salt, commitment };
  });

  // Inputs del circuito: los usuarios reales primero, padding con balances/salt=0 hasta K.
  // Padding no afecta totales (suma 0) ni corteId/openings (no tienen user_id real).
  const circuitUsers = users.map((u) => ({
    balances: [u.argt.toString(), u.bolt.toString()],
    salt: u.salt.toString(),
  }));
  while (circuitUsers.length < K) {
    circuitUsers.push({ balances: ["0", "0"], salt: "0" });
  }

  const r = BigInt("0x" + randomBytes(31).toString("hex")) % BN254_FR;

  const noir = new Noir(circuitArtifact as never);
  const { witness, returnValue } = await noir.execute({
    users: circuitUsers,
    r: r.toString(),
    key_hash: KEY_HASH,
  });

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

  const cL = publicInputs[1];
  if (!cL || BigInt(cL) !== BigInt(returnValue as Hex)) {
    throw new Error("C_L de la proof no coincide con el returnValue del witness (bug)");
  }

  const corteId = keccak256(toBytes(`corte-mini-${new Date().toISOString().slice(0, 10)}`));

  const registry = getMiniRegistry();
  const publicClient = createPublicClient({ chain: arbitrum, transport: http(RPC_URLS.arbitrum) });
  const blockB = await publicClient.getBlockNumber();
  const account = getPublisherAccount();
  const walletClient = createWalletClient({ account, chain: arbitrum, transport: http(RPC_URLS.arbitrum) });

  // cR/verdicts/coverageBps/attestationHash: DECLARADOS, mismo criterio que Phase 2
  // (Sobrecito contracts/script/Publish.s.sol) — no probados en esta fase (T-04-08/D-04).
  const cutInput = {
    corteId,
    cL,
    cR: toHex(BigInt(0xc0ffee), { size: 32 }),
    blockB,
    verdicts: [1, 1] as const, // ARGt, BOLt: cubiertos (declarado)
    coverageBps: [10000] as const, // un bucket, 100% (declarado)
    attestationHash: keccak256(toBytes("corte-mini-attestation-declarada")),
  };

  const txHash = await walletClient.writeContract({
    address: registry.address,
    abi: registryAbi,
    functionName: "publish",
    args: [cutInput, proof, publicInputs as Hex[]],
  });
  await publicClient.waitForTransactionReceipt({ hash: txHash });

  // D-09: una fila por usuario real (nunca por padding), idempotente por (corte_id, user_id).
  for (const u of users) {
    await sql`
      insert into openings (corte_id, user_id, balances, commitment)
      values (${corteId}, ${u.userId}, ${JSON.stringify([u.argt.toString(), u.bolt.toString()])}, ${u.commitment.toString()})
      on conflict (corte_id, user_id) do nothing
    `;
  }

  return { corteId, cL, txHash, usersIncluded: users.length };
}
