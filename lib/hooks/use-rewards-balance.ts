"use client";

import { useQuery } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";

export const REWARDS_BALANCE_KEY = ["rewards-balance"] as const;

/** Saldo del usuario en Rewards según el ledger (`/api/account/account`): capital + interés acumulado. */
export function useRewardsBalance() {
  const { ready, authenticated, getAccessToken } = usePrivy();
  return useQuery({
    queryKey: REWARDS_BALANCE_KEY,
    enabled: ready && authenticated,
    queryFn: async () => {
      const token = await getAccessToken();
      const res = await fetch("/api/account/account", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`account ${res.status}`);
      const data = await res.json();
      const principal = BigInt(data.argtBalance);
      const interest = BigInt(data.interestAccrued);
      return { principal, interest, total: principal + interest };
    },
  });
}
