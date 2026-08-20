import Link from "next/link";
import { cn } from "@/lib/utils";

/** Footer de disclosure (SHIP-02). Cada layout lo ubica donde corresponde:
 *  en (tabs) dentro de la columna de contenido (ya corrida por la sidebar),
 *  en las páginas standalone al final del contenido. */
export function DisclosureFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "border-t border-border bg-card px-4 py-3 text-center text-xs text-muted-foreground",
        className
      )}
    >
      PoC de hackathon, no auditado.{" "}
      <Link href="/disclosure" className="text-gold underline">
        Ver disclosure completo
      </Link>
    </footer>
  );
}
