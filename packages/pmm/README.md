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

Parámetros actuales: `k = 0,05`, fee 0,4 %, oráculo con edad máxima 60 s y confianza ≤ 0,5 %, tope de US$ 2.500 por operación (`maxTradeQuote`).

Inventario objetivo recomendado: US$ 5k a 10k en MEXt (85k a 170k MEXt). Con `k = 0,05` y US$ 10k, una operación de US$ 500 paga ~0,3 % de desvío y una de US$ 1.000 ~0,5 %. Seed desde la wallet ops:

```bash
cast send $MEXT "approve(address,uint256)" $PMM <wei> --private-key $OPS_PRIVATE_KEY --rpc-url arbitrum
cast send $PMM "deposit(uint256,uint256,bool)" <wei> 0 true --private-key $OPS_PRIVATE_KEY --rpc-url arbitrum
```

Operación (owner): `deposit(base, quoteRaw, reset)`, `withdraw(...)`, `resetTargets()`, `setParams(k, feeBps, maxAge, maxConfBps, maxTradeQuote)`, `pause()`. Rebalanceo manual: retirar USDT0 acumulado, conseguir MEXt, depositar con `reset = true`.

Deploy actual: `deployments/arbitrum.json`.

## Auditoría (agentes Pashov, 7 lentes) y arreglos aplicados

Sin caminos de robo de fondos. Se corrigió todo lo señalado:

1. Reembolso de ETH incondicional al final del swap (antes, con `pythUpdate` vacío el ETH quedaba en el contrato).
2. `PMMMath`: idiomas de detección de overflow pre‑0.8 reemplazados por `Math.mulDiv` (la rama de degradación era código muerto).
3. `setParams` acota `maxAge ≤ 10 min` y `0 < maxConfBps ≤ 500`, así el owner no puede desarmar el oráculo.
4. Tope por operación simétrico: en `sellQuote` también se acota el valor en dólares del MEXt que sale.
5. Inventario acreditado por delta real de `balanceOf` (tolera tokens con fee o rebasing).
6. Pistas: las vistas `quote*` aplican los mismos guards que la ejecución; `deposit`/`withdraw` sin reset revierten si desincronizan los objetivos (`TargetsOutOfSync`); CEI (estado antes de transferir, reembolso al final); `FaroRouter.sweepEth` para ETH enviado por error.
