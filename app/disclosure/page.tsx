import Link from "next/link";

export default function DisclosurePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <h1 className="text-xl font-semibold text-zinc-900">Disclosure</h1>

      <section className="flex flex-col gap-2">
        <p className="text-base text-zinc-900">
          Twin Neobank es un PoC no auditado, construido para el hackathon
          &quot;Twin your Neobank&quot;.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">Qué está probado y qué está declarado</h2>
        <p className="text-base text-zinc-900">
          El pasivo custodial (cL) está probado on-chain con una prueba ZK publicada en cada
          corte diario. El activo respaldado (cR), los verdicts de cada tramo y el coverage
          resultante están declarados por el operador vía <code>declaredMask</code>, sin prueba
          criptográfica propia en esta versión.
        </p>
        <p className="text-base text-zinc-900">
          El detalle de cada corte, con qué está probado y qué está declarado, se puede revisar en{" "}
          <Link href="/status/twin-neobank" className="text-[#2563EB] underline">
            /status/twin-neobank
          </Link>
          .
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">Custodia de la clave de la bóveda</h2>
        <p className="text-base text-zinc-900">
          La clave privada de la bóveda vive en el servidor de esta demo, sin HSM ni esquema
          multisig. Es un límite conocido de esta PoC, no una práctica recomendada para producción.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">Aviso legal</h2>
        <p className="text-base text-zinc-900">
          Las Twin Stablecoins son instrumentos de pago respaldados por reservas, no productos de
          inversión.
        </p>
      </section>
    </div>
  );
}
