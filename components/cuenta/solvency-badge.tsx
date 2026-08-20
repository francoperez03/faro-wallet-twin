"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { REGISTRIES } from "@/lib/config/tokens";
import { useLatestCut } from "@/lib/sobrecito/use-registry";

// ponytail: verde/ámbar no están en la paleta de 01-UI-SPEC.md; extensión mínima
// necesaria para este semáforo (SOL-03), no decorativa.
const STATUS_STYLES = {
  green: "border-transparent bg-[#16A34A] text-white",
  amber: "border-transparent bg-[#D97706] text-white",
} as const;

export function SolvencyBadge() {
  const registry = REGISTRIES[0];
  const { hoursAgo, status, isLoading } = useLatestCut(registry);

  if (isLoading) {
    return <Skeleton className="h-8 w-64" />;
  }

  return (
    <div className="flex flex-col gap-2">
      {status === "none" ? (
        <p className="text-sm text-zinc-500">Todavía no hay un corte publicado.</p>
      ) : (
        <Badge className={STATUS_STYLES[status]}>
          Solvencia probada on-chain · último corte hace {Math.max(0, Math.round(hoursAgo ?? 0))} h
        </Badge>
      )}
      <Button asChild variant="link" className="h-auto w-fit p-0 text-blue-600">
        <Link href="/cuenta/verificar">Verificá tu inclusión</Link>
      </Button>
    </div>
  );
}
