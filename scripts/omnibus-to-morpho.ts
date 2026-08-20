// Paso admin del modelo abstraído: deposita el ARGt líquido del omnibus en el vault de Morpho.
// La zkproof de yield audita exactamente este manejo: el rendimiento de estas shares
// es lo único que puede aparecer como rewards. Uso: npx dotenv -e .env.local -- npx tsx scripts/omnibus-to-morpho.ts
import { createPublicClient, createWalletClient, http, erc20Abi, formatUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrum } from "viem/chains";
import { TOKENS, VAULT_ARGT_PRIME, RPC_URLS } from "../lib/config/tokens";
import { OMNIBUS_VAULT_ADDRESS } from "../lib/config/cuenta";
import { vaultAbi } from "../lib/hooks/use-vault-position";

async function main() {
  const key = process.env.VAULT_PRIVATE_KEY;
  if (!key) throw new Error("VAULT_PRIVATE_KEY no configurada");
  const account = privateKeyToAccount(key as `0x${string}`);
  if (account.address.toLowerCase() !== OMNIBUS_VAULT_ADDRESS.toLowerCase()) {
    throw new Error("La clave no corresponde al omnibus");
  }
  const transport = http(RPC_URLS.arbitrum);
  const pub = createPublicClient({ chain: arbitrum, transport });
  const wallet = createWalletClient({ account, chain: arbitrum, transport });

  const argt = TOKENS.ARGt.addresses.arbitrum as `0x${string}`;
  const liquid = await pub.readContract({ address: argt, abi: erc20Abi, functionName: "balanceOf", args: [account.address] });
  if (liquid === BigInt(0)) {
    console.log("Omnibus sin ARGt líquido; nada para depositar.");
    return;
  }
  console.log(`Depositando ${formatUnits(liquid, 18)} ARGt en el vault...`);
  const approveHash = await wallet.writeContract({ address: argt, abi: erc20Abi, functionName: "approve", args: [VAULT_ARGT_PRIME.address as `0x${string}`, liquid] });
  await pub.waitForTransactionReceipt({ hash: approveHash });
  const depositHash = await wallet.writeContract({ address: VAULT_ARGT_PRIME.address as `0x${string}`, abi: vaultAbi, functionName: "deposit", args: [liquid, account.address] });
  const receipt = await pub.waitForTransactionReceipt({ hash: depositHash });
  const shares = await pub.readContract({ address: VAULT_ARGT_PRIME.address as `0x${string}`, abi: vaultAbi, functionName: "balanceOf", args: [account.address] });
  const value = await pub.readContract({ address: VAULT_ARGT_PRIME.address as `0x${string}`, abi: vaultAbi, functionName: "convertToAssets", args: [shares] });
  console.log(`Listo. tx=${receipt.transactionHash} shares=${shares} valor=${formatUnits(value as bigint, 18)} ARGt`);
}

main().catch((e) => { console.error("ERROR:", e?.message ?? e); process.exit(1); });
