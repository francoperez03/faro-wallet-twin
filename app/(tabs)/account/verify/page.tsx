"use client";

import { PAGE_WIDTH } from "@/lib/config/app";
import { cn } from "@/lib/utils";
import { VerifyRewards } from "@/components/verify-rewards";

export default function VerificarPage() {
  return (
    <div className={cn(PAGE_WIDTH, "flex flex-1 flex-col p-6 lg:p-8")}>
      <VerifyRewards />
    </div>
  );
}
