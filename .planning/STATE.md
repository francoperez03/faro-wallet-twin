# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-08-19)

**Core value:** Una cuenta custodial que paga interés y prueba criptográficamente cada día que tiene los pesos de sus clientes, verificable por cualquiera on-chain.
**Current focus:** Phase 1 (Wallet Mode) and Phase 2 (Sobrecito Registry), in parallel

## Current Position

Phase: 1 of 5 (Wallet Mode)
Plan: 0 of TBD in current phase
Status: Ready to plan
Last activity: 2026-08-19 — Roadmap created (5 phases, 24/24 requirements mapped)

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: -
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**
- Last 5 plans: -
- Trend: -

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Roadmap: Phase 2 (Sobrecito Registry deploy + fixture publish) has no dependency on the app and can run in parallel with Phase 1 (Wallet Mode)
- Roadmap: SOL-06 (real ZK pipeline over the live ledger) lives in Phase 4 as a stretch criterion; Phase 5 (Ship) never depends on it
- Roadmap: M1-03 (BOLt) is a non-blocking bonus criterion inside Phase 1, gated on getting BOLt addresses from Discord

### Pending Todos

None yet.

### Blockers/Concerns

- M1-03 (BOLt): gated on external info (Discord) for per-chain addresses. Never block Phase 1 completion on it.
- SOL-06: proving pipeline on the demo machine is a known toolchain risk (SPEC.md §7.7). Fixture fallback is the permanent safety net; never let it block Phase 4 or Phase 5.
- Vault/publisher key lives on the server for this demo (accepted risk, must stay in the SHIP-02 disclosure).

## Deferred Items

Items acknowledged and carried forward from previous milestone close:

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| *(none)* | | | |

## Session Continuity

Last session: 2026-08-19
Stopped at: Roadmap created, awaiting user approval before planning Phase 1
Resume file: None
