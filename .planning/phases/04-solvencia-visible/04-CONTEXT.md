# Phase 4: Solvencia Visible - Context

**Gathered:** 2026-08-20 (fold de la discusión conjunta del 19-08 + pase `--auto` del 20-08)
**Status:** Ready for planning
**Mode:** `--auto` (gray areas restantes resueltas con la opción recomendada; las decisiones de la discusión conjunta del 19-08 quedan LOCKED y se conservan tal cual)

<domain>
## Phase Boundary

Cualquiera puede ver, y el cliente puede verificar, que su saldo está cubierto por una prueba criptográfica publicada on-chain. Entrega: badge de solvencia en el home de Cuenta (SOL-03), verificación de inclusión del cliente en el browser (SOL-04), página pública `/status/twin-neobank` sin login (SOL-05) y, como stretch no bloqueante, el pipeline real de corte redefinido como "corte mini" (SOL-06). Depende de Phase 2 (Registry desplegado, fixture publicada) y Phase 3 (ledger en Postgres con usuarios). Nada de esta fase bloquea el ship: SOL-03/04/05 se completan contra el Registry de la fixture aunque el mini no llegue.

</domain>

<decisions>
## Implementation Decisions

### Corte mini (SOL-06, stretch) — LOCKED 19-08
- **D-01:** SOL-06 se redefine como "corte mini": variante de `liabilities_batch` (K=64, T=2) que emite `C_L` vía `commitment_lib::commit_totals` en vez de las sumas en claro, con public inputs de layout compatible con el Registry (`[key_hash, C_L]`). El ledger de la demo (≤64 usuarios) entra en un solo lote: se elimina el árbol de agregación recursiva.
- **D-02:** Compilación una sola vez en la Mac con el toolchain pineado de Sobrecito (`nargo 1.0.0-beta.22` + `bb 5.0.0-nightly.20260522`); el artifact JSON del circuito se commitea en este repo.
- **D-03:** Proving en runtime con bb.js (WASM) en una función de Vercel (Fluid, 300 s): endpoint "correr corte" + cron. Sin binarios nativos en el server.
- **D-04:** Verifier Solidity generado del circuito mini con `gen-verifier.sh` y segundo Registry anclado a su VK. El Registry de Phase 2 (fixture) queda como fallback permanente. La app apunta al Registry por env.
- **D-05:** Primera tarea del stretch, antes de construir nada más: smoke test de bb.js. Probar que una proof generada con bb.js (la versión npm compatible con `bb 5.0.0-nightly.20260522`) verifica en el verifier Solidity generado con el bb nativo. Si el smoke falla, el stretch se abandona y la fase cierra con la fixture; ninguna otra tarea del mini arranca antes de este resultado.
- **D-06:** Si el mini funciona, el cron del corte es: Vercel cron diario → función que exporta el ledger, ejecuta el circuito mini con bb.js, arma el `CutInput` (cL probado, cR/verdicts/coverage declarados) y publica al segundo Registry con `walletClient` de viem firmando con la clave M2 (la misma wallet publisher de Phase 2, `PUBLISHER_PRIVATE_KEY` en env de Vercel). El endpoint "correr corte" invoca la misma función a mano para la demo en vivo.

### Verificación de inclusión (SOL-04)
- **D-07 (LOCKED 19-08):** El opening es `{balances, salt, corte_id}` servido por una API autenticada (sesión Privy del usuario). El browser recomputa el commitment Poseidon2 con el mismo esquema de `commitment_lib::commit` (domain separation idéntica, dominios del `fixtures/manifest.json`). El salt se deriva server-side con `HKDF(master, did)`; `SOBRECITO_MASTER_HEX` vive solo en env de Vercel y jamás se commitea.
- **D-08:** Implementación de Poseidon2 en browser: usar una implementación JS/WASM (la de `@noir-lang`/bb.js o una lib `poseidon2` JS), pero recién después de validarla contra un vector de test generado desde `commitment_lib` en Noir (mismo `commit(balances, salt)` con inputs conocidos, IV = `domain * 2^64 + n_absorbidos` según `lib.nr::iv_for`). El vector se genera una vez en la Mac y se commitea como fixture de test. Si ninguna lib JS reproduce el vector, fallback: ejecutar un circuito Noir mínimo de commitment con bb.js en el browser (witness execution, sin proving) y usar su output como recomputación.
- **D-09:** Los openings se computan on-the-fly en el request: la API lee el balance actual del ledger, deriva el salt con HKDF y responde. Vale para la era fixture (no hay filas de corte reales). Cuando exista el corte mini, cada corrida persiste filas `openings(corte_id, user_id, balances, commitment)` y la API sirve la fila del corte pedido; el salt se sigue derivando on-the-fly (es determinístico por DID).
- **D-10:** Contra qué se compara: el browser recomputa `commit(balances, salt)` y lo compara con el commitment que el backend registró para ese usuario en el corte. Los commitments individuales no están on-chain (solo `C_L`); la garantía contra omisión viene del binding del auditor, y la UI lo dice en claro (texto heredado de SPEC §7.5). Estados: verde (coincide), rojo (discrepancia), gris/pendiente (corte en curso o sin corte para este usuario, caso típico de la era fixture con corte sintético).
- **D-11:** Acción "reportar discrepancia" en el estado rojo: un `mailto:` prellenado (corte_id, DID, commitment esperado vs recomputado) más un `console.error` estructurado. Sin backend de tickets: es una demo.

### Badge (SOL-03) y frescura
- **D-12 (LOCKED 19-08):** Lectura directa del Registry con viem, sin backend propio. Verde si el último corte tiene menos de 26 h, ámbar si vencido.
- **D-13:** El badge lee `latestCorteId()` + `getCut(corteId)` con `useReadContracts` (dos calls, patrón ya establecido en Phase 1). Sin event logs para el badge: los logs quedan para el historial de `/status`. El "hace N h" sale de `publishedAt` del Cut.

### Página pública /status (SOL-05)
- **D-14 (LOCKED 19-08):** `/status/twin-neobank` sin login: veredictos, cobertura, frescura, historial de cortes y `declaredMask` explicado en claro (qué está probado y qué declarado), con link a la tx del publish.
- **D-15:** La página soporta DOS registries vía config por env: un array `[{label, address, chainId}]` (p. ej. "Corte real (mini)" y "Fixture sintética"). Con un solo registry configurado, la UI no muestra selector. Cada registry se lee igual: historial via event logs `CutPublished` (`getLogs` desde el bloque de deploy), detalle con `getCut`. Los cortes de la fixture se marcan "datos sintéticos" por label del registry.

### Claude's Discretion
- Diseño visual del badge, del semáforo y de la pantalla de verificación (respetando el design system de Phase 1 y el estado gris/verde/rojo).
- Elección exacta de la lib Poseidon2 JS a intentar primero (D-08 fija el criterio: pasa el vector o no se usa).
- Intervalos de refresco de lecturas del Registry, manejo de loading/error, paginación del historial de cortes.
- Estructura interna del código del pipeline mini (mientras respete D-01..D-06 y no toque el repo de Sobrecito).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Diseño del modo Cuenta y solvencia
- `SPEC.md` §7.3 — Arquitectura, corte diario paso a paso, openings, fallback fixture
- `SPEC.md` §7.4 — Pantallas: Cuenta·Home (badge), Cuenta·Verificación (estados verde/rojo/gris), `/status/twin-neobank`
- `SPEC.md` §7.5 — Qué es real y qué declarado; matiz de la inclusión (binding vía auditor, decirlo en la UI)
- `SPEC.md` §7.9 — Reservas con Morpho, cR declarado, cobertura por bucket

### Sobrecito (read-only, se consume desde ahí, no se copia)
- `/Users/francoperez/repos/job/Sobre/sobrecito/circuits/README.md` — Workspace, toolchain pineado, targets de verifier (evm vs noir-recursive), disclosure
- `/Users/francoperez/repos/job/Sobre/sobrecito/circuits/commitment_lib/src/lib.nr` — `commit`, `commit_totals`, `iv_for` (IV = domain·2^64 + n), la referencia exacta para D-08
- `/Users/francoperez/repos/job/Sobre/sobrecito/circuits/fixtures/manifest.json` — Dominios de separation, layout de public inputs `[key_hash, C_L]`, opening de la fixture, toolchain
- `/Users/francoperez/repos/job/Sobre/sobrecito/contracts/src/SobrecitoRegistry.sol` — `publish`, `getCut`, `latestCorteId`, `cutCount`, evento `CutPublished`, struct `Cut`/`CutInput`

### Planning
- `.planning/REQUIREMENTS.md` — SOL-03, SOL-04, SOL-05, SOL-06
- `.planning/ROADMAP.md` — Success criteria de Phase 4 (el criterio 4 es stretch, no bloqueante)
- `.planning/phases/02-sobrecito-registry/02-CONTEXT.md` — Decisiones del Registry fixture (si existe al momento de planificar)
- `.planning/phases/03-modo-cuenta/03-CONTEXT.md` — Ledger, DID de Privy, API autenticada (si existe al momento de planificar)

</canonical_refs>

<code_context>
## Existing Code Insights

Al momento de esta discusión el repo solo tiene SPEC.md y planning; Phases 1-3 crean el código del que esta fase depende.

### Reusable Assets (esperados de fases previas)
- Módulo de config único de addresses (D-10 de Phase 1): ahí se agregan los registries (array de D-15) y la address del verifier mini.
- Patrón `useReadContracts` de Phase 1 para las lecturas del Registry (D-13).
- API autenticada por sesión Privy y ledger Postgres de Phase 3: la ruta de openings (D-09) se monta sobre eso.
- Wallet M2 como publisher (Phase 2): la misma clave firma el publish del cron mini (D-06).

### Integration Points
- Badge en Cuenta·Home (pantalla de Phase 3), pantalla de verificación como ruta nueva del modo Cuenta, `/status/twin-neobank` como ruta pública fuera del layout autenticado.
- El artifact JSON del circuito mini y el vector de test Poseidon2 se commitean en este repo (Sobrecito no se modifica).

</code_context>

<specifics>
## Specific Ideas

- La pantalla de verificación es adaptación directa de `client-demo.tsx` de Sobrecito, cambiando la verificación mock (SHA-256 sobre fixtures) por Poseidon2 real (SPEC §7.4).
- El pitch de la inclusión es honesto: "verificás que tu opening abre contra tu commitment servido por el backend; la garantía contra omisión la da el binding del auditor". El texto va en la UI, sin letra chica escondida.
- Riesgos declarados del mini (19-08): compatibilidad de versión bb.js ↔ bb nativo (la proof debe verificar en el verifier generado) y memoria del proving en serverless. Por eso el smoke test (D-05) va primero y bloquea el resto del stretch.

</specifics>

<deferred>
## Deferred Ideas

- Reservas probadas con storage proofs (SOL-V2-01) — v2, cR va declarado.
- Merkle de commitments individuales para inclusión verificable on-chain — deuda declarada de Sobrecito (`fold_batch_acc` lineal), fuera de scope.
- UI de auditor con view-key — mock o pantalla estática solo si sobra tiempo (out of scope del proyecto).
- Backend de tickets para el reporte de discrepancia — el mailto de D-11 alcanza para la demo.

</deferred>

---

*Phase: 04-solvencia-visible*
*Context gathered: 2026-08-20*
