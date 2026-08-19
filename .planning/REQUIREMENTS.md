# Requirements · Twin Neobank

Fuente: `SPEC.md` (raíz) + PROJECT.md. v1 = lo que se demuestra en la submission del hackathon (jueves 20/08 18 h).

## v1 Requirements

### Auth y wallet (AUTH)

- [ ] **AUTH-01**: User can log in with email or Google via Privy and get an embedded wallet without a browser extension
- [ ] **AUTH-02**: User can see their embedded wallet address and disconnect/log out

### Milestone 1 · Balances y transfers (M1)

- [ ] **M1-01**: User can see their ARGt balance per chain (Arbitrum, Base, Polygon) and the total
- [ ] **M1-02**: User can transfer ARGt to any address on a chosen chain, with automatic chain switching
- [ ] **M1-03**: User can see their BOLt balance and transfer BOLt (bonus; gated on getting BOLt addresses from Discord)

### Milestone 2 · Vault (M2)

- [ ] **M2-01**: User can deposit ARGt into the ARGt Prime vault (ERC-4626, Arbitrum) with approve + deposit
- [ ] **M2-02**: User can see their vault position valued in ARGt (convertToAssets) and withdraw/redeem

### Milestone 3 · Bridge (M3)

- [ ] **M3-01**: User can bridge ARGt between Base, Arbitrum and Polygon (approve + bridge call with cross-chain fee)
- [ ] **M3-02**: User sees bridge status (sent / pending on destination) and refreshed destination balance

### Modo Cuenta (CTA)

- [ ] **CTA-01**: User can switch between Wallet mode and Cuenta mode with a persistent toggle
- [ ] **CTA-02**: User can move ARGt into their Cuenta (transfer to the omnibus vault address; backend credits the ledger on Transfer event, matching Privy DID ↔ embedded wallet address)
- [ ] **CTA-03**: User can see their Cuenta balance, accrued interest and current rate
- [ ] **CTA-04**: User can withdraw from Cuenta to their embedded wallet on a chosen chain (backend signs from the vault; per-user daily limit)
- [ ] **CTA-05**: Ledger persists in Postgres with accounts and movements (deposit, withdraw, interest), seeded with synthetic users so the cut has volume
- [ ] **CTA-06**: Interest accrues pro rata from real vault yield (convertToAssets delta), creditable via cron or manual trigger

### Solvencia · Sobrecito (SOL)

- [ ] **SOL-01**: SobrecitoRegistry + HonkVerifier deployed on Arbitrum via Deploy.s.sol with the fixture's key_hash
- [ ] **SOL-02**: A cut is published on-chain (publish with the committed fixture proof) and rejected publishes revert
- [ ] **SOL-03**: Cuenta home shows a solvency badge ("Solvencia probada on-chain · último corte hace N h", green < 26 h, amber otherwise) reading the Registry
- [ ] **SOL-04**: User can verify their inclusion: fetch their opening, recompute the Poseidon2 commitment in the browser and see green/red/pending states
- [ ] **SOL-05**: Public `/status/twin-neobank` page shows verdicts, coverage, freshness, cut history and declaredMask (probado vs declarado), no login
- [ ] **SOL-06**: Real pipeline: export ledger CSV → orchestrate_tree.py → publish the real root proof (stretch; fixture remains the fallback)

### Entrega (SHIP)

- [ ] **SHIP-01**: App deployed on Vercel at a public URL
- [ ] **SHIP-02**: Disclosure visible in-app: PoC no auditado, qué está probado y qué declarado
- [ ] **SHIP-03**: Submission sent (URL, nombre, mail) before jueves 20/08 18 h

## v2 Requirements

- **SOL-V2-01**: Reservas probadas con storage proofs (F2 de Sobrecito) en vez de cR declarado
- **SOL-V2-02**: Multisig 2-de-2 pipeline+operador para el publisher
- **SOL-V2-03**: UI de auditor con view-key y binding
- **CTA-V2-01**: Rebalanceo automático de la bóveda entre chains vía bridge
- **ZK-V2-01**: Stealth addresses / prueba de solvencia personal (ideas 5.1/5.2 del SPEC)

## Out of Scope

- KYC/compliance real — demo de hackathon
- Custodia con HSM/Fireblocks — clave de bóveda en server, declarado como límite de demo
- Bridge o vault para BOLt — no existen en la infra de Twin
- Fiat on/off ramp — fuera del brief
- Soporte Ethereum mainnet — el bridge de Twin no lo soporta

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| M1-01 | Phase 1 | Pending |
| M1-02 | Phase 1 | Pending |
| M1-03 | Phase 1 | Pending |
| M2-01 | Phase 1 | Pending |
| M2-02 | Phase 1 | Pending |
| M3-01 | Phase 1 | Pending |
| M3-02 | Phase 1 | Pending |
| SOL-01 | Phase 2 | Pending |
| SOL-02 | Phase 2 | Pending |
| CTA-01 | Phase 3 | Pending |
| CTA-02 | Phase 3 | Pending |
| CTA-03 | Phase 3 | Pending |
| CTA-04 | Phase 3 | Pending |
| CTA-05 | Phase 3 | Pending |
| CTA-06 | Phase 3 | Pending |
| SOL-03 | Phase 4 | Pending |
| SOL-04 | Phase 4 | Pending |
| SOL-05 | Phase 4 | Pending |
| SOL-06 | Phase 4 | Pending |
| SHIP-01 | Phase 5 | Pending |
| SHIP-02 | Phase 5 | Pending |
| SHIP-03 | Phase 5 | Pending |
