# Phase 2 · Sobrecito Registry — Context

Discutido 2026-08-19 (discusión conjunta de las 5 fases).

## Decisiones

- **Deployer/publisher**: la wallet M2 de wakeup, `0x13B56eA93CB18ae90d7Ff6E01Cb97C1AbFB2B992`, clave en `~/.wakeup-m2-arb1.key`. Ya deployó a mainnet Arbitrum (vault-aggregator).
- **Fondeo pendiente**: balance actual 0.00053 ETH en Arbitrum (0 en Base/Polygon). Sumar ~0.002 ETH en Arbitrum antes del deploy (verifier grande + Registry + publishes de ~1,55M gas). Acción del usuario.
- **Deploy**: desde el repo Sobrecito (`/Users/francoperez/repos/job/Sobre/sobrecito/contracts`) con `Deploy.s.sol` y el key_hash del manifest de la fixture. No se copia código al repo twin; solo se registran addresses (en env y en un `deployments.json` propio).
- **Publish inicial**: la prueba commiteada `circuits/fixtures/full_cut/root` (target evm, ya verificada en los 22 tests de Foundry). Caso negativo (publish inválido revierte) demostrable con la proof adulterada del test suite.
- **Registry-mini (para fase 4)**: el keyHash es immutable; cuando exista el circuito "corte mini" se deploya un SEGUNDO Registry anclado a su VK. Este deploy de fase 2 no lo bloquea ni lo espera.
