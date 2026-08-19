<!-- GSD:project-start source:PROJECT.md -->
## Project

**Twin Neobank**

Un neobanco sobre las stablecoins de Twin para el hackathon "Twin your Neobank" (LATAM Digital Assets Conference, submission cierra jueves 20/08 18 h). Tiene dos modos: **Wallet** (self-custody con Privy embedded wallet: balances, transfers, vault Morpho y bridge de ARGt) y **Cuenta** (custodial: saldo interno con interés desde el vault, respaldado por una prueba ZK de solvencia diaria publicada on-chain con el stack de Sobrecito).

**Core Value:** Una cuenta custodial que paga interés y prueba criptográficamente cada día que tiene los pesos de sus clientes, verificable por cualquiera on-chain.

### Constraints

- **Timeline**: submission jueves 20/08 18 h — todo recorte favorece llegar con demo hosteada
- **Tech stack**: Next.js (App Router) + Privy + wagmi/viem (`@privy-io/wagmi`); Vercel + Postgres del Marketplace para el ledger
- **Dependencies**: repo Sobrecito local (circuits/contracts/fixtures); ARGt real para fondear bóveda y demo; ETH/gas en Arbitrum para deploy y publish (~1,55M gas por verify)
- **Security**: clave de bóveda en server = solo demo, declararlo; jamás commitear `SOBRECITO_MASTER_HEX` ni proofs con datos reales
- **Disclosure**: PoC no auditado; cR/verdicts/coverage declarados (declaredMask); estilo de escritura heredado (sin "no es X, es Y", sin guiones largos en español)
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
