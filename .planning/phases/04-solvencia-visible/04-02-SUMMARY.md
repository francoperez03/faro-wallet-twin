---
phase: 04-solvencia-visible
plan: 02
subsystem: solvencia
tags: [poseidon2, noir, hkdf, privy, verificacion-inclusion]

requires:
  - phase: 03-modo-cuenta
    provides: "lib/privy-server.ts (verifyPrivyToken), lib/db/client.ts (sql), tabla accounts(user_id, argt_balance)"
provides:
  - "lib/poseidon2/commit.ts: recomputeCommitment(balances, salt) validado contra un vector real de commitment_lib"
  - "lib/poseidon2/test-vectors/commitment-vector.json: vector real generado con nargo test sobre commitment_lib::commit"
  - "app/api/cuenta/opening/route.ts: GET autenticado, on-the-fly, {balances, salt, corteId, commitment, synthetic}"
  - "app/(tabs)/cuenta/verificar/page.tsx: pantalla de verificación con estados verde/rojo/gris y mailto de reporte"
affects: [04-03]

tech-stack:
  added: ["@zkpassport/poseidon2 (permute crudo BN254, validado 1:1 contra el vector)", "node:test + tsx como test runner (sin framework nuevo)"]
  patterns:
    - "recomputeCommitment() reimplementa el sponge duplex de commitment_lib::Poseidon2 (rate=3, IV=domain*2^64+n) sobre la permutación cruda de una lib JS, en vez de asumir cualquier hash Poseidon2 'genérico'"
    - "Salt derivado server-only con HKDF-SHA256(SOBRECITO_MASTER_HEX, did), reducido mod BN254 Fr antes de usarse como Field"
    - "DID tomado exclusivamente del access token de Privy verificado (nunca de un param de la request), mismo patrón de lib/privy-server.ts que Phase 3"

key-files:
  created:
    - tools/poseidon2-vector/Nargo.toml
    - tools/poseidon2-vector/src/main.nr
    - lib/poseidon2/test-vectors/commitment-vector.json
    - lib/poseidon2/commit.ts
    - lib/poseidon2/commit.test.ts
    - app/api/cuenta/opening/route.ts
    - app/(tabs)/cuenta/verificar/page.tsx
  modified:
    - package.json (script "test", dependencia @zkpassport/poseidon2)
    - .env.example (SOBRECITO_MASTER_HEX, placeholder)

key-decisions:
  - "@zkpassport/poseidon2 (permute crudo sobre BN254) pasó el vector real exacto en el primer intento; no hizo falta el fallback de D-08 (witness execution con noir_js/bb.js)"
  - "Estado verde/rojo se decide solo por la comparación de commitments, no por el flag synthetic (el action del plan decía gris si synthetic:true, pero el acceptance_criteria del mismo Task 3 pedía verde en el caso normal de corte sintético; se resolvió a favor de acceptance_criteria porque es el criterio verificable explícito, y se agregó una nota separada 'Corte sintético' que no gatea el color)"
  - "corte_id sintético fijo 'fixture-sintetico' (no 'fixture-reducida' del manifest de Sobrecito, que es el id del dataset de Sobrecito, no de este ledger)"

patterns-established:
  - "Cualquier endpoint que necesite computar/verificar un commitment Poseidon2 importa recomputeCommitment de lib/poseidon2/commit.ts, nunca reimplementa el sponge"

requirements-completed: [SOL-04]

duration: ~50min
completed: 2026-08-20
---

# Phase 4 Plan 2: Verificación de inclusión del cliente Summary

**Vector Poseidon2 real generado con `nargo test` sobre `commitment_lib::commit`, reproducido exacto por `@zkpassport/poseidon2` (permutación cruda BN254) en JS, y usado en una API de opening autenticada por Privy más una pantalla de verificación con semáforo verde/rojo y disclosure honesto de la garantía de inclusión.**

## Performance

- **Duration:** ~50 min
- **Tasks:** 3/3 completados
- **Files modified:** 9

## Accomplishments

- Task 1 (checkpoint:human-action ejecutado con evidencia, ver abajo): vector de test real generado desde `commitment_lib` con el toolchain pineado (`nargo 1.0.0-beta.22`), commiteado en `lib/poseidon2/test-vectors/commitment-vector.json`
- Task 2: `recomputeCommitment(balances, salt)` reimplementa el sponge duplex exacto de `commitment_lib::Poseidon2` (rate=3, capacidad=1, IV custom `domain*2^64+n`) sobre `permute()` de `@zkpassport/poseidon2`, validado con `node --test` contra el vector real (match exacto, sin necesitar el fallback de witness execution)
- Task 3: `GET /api/cuenta/opening` autenticado (DID solo del token Privy, T-04-04), salt derivado server-side con HKDF-SHA256(`SOBRECITO_MASTER_HEX`, did) reducido al field de Poseidon2, commitment recomputado server-side; pantalla `/cuenta/verificar` que recomputa en el browser, compara, y muestra verde/rojo con botón de reporte por `mailto:` en rojo
- `npm run build` pasa con las tres rutas nuevas compiladas

## Checkpoint ejecutado (Task 1, con evidencia)

El toolchain pineado (`nargo 1.0.0-beta.22`, `bb 5.0.0-nightly.20260522`) estaba disponible en esta Mac vía `export PATH="$HOME/.nargo/bin:$HOME/.bb:$PATH"` (verificado con `nargo --version`). Se ejecutó directamente en vez de detenerse en el checkpoint humano:

1. Se creó `tools/poseidon2-vector/` con un `Nargo.toml` que declara `commitment_lib = { path = "/Users/francoperez/repos/job/Sobre/sobrecito/circuits/commitment_lib" }` (ruta absoluta, read-only).
2. `nargo test --show-output` corrió `commitment_lib::commit([1000000000000000000], 424242)` e imprimió el Field real:
   ```
   0x181ab30b6db964295ad2ee45b662e8ba112af8a441f276b7e1e351108b9cf5cf
   ```
3. Se confirmó que `git status` en el repo Sobrecito no muestra ningún cambio dentro de `circuits/commitment_lib/` (los cambios untracked preexistentes ahí son de otras partes del repo, no tocadas por este plan).
4. El vector se commiteó en `lib/poseidon2/test-vectors/commitment-vector.json` con ese valor exacto (no placeholder).

**Vector obtenido:** `expected = 0x181ab30b6db964295ad2ee45b662e8ba112af8a441f276b7e1e351108b9cf5cf` para `commit([1000000000000000000], 424242)`.

**Implementación JS que pasó el vector:** `@zkpassport/poseidon2` (versión `0.6.2`), usando su función `permute` (permutación cruda de Poseidon2 sobre BN254, t=4). Se probó primero por ser una lib purpose-built para Noir/BN254; pasó el vector exacto en el primer intento, así que no se necesitó `@aztec/bb.js` (se probó instalar la versión que matchea el bb nativo, `5.0.0-nightly.20260522`, pero no expone una permutación cruda en su API pública de Node, así que se desinstaló) ni el fallback de witness execution con `noir_js`.

## Task Commits

1. **Task 1: Vector de test Poseidon2 real** - `9467529` (feat)
2. **Task 2: recomputeCommitment JS validado contra el vector** - `8306495` (test)
3. **Task 3: API de opening + pantalla de verificación** - `ea393e8` (feat)

## Files Created/Modified

- `tools/poseidon2-vector/Nargo.toml`, `tools/poseidon2-vector/src/main.nr` - crate descartable, path dependency read-only a Sobrecito
- `lib/poseidon2/test-vectors/commitment-vector.json` - vector real (balances, salt, expected, domain, note)
- `lib/poseidon2/commit.ts` - `recomputeCommitment(balances, salt)`, sponge duplex sobre `permute()` de `@zkpassport/poseidon2`
- `lib/poseidon2/commit.test.ts` - 2 tests (`node:test`): match exacto contra el vector, no-colisión al cambiar un balance
- `app/api/cuenta/opening/route.ts` - `GET`, HKDF server-only, commitment server-side, `corteId` sintético fijo
- `app/(tabs)/cuenta/verificar/page.tsx` - fetch + recompute + comparación + semáforo + mailto
- `package.json` - script `"test": "node --import tsx --test"`, dependencia `@zkpassport/poseidon2`
- `.env.example` - `SOBRECITO_MASTER_HEX` (placeholder, nota server-only)

## Decisions Made

- **Estado verde/rojo no gatea por `synthetic`**: el `<action>` del plan decía "gris si synthetic:true", pero el `<acceptance_criteria>` del mismo Task 3 pedía explícitamente "con sesión, la pantalla muestra verde cuando el commitment recomputado coincide (caso normal, corte sintético)". Ambos textos son contradictorios entre sí dentro del mismo plan. Se resolvió a favor del `acceptance_criteria` (el criterio verificable y más concreto), mostrando verde/rojo solo según la comparación de commitments, y agregando una línea informativa separada "Corte sintético (era fixture...)" que no gatea el color. El estado gris quedó reservado para loading y error de fetch (sesión no lista, request en curso).
- **HKDF construcción**: `hkdfSync("sha256", ikm=Buffer.from(SOBRECITO_MASTER_HEX,"hex"), salt=Buffer.alloc(0), info=Buffer.from(did,"utf8"), 32)`, resultado interpretado como bigint y reducido mod el orden del subgrupo escalar de BN254 (Fr) para ser un Field válido de Poseidon2. No especificado con ese nivel de detalle en el plan; es la lectura literal más directa de "HKDF(master, did)" con Node `crypto.hkdfSync`.
- **`corte_id` sintético fijo**: `"fixture-sintetico"`, deliberadamente distinto del `corte_id` del dataset de Sobrecito (`"fixture-reducida"` en `fixtures/manifest.json`), porque ese id pertenece al dataset de Sobrecito, no a este ledger de la demo.
- **`@aztec/bb.js` se instaló y se desinstaló**: la versión exacta que matchea el toolchain nativo (`5.0.0-nightly.20260522`) no expone una permutación Poseidon2 cruda en su API pública de Node (solo la usa internamente para oracle hashing del backend de prueba), así que no sirve para este caso de uso sin reimplementar más capas de las necesarias.

## Deviations from Plan

### Auto-fixed / resueltas durante ejecución

**1. [Rule 3 - Blocking] `npm test` no existía (sin framework de test en el repo)**
- **Found during:** Task 2 (`<verify>` pide `npm test -- lib/poseidon2/commit.test.ts`)
- **Issue:** `package.json` no tenía script `test` ni ningún runner instalado
- **Fix:** Se usó `node --test` (runner nativo de Node, sin dependencia nueva) con `--import tsx` para soportar TypeScript, agregado como script `"test": "node --import tsx --test"`
- **Files modified:** `package.json`
- **Verification:** `npm test -- lib/poseidon2/commit.test.ts` pasa (2/2)
- **Committed in:** `8306495`

**2. Contradicción interna del plan (gris vs verde en synthetic) — ver "Decisions Made" arriba.**

---

**Total deviations:** 1 auto-fijo (Rule 3), 1 ambigüedad de plan resuelta y documentada.
**Impact on plan:** Ninguno cambia el alcance; ambas resoluciones mantienen SOL-04 cumplido tal como lo pide `<success_criteria>`.

## Issues Encountered

Ninguno bloqueante. `PRIVY_APP_SECRET`/`DATABASE_URL` siguen pendientes (heredado de Phase 3): el endpoint compila y degrada a `401 {"error":"configurar Privy"}` en runtime sin crashear, verificado con `npm run dev` + `curl`.

## User Setup Required

- `SOBRECITO_MASTER_HEX` (32 bytes hex) debe setearse en env de Vercel antes de que el opening real funcione en producción; el placeholder en `.env.example` está vacío a propósito.
- Depende del mismo checkpoint pendiente de Phase 3 (Neon/`DATABASE_URL`, `PRIVY_APP_SECRET`) para probarse end-to-end con una sesión real.

## Next Phase Readiness

- `lib/poseidon2/commit.ts` queda listo para que 04-03 (corte mini) lo reuse si necesita recomputar/verificar commitments fuera del circuito.
- `app/api/cuenta/opening/route.ts` sirve openings on-the-fly (D-09); cuando exista el corte mini, la persistencia de filas `openings(corte_id, ...)` es un cambio aislado a esa ruta (leer la fila del corte en vez de recomputar el balance actual), sin tocar `lib/poseidon2/commit.ts` ni la pantalla de verificación.

---
*Phase: 04-solvencia-visible*
*Completed: 2026-08-20*
