---
phase: 05-ship
plan: 02
subsystem: infra
tags: [vercel, cron, env-vars, deploy]

requires:
  - phase: 03-modo-cuenta
    provides: "endpoint /api/cuenta/interest protegido por CRON_SECRET (plan 03-03)"
  - phase: 01-wallet-mode
    provides: "proyecto Vercel twin-neobank creado y linkeado"
provides:
  - "Deploy de producción vivo en https://twin-neobank-eight.vercel.app"
  - "6 env vars server/públicas seteadas en Vercel Production (VAULT_PRIVATE_KEY, CRON_SECRET, SOBRECITO_MASTER_HEX, NEXT_PUBLIC_REGISTRY_1_*)"
  - "Auditoría de env vars: ninguna secreta con prefijo NEXT_PUBLIC_"
affects: [05-01, 05-03]

tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified: []

key-decisions:
  - "vercel.json ya tenía el cron correcto (creado por plan 03-03, /api/cuenta/interest, 0 6 * * *, una sola entrada) — no se tocó, solo se verificó contra D-09."
  - "Se generaron CRON_SECRET y SOBRECITO_MASTER_HEX con openssl rand -hex 32 directo a vercel env add, sin imprimir ni commitear el valor."
  - "VAULT_PRIVATE_KEY seteado desde ~/.wakeup-m2-arb1.key vía pipe, sin imprimir el valor."
  - "Neon integration sigue bloqueada en aceptación de términos de marketplace (acción del usuario); se reintentó una vez y sigue con action_required."
  - "NEXT_PUBLIC_PRIVY_APP_ID, DATABASE_URL y PRIVY_APP_SECRET quedan pendientes: dependen de que el usuario cree la app de Privy y acepte los términos de Neon. El deploy se hizo igual (D-07, deploy temprano) — la app queda mostrando la pantalla de 'Configurar Privy App ID' hasta entonces."

requirements-completed: [SHIP-01]

duration: ~20min
completed: 2026-08-20
---

# Phase 5 Plan 2: Env audit + cron + deploy verification Summary

**Producción viva en `https://twin-neobank-eight.vercel.app` (200 OK) con 6 env vars server/públicas seteadas y el cron diario de interés verificado; faltan 3 vars bloqueadas en acciones pendientes del usuario (Privy app, términos de Neon).**

## Performance

- **Duration:** ~20 min
- **Tasks:** 2
- **Files modified:** 0 (vercel.json ya cumplía el requisito, no se modificó)

## Accomplishments

- Auditoría de env vars en Vercel Production: ninguna variable secreta tiene prefijo `NEXT_PUBLIC_`.
- 6 env vars seteadas en Production: `VAULT_PRIVATE_KEY`, `CRON_SECRET`, `SOBRECITO_MASTER_HEX` (secretas, sensitive) y `NEXT_PUBLIC_REGISTRY_1_LABEL`/`_ADDRESS`/`_CHAIN_ID` (públicas, datos de contrato).
- `vercel.json` verificado contra D-09: un solo cron diario (`0 6 * * *`), apunta a `/api/cuenta/interest` (endpoint real, protegido por `CRON_SECRET`, con el trigger manual de CTA-06 intacto como respaldo).
- Deploy a producción exitoso: `vercel deploy --prod --yes` → `READY`, alias de producción `https://twin-neobank-eight.vercel.app` responde 200.
- Reintento de `vercel integration add neon`: confirmado que sigue bloqueado en `action_required` (términos de marketplace pendientes de aceptación del usuario en el browser).

## Task Commits

Ninguna. Este plan no modificó archivos versionados: `vercel.json` ya cumplía el requisito del Task 2 desde el plan 03-03 (verificado, no editado); las env vars de Vercel se administran vía CLI/dashboard, no en el repo; `.env.local` no se modificó porque los valores generados (secretos) nunca se imprimieron y no hay forma de escribirlos sin exponerlos.

## Env Vars Audit (names only, never values)

| Variable | Estado en Vercel Production | Tipo | Prefijo NEXT_PUBLIC_ |
|---|---|---|---|
| `VAULT_PRIVATE_KEY` | Seteada (Sensitive) | server-only | No |
| `CRON_SECRET` | Seteada (Sensitive) | server-only | No |
| `SOBRECITO_MASTER_HEX` | Seteada (Sensitive) | server-only | No |
| `NEXT_PUBLIC_REGISTRY_1_LABEL` | Seteada | pública | Sí (correcto, dato público) |
| `NEXT_PUBLIC_REGISTRY_1_ADDRESS` | Seteada | pública | Sí (correcto, dato público) |
| `NEXT_PUBLIC_REGISTRY_1_CHAIN_ID` | Seteada | pública | Sí (correcto, dato público) |
| `NEXT_PUBLIC_PRIVY_APP_ID` | **Falta** — bloqueada, el usuario no creó la app de Privy todavía | pública | — |
| `DATABASE_URL` | **Falta** — bloqueada, integración Neon pendiente de aceptar términos | server-only | — |
| `PRIVY_APP_SECRET` | **Falta** — depende de crear la app de Privy | server-only | — |

Resultado de auditoría: **ninguna variable secreta tiene el prefijo `NEXT_PUBLIC_`.** Cumple T-05-03.

## Files Created/Modified

Ninguno. `vercel.json` fue leído y verificado, no modificado (ya contenía la config correcta desde el plan 03-03).

## Decisions Made

- No tocar `vercel.json`: ya tenía exactamente lo que este plan pedía (un cron diario, endpoint correcto). Editarlo hubiera sido trabajo redundante.
- Setear las env vars que sí se podían resolver localmente ahora (VAULT_PRIVATE_KEY desde el archivo de llave, CRON_SECRET y SOBRECITO_MASTER_HEX generados con `openssl rand -hex 32`) en vez de esperar a que el usuario las provea, para no bloquear el deploy temprano (D-07).
- Deployar a producción igual sin `NEXT_PUBLIC_PRIVY_APP_ID`: la app muestra la pantalla de configuración de Privy, comportamiento esperado y documentado, no un error.

## Deviations from Plan

None - plan executed exactly as written (Task 2's file target ya estaba en el estado deseado por un plan anterior, no requirió edición).

## Issues Encountered

- **Neon integration bloqueada:** `vercel integration add neon` devuelve `action_required` / `integration_terms_acceptance_required`. Requiere que el usuario abra `https://vercel.com/francoperez03s-projects/~/integrations/accept-terms/neon?source=cli` en el browser y acepte los términos. Se reintentó una vez según instrucción, sigue bloqueado. No se puede resolver sin acción humana en el browser.
- **Privy app no creada:** `NEXT_PUBLIC_PRIVY_APP_ID` y `PRIVY_APP_SECRET` dependen de que el usuario cree la app en dashboard.privy.io. Sin esto, la app en producción muestra la pantalla "Configurar Privy App ID" en vez del flujo de login — esperado para este deploy intermedio.

## User Setup Required

Acciones pendientes que solo el usuario puede completar:

1. **Aceptar términos de Neon:** abrir `https://vercel.com/francoperez03s-projects/~/integrations/accept-terms/neon?source=cli`, aceptar, y volver a correr `vercel integration add neon` (o reintentarlo un ejecutor). Después, la integración crea `DATABASE_URL` automáticamente en Vercel.
2. **Crear la app de Privy:** en dashboard.privy.io, crear la app, copiar el `App ID` y el `App secret`. Luego:
   ```bash
   echo "<app-id>" | vercel env add NEXT_PUBLIC_PRIVY_APP_ID production
   echo "<app-secret>" | vercel env add PRIVY_APP_SECRET production
   ```
   (nunca pegar el valor directo en la terminal donde quede en el historial visible; usar el pipe como en el ejemplo).
3. Después de (1) y (2), correr `vercel deploy --prod --yes` de nuevo para que el build tome las nuevas env vars (Next.js embebe `NEXT_PUBLIC_*` en build time).

## Next Phase Readiness

- **URL de producción confirmada viva:** `https://twin-neobank-eight.vercel.app` responde 200.
- SHIP-01 queda cerrado en lo que este plan controla: env vars auditadas (T-05-03 mitigado), cron registrado y verificado (T-05-04 aceptado), deploy vivo.
- Bloqueadores para el smoke test completo (D-10 de 05-CONTEXT.md): login Privy no funcionará hasta que el usuario complete el setup de arriba; el modo Cuenta no funcionará hasta que `DATABASE_URL` esté seteada (Neon).
- Plan 05-01 y 05-03 (disclosure, submission) no dependen de estos bloqueadores y pueden avanzar en paralelo.

---
*Phase: 05-ship*
*Completed: 2026-08-20*
