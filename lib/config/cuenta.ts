import type { ChainKey } from "@/lib/config/tokens";

export const OMNIBUS_VAULT_ADDRESS: `0x${string}` = "0x13B56eA93CB18ae90d7Ff6E01Cb97C1AbFB2B992"; // D-06
export const DEPOSIT_CHAIN: ChainKey = "arbitrum"; // D-07: depósitos solo en Arbitrum
export const DAILY_WITHDRAW_LIMIT_BASE_UNITS = BigInt(1000) * BigInt(10) ** BigInt(18); // D-14: 1000 ARGt/día, unidades base
export const SPREAD_BPS = 0; // D-11
