# Phase 3 · Modo Cuenta — Context

Discutido 2026-08-19 (discusión conjunta de las 5 fases).

## Decisiones

- **Ledger**: Postgres vía Vercel Marketplace (Neon). Tablas `accounts(user_id, argt_balance, bolt_balance, updated_at)` y `movements(id, user_id, type, amount, token, tx_hash, created_at)`. Seed con ~60 usuarios sintéticos.
- **Bóveda omnibus**: la misma wallet M2 (`0x13B5...B992`) hace de bóveda y publisher. Necesita ARGt (fondeo del usuario) y gas en Base/Polygon para retiros multichain.
- **Detección de depósitos**: polling de logs `Transfer(from, to=bóveda)` por chain (viem `getLogs` en un cron corto o al cargar la vista), matcheando `from` contra las embedded wallets conocidas (Privy DID ↔ address).
- **Interés**: **cron real de Vercel** (`vercel.json`/`vercel.ts` crons): lee el delta de `convertToAssets` del vault y acredita pro rata como movimientos `interest`. Exponer también el endpoint para dispararlo a mano en la demo (mismo handler).
- **Retiros**: el backend firma desde la bóveda con viem (clave en env de Vercel, solo server). Límite diario por usuario hardcodeado.
- **user_id** = DID de Privy (`did:privy:...`), verificado server-side con el access token de Privy en cada request.
