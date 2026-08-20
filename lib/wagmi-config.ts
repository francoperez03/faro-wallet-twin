import { createConfig } from "@privy-io/wagmi";
import { http } from "viem";
import { arbitrum, base, polygon } from "viem/chains";
import { RPC_URLS } from "@/lib/config/tokens";

export const wagmiConfig = createConfig({
  chains: [arbitrum, base, polygon],
  transports: {
    [arbitrum.id]: http(RPC_URLS.arbitrum),
    [base.id]: http(RPC_URLS.base),
    [polygon.id]: http(RPC_URLS.polygon),
  },
});
