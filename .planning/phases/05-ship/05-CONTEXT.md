# Phase 5: Ship - Context

**Gathered:** 2026-08-19 (discusión conjunta) · ampliado 2026-08-20 en modo `--auto`
**Status:** Ready for planning
**Mode:** `--auto` (decisiones auto-seleccionadas con la opción recomendada, salvo el nombre, que queda como decisión del usuario)

<domain>
## Phase Boundary

La app queda deployada en Vercel con URL pública (SHIP-01), con el disclosure visible in-app (SHIP-02) y la submission enviada (URL + nombre + mail) antes del jueves 20/08 18:00 (SHIP-03). Ningún feature nuevo entra en esta fase: es deploy, verificación y entrega.

</domain>

<decisions>
## Implementation Decisions

### Nombre del producto (DECISIÓN DEL USUARIO · PENDIENTE)
- **D-01:** El nombre lo elige el usuario en esta fase (locked en la discusión conjunta del 19-08). Auto no puede resolverlo. Tres candidatos propuestos:
  1. **Faro**: el diferencial del producto es la solvencia visible on-chain; un faro es la metáfora directa (cualquiera puede mirar y verificar). Corto, pronunciable, banca en español.
  2. **Vera**: de verdad/verificable. Suena a fintech con nombre propio, funciona en inglés y español, y conecta con la verificación de inclusión del cliente.
  3. **Doble**: guiño a Twin (gemelo) y al respaldo 1:1 del saldo custodial con reservas probadas. Es el más ligado al hackathon.
- **D-02:** Hasta que el usuario elija, todo usa el working name `twin-neobank` (proyecto Vercel, repo, metadata). El rebrand al elegir es solo de display: strings de UI, `<title>`, disclosure y el nombre en el form de submission. El slug del proyecto Vercel no se renombra (evita romper la URL ya deployada).
- **D-03:** Sin video. La submission lleva solo URL + nombre + mail (el form pide eso).

### Disclosure (SHIP-02)
- **D-04:** Doble ubicación: footer persistente en toda la app con una línea corta ("PoC de hackathon, no auditado") que linkea a una página `/disclosure` con el texto completo. Cubre "visible in-app" sin ensuciar las pantallas de demo.
- **D-05:** Contenido de `/disclosure` (locked, heredado de Sobrecito y del brief):
  - PoC no auditado, construido para el hackathon "Twin your Neobank".
  - Qué está probado vs declarado: cL (pasivos) probado on-chain; cR, verdicts y coverage declarados vía declaredMask.
  - Clave de bóveda en el server como límite de demo (sin HSM ni multisig).
  - Texto legal de Twin del brief: las Twin Stablecoins son instrumentos de pago respaldados por reservas, no productos de inversión.
- **D-06:** La página `/status/twin-neobank` (fase 4) ya muestra declaredMask; el disclosure la linkea como evidencia, sin duplicar la data.

### Deploy en Vercel (SHIP-01)
- **D-07:** Cuenta `francoperez03s-projects`, plan hobby. Proyecto creado temprano (fase 1 ya deployada) para que el ship final sea verificación + form. Dominio: el subdominio `*.vercel.app` por defecto; dominio custom fuera de alcance.
- **D-08:** Env vars en Vercel (Production):
  - Públicas (`NEXT_PUBLIC_`): `NEXT_PUBLIC_PRIVY_APP_ID`; RPCs override opcionales si se configuraron por env en fase 1.
  - Solo server (jamás `NEXT_PUBLIC_`, jamás commiteadas): `DATABASE_URL` (Neon), `VAULT_PRIVATE_KEY`, `SOBRECITO_MASTER_HEX`.
  - Addresses de contratos y Registries: viven en el módulo de config único (D-10 de fase 1), son datos públicos; solo van a env si fase 2/4 las parametrizó así.
  - Checklist: verificar en el dashboard que ninguna secreta tenga prefijo `NEXT_PUBLIC_` antes del smoke final.
- **D-09:** Cron de interés (CTA-06): registrado en `vercel.json` (`crons`). El plan hobby limita los crons a una ejecución diaria, suficiente para el corte diario. El endpoint de trigger manual queda como respaldo para la demo (ya previsto en CTA-06).

### Smoke test pre-submission (orden por importancia para la demo)
- **D-10:** Checklist sobre la URL de producción, en este orden:
  1. Login Privy (email) y embedded wallet creada.
  2. Balances de ARGt por chain + total.
  3. Transfer de ARGt (monto chico) con switchChain automático.
  4. Vault: depositar y ver la posición (retiro si el tiempo alcanza).
  5. Bridge: approve + bridge con fee y balance de destino actualizado.
  6. Cuenta: pasar a cuenta, ver acreditación, retirar.
  7. Badge de solvencia verde en el home de Cuenta.
  8. `/status/twin-neobank` carga sin login y muestra el último corte.
  9. Footer de disclosure visible y `/disclosure` carga.
- **D-11:** El smoke arranca a más tardar 16:00. La submission se envía a las 17:30 como máximo (buffer de 30 min contra el form).

### Contingencia: milestone roto a las 17:00
- **D-12:** Si una sección está rota a las 17:00, se oculta con un feature flag simple (constante en el módulo de config, por ejemplo `HIDDEN_SECTIONS`) en vez de shippear errores visibles. Se submitea con lo que funciona: una demo más chica y prolija gana a una completa con pantallas rotas. Prioridad de sacrificio, de último a primero: bonus BOLt, bridge, Cuenta+solvencia, vault. Login y balances (M1) jamás se ocultan.

### Claude's Discretion
- Redacción exacta del copy del footer y de `/disclosure` (respetando D-05 y el estilo de escritura del proyecto).
- Layout de la página `/disclosure`.
- Mecánica exacta del feature flag de D-12.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Submission y riesgos
- `SPEC.md` §1 — Qué pide el hackathon y cómo se evalúa por milestones (lo que el smoke test debe cubrir)
- `SPEC.md` §8 — Riesgos operativos de la demo (gas por chain, RPCs de Polygon, fee del bridge)

### Planning
- `.planning/REQUIREMENTS.md` — SHIP-01/02/03
- `.planning/ROADMAP.md` — Success criteria de Phase 5 y dependencias (Phase 1, 3, 4; no depende de SOL-06)
- `.planning/PROJECT.md` — Constraints de disclosure y seguridad (jamás commitear `SOBRECITO_MASTER_HEX` ni `VAULT_PRIVATE_KEY`)

### Decisiones previas que esta fase ejecuta
- `.planning/phases/01-wallet-mode/01-CONTEXT.md` — D-10 (módulo de config único de addresses), tokens neutros de UI a la espera del nombre
- `.planning/phases/04-*/04-CONTEXT.md` — declaredMask y página `/status/twin-neobank` que el disclosure referencia (si existe al momento de planear)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Proyecto Vercel ya creado y con la fase 1 deployada: esta fase solo agrega env vars faltantes, el cron y el disclosure.
- Módulo de config único (fase 1, D-10): ahí viven las addresses y ahí entra el feature flag de D-12 y el nombre elegido como constante de branding.

### Integration Points
- `vercel.json` en la raíz para el cron de interés (D-09).
- Footer global en el layout raíz de Next.js (App Router) para el disclosure (D-04).
- `/status/twin-neobank` (fase 4) linkeada desde `/disclosure`.

</code_context>

<specifics>
## Specific Ideas

- El deploy temprano ya se hizo criterio de las fases anteriores: el ship final debe ser trámite (verificar, elegir nombre, submitear), sin trabajo técnico nuevo.
- Deadline duro: jueves 20/08 18:00. Submission enviada 17:30 como máximo (D-11).
- Mail de submission: franco.perez03@gmail.com.

</specifics>

<deferred>
## Deferred Ideas

- Dominio custom para el producto: fuera de alcance del hackathon, queda para después si el proyecto sigue.
- Renombrar el slug del proyecto Vercel al nombre elegido: solo si algún día importa la URL; hoy rompería la URL submitida.

</deferred>

---

*Phase: 05-ship*
*Context gathered: 2026-08-19 / 2026-08-20*
