"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Send, TrendingUp, ArrowLeftRight, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/home", label: "Home", ariaLabel: "Ir a Home", icon: Home },
  { href: "/enviar", label: "Enviar", ariaLabel: "Ir a Enviar", icon: Send },
  { href: "/rendimiento", label: "Rendimiento", ariaLabel: "Ir a Rendimiento", icon: TrendingUp },
  { href: "/bridge", label: "Mover entre redes", ariaLabel: "Ir a Mover entre redes", icon: ArrowLeftRight },
  { href: "/actividad", label: "Actividad", ariaLabel: "Ir a Actividad", icon: ListOrdered },
];

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <main className="flex-1 pb-16">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 border-t border-zinc-100 bg-white">
        <ul className="flex">
          {TABS.map(({ href, label, ariaLabel, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  aria-label={ariaLabel}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 border-t-2 py-1 text-xs",
                    active
                      ? "border-blue-600 font-semibold text-blue-600"
                      : "border-transparent text-zinc-500"
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
  );
}
