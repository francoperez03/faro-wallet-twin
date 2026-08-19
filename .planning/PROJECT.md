# Twin Neobank

## What This Is

Un neobanco sobre las stablecoins de Twin para el hackathon "Twin your Neobank" (LATAM Digital Assets Conference, submission cierra jueves 20/08 18 h). Tiene dos modos: **Wallet** (self-custody con Privy embedded wallet: balances, transfers, vault Morpho y bridge de ARGt) y **Cuenta** (custodial: saldo interno con interés desde el vault, respaldado por una prueba ZK de solvencia diaria publicada on-chain con el stack de Sobrecito).

## Core Value

Una cuenta custodial que paga interés y prueba criptográficamente cada día que tiene los pesos de sus clientes, verificable por cualquiera on-chain.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Login Privy (email/Google) con embedded wallet, sin extensión
- [ ] M1: balance y transfers de ARGt en Arbitrum, Base y Polygon
- [ ] M2: depositar/retirar en el vault ARGt Prime (ERC-4626, Morpho, Arbitrum)
- [ ] M3: bridge de ARGt entre Base ↔ Arbitrum ↔ Polygon (approve + bridge con fee)
- [ ] Bonus: BOLt como segunda moneda (balance + transfers + columna en ledger, sin interés)
- [ ] Modo Cuenta: pasar a cuenta (transfer a bóveda + acreditación por evento), retirar (firma desde bóveda, multichain), interés pro rata desde el vault
- [ ] SobrecitoRegistry + HonkVerifier desplegados en Arbitrum; primer publish con la fixture verificada
- [ ] Corte sobre el ledger real (CSV → orchestrate_tree.py → publish) — fase posterior, fixture como fallback permanente
- [ ] Verificación de inclusión del cliente (opening + Poseidon2 en browser)
- [ ] Semáforo público `/status/twin-neobank` leyendo `CutPublished` con declaredMask en claro
- [ ] Deploy en Vercel + submission (URL, nombre, mail)

### Out of Scope

- Reservas probadas con storage proofs (F2 de Sobrecito) — roadmap, no entra en 24 h; cR va declarado
- Multisig 2-de-2 del publisher — single-sig como Sobrecito hoy
- UI de auditor con view-key — mock o pantalla estática solo si sobra tiempo
- Bridge/vault para BOLt — no existen en la infra de Twin
- Stealth addresses y demás ideas ZK de la sección 5 del SPEC — el diferencial elegido es Sobrecito
- KYC/compliance real — es una demo

## Context

- Spec completo en `SPEC.md` (raíz del repo): brief del hackathon, addresses verificadas por RPC, diseño del modo Cuenta (sección 7), alcance de monedas (7.8), reservas con Morpho (7.9).
- Sobrecito vive en `/Users/francoperez/repos/job/Sobre/sobrecito`: circuits Noir (toolchain pineado `nargo 1.0.0-beta.22` + `bb 5.0.0-nightly.20260522`), contracts Foundry (Registry + HonkVerifier, 22 tests, `Deploy.s.sol` reproducible), fixture commiteada. Se consume desde ahí, no se copia al repo.
- Addresses clave: ARGt Arbitrum `0x59863989d080B22476DB95656d0C3CC18be92214`, Base `0xf016413834e6d1a14f3d628b11d6ef725a6bdbdd`, Polygon `0x50464be58912745447e24eb3bbdedcee10d3e056`; vault `0x9Dd3F844747AB78d616BF76DB92756E17A064aDD`; adapters del bridge en SPEC.md §2.
- Pendiente externo: addresses de BOLt por chain (pedir en Discord de Twin) y el archivo `bridge-adapter-abi.ts` del Notion.

## Constraints

- **Timeline**: submission jueves 20/08 18 h — todo recorte favorece llegar con demo hosteada
- **Tech stack**: Next.js (App Router) + Privy + wagmi/viem (`@privy-io/wagmi`); Vercel + Postgres del Marketplace para el ledger
- **Dependencies**: repo Sobrecito local (circuits/contracts/fixtures); ARGt real para fondear bóveda y demo; ETH/gas en Arbitrum para deploy y publish (~1,55M gas por verify)
- **Security**: clave de bóveda en server = solo demo, declararlo; jamás commitear `SOBRECITO_MASTER_HEX` ni proofs con datos reales
- **Disclosure**: PoC no auditado; cR/verdicts/coverage declarados (declaredMask); estilo de escritura heredado (sin "no es X, es Y", sin guiones largos en español)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Modo Cuenta custodial (6.A) como diferencial, sobre 6.B/6.C | Reuso total del stack Sobrecito; pitch alineado con "respaldado por reservas" de Twin | — Pending |
| ARGt completo + BOLt bonus; rendimiento solo ARGt vía Morpho | Único vault existente; BOLt suma bonus a costo marginal | — Pending |
| Fixture primero, pipeline real después | Registry + publish demostrables en horas; el proving sobre ledger real es riesgo de toolchain | — Pending |
| Privy para auth/wallet | Embedded wallet hace que se sienta neobanco; integra con wagmi | — Pending |
| user_id = DID de Privy | Ata login y commitment sin claves por cliente | — Pending |
| Vercel + Postgres Marketplace | Deploy en minutos, requisito de URL hosteada | — Pending |
| Solo + Claude, contra deadline | Fases chicas, secuenciales en lo crítico, fallbacks siempre | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

---
*Last updated: 2026-08-19 after initialization*
