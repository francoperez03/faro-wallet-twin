# packages/pmm

Contratos del cambio ARGt ↔ MEXt de Faro en Arbitrum.

- `FaroPMM`: market maker proactivo (port de DODO v2 PMMPricing/DODOMath, Apache-2.0) para base = MEXt, quote = USDT0. Precio anclado al oráculo Pyth USD/MXN (pull: el update viaja en la misma tx), desviado según el inventario respecto de su objetivo (`k`). Fee sobre el output, queda en el pool.
- `FaroRouter`: ARGt → USDT0 (Curve twocrypto de Twin) → MEXt (PMM) y vuelta, en una sola transacción. Nunca retiene fondos.

```bash
cp .env.example .env            # ARBITRUM_RPC_URL, OPS_PRIVATE_KEY (owner/inventario), ARBISCAN_API_KEY
forge test --no-match-contract Fork
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc forge test --match-contract Fork -vv
forge script script/Deploy.s.sol --rpc-url arbitrum --broadcast        # SEED_MEXT opcional (wei)
PMM=0x… ROUTER=0x… forge script script/Status.s.sol --rpc-url arbitrum
```

Operación (owner): `deposit(base, quoteRaw, reset)`, `withdraw(...)`, `resetTargets()`, `setParams(k, feeBps, maxAge, maxConfBps)`, `pause()`. Rebalanceo manual: retirar USDT0 acumulado, conseguir MEXt, depositar con `reset = true`.

Deploy actual: `deployments/arbitrum.json`.
