# Phase 3: Modo Cuenta - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-20
**Phase:** 3-modo-cuenta
**Mode:** `--auto` — todas las áreas auto-seleccionadas, cada pregunta resuelta con la opción recomendada
**Areas discussed:** Acceso a datos, Alcance de chains para depósitos, Mecanismo de polling, Confirmaciones e idempotencia, Matemática del interés, Tasa mostrada, Concurrencia de retiros, Valor del límite diario, Seed sintético, Persistencia del toggle

**Locked de la discusión conjunta del 19-08 (no re-litigadas):** Neon Postgres vía Vercel Marketplace; tablas `accounts`/`movements`; ~60 usuarios sintéticos; bóveda omnibus = wallet M2 `0x13B5...B992`; depósitos por polling de `Transfer` con viem `getLogs` matcheando DID ↔ address; interés vía cron real de Vercel leyendo el delta de `convertToAssets`, mismo handler como endpoint manual; retiros firmados server-side con clave en env; límite diario hardcodeado; `user_id` = DID de Privy verificado server-side.

---

## Acceso a datos (ORM vs SQL crudo)

| Option | Description | Selected |
|--------|-------------|----------|
| SQL crudo con `@neondatabase/serverless` | Dos tablas, un puñado de queries; cero setup de ORM, driver oficial de Neon para serverless | ✓ |
| Drizzle | Tipado lindo, pero suma migraciones y config contra el deadline | |
| Prisma | El más pesado de los tres para este tamaño de schema | |

**Choice:** Recomendada. **Notes:** schema en un `schema.sql` idempotente aplicado por el script de seed.

## Alcance de chains para depósitos

| Option | Description | Selected |
|--------|-------------|----------|
| Depósitos solo Arbitrum, retiros multichain | SPEC §7.3 ancla la escucha en Arbitrum; ahí viven vault e interés. La UI hace switchChain y sugiere el bridge si hay fondos en otra chain | ✓ |
| Depósitos multichain | Triplica el polling y el estado de sync por un flujo que el bridge ya cubre | |

**Choice:** Recomendada (D-07). **Notes:** los retiros sí son multichain porque CTA-04 lo exige explícitamente.

## Mecanismo de polling de depósitos

| Option | Description | Selected |
|--------|-------------|----------|
| Endpoint on-demand: al cargar la vista + polling corto del cliente mientras espera acreditación + barrido desde el cron | Acreditación en segundos durante la demo, sin workers | ✓ |
| Solo cron de Vercel | En plan hobby el cron es diario; inútil como detector primario | |
| Websockets / indexer | Sobredimensionado para una demo de 24 h | |

**Choice:** Recomendada (D-08).

## Confirmaciones e idempotencia

| Option | Description | Selected |
|--------|-------------|----------|
| Acreditar al ver el log (sin depth extra) + índice único parcial sobre `tx_hash` + `last_processed_block` en la misma transacción SQL | Reorgs en Arbitrum son rarísimos; la constraint dedupe syncs superpuestos | ✓ |
| Esperar N confirmaciones | Suma latencia visible en la demo sin riesgo real que lo justifique | |

**Choice:** Recomendada (D-09).

## Matemática del interés

| Option | Description | Selected |
|--------|-------------|----------|
| Delta de `convertToAssets` vs snapshot en `sync_state`; pro rata por balance con bigint `floor`; remanente sin acreditar; spread 0 como constante | Determinístico, sin floats, delta negativo no acredita | ✓ |
| Tasa fija simulada | Contradice la decisión locked de leer el yield real del vault | |

**Choice:** Recomendada (D-11).

## Tasa mostrada (CTA-03)

| Option | Description | Selected |
|--------|-------------|----------|
| APY anualizado desde los dos últimos snapshots del cron; "—" + link a Morpho si hay menos de dos | Consistente con D-07 de Phase 1, sin estimaciones on-chain extra | ✓ |
| Estimar APY con lecturas en dos bloques al vuelo | Más código y edge cases por un número que el snapshot ya da | |

**Choice:** Recomendada (D-12).

## Concurrencia de retiros y nonce

| Option | Description | Selected |
|--------|-------------|----------|
| `pg_advisory_xact_lock` por chain alrededor de debitar → firmar → enviar | Serializa sin colas ni infra extra; suficiente para tráfico de demo | ✓ |
| Cola en memoria | No sobrevive a instancias serverless paralelas | |
| Manejo manual de nonces | Complejidad sin necesidad una vez serializado | |

**Choice:** Recomendada (D-15). **Notes:** débito primero con `status='pending'`, `sent` con tx_hash, `failed` revierte el débito (D-16).

## Valor del límite diario

| Option | Description | Selected |
|--------|-------------|----------|
| 1.000 ARGt por usuario por día, ventana móvil de 24 h | Suficiente para demostrar el límite en la demo sin vaciar la bóveda | ✓ |
| Límite por transacción | No cumple la semántica "diario" de CTA-04 | |

**Choice:** Recomendada (D-14).

## Seed sintético

| Option | Description | Selected |
|--------|-------------|----------|
| ~60 usuarios `did:privy:synthetic-NNN`, distribución aprox. log-normal (10 a 50.000 ARGt), 1-3 movimientos históricos c/u, solo en ledger | Volumen y variedad para el corte de Phase 4; script determinístico e idempotente | ✓ |
| Balances uniformes | Corte poco verosímil para el pitch | |
| Mostrar sintéticos en la UI | La UI es del usuario logueado; los sintéticos son dato del ledger | |

**Choice:** Recomendada (D-17, D-18).

## Persistencia del toggle Wallet/Cuenta

| Option | Description | Selected |
|--------|-------------|----------|
| `localStorage` | Preferencia de UI, cero backend | ✓ |
| Columna en DB | Un request extra por un booleano de presentación | |
| Cookie | Sin beneficio de SSR que lo justifique acá | |

**Choice:** Recomendada (D-19).

---

## Claude's Discretion

- Copy de pantallas, estados de loading/error, intervalos exactos de polling del cliente.
- Nombres de rutas de API y organización de `lib/` server-side.
- Detalles menores de schema (timestamps, índices extra) respetando D-03.
- Formato de responses y validación de inputs.

## Deferred Ideas

- Badge de solvencia, verificación de inclusión y semáforo público → Phase 4.
- Panel de operador → opcional de Phase 4.
- Rebalanceo automático de bóveda entre chains → backlog (CTA-V2-01).
- Depósitos a Cuenta desde Base/Polygon → backlog.
- Websockets/indexer para depósitos → innecesario para la demo.
