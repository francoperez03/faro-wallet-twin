"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/wagmi-config";

const queryClient = new QueryClient();

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
// ponytail: placeholder detection avoids crashing the Privy SDK (and the build's static
// prerender) when the app id hasn't been set up yet in dashboard.privy.io.
const PRIVY_CONFIGURED = Boolean(PRIVY_APP_ID) && PRIVY_APP_ID !== "REPLACE_ME_PRIVY_APP_ID";

export function Providers({ children }: { children: React.ReactNode }) {
  if (!PRIVY_CONFIGURED) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
        <h1 className="text-lg font-semibold text-foreground">Configurar Privy App ID</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Creá una app en dashboard.privy.io y seteá NEXT_PUBLIC_PRIVY_APP_ID en .env.local para
          habilitar el login.
        </p>
      </div>
    );
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID!}
      config={{
        loginMethods: ["email", "google"],
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
