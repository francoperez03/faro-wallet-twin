---
phase: 01-wallet-mode
plan: 03
subsystem: vault
tags: [erc4626, wagmi, viem, morpho, arbitrum, vault]

requires:
  - phase: 01-wallet-mode
    provides: "lib/config/tokens.ts (VAULT_ARGT_PRIME, TOKENS.ARGt), lib/wagmi-config.ts, tab shell"
provides:
  - "lib/hooks/use-vault-position.ts: posición del vault (shares + valueInArgt via convertToAssets) con refetch"
  - "components/vault-card.tsx: card de posición, empty state, sugerencia de bridge si hay ARGt en Base/Polygon"
  - "app/(tabs)/rendimiento/page.tsx: depositar (approve + deposit) y retirar (redeem parcial o total) sobre el vault ARGt Prime en Arbitrum"
affects: [phase-3-modo-cuenta]

tech-stack:
  added: []
  patterns:
    - "ABI ERC-4626 mínima (solo funciones usadas) definida junto al hook que la consume, exportada para reuso (vaultAbi en use-vault-position.ts, reusada en page.tsx)"
    - "Escrituras imperativas con useWriteContract (hook) + readContract/waitForTransactionReceipt de wagmi/actions (config) para pasos secuenciales (allowance -> approve -> deposit)"

key-files:
  created:
    - lib/hooks/use-vault-position.ts
    - components/vault-card.tsx
  modified:
    - app/(tabs)/rendimiento/page.tsx

key-decisions:
  - "BigInt(0) en vez de 0n: tsconfig.json tiene target ES2017 (heredado de 01-01), que no soporta bigint literals; se evitó tocar tsconfig.json (fuera del scope de archivos de este plan) usando BigInt(0) en su lugar"
  - "Retiro parcial pide un monto en ARGt (no shares crudas): se resuelve a shares con previewWithdraw(assets) del vault antes de llamar redeem, más preciso que convertToShares para who-pays-for-rounding y evita pedirle al user que piense en shares"
  - "Toast de progreso (sonner) implementado como estaba en el plan, pero <Toaster/> no está montado en ningún layout todavía (gap heredado de 01-01, ningún plan de wave 2 toca app/layout.tsx); los toasts no van a ser visibles hasta que se monte. Documentado como Known Gap abajo, no corregido por estar fuera del set de archivos declarado por este plan y por la restricción explícita de tocar solo archivos disjuntos entre executors paralelos"

patterns-established:
  - "vaultAbi se exporta desde el hook de lectura y se reusa en la pantalla de escritura, evitando duplicar la definición del ABI"

requirements-completed: [M2-01, M2-02]

duration: ~35min
completed: 2026-08-20
---

# Phase 1 Plan 3: Vault ARGt Prime (posición, depósito, retiro) Summary

**Deposit (approve + deposit) y withdraw (redeem parcial o total) reales sobre el vault ERC-4626 ARGt Prime en Arbitrum, con posición valuada en ARGt via convertToAssets(balanceOf(user)).**

## Performance

- **Duration:** ~35 min
- **Tasks:** 2/2 ejecutados
- **Files modified:** 3 (2 creados, 1 modificado)

## Accomplishments
- `use-vault-position.ts` lee `balanceOf(user)` (shares) del vault y lo convierte a ARGt con `convertToAssets`, expone `refetch` para revalidar tras cada tx
- `vault-card.tsx` muestra la posición valuada (tabular-nums), el empty state exacto del UI-SPEC, link "Ver en Morpho" y una sugerencia de bridge si el user tiene ARGt en Base o Polygon (lectura local con `useReadContracts`, sin importar hooks de 01-02)
- `rendimiento/page.tsx` implementa depósito (`approve` con el monto exacto + `deposit(assets, receiver)`, skip de approve si el allowance ya alcanza) y retiro (parcial via `previewWithdraw` + `redeem`, o total con `redeem(balanceOfShares, ...)` detrás de un diálogo de confirmación destructivo)

## Task Commits

1. **Task 1: Posición del vault (lectura)** - `3f4c054` (feat)
2. **Task 2: Depositar y retirar (M2-01, M2-02)** - `b3399c8` (feat)

## Files Created/Modified
- `lib/hooks/use-vault-position.ts` - Hook de posición (shares + valueInArgt + isLoading + refetch), exporta `vaultAbi`
- `components/vault-card.tsx` - Card de posición valuada / empty state / sugerencia de bridge
- `app/(tabs)/rendimiento/page.tsx` - Pantalla completa: VaultCard + form de depósito + form de retiro (parcial/total)

## Decisions Made
- `BigInt(0)` en vez del literal `0n` en todo el código nuevo, porque `tsconfig.json` (target ES2017, heredado del scaffold de 01-01) rompe el build con bigint literals; corregir el target hubiera significado tocar un archivo fuera del scope declarado de este plan mientras corren 3 executors en paralelo, así que se evitó el literal en su lugar.
- Retiro parcial resuelto vía `previewWithdraw(assets)` en vez de pedirle shares crudas al usuario o usar `convertToShares` (menos preciso para redondeo de retiro).
- `approve` siempre con el monto exacto (nunca `type(uint256).max`), conforme a la mitigación T-03-01 del threat model del plan.

## Deviations from Plan

None (a nivel de código) más allá de la sustitución de `0n` documentada arriba, que no cambia comportamiento ni alcance.

## Issues Encountered
- `npm run build` falló una vez con "Another next build process is already running" porque otro executor (01-02) estaba compilando en paralelo sobre el mismo repo; se reintentó tras esperar y pasó sin cambios.
- `git commit` no chocó con `index.lock` en esta ejecución; no fue necesario el retry loop, aunque se dejó preparado (`for i in 1..5`) por si acaso.

## Known Gap (no corregido, fuera de scope)
- `<Toaster />` (sonner) no está montado en `app/layout.tsx` ni en ningún layout de tabs. Los `toast.success`/`toast.error` de esta pantalla llaman a la API de sonner pero no van a renderizar nada visible hasta que algún plan monte `<Toaster />` en el layout raíz. No se corrigió acá porque `app/layout.tsx` no está en `files_modified` de este plan y las instrucciones de ejecución en paralelo piden tocar solo los archivos declarados por cada plan. La UI de progreso sigue siendo legible sin el toast: los botones muestran el texto de estado ("Aprobando...", "Depositando...", "Retirando...") mientras la tx está en curso.

## User Setup Required

Ninguno nuevo. Sigue pendiente lo de 01-01 (crear app en dashboard.privy.io) para probar el login end-to-end; sin login no se puede probar deposit/withdraw en vivo.

**No verificado en runtime con fondos reales** (deposit, withdraw parcial, withdraw total en Arbitrum mainnet): esta ejecución solo corrió `npm run build` (TypeScript + prerender estático) como exige el plan. El address del vault (`VAULT_ARGT_PRIME.address` en `lib/config/tokens.ts`, creado en 01-01) no fue re-verificado por RPC en esta sesión; se asumió correcto por venir de SPEC.md §2 vía el scaffold de 01-01.

## Next Phase Readiness
- `use-vault-position.ts` y su `vaultAbi` exportado quedan disponibles para que Phase 3 (Modo Cuenta) los reuse si necesita leer la posición del vault desde el backend/ledger.
- Bloqueante para QA real: (1) Privy App ID real (ver 01-01-SUMMARY.md), (2) montar `<Toaster />` en el layout (ver Known Gap arriba) para que el feedback de progreso sea visible, (3) probar con fondos reales de ARGt en Arbitrum.

---
*Phase: 01-wallet-mode*
*Completed: 2026-08-20*
