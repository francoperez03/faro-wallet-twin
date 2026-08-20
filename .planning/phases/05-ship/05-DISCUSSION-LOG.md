# Phase 5: Ship - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-20
**Phase:** 5-ship
**Mode:** `--auto` — todas las áreas auto-seleccionadas, cada pregunta resuelta con la opción recomendada, salvo el nombre (decisión del usuario, pendiente)
**Areas discussed:** Nombre del producto, Disclosure, Dominio, Setup del proyecto Vercel, Env vars, Smoke test, Cron, Contingencia de milestone roto

Decisiones locked previas (discusión conjunta 19-08, se respetan sin reabrir): nombre propio elegido por el usuario en esta fase, sin video, submission = URL + nombre + mail, cuenta Vercel francoperez03s-projects plan hobby, disclosure obligatorio in-app, deploy temprano.

---

## Nombre del producto

| Option | Description | Selected |
|--------|-------------|----------|
| Faro | Metáfora de la solvencia visible on-chain; corto, banca en español | pendiente |
| Vera | Verdad/verificable; suena fintech, funciona en dos idiomas | pendiente |
| Doble | Guiño a Twin y al respaldo 1:1 del saldo custodial | pendiente |

**Choice:** DECISIÓN DEL USUARIO, pendiente. Es lo único que auto no puede resolver (locked 19-08: el usuario elige entre propuestas). **Notes:** mientras tanto rige el working name `twin-neobank`; el rebrand posterior es solo de display.

## Disclosure: dónde vive

| Option | Description | Selected |
|--------|-------------|----------|
| Footer persistente + página /disclosure | Línea corta siempre visible, texto completo en su página; cumple "visible in-app" sin ensuciar la demo | ✓ |
| Solo footer con texto completo | Cumple pero recarga todas las pantallas | |
| Solo página linkeada desde settings | Riesgo de que los jueces no la vean | |

**Choice:** Recomendada (ambas). **Notes:** contenido locked por la discusión conjunta y el brief de Twin.

## Dominio

| Option | Description | Selected |
|--------|-------------|----------|
| Subdominio *.vercel.app por defecto | Cero fricción, la URL ya existe por el deploy temprano | ✓ |
| Dominio custom | Costo de tiempo y DNS a horas del deadline | |

**Choice:** Recomendada. Dominio custom deferred.

## Setup del proyecto Vercel

| Option | Description | Selected |
|--------|-------------|----------|
| Proyecto temprano con working name, rename solo de display | Ya deployado desde fase 1; no se toca el slug para no romper la URL | ✓ |
| Crear proyecto nuevo con el nombre final | Nuevo deploy y nueva URL a horas del cierre | |

**Choice:** Recomendada.

## Env vars

| Option | Description | Selected |
|--------|-------------|----------|
| Checklist explícito público vs server | `NEXT_PUBLIC_PRIVY_APP_ID` público; `DATABASE_URL`, `VAULT_PRIVATE_KEY`, `SOBRECITO_MASTER_HEX` solo server; addresses en el módulo de config | ✓ |
| Todo por env sin clasificar | Riesgo de filtrar una secreta con prefijo NEXT_PUBLIC_ | |

**Choice:** Recomendada. **Notes:** verificación de prefijos en el dashboard antes del smoke final.

## Smoke test pre-submission

| Option | Description | Selected |
|--------|-------------|----------|
| Checklist ordenado por importancia de demo | Login → balances → transfer → vault → bridge → cuenta → badge → status → disclosure; arranca 16:00, submission 17:30 máx | ✓ |
| Probar en orden de desarrollo | No prioriza lo que los jueces evalúan primero | |

**Choice:** Recomendada.

## Cron

| Option | Description | Selected |
|--------|-------------|----------|
| Cron en vercel.json + trigger manual de respaldo | Hobby permite cron diario, alcanza para el corte; el trigger manual salva la demo | ✓ |
| Solo trigger manual | Deja CTA-06 sin automatizar | |
| Servicio externo de cron | Dependencia nueva innecesaria | |

**Choice:** Recomendada.

## Contingencia: milestone roto a las 17:00

| Option | Description | Selected |
|--------|-------------|----------|
| Feature flag que oculta secciones rotas | Demo más chica y prolija; prioridad de sacrificio definida (BOLt → bridge → Cuenta+solvencia → vault; M1 jamás) | ✓ |
| Shippear con errores visibles | Una pantalla rota pesa más que un feature ausente | |
| Correr el deadline arreglando | El deadline es duro, no hay margen | |

**Choice:** Recomendada.

## Claude's Discretion

- Copy exacto del footer y de `/disclosure` (respetando contenido locked y estilo de escritura).
- Layout de `/disclosure` y mecánica del feature flag.

## Deferred Ideas

- Dominio custom.
- Rename del slug del proyecto Vercel al nombre final.
