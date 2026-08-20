"use client";

import { PAGE_WIDTH } from "@/lib/config/app";
import { cn } from "@/lib/utils";

import { usePrivy } from "@privy-io/react-auth";
import { ActivityCard } from "@/components/activity-card";

export default function ActividadPage() {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address as `0x${string}` | undefined;

  return (
    <div className={cn(PAGE_WIDTH, "flex flex-col gap-6 p-6 lg:p-8")}>
      <h1 className="font-serif text-3xl text-foreground">Actividad</h1>
      <ActivityCard walletAddress={walletAddress} />
    </div>
  );
}
