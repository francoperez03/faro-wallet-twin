import { createConfig } from "@privy-io/wagmi";
import { http } from "viem";
import { arbitrum, base, mainnet, polygon } from "viem/chains";
import { RPC_URLS } from "@/lib/config/tokens";

export const wagmiConfig = createConfig({
  chains: [arbitrum, base, polygon, mainnet],
  transports: {
    [arbitrum.id]: http(RPC_URLS.arbitrum),
    [base.id]: http(RPC_URLS.base),
    [polygon.id]: http(RPC_URLS.polygon),
    [mainnet.id]: http(RPC_URLS.ethereum),
  },
});
