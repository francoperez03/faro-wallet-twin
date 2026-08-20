---
phase: 01-wallet-mode
plan: 01
subsystem: auth
tags: [nextjs, tailwind, shadcn, privy, wagmi, viem, embedded-wallet]

requires: []
provides:
  - Next.js App Router scaffold (TypeScript, Tailwind v4, shadcn new-york/neutral)
  - lib/config/tokens.ts: registry único de ARGt/vault/bridge adapters (D-10), reusable por fases 3-4
  - lib/wagmi-config.ts: createConfig desde @privy-io/wagmi para arbitrum/base/polygon
  - app/providers.tsx: stack PrivyProvider > QueryClientProvider > WagmiProvider con guard de "app id no configurado"
  - Tab shell mobile-first (5 tabs, 44px touch target, accent activo)
  - app/(tabs)/home/page.tsx: login CTA, embedded wallet address, logout con confirmación
affects: [01-02, 01-03, 01-04, phase-3-modo-cuenta]

tech-stack:
  added: [next@16.3.1, tailwindcss@4, shadcn (new-york/neutral, componentes button/card/input/tabs/dialog/badge/skeleton/sonner), geist, "@privy-io/react-auth@3.37", "@privy-io/wagmi@4.0", "wagmi@3.7", "viem@2.55.10", "@tanstack/react-query"]
  patterns:
    - "Registry único de tokens/addresses en lib/config/tokens.ts, consumido por wagmi-config y por cualquier pantalla que necesite direcciones"
    - "Guard de configuración externa: providers.tsx detecta placeholder de env (REPLACE_ME_PRIVY_APP_ID) y renderiza un estado explícito en vez de crashear el SDK/build"

key-files:
  created:
    - lib/config/tokens.ts
    - lib/wagmi-config.ts
    - app/providers.tsx
    - app/(tabs)/layout.tsx
    - app/(tabs)/home/page.tsx
    - .env.example
  modified:
    - app/layout.tsx
    - app/page.tsx
    - package.json

key-decisions:
  - "viem pineado a 2.55.10 exacto (no 2.55.x) porque @privy-io/wagmi@4.0.16 declara peer dependency exacta viem@2.55.10"
  - "shadcn CLI pineado a 3.8.5 (no latest/4.x) para conservar el flujo clásico --base-color/style=new-york que pide el UI-SPEC; shadcn@latest (4.18) reemplazó eso por un sistema de presets incompatible"
  - "Guard 'Configurar Privy App ID' en providers.tsx: Privy valida el formato del appId incluso durante el prerender estático de Next, así que sin este guard 'npm run build' rompe con cualquier appId vacío o placeholder (Rule 3, blocking)"
  - "Rutas de tabs: /home, /enviar, /rendimiento, /bridge, /actividad (slugs a discreción, plan no los fijaba); / redirige a /home"

patterns-established:
  - "Cualquier pantalla que necesite leer address/decimals/chain de ARGt importa desde lib/config/tokens.ts, nunca hardcodea"
  - "Componentes shadcn se agregan con npx shadcn@3.8.5 add <name> para mantener el preset new-york/neutral"

requirements-completed: [AUTH-01, AUTH-02]

duration: 45min
completed: 2026-08-20
---

# Phase 1 Plan 1: Wallet Mode Scaffold Summary

**Scaffold Next.js + shadcn (new-york/neutral) con el registry único de tokens/addresses (D-10), el stack Privy+wagmi en el orden correcto, y un tab shell de 5 tabs; el login queda implementado y listo, pendiente de que el usuario complete el setup real en dashboard.privy.io.**

## Performance

- **Duration:** ~45 min
- **Tasks:** 3/3 ejecutados (Task 3 completado en el código; su checkpoint humano queda pendiente)
- **Files modified:** ~40 (scaffold completo + 3 features)

## Accomplishments
- Proyecto Next.js 16.3.1 + Tailwind v4 + shadcn (new-york/neutral/cssVariables) compilando sin errores
- `lib/config/tokens.ts` con las addresses exactas de SPEC.md §2 (ARGt por chain, vault, bridge adapters) — módulo único que fases 3-4 van a reusar
- Stack de providers `PrivyProvider > QueryClientProvider > WagmiProvider` en el orden exacto del spec, con `createConfig`/`WagmiProvider` importados desde `@privy-io/wagmi` (nunca desde `wagmi`)
- Tab shell mobile-first con 5 tabs (Home, Enviar, Rendimiento, Mover entre redes, Actividad), hit area de 44px, tab activo con accent `#2563EB`
- `app/(tabs)/home/page.tsx`: CTA de login, address de la embedded wallet truncada, logout con diálogo de confirmación destructivo (copy del UI-SPEC)

## Task Commits

1. **Task 1: Scaffold Next.js + Tailwind + shadcn + config module** - `71c59cd` (feat)
2. **Task 2: Providers Privy+wagmi y tab shell** - `dd8a0bd` (feat)
3. **Task 3: Setup de Privy y login funcional** - `a255673` (feat) — código completo; checkpoint humano (crear app en dashboard.privy.io) sigue pendiente

## Files Created/Modified
- `lib/config/tokens.ts` - Registry único de ARGt/vault/bridge adapters, contenido exacto de `<interfaces>` del plan
- `lib/wagmi-config.ts` - `createConfig` desde `@privy-io/wagmi` con transports http() por chain vía `RPC_URLS`
- `app/providers.tsx` - Stack de providers + guard de "Privy App ID no configurado"
- `app/(tabs)/layout.tsx` - Tab bar fijo, 5 tabs, activo con `usePathname`
- `app/(tabs)/home/page.tsx` - Login CTA / estado logueado con address y logout
- `app/(tabs)/{enviar,rendimiento,bridge,actividad}/page.tsx` - Placeholders para que el tab shell no dé 404 (los llenan planes siguientes)
- `.env.example` / `.env.local` (no versionado) - Placeholder `REPLACE_ME_PRIVY_APP_ID`
- `components.json`, `components/ui/*` - Preset shadcn new-york/neutral + 8 componentes

## Decisions Made
- **shadcn CLI pineado a 3.8.5**: `shadcn@latest` (4.18) reescribió el flujo de init a un sistema de presets (`base-nova`) que ya no soporta `style=new-york`/`baseColor=neutral` como flags directos. La versión 3.8.5 todavía expone `--base-color` con el resultado exacto que pide el UI-SPEC (`components.json` con `style: "new-york"`, `baseColor: "neutral"`).
- **viem pineado a 2.55.10 exacto**: `@privy-io/wagmi@4.0.16` declara `peer viem@"2.55.10"` (versión exacta, no rango). Usar `viem@2.55` como pedía el plan generaba un conflicto de peer dependencies; se resolvió con la versión exacta que además cae dentro del rango 2.55 pedido.
- **Guard de "app id no configurado" en `providers.tsx`**: no estaba en el plan original de Task 2, pero es necesario para que `npm run build` no rompa (Privy valida el formato del `appId` incluso en el prerender estático). Se implementó como parte de Task 2 (no de Task 3) porque bloqueaba el build de esa tarea también.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Guard de Privy App ID no configurado agregado a Task 2**
- **Found during:** Task 2 (verificación `npm run build`)
- **Issue:** `PrivyProvider` con `appId=""` tira `Error: Cannot initialize the Privy provider with an invalid Privy app ID` durante el prerender estático de Next, rompiendo `npm run build` antes de llegar a Task 3
- **Fix:** `providers.tsx` detecta si `NEXT_PUBLIC_PRIVY_APP_ID` está vacío o es el placeholder `REPLACE_ME_PRIVY_APP_ID`, y en ese caso renderiza una pantalla "Configurar Privy App ID" en vez de montar el SDK
- **Files modified:** `app/providers.tsx`
- **Verification:** `npm run build` pasa sin app id real; `curl localhost:3000/home` muestra el texto del guard
- **Committed in:** `dd8a0bd` (Task 2 commit)

**2. [Rule 3 - Blocking] shadcn CLI pineado a 3.8.5 en vez de latest**
- **Found during:** Task 1
- **Issue:** `npx shadcn@latest init` (4.18) no acepta `--style`/`--base-color`; usa un sistema de presets nuevo (`base-nova`) incompatible con el contrato del UI-SPEC (`new-york`/`neutral`)
- **Fix:** Se usó `shadcn@3.8.5`, la última versión que soporta el flujo clásico de flags, produciendo el `components.json` exacto que pide el UI-SPEC
- **Files modified:** `components.json`, `components/ui/*`
- **Committed in:** `71c59cd` (Task 1 commit)

**3. [Rule 3 - Blocking] `create-next-app` corrido en directorio temporal y copiado al repo**
- **Found during:** Task 1
- **Issue:** `create-next-app` rechaza correr en un directorio con archivos existentes (`.planning/`, `CLAUDE.md`, `SPEC.md`), aunque no hay conflicto real de nombres
- **Fix:** Se scaffoldeó en un directorio temporal y se copió el resultado al repo. Al copiar se sobreescribió por error el `CLAUDE.md` del proyecto con el `CLAUDE.md` genérico del scaffold; se detectó vía `git diff` y se restauró con `git checkout -- CLAUDE.md` antes de cualquier commit
- **Files modified:** ninguno permanente (CLAUDE.md restaurado)
- **Committed in:** N/A (corregido antes del commit de Task 1)

---

**Total deviations:** 3 auto-fixed (todos Rule 3, blocking). Ninguno cambia el alcance del plan; todos eran necesarios para que el scaffold compilara con las versiones de herramientas disponibles hoy.

## Issues Encountered
- Durante la copia del scaffold al repo, `next dev` (corrido para verificar el guard de Task 3) reescribió `CLAUDE.md` agregando un bloque `<!-- BEGIN:nextjs-agent-rules -->` no solicitado (comportamiento propio de Next.js 16.3, no una instrucción del usuario ni del equipo). Se revirtió con `git checkout -- CLAUDE.md` antes de commitear.
- `node_modules` se reinstaló una vez completo (`rm -rf node_modules package-lock.json && npm install`) porque un binario de `next` quedó corrupto tras la instalación inicial (`Cannot find module '../server/require-hook'`); no relacionado con el código del proyecto.

## User Setup Required

**Falta crear la app real en dashboard.privy.io.** El código de Task 3 está completo y compila, pero el login no puede probarse end-to-end sin un App ID real:

1. Ir a dashboard.privy.io y crear una app.
2. Habilitar login methods: **email** y **Google**.
3. Activar "**create embedded wallet on login**" → configurar para **users-without-wallets** (coincide con `embeddedWallets.ethereum.createOnLogin` en `app/providers.tsx`).
4. Copiar el App ID.
5. Reemplazar `REPLACE_ME_PRIVY_APP_ID` en `.env.local` (local) y en las env vars de Vercel (deploy, fase 5) por el App ID real.
6. Correr `npm run dev`, abrir `localhost:3000`, loguearse con email o Google (sin extensión), confirmar que Home muestra la address `0x...` de la embedded wallet, y que "Cerrar sesión" (con confirmación) vuelve al estado de login.

Sin este paso, AUTH-01/AUTH-02 quedan implementados pero no verificados end-to-end.

## Next Phase Readiness
- `lib/config/tokens.ts` y `lib/wagmi-config.ts` listos para que los planes de balances/transfer (M1), vault (M2) y bridge (M3) de wave 2 los consuman sin re-derivar addresses ni reconfigurar chains.
- El tab shell tiene rutas placeholder para las 4 pantallas restantes (`/enviar`, `/rendimiento`, `/bridge`, `/actividad`); cada plan de wave 2 reemplaza su placeholder.
- Bloqueante para verificar AUTH-01/AUTH-02 en vivo: el usuario debe completar el setup de Privy (ver "User Setup Required" arriba). El resto del scaffold no depende de eso.

---
*Phase: 01-wallet-mode*
*Completed: 2026-08-20*
