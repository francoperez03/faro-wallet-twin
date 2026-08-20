---
phase: 01-wallet-mode
verified: 2026-08-20T00:00:00Z
status: human_needed
score: 5/5 truths verified at code level (runtime E2E pending on Privy checkpoint)
overrides_applied: 0
human_verification:
  - test: "Crear app real en dashboard.privy.io, setear NEXT_PUBLIC_PRIVY_APP_ID, loguearse con email/Google sin extensión"
    expected: "Login funciona, Home muestra la embedded wallet address real, 'Cerrar sesión' con confirmación vuelve al estado de login (AUTH-01, AUTH-02)"
    why_human: "Requiere credenciales externas (Privy dashboard) y un navegador real; NEXT_PUBLIC_PRIVY_APP_ID sigue en placeholder REPLACE_ME_PRIVY_APP_ID"
  - test: "Con fondos reales de ARGt, ver balance por chain y total en Home, transferir a una address desde una chain distinta a la activa"
    expected: "Balance total y desglose correctos, switchChain automático antes de transfer, balance baja tras confirmar (M1-01, M1-02)"
    why_human: "Requiere wallet fondeada y confirmación de tx real en mainnet; solo verificado a nivel de código y npm run build"
  - test: "Depositar ARGt en el vault, ver posición valuada, retirar parcial y total"
    expected: "approve (si allowance insuficiente) + deposit, posición muestra convertToAssets correcto, redeem parcial (previewWithdraw) y total funcionan (M2-01, M2-02)"
    why_human: "Requiere fondos reales en Arbitrum y confirmación de tx; no ejecutado en runtime"
  - test: "Bridgear ARGt entre dos de las tres chains con el ABI reconstruido empíricamente"
    expected: "approve + quoteSend + send con value=nativeFee, pill pasa de 'En tránsito' a 'Completado' sin refresh manual, balance de destino sube (M3-01, M3-02)"
    why_human: "El ABI es una reconstrucción por verificación on-chain (13/13 selectores + 4 lecturas de estado), no el archivo real del Notion; falta bajarlo y comparar, y falta una tx real de bridge extremo a extremo"
  - test: "Confirmar addresses de BOLt por Discord y, si llegan, agregar el entry al registry"
    expected: "M1-03 (bonus, no bloqueante) completo con balance y transfer de BOLt"
    why_human: "Depende de un dato externo (Discord de Twin) que no llegó durante la ejecución; explícitamente no bloqueante por CONTEXT.md D-10 y por instrucción del team lead"
---

# Phase 1: Wallet Mode Verification Report

**Phase Goal:** Un usuario entra sin extensión, ve sus balances de ARGt en 3 chains, transfiere, deposita en el vault y bridgea entre chains.
**Verified:** 2026-08-20
**Status:** human_needed
**Re-verification:** No — initial verification

## Build Check

`npm run build` (Next.js 16.3.1, Turbopack) passes clean: TypeScript compiles, all 6 routes (`/`, `/home`, `/enviar`, `/rendimiento`, `/bridge`, `/actividad`) prerender as static content with no errors. No concurrent-executor conflicts encountered (no plan 03-01 files exist yet in this repo snapshot, so the "retry if failing on lib/db etc." condition from the task did not apply).

## Goal Achievement

### Observable Truths (ROADMAP Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User se loguea con email o Google via Privy y obtiene una embedded wallet, sin instalar extensión | ✓ VERIFIED (code) / ? PENDING (runtime) | `app/providers.tsx`: `PrivyProvider` with `loginMethods: ["email","google"]`, `embeddedWallets.ethereum.createOnLogin: "users-without-wallets"`. `app/(tabs)/home/page.tsx` renders login CTA / authenticated state via `usePrivy()`. Runtime unverifiable: `NEXT_PUBLIC_PRIVY_APP_ID` is still the placeholder `REPLACE_ME_PRIVY_APP_ID` (checked `.env.local` absent from repo scan; `.env.example` documents the placeholder) |
| 2 | User ve su balance de ARGt por chain (Arbitrum, Base, Polygon) y el total, y puede transferir a cualquier address con cambio de chain automático | ✓ VERIFIED (code) / ? PENDING (runtime) | `lib/hooks/use-token-balances.ts` (multicall `useReadContracts`), Home renders Display total + `BalanceList`/`TokenRow` breakdown. `app/(tabs)/enviar/page.tsx`: address regex validation, amount validation vs. on-chain balance, `if (chainId !== CHAIN_IDS[chain]) await switchChainAsync(...)` executed **before** `writeContractAsync({functionName:"transfer",...})` — switchChain-before-write confirmed in source order |
| 3 | User deposita ARGt en el vault ARGt Prime (approve + deposit), ve su posición valuada en ARGt y puede retirarla | ✓ VERIFIED (code) / ? PENDING (runtime) | `app/(tabs)/rendimiento/page.tsx`: reads `allowance`, calls `approve` only if `allowance < assets` (exact amount, never max), then `deposit(assets, address)`; withdraw partial via `previewWithdraw(assets)` → `redeem(shares, address, address)`; withdraw "todo" uses live `shares` balance behind a destructive confirm `Dialog` with the exact UI-SPEC copy. Position: `use-vault-position.ts` computes `valueInArgt` via `convertToAssets(balanceOf(user))` |
| 4 | User bridgea ARGt entre Base, Arbitrum y Polygon (approve + bridge con fee) y ve el estado y el balance de destino actualizado | ✓ VERIFIED (code) / ? PENDING (runtime) | `lib/hooks/use-bridge.ts`: `bridge()` calls `quoteFee` → `switchChainAsync` (if needed) → ERC-20 `approve(adapter, amount)` → `send(sendParam, fee, address)` with `value: fee.nativeFee` → `startPolling` against destination balance (10s interval, 5min timeout). ABI restricted to `quoteSend`/`send`/`token`/`approvalRequired` — no functions invented beyond the empirically verified LayerZero V2 OFT set (13/13 selector match + 4 state-read matches documented in `lib/config/bridge-adapter-abi.ts` and 01-04-SUMMARY.md) |
| 5 | (bonus, no bloqueante) User ve su balance de BOLt y puede transferirlo, si las addresses llegan a tiempo | ✗ NOT MET (explicitly non-blocking) | `lib/config/tokens.ts` has a `// BOLt: agregar entry aquí cuando lleguen las addresses por Discord` comment placeholder; no entry added. BOLt addresses never arrived via Discord during this phase. Per CONTEXT.md D-10 and explicit team-lead instruction, this criterion does not block phase closure |

**Score:** 4/4 blocking truths verified at code level; runtime E2E pending on the Privy checkpoint (expected and explicitly acknowledged in all four SUMMARYs). 1 bonus criterion (BOLt) correctly not met and explicitly non-blocking.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `lib/config/tokens.ts` | Token/vault/bridge registry, addresses byte-identical to SPEC.md §2 | ✓ VERIFIED | ARGt: arbitrum `0x59863989d080B22476DB95656d0C3CC18be92214`, base `0xf016413834e6d1a14f3d628b11d6ef725a6bdbdd`, polygon `0x50464be58912745447e24eb3bbdedcee10d3e056` — exact match vs. SPEC.md §2. Vault `0x9Dd3F844747AB78d616BF76DB92756E17A064aDD` — exact match. Bridge adapters (arbitrum/base/polygon) — exact match vs. SPEC.md §2 |
| `lib/wagmi-config.ts` | `createConfig` from `@privy-io/wagmi`, not `wagmi` | ✓ VERIFIED | `import { createConfig } from "@privy-io/wagmi"` confirmed; chains arbitrum/base/polygon with per-chain `http(RPC_URLS[chain])` transports |
| `app/providers.tsx` | Provider order `PrivyProvider > QueryClientProvider > WagmiProvider`, imports from `@privy-io/wagmi` | ✓ VERIFIED | `import { WagmiProvider } from "@privy-io/wagmi"` (not from `wagmi`); JSX nesting is exactly `PrivyProvider > QueryClientProvider > WagmiProvider`; placeholder-detection guard renders a "Configurar Privy App ID" screen instead of crashing when `NEXT_PUBLIC_PRIVY_APP_ID` is empty or equals `REPLACE_ME_PRIVY_APP_ID` |
| `app/(tabs)/enviar/page.tsx` | Transfer flow: switchChain before writeContract | ✓ VERIFIED | Confirmed switchChain call precedes the `transfer` write in source order (see truth #2) |
| `app/(tabs)/rendimiento/page.tsx` | Vault flow: approve→deposit exact amount, redeem paths | ✓ VERIFIED | Confirmed (see truth #3); approve amount is always exact `assets`, never `type(uint256).max`, matching plan's stated threat mitigation |
| `lib/hooks/use-bridge.ts` + `lib/config/bridge-adapter-abi.ts` | Bridge flow: approve→quoteSend→send with value=nativeFee, no invented ABI functions | ✓ VERIFIED | Confirmed (see truth #4); ABI limited to the 4 empirically verified functions |
| `app/(tabs)/layout.tsx` | Tab shell, 44px touch targets | ✓ VERIFIED | `min-h-11 min-w-11` (44px) on each tab link, `aria-label` in Spanish per tab |
| `app/(tabs)/home/page.tsx` | Display typography + tabular-nums on total balance | ✓ VERIFIED | `text-[32px] font-semibold leading-tight tracking-tight text-zinc-900 tabular-nums` on the total balance figure |
| `components/ui/sonner.tsx` + `app/layout.tsx` | Toast feedback wired at root | ✓ VERIFIED | `<Toaster />` mounted in `app/layout.tsx` (confirmed via grep) — the "Known Gap" flagged in 01-03-SUMMARY (Toaster not mounted) was resolved by a later commit from a concurrent executor (documented as deviation #3 in 01-04-SUMMARY); current code state has it correctly wired, superseding both summaries' stale claims |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `app/(tabs)/enviar/page.tsx` | ARGt `transfer` | `writeContractAsync` after conditional `switchChainAsync` | ✓ WIRED | Order confirmed correct in source |
| `app/(tabs)/rendimiento/page.tsx` | Vault `deposit`/`redeem` | `writeContractAsync` + `waitForTransactionReceipt` sequencing | ✓ WIRED | approve→deposit and previewWithdraw→redeem sequences confirmed |
| `lib/hooks/use-bridge.ts` | Bridge adapter `send` | `writeContractAsync` with `value: fee.nativeFee` after `approve` | ✓ WIRED | Fee always read on-chain via `quoteSend` before use, never hardcoded (matches plan pattern T-04-01) |
| `components/vault-card.tsx` | Home/Rendimiento | rendered by `rendimiento/page.tsx`; not imported on Home (per SPEC — vault card belongs to Rendimiento tab, Home only shows total+breakdown) | ✓ WIRED | Consistent with SPEC.md §4 screen split |
| `app/providers.tsx` | `lib/wagmi-config.ts` | `WagmiProvider config={wagmiConfig}` | ✓ WIRED | Confirmed |

### Anti-Patterns Found

None blocking. Two `ponytail:`-tagged deliberate simplifications, both explicitly documented with an upgrade path:
- `app/providers.tsx`: placeholder-detection guard (intentional, not a stub — prevents build crash, matches Task 3 checkpoint design)
- `lib/config/bridge-adapter-abi.ts`: ABI reconstructed by on-chain verification instead of the real Notion file (intentional, evidence-documented, upgrade path stated: swap file if the real ABI differs)

No `TODO`/`FIXME`/placeholder JSX text found in the four screens reviewed. No stub `return null`/empty-object patterns found in the reviewed hooks.

### Requirements Coverage

| Requirement | Source Plan | Status | Evidence |
|---|---|---|---|
| AUTH-01 | 01-01 | ✓ SATISFIED (code) / pending runtime | Login flow implemented, blocked on Privy dashboard app id |
| AUTH-02 | 01-01 | ✓ SATISFIED (code) / pending runtime | Address display + logout confirmation implemented |
| M1-01 | 01-02 | ✓ SATISFIED (code) / pending runtime | Multicall balances per chain + total |
| M1-02 | 01-02 | ✓ SATISFIED (code) / pending runtime | Transfer with automatic switchChain |
| M1-03 | 01-02 | ✗ NOT SATISFIED, explicitly non-blocking | BOLt addresses never arrived |
| M2-01 | 01-03 | ✓ SATISFIED (code) / pending runtime | Approve + deposit |
| M2-02 | 01-03 | ✓ SATISFIED (code) / pending runtime | convertToAssets position + redeem (partial/full) |
| M3-01 | 01-04 | ✓ SATISFIED (code) / pending runtime | Approve + quoteSend + send |
| M3-02 | 01-04 | ✓ SATISFIED (code) / pending runtime | Status pill + destination balance polling |

No orphaned requirements — all 9 requirements declared for Phase 1 in REQUIREMENTS.md are claimed by one of the four plans.

### Human Verification Required

See YAML frontmatter `human_verification` — all 4 items trace back to the same root blocker (no real Privy App ID configured yet, `NEXT_PUBLIC_PRIVY_APP_ID` still `REPLACE_ME_PRIVY_APP_ID`) plus the bridge ABI provenance checkpoint and the non-blocking BOLt bonus. This is expected: all four plan SUMMARYs explicitly flag runtime E2E as pending, consistent with the phase's "Task 3 checkpoint" design (code complete, human setup pending).

### Gaps Summary

No code-level gaps. All 4 blocking success criteria (login, balances/transfer, vault, bridge) are implemented correctly and match SPEC.md §2/§3/§4 byte-for-byte on addresses and provider wiring, and `npm run build` passes clean. The phase cannot be marked `passed` because real end-to-end runtime verification (real Privy login, real on-chain transactions) has not happened — this is an operational checkpoint outside the executors' control, not an implementation defect. The bridge ABI is a well-evidenced reconstruction (13/13 selector match, 4 consistent state reads) but is explicitly flagged by 01-04-SUMMARY as CHECKPOINT_PENDING until compared against the real Notion file. The BOLt bonus (M1-03) is honestly not met, correctly classified as non-blocking per CONTEXT.md D-10.

---

_Verified: 2026-08-20_
_Verifier: Claude (gsd-verifier)_
