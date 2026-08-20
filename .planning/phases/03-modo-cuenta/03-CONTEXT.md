# Phase 3: Modo Cuenta - Context

**Gathered:** 2026-08-20 (incorpora las decisiones de la discusión conjunta del 2026-08-19)
**Status:** Ready for planning
**Mode:** `--auto` (áreas restantes resueltas con la opción recomendada, revisables abajo)

<domain>
## Phase Boundary

Un usuario alterna entre modo Wallet y modo Cuenta con un toggle persistente, pasa ARGt a su Cuenta (transfer a la bóveda omnibus, acreditado cuando el backend detecta el evento Transfer atado a su DID de Privy), ve su saldo, interés acumulado y tasa actual, y retira a su embedded wallet en la chain elegida respetando un límite diario. El ledger vive en Postgres (Neon) con cuentas y movimientos, sembrado con ~60 usuarios sintéticos para que el corte de Phase 4 tenga volumen. El badge de solvencia, la verificación de inclusión y el semáforo público pertenecen a Phase 4. Requirements: CTA-01..CTA-06.

</domain>

<decisions>
## Implementation Decisions

### Ledger y acceso a datos
- **D-01** (locked 19-08): Postgres vía Vercel Marketplace (Neon). Tablas `accounts` y `movements`. Seed con ~60 usuarios sintéticos.
- **D-02:** Sin ORM: SQL crudo con `@neondatabase/serverless` (tagged template `sql`). Dos tablas y un puñado de queries no justifican Drizzle ni Prisma contra el deadline. Schema en un único `schema.sql` idempotente (`CREATE TABLE IF NOT EXISTS`) aplicado por un script de setup/seed.
- **D-03:** Schema concreto:
  - `accounts(user_id text PK, wallet_address text UNIQUE, argt_balance numeric(38,0), bolt_balance numeric(38,0), created_at, updated_at)`. Balances en unidades base (18 decimals) como enteros, nunca floats.
  - `movements(id serial PK, user_id, type text CHECK (deposit|withdraw|interest), token text, amount numeric(38,0), chain text, tx_hash text, status text, created_at)`. Índice único parcial sobre `tx_hash` para `type='deposit'` (idempotencia, ver D-08).
  - `sync_state(key text PK, value text)`: guarda `last_processed_block` (depósitos, Arbitrum) y el último snapshot de `convertToAssets` con su timestamp (interés).
- **D-04:** `wallet_address` se puebla en el primer request autenticado de cada usuario: el backend verifica el access token de Privy, obtiene el DID y la embedded wallet, y hace upsert del account. Los depósitos matchean `from` contra esa columna.

### Identidad y auth
- **D-05** (locked 19-08): `user_id` = DID de Privy (`did:privy:...`), verificado server-side con el access token de Privy (`@privy-io/server-auth`) en cada request a las API routes de Cuenta.

### Depósitos (pasar a Cuenta)
- **D-06** (locked 19-08): detección por polling de logs `Transfer(from, to=bóveda)` con viem `getLogs`, matcheando `from` contra las embedded wallets conocidas (DID ↔ address). Bóveda omnibus = wallet M2 `0x13B56eA93CB18ae90d7Ff6E01Cb97C1AbFB2B992`.
- **D-07:** Depósitos solo en Arbitrum para esta fase. El SPEC §7.3 ancla la escucha en Arbitrum y ahí viven el vault y el interés. "Pasar a Cuenta" hace `switchChain` a Arbitrum antes del transfer (mismo patrón que D-05 de Phase 1); si el usuario tiene ARGt en otra chain, la UI sugiere el bridge (mismo patrón que D-07 de Phase 1). Los retiros sí son multichain (D-11).
- **D-08:** Mecanismo de polling: on-demand, sin worker dedicado. Un endpoint `sync-deposits` corre `getLogs` desde `last_processed_block + 1` hasta `latest` y acredita lo que encuentre. Se dispara: (a) al cargar la vista Cuenta, (b) con polling corto del cliente (cada ~5 s) mientras la pantalla "Pasar a Cuenta" espera la acreditación, y (c) desde el cron de interés como barrido de respaldo. El cron de Vercel (mínimo 1/min en el plan hobby es diario, así que no sirve como detector primario) queda solo como respaldo.
- **D-09:** Profundidad de confirmación: se acredita apenas el log aparece en `getLogs` hasta `latest`, sin esperar depth extra. Reorgs en Arbitrum son rarísimos y es una demo; el índice único sobre `tx_hash` (D-03) impide doble acreditación si dos syncs se superponen. `last_processed_block` se actualiza en la misma transacción SQL que inserta los movimientos.

### Interés
- **D-10** (locked 19-08): cron real de Vercel (`vercel.json`) que lee el delta de `convertToAssets(vault.balanceOf(bóveda))` y acredita pro rata como movimientos `interest`. El mismo handler queda expuesto como endpoint manual (protegido con `CRON_SECRET`) para dispararlo en la demo.
- **D-11:** Matemática del devengo: en cada corrida, `delta = convertToAssets_actual - snapshot_anterior` (guardado en `sync_state`). Si `delta <= 0`, no se acredita nada y se actualiza el snapshot. Si `delta > 0`, se reparte pro rata por `argt_balance` al momento de la corrida, con aritmética bigint: `floor(delta * balance_usuario / total_balances)`. El remanente del redondeo queda sin acreditar (queda en la bóveda). Spread = 0 para la demo, como constante `SPREAD_BPS = 0` en el módulo de config.
- **D-12:** Tasa mostrada (CTA-03): APY anualizado a partir de los dos últimos snapshots de `convertToAssets` guardados por el cron. Con menos de dos snapshots se muestra "—" con link "ver en Morpho" (consistente con D-07 de Phase 1). El interés acumulado del usuario es la suma de sus movimientos `interest`.

### Retiros
- **D-13** (locked 19-08): el backend firma `transfer` desde la bóveda con viem, clave en env de Vercel (solo server, jamás commiteada). Límite diario por usuario hardcodeado.
- **D-14:** Valor del límite: 1.000 ARGt por usuario por día (constante en el módulo de config), verificado server-side sumando los movimientos `withdraw` de las últimas 24 h (ventana móvil).
- **D-15:** Concurrencia y nonce: las corridas de retiro se serializan con un advisory lock de Postgres por chain (`pg_advisory_xact_lock`) alrededor de la secuencia debitar → firmar → enviar. Con una demo de bajo tráfico esto elimina las carreras de nonce sin colas ni infraestructura extra. El nonce lo maneja viem por request dentro del lock.
- **D-16:** Flujo y estados: el retiro debita el ledger primero e inserta el movimiento con `status='pending'`; tras el envío pasa a `sent` con `tx_hash`; si la firma o el envío fallan, se revierte el débito y el movimiento queda `failed`. Antes de firmar, el backend chequea `balanceOf(bóveda)` y gas en la chain destino: si no alcanza, responde con error claro sugiriendo retirar por Arbitrum. El rebalanceo de la bóveda entre chains es manual del operador (fuera del código de esta fase).

### Seed sintético
- **D-17:** Script de seed determinístico e idempotente (upsert por `user_id`): ~60 usuarios con ids `did:privy:synthetic-NNN`, balances distribuidos de forma verosímil (aprox. log-normal entre 10 y 50.000 ARGt, mayoría entre 100 y 5.000), cada uno con 1-3 movimientos `deposit`/`interest` históricos para que el ledger tenga volumen y variedad de cara al corte de Phase 4. `wallet_address` NULL para los sintéticos (nunca depositan on-chain).
- **D-18:** Los sintéticos existen solo en el ledger. La UI muestra únicamente los datos del usuario logueado; ninguna pantalla lista usuarios.

### Toggle Wallet / Cuenta
- **D-19:** Persistencia en `localStorage` (más el estado en el cliente). Sin columna en DB ni cookie: el toggle es preferencia de UI, no dato de negocio. Visible y persistente arriba de la app (SPEC §7.4).

### BOLt (bonus, no bloqueante)
- **D-20:** El ledger nace con la columna `bolt_balance` (D-03) y `movements.token` distingue moneda, pero no hay UI de depósito/retiro de BOLt en esta fase salvo que las addresses lleguen a tiempo (mismo criterio que D-10 de Phase 1). Sin interés para BOLt (SPEC §7.8).

### Claude's Discretion
- Copy exacto de pantallas, estados de loading/error, intervalos precisos de polling del cliente.
- Nombres de rutas de API y organización interna de `lib/` para el server (db, privy, vault, deposits, withdrawals, interest).
- Detalles menores de schema (timestamps, índices adicionales) mientras se respeten D-03 y la idempotencia.
- Formato del response de los endpoints y validación de inputs (montos > 0, chain soportada, etc.).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Diseño del modo Cuenta
- `SPEC.md` §7.1-§7.3 — Concepto, actores y arquitectura: bóveda omnibus, ledger, depósitos por evento, retiros firmados, interés desde el vault, identidad por DID
- `SPEC.md` §7.4 — Pantallas del modo Cuenta (toggle, home, pasar a cuenta, retirar). La verificación y el badge son de Phase 4
- `SPEC.md` §7.5 — Qué es real y qué es mock en 24 h
- `SPEC.md` §7.7 — Riesgos específicos (clave en server = solo demo, declararlo)
- `SPEC.md` §7.8 — Alcance de monedas: ARGt con interés, BOLt como segunda columna sin interés
- `SPEC.md` §7.9 — Reservas con Morpho adentro (contexto para el snapshot de `convertToAssets`)

### Datos on-chain y stack
- `SPEC.md` §2 — Addresses verificadas: ARGt por chain, vault ARGt Prime `0x9Dd3F844747AB78d616BF76DB92756E17A064aDD`
- `SPEC.md` §3 — Stack y versiones (Privy 3.37, wagmi 3.7, viem 2.55, next 16.3)
- `SPEC.md` §8 — Riesgos: gas por chain, RPCs de Polygon

### Planning
- `.planning/REQUIREMENTS.md` — CTA-01..CTA-06 (los 6 requirements de esta fase)
- `.planning/ROADMAP.md` — Success criteria de Phase 3
- `.planning/phases/01-wallet-mode/01-CONTEXT.md` — D-10 (registry de tokens en módulo de config único, que esta fase reusa) y D-03 (RPCs publicnode)
- `.planning/phases/01-wallet-mode/01-UI-SPEC.md` — Design system (shadcn new-york, Geist, mobile-first): las pantallas de Cuenta siguen el mismo contrato

</canonical_refs>

<code_context>
## Existing Code Insights

Phase 1 todavía no está ejecutada: al momento de esta discusión el repo solo tiene SPEC.md y CLAUDE.md. Esta fase depende de que Phase 1 haya creado el scaffold Next.js (App Router) + Privy + `@privy-io/wagmi`.

### Reusable Assets (de Phase 1, por contrato)
- Módulo de config único con el registry de tokens, addresses de ARGt/vault y la wallet M2 (bóveda): esta fase agrega ahí la constante del límite diario, `SPREAD_BPS` y la address de la bóveda si no está.
- Flujo de transfer de M1: "Pasar a Cuenta" es ese mismo transfer con destino fijo (la bóveda) y `switchChain` a Arbitrum.
- Transports viem por chain (publicnode) para `getLogs`, `balanceOf` y `convertToAssets` server-side.

### Integration Points
- Toggle Wallet/Cuenta arriba del layout existente de tabs de Phase 1.
- Nuevas API routes server-only: sync de depósitos, retiro, interés (cron + manual), datos de cuenta.
- Env vars nuevas en Vercel: `DATABASE_URL` (Neon), `VAULT_PRIVATE_KEY`, `PRIVY_APP_SECRET`, `CRON_SECRET`.
- `vercel.json` con el cron de interés (diario alcanza; el devengo es diario por diseño).

</code_context>

<specifics>
## Specific Ideas

- Que la Cuenta se sienta cuenta bancaria: saldo protagonista, interés visible acumulándose, sin jerga cripto en el copy.
- "Pasar a Cuenta" muestra "acreditado" cuando el backend ve el evento (SPEC §7.4); el polling del cliente hace que eso ocurra en segundos durante la demo.
- La clave de la bóveda en el server es aceptable solo como demo y hay que decirlo (disclosure de Phase 5, riesgo en SPEC §7.7).
- El seed sintético existe para que el corte de Phase 4 tenga volumen y el semáforo no muestre "2 usuarios" (SPEC §7.3).

</specifics>

<deferred>
## Deferred Ideas

- Badge "Solvencia probada on-chain", verificación de inclusión y `/status/twin-neobank` — Phase 4.
- Panel de operador ("correr corte ahora", log del pipeline) — opcional de Phase 4 si sobra tiempo.
- Rebalanceo automático de la bóveda entre chains vía bridge — backlog (CTA-V2-01).
- Depósitos a Cuenta desde Base/Polygon — backlog; en esta fase la UI redirige al bridge.
- Websockets o indexer para detección de depósitos en tiempo real — innecesario para la demo; el polling on-demand cubre el flujo.

</deferred>

---

*Phase: 03-modo-cuenta*
*Context gathered: 2026-08-20*
