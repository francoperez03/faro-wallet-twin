import { Faro } from "@/components/faro";
import { PRODUCT_NAME } from "@/lib/config/app";

export default function FaroPreviewPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <Faro size={220} />
      <p className="font-serif text-4xl text-gold">{PRODUCT_NAME}</p>
    </main>
  );
}
