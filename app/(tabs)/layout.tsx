"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { Home, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { HIDDEN_SECTIONS, PRODUCT_NAME } from "@/lib/config/app";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { authenticated } = usePrivy();
  // ponytail: foco en Wallet por ahora; volver a useCuentaMode() para reactivar el modo Cuenta.
  const homeHref = "/home";

  // id: sección de la prioridad de sacrificio de D-12 ('m1' -> Home nunca se oculta).
  const TABS = [
    { id: "m1", href: homeHref, label: "Home", ariaLabel: "Ir a Home", icon: Home, section: "cuenta" },
    { id: "vault", href: "/rewards", label: "Rewards", ariaLabel: "Ir a Rewards", icon: TrendingUp, section: "wallet" },
  ]
    .filter((tab) => !HIDDEN_SECTIONS.includes(tab.id))
    // Sin sesión solo Home queda navegable; el resto se muestra deshabilitado.
    .map((tab) => ({ ...tab, disabled: !authenticated && tab.href !== homeHref }));

  const isActive = (href: string) =>
    href === homeHref ? pathname === "/home" || pathname === "/account" : pathname === href;

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
            {TABS.map(({ href, label, ariaLabel, icon: Icon, disabled }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-label={ariaLabel}
                    aria-current={active ? "page" : undefined}
                    aria-disabled={disabled || undefined}
                    tabIndex={disabled ? -1 : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-3 px-5 text-sm",
                      disabled && "pointer-events-none opacity-40",
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
          <p className="text-center font-mono text-[11px] text-muted-foreground">v1.0</p>
        </div>
      </aside>

      <div className="flex min-h-full flex-1 flex-col lg:pl-[230px]">
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>

        {/* Tab bar mobile */}
        <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card lg:hidden">
          <ul className="flex">
            {TABS.map(({ href, label, ariaLabel, icon: Icon, disabled }) => {
              const active = isActive(href);
              return (
                <li key={href} className="flex-1">
                  <Link
                    href={href}
                    aria-label={ariaLabel}
                    aria-current={active ? "page" : undefined}
                    aria-disabled={disabled || undefined}
                    tabIndex={disabled ? -1 : undefined}
                    className={cn(
                      "flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 border-t-2 py-1 text-xs",
                      disabled && "pointer-events-none opacity-40",
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
