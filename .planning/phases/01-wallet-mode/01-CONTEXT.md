# Phase 1: Wallet Mode - Context

**Gathered:** 2026-08-19
**Status:** Ready for planning
**Mode:** `--auto` (decisiones auto-seleccionadas con la opción recomendada, revisables abajo)

<domain>
## Phase Boundary

Un usuario entra sin extensión (Privy email/Google, embedded wallet), ve sus balances de ARGt en Arbitrum, Base y Polygon con el total, transfiere a cualquier address con cambio de chain automático, deposita y retira del vault ARGt Prime (ERC-4626, Arbitrum) y bridgea ARGt entre las 3 chains. BOLt es bonus no bloqueante. Todo self-custody, sin backend. El modo Cuenta, Sobrecito y el deploy final pertenecen a fases posteriores.

</domain>

<decisions>
## Implementation Decisions

### Estructura de pantallas
- **D-01:** Seguir SPEC.md §4 tal cual: Home/Balance (total + desglose por chain + posición en vault), Enviar, Rendimiento (vault), Mover entre redes (bridge), Actividad. Navegación por tabs, layout mobile-first con estética de neobanco (que se sienta banco, no dapp).

### Lectura de balances y RPCs
- **D-02:** Balances con `useReadContracts` (multicall) por chain via wagmi; total sumando las 3 chains. ARGt tiene 18 decimals.
- **D-03:** RPCs públicos con transports `http()`. Para Polygon usar publicnode (SPEC §8: polygon-rpc.com falló en pruebas). Alchemy solo si los públicos molestan.

### UX de transferencia
- **D-04:** Selector de chain explícito + input de address plano. ENS se omite (recorte por deadline; el spec lo marca opcional).
- **D-05:** `switchChain` automático antes de `transfer(to, amount)` cuando el usuario está en otra chain. La embedded wallet de Privy firma sin popup.

### UX de vault
- **D-06:** Depositar = `approve` + `deposit(assets, receiver)`. Retirar = `redeem(shares, receiver, owner)` con opción "retirar todo". Posición valuada con `convertToAssets(balanceOf(user))`.
- **D-07:** APY como link "ver en Morpho" en vez de estimarlo on-chain. Si el usuario tiene ARGt en otra chain, sugerir el bridge.

### Bridge
- **D-08:** Primer paso del trabajo de bridge: bajar `bridge-adapter-abi.ts` del Notion (pendiente externo). Fee con `quote`/`estimateFee` del ABI si existe; si no existe, preguntar en Discord antes de hardcodear nada.
- **D-09:** Flujo: `approve(adapter, amount)` + `bridge(...)` con `value` = fee cotizado. Estado optimista "en tránsito" + polling del balance de ARGt en la chain destino hasta que sube. Sin indexer cross-chain.

### BOLt (bonus, no bloqueante)
- **D-10:** Balances y transfers construidos sobre un registry de tokens por config (address por chain, decimals, símbolo). BOLt entra agregando su entry cuando lleguen las addresses por Discord. Sin vault ni bridge para BOLt (SPEC §7.8). Phase 1 se cierra sin BOLt si no llegan.

### Actividad
- **D-11:** Lista mínima: logs `Transfer` del usuario (from o to) en los últimos N bloques de la chain activa. Es el primer candidato a recorte si falta tiempo; ningún success criterion depende de ella.

### Claude's Discretion
- Librería/approach de UI (Tailwind, componentes, copy exacto de pantallas) mientras se vea neobanco y mobile-first.
- Valores de N bloques, intervalos de polling, manejo de estados de loading/error.
- Estructura interna del código (el roadmap no fija arquitectura); dejar el registry de tokens y las direcciones en un módulo de config único porque el modo Cuenta (Phase 3) reusa las mismas addresses.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Spec del hackathon y datos on-chain
- `SPEC.md` §1 — Milestones exigidos (qué hay que demostrar por cada uno)
- `SPEC.md` §2 — Addresses verificadas por RPC: ARGt por chain, vault, bridge adapters. Ojo: `0x5986...2214` en Base es MEXt, no ARGt
- `SPEC.md` §3 — Stack y versiones (Privy 3.37, `@privy-io/wagmi` 4.0, wagmi 3.7, viem 2.55, next 16.3); orden de providers `PrivyProvider > QueryClientProvider > WagmiProvider`; imports de `WagmiProvider`/`createConfig` desde `@privy-io/wagmi`, no desde `wagmi`
- `SPEC.md` §4 — Pantallas y flujos (la fuente de D-01)
- `SPEC.md` §7.8 — Alcance de monedas ARGt vs BOLt
- `SPEC.md` §8 — Riesgos: fee del bridge, RPC de Polygon, gas para la embedded wallet en cada chain, addresses de bonus

### Planning
- `.planning/REQUIREMENTS.md` — AUTH-01/02, M1-01/02/03, M2-01/02, M3-01/02 (los 9 requirements de esta fase)
- `.planning/ROADMAP.md` — Success criteria de Phase 1

### Pendientes externos (no son archivos todavía)
- `bridge-adapter-abi.ts` — adjunto en el Notion de Twin, bajar a mano antes de implementar M3
- Addresses de BOLt por chain — pedir en Discord de Twin (solo bonus)

</canonical_refs>

<code_context>
## Existing Code Insights

Greenfield: el repo solo tiene SPEC.md y CLAUDE.md, no hay código todavía. Esta fase crea el scaffold Next.js (App Router) + Privy + `@privy-io/wagmi`.

### Integration Points
- El registry de tokens y las addresses (D-10) deben vivir en un módulo de config único: Phase 3 (Modo Cuenta) y Phase 4 reusan las mismas addresses y el vault.
- Setup de Privy: app en dashboard.privy.io con email/Google y "create embedded wallet on login"; `NEXT_PUBLIC_PRIVY_APP_ID` en env.

</code_context>

<specifics>
## Specific Ideas

- Que se sienta neobanco y no dapp: login por email, sin popups de extensión, saldos en pesos tokenizados como protagonistas.
- Riesgo operativo de la demo: la embedded wallet necesita gas (ETH/POL) en cada chain; fondear de antemano (SPEC §8).

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. (Las ideas ZK de SPEC §5 ya están out of scope a nivel proyecto.)

</deferred>

---

*Phase: 01-wallet-mode*
*Context gathered: 2026-08-19*
