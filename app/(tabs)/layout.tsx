"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Send, TrendingUp, ArrowLeftRight, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { DisclosureFooter } from "@/components/disclosure-footer";
import { useCuentaMode } from "@/lib/hooks/use-cuenta-mode";
import { HIDDEN_SECTIONS, PRODUCT_NAME } from "@/lib/config/app";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { mode } = useCuentaMode();
  const homeHref = mode === "cuenta" ? "/cuenta" : "/home";

  // id: sección de la prioridad de sacrificio de D-12 ('m1' -> Home nunca se oculta).
  const TABS = [
    { id: "m1", href: homeHref, label: "Home", ariaLabel: "Ir a Home", icon: Home, section: "cuenta" },
    { id: "m1", href: "/enviar", label: "Enviar", ariaLabel: "Ir a Enviar", icon: Send, section: "wallet" },
    { id: "vault", href: "/rendimiento", label: "Rendimiento", ariaLabel: "Ir a Rendimiento", icon: TrendingUp, section: "wallet" },
    { id: "bridge", href: "/bridge", label: "Mover entre redes", ariaLabel: "Ir a Mover entre redes", icon: ArrowLeftRight, section: "wallet" },
    { id: "m1", href: "/actividad", label: "Actividad", ariaLabel: "Ir a Actividad", icon: ListOrdered, section: "wallet" },
  ].filter((tab) => !HIDDEN_SECTIONS.includes(tab.id));

  const isActive = (href: string) =>
    href === homeHref ? pathname === "/home" || pathname === "/cuenta" : pathname === href;

  const crumb = pathname.replace(/^\//, "").replace(/\//g, " / ") || "home";

  return (
    <div className="flex min-h-full flex-1 flex-col lg:flex-row">
      {/* Sidebar desktop (brandkit app.twin.finance) */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[230px] flex-col border-r border-border bg-sidebar lg:flex">
        <div className="border-b border-border px-5 py-5">
          <Link href={homeHref} className="font-serif text-2xl text-gold">
            {PRODUCT_NAME}
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <p className="px-5 pb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Overview
          </p>
          <ul>
            {TABS.map(({ href, label, ariaLabel, icon: Icon }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-label={ariaLabel}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-3 px-5 text-sm",
                      active
                        ? "bg-gold-dim text-gold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-border p-4">
          <ModeToggle />
          <p className="pt-3 text-center font-mono text-[11px] text-muted-foreground">
            <Link href="/disclosure" className="underline hover:text-gold">
              disclosure
            </Link>{" "}
            · v1.0
          </p>
        </div>
      </aside>

      <div className="flex min-h-full flex-1 flex-col lg:pl-[230px]">
        {/* Header mobile (ModeToggle) / topbar desktop (breadcrumb) */}
        <div className="border-b border-border bg-card p-4 lg:hidden">
          <ModeToggle />
        </div>
        <div className="hidden items-center justify-between border-b border-border bg-card px-6 py-3 lg:flex">
          <p className="font-mono text-xs text-muted-foreground">
            {PRODUCT_NAME.toLowerCase()} <span className="text-gold">/</span> {crumb}
          </p>
          <span className="inline-flex items-center gap-2 rounded-[3px] border border-border px-2 py-1 font-mono text-[11px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-green" />
            Arbitrum · Base · Polygon
          </span>
        </div>

        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
        <DisclosureFooter className="mb-16 lg:mb-0" />

        {/* Tab bar mobile */}
        <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card lg:hidden">
          <ul className="flex">
            {TABS.map(({ href, label, ariaLabel, icon: Icon }) => {
              const active = isActive(href);
              return (
                <li key={href} className="flex-1">
                  <Link
                    href={href}
                    aria-label={ariaLabel}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 border-t-2 py-1 text-xs",
                      active
                        ? "border-gold font-semibold text-gold"
                        : "border-transparent text-muted-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-center leading-tight">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
