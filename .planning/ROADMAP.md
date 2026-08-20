# Roadmap: Twin Neobank

## Overview

Un neobanco de 24 horas sobre las stablecoins de Twin. Arranca con la wallet self-custody de los 3 milestones del brief (login Privy, balances/transfers, vault, bridge), y en paralelo despliega el Registry de Sobrecito, que no depende de la app. Sobre esa base construye el modo Cuenta custodial con ledger propio e interés, cablea la solvencia probada on-chain con verificación del cliente y el semáforo público, y cierra con el deploy y la submission. El pipeline ZK real sobre el ledger es un stretch dentro de la fase de solvencia: nunca bloquea el ship.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Wallet Mode** - Login Privy, balances y transfers multichain de ARGt, vault Morpho, bridge entre chains
- [x] **Phase 2: Sobrecito Registry** - Registry + verifier desplegados en Arbitrum, primer publish con la fixture ✓ 2026-08-20
- [ ] **Phase 3: Modo Cuenta** - Ledger custodial con interés, depósitos y retiros
- [ ] **Phase 4: Solvencia Visible** - Badge, verificación de inclusión del cliente, semáforo público, pipeline real (stretch)
- [ ] **Phase 5: Ship** - Deploy en Vercel, disclosure y submission

## Phase Details

### Phase 1: Wallet Mode
**Goal**: Un usuario entra sin extensión, ve sus balances de ARGt en 3 chains, transfiere, deposita en el vault y bridgea entre chains.
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, M1-01, M1-02, M1-03, M2-01, M2-02, M3-01, M3-02
**Success Criteria** (what must be TRUE):
  1. User se loguea con email o Google via Privy y obtiene una embedded wallet, sin instalar extensión
  2. User ve su balance de ARGt por chain (Arbitrum, Base, Polygon) y el total, y puede transferir a cualquier address con cambio de chain automático
  3. User deposita ARGt en el vault ARGt Prime (approve + deposit), ve su posición valuada en ARGt y puede retirarla
  4. User bridgea ARGt entre Base, Arbitrum y Polygon (approve + bridge con fee) y ve el estado y el balance de destino actualizado
  5. (bonus, no bloqueante) User ve su balance de BOLt y puede transferirlo, si las addresses llegan a tiempo
**Plans**: TBD
**UI hint**: yes

### Phase 2: Sobrecito Registry
**Goal**: La infraestructura de solvencia vive on-chain, lista para que el modo Cuenta publique cortes.
**Depends on**: Nothing (parallel with Phase 1)
**Requirements**: SOL-01, SOL-02
**Success Criteria** (what must be TRUE):
  1. SobrecitoRegistry y HonkVerifier están desplegados en Arbitrum via Deploy.s.sol con el key_hash de la fixture
  2. Un publish con la prueba de la fixture commiteada se acepta on-chain y queda visible en el explorer
  3. Un publish inválido (prueba que no corresponde) revierte
**Plans**: 2 plans
Plans:
- [ ] 02-01-PLAN.md — Preflight + deploy de SobrecitoRegistry y HonkVerifier en Arbitrum One
- [ ] 02-02-PLAN.md — Publish.s.sol, publish real de la fixture + caso negativo simulado, handoff de addresses al repo twin

### Phase 3: Modo Cuenta
**Goal**: Un usuario mantiene un saldo custodial en el neobanco, con interés, y puede mover fondos entre su wallet y su cuenta.
**Depends on**: Phase 1
**Requirements**: CTA-01, CTA-02, CTA-03, CTA-04, CTA-05, CTA-06
**Success Criteria** (what must be TRUE):
  1. User alterna entre modo Wallet y modo Cuenta con un toggle persistente
  2. User pasa ARGt a su Cuenta (transfer a la bóveda omnibus) y lo ve acreditado cuando el backend detecta el evento Transfer, atado a su DID de Privy
  3. User ve su saldo en Cuenta, el interés acumulado y la tasa actual
  4. User retira de su Cuenta a su embedded wallet en la chain elegida, respetando el límite diario
  5. El ledger en Postgres tiene cuentas y movimientos (deposit, withdraw, interest) sembrados con usuarios sintéticos, con volumen suficiente para un corte
**Plans**: 4 plans

Plans:
- [ ] 03-01-PLAN.md — Ledger Postgres (schema, seed 60 usuarios sintéticos), identidad server-side vía Privy
- [ ] 03-02-PLAN.md — Depósitos por evento Transfer y retiros firmados con límite diario
- [ ] 03-03-PLAN.md — Interés real desde el vault (cron + manual) y tasa APY
- [ ] 03-04-PLAN.md — UI de Cuenta: toggle, home, pasar a cuenta, retirar
**UI hint**: yes

### Phase 4: Solvencia Visible
**Goal**: Cualquiera puede ver y el cliente puede verificar que su saldo está cubierto por una prueba criptográfica publicada on-chain.
**Depends on**: Phase 2, Phase 3
**Requirements**: SOL-03, SOL-04, SOL-05, SOL-06
**Success Criteria** (what must be TRUE):
  1. El home de Cuenta muestra el badge "Solvencia probada on-chain · último corte hace N h" leyendo el Registry (verde < 26 h, ámbar si vencido)
  2. User verifica su inclusión: pide su opening, recomputa el commitment Poseidon2 en el browser y ve el estado verde/rojo/pendiente
  3. La página pública `/status/twin-neobank` muestra veredictos, cobertura, frescura, historial de cortes y el declaredMask en claro, sin login
  4. (stretch, no bloqueante) El pipeline real exporta el ledger a CSV, corre orchestrate_tree.py y publica la prueba de la raíz real, reemplazando la fixture
**Plans**: 3 plans
Plans:
- [ ] 04-01-PLAN.md — Badge de solvencia en Cuenta·Home + página pública /status/twin-neobank (lectura directa del Registry)
- [ ] 04-02-PLAN.md — Verificación de inclusión: vector Poseidon2 real, opening autenticado, pantalla de verificación
- [ ] 04-03-PLAN.md — Corte mini (stretch, no bloqueante): gate bb.js, segundo Registry, pipeline de proving + publish
**UI hint**: yes

### Phase 5: Ship
**Goal**: La app está hosteada, disclosed y entregada antes del deadline.
**Depends on**: Phase 1, Phase 3, Phase 4 (badge y status; no depende de SOL-06)
**Requirements**: SHIP-01, SHIP-02, SHIP-03
**Success Criteria** (what must be TRUE):
  1. La app está deployada en Vercel con una URL pública
  2. El disclosure es visible in-app: PoC no auditado, qué está probado y qué declarado
  3. La submission fue enviada (URL, nombre, mail) antes del jueves 20/08 18 h
**Plans**: 3 plans
Plans:
- [ ] 05-01-PLAN.md — Disclosure + footer + feature flags (HIDDEN_SECTIONS)
- [ ] 05-02-PLAN.md — Env vars audit + cron + deploy verification
- [ ] 05-03-PLAN.md — Naming checkpoint + smoke test + submission
**UI hint**: yes

## Progress

**Execution Order:**
Phases 1 and 2 can run in parallel (Phase 2 has no app dependency). Phase 3 needs Phase 1. Phase 4 needs Phases 2 and 3. Phase 5 needs Phases 1, 3 and 4's badge/status criteria (never blocked by Phase 4's stretch criterion, SOL-06).

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Wallet Mode | 0/TBD | Not started | - |
| 2. Sobrecito Registry | 2/2 | Complete | 2026-08-20 |
| 3. Modo Cuenta | 0/4 | Not started | - |
| 4. Solvencia Visible | 0/TBD | Not started | - |
| 5. Ship | 0/TBD | Not started | - |
