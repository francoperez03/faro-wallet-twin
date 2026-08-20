"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { REGISTRIES } from "@/lib/config/tokens";
import { useLatestCut } from "@/lib/sobrecito/use-registry";

const DOT_STYLES = {
  green: "bg-green",
  amber: "bg-amber",
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
        <p className="text-sm text-muted-foreground">Todavía no hay un corte publicado.</p>
      ) : (
        <Badge className="items-center gap-2 border border-border bg-card text-foreground">
          <span className={`h-1.5 w-1.5 rounded-full ${DOT_STYLES[status]}`} />
          Solvencia probada on-chain · último corte hace{" "}
          <span className="font-mono">{Math.max(0, Math.round(hoursAgo ?? 0))} h</span>
        </Badge>
      )}
      <Button asChild variant="link" className="h-auto w-fit p-0 text-gold">
        <Link href="/account/verify">Verificá tu inclusión</Link>
      </Button>
    </div>
  );
}
