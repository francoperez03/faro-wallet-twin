"use client";

import Link from "next/link";
import { PRODUCT_NAME } from "@/lib/config/app";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <Link href="/home" className="font-serif text-2xl text-gold">
          {PRODUCT_NAME}
        </Link>
        <div className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground sm:flex">
          <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
          Arbitrum · Base · Polygon
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
