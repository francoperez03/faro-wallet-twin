import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Twin Neobank",
  description: "Neobanco sobre las stablecoins de Twin",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Toaster />
        {/* mb-16: reserva el alto del tab bar fijo de app/(tabs)/layout.tsx para que
            el footer no quede tapado al hacer scroll hasta el final en esas rutas. */}
        <footer className="mb-16 border-t border-zinc-100 bg-white px-4 py-3 text-center text-xs text-zinc-500">
          PoC de hackathon, no auditado.{" "}
          <Link href="/disclosure" className="text-[#2563EB] underline">
            Ver disclosure completo
          </Link>
        </footer>
      </body>
    </html>
  );
}
