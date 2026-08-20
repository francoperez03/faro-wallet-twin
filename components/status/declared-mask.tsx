// Texto fijo: declaredMask es 0x0F (constante) en toda esta fase, ver <interfaces> de 04-01-PLAN.md.
export function DeclaredMask() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-sm text-foreground/80">
      <p className="font-semibold text-foreground">Qué está probado y qué declarado</p>
      <ul className="mt-2 flex flex-col gap-1">
        <li>
          <span className="font-medium text-green">cL (pasivos):</span> probado on-chain, verificado
          criptográficamente por el HonkVerifier.
        </li>
        <li>
          <span className="font-medium text-amber">cR (reservas), veredictos, cobertura y attestation
          hash:</span> declarados por el publisher, sin verificación criptográfica en esta fase.
        </li>
      </ul>
      <p className="mt-2 text-muted-foreground">
        La inclusión de un usuario puntual se verifica comparando su opening contra el commitment que el
        backend registró para él en el corte. Los commitments individuales no están on-chain (solo cL), así
        que la garantía contra omisión viene del binding que hace el auditor, no de la chain sola.
      </p>
    </div>
  );
}
