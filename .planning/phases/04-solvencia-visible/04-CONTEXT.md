# Phase 4 · Solvencia Visible — Context

Discutido 2026-08-19 (discusión conjunta de las 5 fases).

## Decisiones

- **SOL-06 se redefine como "corte mini"** (pedido del usuario: extraer lógica mínima en vez de correr el pipeline completo en la Mac):
  1. Variante de `liabilities_batch` (K=64, T=2) que emite `C_L` vía `commitment_lib::commit_totals` en vez de las sumas en claro; public inputs con layout compatible con el Registry (`[key_hash, C_L]`). El ledger de la demo (≤64 usuarios) entra en un solo lote: se elimina el árbol de agregación recursiva.
  2. Compilación una sola vez en la Mac con el toolchain pineado de Sobrecito (`nargo 1.0.0-beta.22` + `bb 5.0.0-nightly.20260522`); el artifact JSON del circuito se commitea.
  3. Proving en runtime con **bb.js (WASM) en una función de Vercel** (Fluid, 300 s): endpoint "correr corte" + cron. Sin binarios nativos en el server.
  4. Verifier Solidity generado del circuito mini (`gen-verifier.sh`) y segundo Registry anclado a su VK (el de fase 2 queda para la fixture). La app apunta al Registry por env.
  - Riesgos: compatibilidad de versión bb.js ↔ bb nativo (la proof debe verificar en el verifier generado); memoria del proving en serverless. Validar con un smoke test antes de comprometer. Fallback permanente: la fixture del Registry de fase 2.
- **Verificación de inclusión (SOL-04)**: opening = `{balances, salt, corte_id}` servido por API autenticada; el browser recomputa el commitment Poseidon2 (mismo esquema de `commitment_lib`, con domain separation idéntica) usando bb.js/noir-lang o una implementación JS de Poseidon2 verificada contra un vector de la lib. El salt se deriva server-side (`HKDF(master, did)`); `SOBRECITO_MASTER_HEX` vive solo en env de Vercel.
- **Badge (SOL-03) y semáforo (SOL-05)**: lectura directa del Registry con viem (evento `CutPublished` + `latestCorteId`); verde < 26 h, ámbar si vencido; `declaredMask` explicado en claro. Sin backend propio para esto.

## Nota de alcance

El corte mini sigue siendo stretch: SOL-03/04/05 se completan contra el Registry de la fixture aunque el mini no llegue. Nada de esta fase bloquea el ship.
