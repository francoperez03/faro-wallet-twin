# Phase 5 · Ship — Context

Discutido 2026-08-19 (discusión conjunta de las 5 fases).

## Decisiones

- **Branding**: nombre propio para el neobanco (el usuario elige entre propuestas al llegar a esta fase; la UI de fase 1 usa tokens neutros hasta entonces). Sin video: la submission lleva solo URL + nombre + mail (el form pide eso).
- **Hosting**: Vercel (cuenta francoperez03s-projects, plan hobby, ya usada en vault-aggregator). Env vars: `NEXT_PUBLIC_PRIVY_APP_ID`, `DATABASE_URL` (Neon), `VAULT_PRIVATE_KEY`, `SOBRECITO_MASTER_HEX`, addresses de contratos y Registries.
- **Disclosure in-app** (obligatorio, heredado de Sobrecito): PoC no auditado; cL probado on-chain, cR/verdicts/coverage declarados (declaredMask); clave de bóveda en server como límite de demo; Twin Stablecoins son instrumentos de pago respaldados por reservas, no productos de inversión (texto del brief).
- **Deadline duro**: submission jueves 20/08 18:00. El deploy a Vercel se hace temprano (fase 1 ya deployada) para que el ship final sea solo verificación + form.
