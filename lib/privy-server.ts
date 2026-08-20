import { PrivyClient } from "@privy-io/server-auth";

export interface PrivyIdentity {
  userId: string;
  walletAddress: `0x${string}` | null;
}

let _client: PrivyClient | null = null;
function getClient(): PrivyClient {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;
  if (!appId || !appSecret || appId === "REPLACE_ME_PRIVY_APP_ID") {
    throw new Error("configurar Privy");
  }
  if (!_client) _client = new PrivyClient(appId, appSecret);
  return _client;
}

/** Verifica el access token de Privy (D-05) y resuelve la embedded wallet del usuario. Throws con status 401. */
export async function verifyPrivyToken(authHeader: string | null): Promise<PrivyIdentity> {
  const client = getClient();
  const token = authHeader?.replace(/^Bearer\s+/i, "");
  if (!token) throw new Error("401");

  let userId: string;
  try {
    const claims = await client.verifyAuthToken(token);
    userId = claims.userId;
  } catch {
    throw new Error("401");
  }

  const user = await client.getUser(userId);
  const embeddedWallet = user.linkedAccounts.find(
    (account) => account.type === "wallet" && account.walletClientType === "privy",
  );
  const walletAddress =
    embeddedWallet && "address" in embeddedWallet
      ? (embeddedWallet.address as `0x${string}`)
      : null;

  return { userId, walletAddress };
}
