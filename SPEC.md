# Twin your Neobank · Spec

Hackathon de Twin en la LATAM Digital Assets Conference. 24 h, equipos de 1 o 2. Entrega: URL de la wallet hosteada + nombre + mail + X. Cierre: jueves 20 de agosto, 18 h. Soporte en Discord. Fuente: https://twinfinance.notion.site/twin-your-neobank

## 1. Qué piden

Una wallet de punta a punta (conexión, balance, transferencias) integrando las stablecoins de Twin. Evaluación por milestones:

| # | Milestone | Qué hay que mostrar |
|---|-----------|---------------------|
| 1 | Balance y transfers de ARGt | Conectar, ver balance, enviar ARGt |
| 2 | Vault ARGt Prime (Morpho, ERC-4626, Arbitrum) | Depositar, ver posición, retirar |
| 3 | Bridge de ARGt entre Base / Arbitrum / Polygon | Approve al adapter + bridge(chainDestino, receiver) pagando fee de mensajería |
| 🎁 | Bonus | Sumar otra stablecoin de Twin (BOLt, BRAt, CHLt, COLt, MEXt, PERt) |

Premios: kit merch + 100k ARGt (1°), kit + 50k ARGt (2°), kit (3°).

## 2. Datos on-chain

Las tablas de addresses del Notion están vacías en la versión pública (bases de datos no compartidas). Lo que sigue lo saqué de la página y lo verifiqué por RPC.

**ARGt** (18 decimals, name "Argentine Peso token")

| Chain | Chain ID | Address | Fuente |
|-------|----------|---------|--------|
| Arbitrum | 42161 | `0x59863989d080B22476DB95656d0C3CC18be92214` | Notion + `adapter.token()` |
| Base | 8453 | `0xf016413834e6d1a14f3d628b11d6ef725a6bdbdd` | `adapter.token()` |
| Polygon | 137 | `0x50464be58912745447e24eb3bbdedcee10d3e056` | `adapter.token()` |

Ojo: las addresses cambian por chain. En Base, `0x5986...2214` es MEXt, no ARGt.

**Vault ARGt Prime** (Arbitrum, ERC-4626, operado por DAMM Capital): `0x9Dd3F844747AB78d616BF76DB92756E17A064aDD`. Asset: ARGt Arbitrum.

**Bridge adapters** (ruta soportada: Base ↔ Arbitrum ↔ Polygon; Ethereum no):

| Chain | Adapter |
|-------|---------|
| Arbitrum | `0x4821FBf47B261F0D52Ba0F941CF67b8648f82691` |
| Base | `0xe80Af1d12426dB4394b147e04f179a38e7C5Dfe7` |
| Polygon | `0xD70ad085684b2A9f4B5d54D7BDB2ecA37a273216` |

ABI: `bridge-adapter-abi.ts` adjunto en el Notion (2.5 KiB, hay que bajarlo a mano).

Pendiente pedir en Discord: addresses de las otras 6 stablecoins y en qué chains están (para el bonus).

## 3. Stack propuesto

- Next.js (App Router) + TypeScript, deploy en Vercel.
- **Privy** para auth y wallet: login con email / Google / passkey, embedded wallet sin extensión. Esto es lo que hace que se sienta "neobanco" y no "dapp". También acepta wallets externas.
- **wagmi + viem** para todo lo on-chain. Privy se integra con wagmi vía `@privy-io/wagmi` (hay que importar `WagmiProvider` y `createConfig` desde ahí, no desde `wagmi`).
- Chains: Arbitrum, Base, Polygon. Transports `http()` con RPC públicos o Alchemy.
- Sin backend. Todo lectura/escritura desde el cliente.

Versiones al 19/08/2026: `@privy-io/react-auth` 3.37, `@privy-io/wagmi` 4.0, `wagmi` 3.7, `viem` 2.55, `next` 16.3.

Setup de Privy: crear app en dashboard.privy.io, habilitar login methods (email, google, passkey) y "create embedded wallet on login", setear `NEXT_PUBLIC_PRIVY_APP_ID`. Orden de providers: `PrivyProvider` > `QueryClientProvider` > `WagmiProvider`.

## 4. Pantallas y flujos

**Home / Balance.** Saldo total de ARGt sumando las 3 chains (multicall `balanceOf` por chain), desglose por chain, saldo en el vault (`convertToAssets(balanceOf(user))`). Si hay otras stablecoins, una fila por moneda.

**Enviar.** Destinatario (address o ENS), monto, chain. `transfer(to, amount)` con `useWriteContract`. Si el usuario está en otra chain, `switchChain` primero. Privy embedded wallet firma sin popup de extensión.

**Rendimiento (vault).** Pestaña con: APY (se puede estimar con `convertToAssets` en dos bloques, o mostrar "ver en Morpho"), posición actual, input depositar (`approve` + `deposit(assets, receiver)`), input retirar (`redeem(shares, receiver, owner)` o `withdraw`). Solo en Arbitrum; si el usuario tiene ARGt en otra chain, sugerir bridge.

**Mover entre redes (bridge).** Chain origen, chain destino, monto. `approve(adapter, amount)` + `bridge(...)` con `value` = fee cotizado (el ABI debería exponer un `quote`/`estimateFee`; verificar al bajar el ABI). Mostrar estado "en tránsito" y refrescar balance de destino.

**Actividad.** Lista de transfers recientes (logs `Transfer` filtrados por el usuario, últimos N bloques). Suficiente para demo.

## 5. Ideas ZK para la billetera

Ordenadas por relación esfuerzo / impacto en un hackathon de 24 h. Las dos primeras son las que recomiendo; el resto son opciones si sobra tiempo o para el pitch.

### 5.1 Direcciones stealth para cobros privados (ERC-5564 / ERC-6538)

Cada usuario publica una "meta-address" stealth. Quien le paga deriva una address nueva de un solo uso y publica un anuncio en el registry; el receptor escanea los anuncios con su viewing key y encuentra sus fondos. Resultado: dos pagos al mismo usuario no son vinculables on-chain.

- Por qué: privacidad real sin circuitos. Es criptografía de curva elíptica (secp256k1, ECDH + hash), todo en cliente con viem/noble.
- Esfuerzo: bajo. Un día de trabajo holgado incluyendo UI.
- Dónde pega: en "Enviar" (toggle "pago privado") y en un "link de cobro" que la wallet genera.
- Limitación: cada stealth address necesita gas para mover fondos; con Privy se puede usar paymaster o un relayer simple.

### 5.2 Prueba de solvencia sin revelar saldo (Noir en el browser)

El usuario demuestra "tengo más de X ARGt" o "tengo más de X en el vault" sin mostrar el monto exacto. Circuito en Noir que toma balance (privado) y umbral (público), más una firma del usuario sobre un snapshot, y produce una prueba verificable en el navegador o en un contrato verifier en Arbitrum.

- Casos de uso: alquiler (demostrar ingresos/ahorro al propietario), acceso a crédito, onboarding a un vault con mínimo, "garantía" para un comercio.
- Esfuerzo: medio. Noir + bb.js corren en browser; la parte difícil es anclar el balance a la chain (opción rápida: el circuito verifica una firma EIP-712 del snapshot hecha por la propia wallet, y el verificador confía en el bloque; opción fuerte: storage proof del `balanceOf`, más laburo).
- Dónde pega: botón "Generar comprobante de solvencia" que devuelve un link o QR con la prueba.

### 5.3 Gating de compliance con zk-identidad (zkKYC)

Para transfers arriba de un umbral, exigir una prueba de "mayor de 18 y residente en país X" sin revelar documento ni nombre. Se integra con Self (pasaporte NFC, soporta e-passports ICAO, incluye Argentina) o zkPassport. La wallet guarda solo el nullifier.

- Por qué pega con Twin: las stablecoins LATAM viven bajo regulación (Twin es SAS uruguaya con licencia BMA). "Cumplimiento sin exponer datos" es un pitch fuerte para un neobanco.
- Esfuerzo: medio. El SDK hace el trabajo pesado; el riesgo es el onboarding del usuario en la demo (necesita pasaporte con chip).
- Alternativa más demo-friendly: zkEmail / zk-JWT para probar "tengo un mail @empresa.com" y habilitar una cuenta corporativa.

### 5.4 Pool shielded de ARGt (transfers privados completos)

Wrapper de ARGt con commitments y nullifiers (estilo Tornado/Privacy Pools/Railgun). Depositás ARGt, recibís una nota, transferís notas off-chain, retirás a cualquier address.

- Impacto: máximo en privacidad. Es "el" feature zk de una wallet de stablecoins.
- Esfuerzo: alto. Circuitos, árbol de Merkle, relayer. No entra en 24 h desde cero; entra si se reutiliza un repo existente (Privacy Pools, circuitos de Tornado en circom) y se lo apunta a ARGt.
- Sugerencia: dejarlo como roadmap en el pitch y mostrar 5.1 como el primer paso concreto.

### 5.5 Pagos grupales anónimos con Semaphore

Un grupo (empleados de una empresa, miembros de una comunidad) se registra en un grupo Semaphore. Cualquier miembro reclama su parte de un pool de ARGt demostrando membresía sin decir quién es (nullifier evita doble cobro).

- Casos: nómina privada, "sobres" de remesas, subsidios.
- Esfuerzo: medio-bajo. Semaphore tiene SDK y contratos desplegados en Base/Arbitrum.

### 5.6 Recuperación de cuenta con zkEmail

Si la wallet fuera una smart account (ERC-4337 con Privy como signer), agregar un módulo de recovery donde el usuario demuestra con una prueba zk que recibió un mail de recovery en su dirección, sin revelar el mail ni exponer el contenido. Apunta al punto débil de los neobancos on-chain: perder la llave.

- Esfuerzo: medio-alto. Útil para el pitch, poco realista para el demo en 24 h salvo usando el módulo ya publicado de zkEmail.

### 5.7 Yield privado sobre el vault

Combinar 5.1 con el vault: depositar al vault desde una stealth address para que el rendimiento no quede vinculado a la identidad pública del usuario. Cuesta casi nada extra una vez que 5.1 existe.

### Recomendación

Para ganar con los milestones y tener un diferencial: M1 + M2 + M3 con Privy, y sumar **5.1 (stealth) + 5.2 (prueba de solvencia, construida sobre el stack de Sobrecito, ver sección 6)**. Ambos se explican en un minuto, se demuestran en vivo y conectan con el caso de uso de un neobanco en LATAM (cobrar sin exponer historial, demostrar solvencia sin exponer saldo). 5.3 y 5.4 como roadmap en la presentación.

## 6. Integrar Sobrecito

Repo: `/Users/francoperez/repos/job/Sobre/sobrecito`. Qué es: prueba de solvencia ZK para custodios (PSAVs). El custodio prueba cada día que sus activos cubren los saldos de sus clientes sin revelar direcciones, montos ni totales. Lo que ya existe y funciona:

- `circuits/`: Noir (`nargo 1.0.0-beta.22` + `bb 5.0.0-nightly.20260522`). `commitment_lib` (Poseidon2 con domain separation, commit por usuario con salt HKDF), `liabilities_batch` (range proofs + suma por token), agregación recursiva hasta una prueba raíz con un único output público `C_L`. Fixture commiteada (`fixtures/manifest.json`, 256 usuarios × 4 tokens).
- `contracts/`: Foundry. `HonkVerifier.sol` generado por bb (~1,55M gas por verify), `SobrecitoRegistry.sol` (publish gateado por verify, corte inmutable, key_hash immutable), `Deploy.s.sol` reproducible, 22 tests verdes.
- `apps/web/`: Next 16. Rutas `/status/[psav]` (semáforo público), `/demo-cliente` (el cliente verifica su inclusión y ve qué pasa si lo omiten), dashboards de operador y auditor.

Tensión de base: Sobrecito prueba la solvencia de quien custodia. En la wallet del hackathon el usuario custodia sus propias llaves (Privy embedded), así que no hay pasivos que probar. Hay tres formas de cruzarlo:

### 6.A "Modo cuenta" custodial + solvencia probada on-chain

El neobanco ofrece dos modos: **Wallet** (self-custody, los 3 milestones tal cual) y **Cuenta** (el neobanco custodia ARGt en una bóveda omnibus y el usuario ve un saldo interno, como un banco). Para el modo Cuenta, Sobrecito corre el corte diario y publica en un `SobrecitoRegistry` desplegado en Arbitrum. La app muestra "Solvencia verificada on-chain · último corte hace N h" y un botón "Verificá que tu saldo está incluido" (la pantalla de `/demo-cliente` adaptada). El `user_id` del corte es el DID de Privy, lo que ata identidad de login y commitment sin exponer nada.

- Reuso: total. Registry + verifier + fixture se despliegan hoy con `Deploy.s.sol`; la UI de cliente y el semáforo existen.
- Costo: deploy en Arbitrum (gas del verify) y un ledger interno mínimo para el modo Cuenta (puede ser mock con datos sintéticos; el corte que se publica es la fixture).
- Riesgo: duplica el scope y se aleja del brief ("armá tu wallet"). Un jurado puede leer la custodia como retroceso. A favor: el pitch es muy claro, "un neobanco que prueba cada día que tiene los ARGt de sus clientes" es la misma promesa de "respaldado por reservas" de Twin, un nivel más arriba.

### 6.B Reusar el stack de Sobrecito para el comprobante de solvencia personal (idea 5.2)

El usuario prueba "tengo ≥ X ARGt" sin revelar el saldo. El circuito es `liabilities_batch` reducido a 1 usuario × 1 token con el umbral como input público y el commitment de `commitment_lib` como ancla. Se prueba en el browser con bb.js; el verifier Solidity sale de `contracts/script/gen-verifier.sh` y se despliega en Arbitrum junto a un contrato mínimo que registra "address A probó ≥ X en el bloque B".

- Reuso: parcial pero real. La lib de commitments, el toolchain pineado, el pipeline VK → verifier Solidity → Foundry test, y el patrón de disclosure. El circuito nuevo es chico (una hora).
- Costo: bajo. Encaja con el brief sin cambiar la naturaleza de la wallet.
- Riesgo: anclar el saldo al estado de la chain. Para la demo alcanza con que la wallet firme un snapshot EIP-712 del balance y el circuito verifique la firma; el storage proof queda como roadmap.

### 6.C Sobrecito como prueba de reservas para Twin o para el vault

Las reservas de Twin son off-chain (efectivo, soberanos): ahí solo cabe attestation, y ese es justamente el bucket "atestado" del modelo de Sobrecito. El vault de Morpho es transparente on-chain y no necesita prueba. Sirve para el pitch ("Sobrecito puede atestar la cadena completa: emisor, vault, neobanco") pero no suma demo en 24 h.

### Decisión

Se elige **6.A, modo Cuenta custodial con solvencia probada**. El diseño completo está en la sección 7. 6.B queda como opción secundaria si sobra tiempo.

## 7. Modo Cuenta: diseño

### 7.1 Concepto

El neobanco tiene dos modos, visibles como un toggle arriba de la app:

- **Wallet**: self-custody con Privy embedded wallet. Los 3 milestones tal cual (balance, transfers, vault, bridge).
- **Cuenta**: el neobanco custodia ARGt en una bóveda omnibus y el usuario ve un saldo interno, con interés diario. Como un banco, pero cada día publica on-chain una prueba ZK de que tiene los ARGt de todos sus clientes, sin revelar quién tiene cuánto ni cuánto hay en total. Cada cliente verifica con un tap que su saldo está incluido.

El pitch en una frase: *Twin respalda ARGt con reservas; nosotros respaldamos tu cuenta con una prueba criptográfica diaria que cualquiera puede verificar.*

Los 3 milestones también viven dentro del modo Cuenta: la bóveda pone una parte en el vault de Morpho (de ahí sale el interés), y rebalancea ARGt entre chains con el bridge para pagar retiros donde el usuario quiera. Así la misma infra cumple el brief dos veces.

### 7.2 Actores

| Actor | Quién es en la demo | Qué hace |
|---|---|---|
| Usuario | Cualquiera que entra con email/Google por Privy | Deposita, retira, cobra interés, verifica su inclusión |
| Neobanco (pipeline + operador) | Nosotros, un backend en el mismo Next | Lleva el ledger, custodia la bóveda, corre el corte diario, publica al Registry |
| Auditor | Rol simulado (view-key) | Abre el detalle del corte y chequea binding contra el Registry |
| Público | Cualquiera sin login | Ve el semáforo `/status/twin-neobank` |
| Twin | Emisor de ARGt | Nada que hacer; el pitch lo nombra como la capa de abajo |

### 7.3 Arquitectura

```
Browser (Next + Privy)
 ├─ modo Wallet ── wagmi/viem ──► ARGt / Vault / Bridge (Arbitrum, Base, Polygon)
 └─ modo Cuenta ── API routes ──► Ledger interno (SQLite/Postgres)
                                   │
                          Bóveda omnibus (EOA, clave en server)
                                   ├─ ARGt en Arbitrum (+ Base para retiros)
                                   ├─ shares del Vault ARGt Prime (Morpho)
                                   └─ bridge adapters para rebalancear
                                   │
                          Pipeline Sobrecito (cron o botón "correr corte")
                                   ├─ export CSV ledger ─► orchestrate_tree.py ─► prueba raíz (C_L)
                                   ├─ publish(cut, proof) ─► SobrecitoRegistry (Arbitrum)
                                   └─ openings por usuario (balances + salt), servidos on-demand
```

**Identidad.** `user_id` del ledger = DID de Privy (`did:privy:...`). El mismo login que abre la wallet abre la cuenta, y el salt del commitment se deriva de ese id (`HKDF(master, user_id)`). No hay claves por cliente: el usuario verifica sin firmar nada.

**Ledger.** Dos tablas: `accounts(user_id, argt_balance, updated_at)` y `movements(id, user_id, type, amount, tx_hash, created_at)`. Tipos: deposit, withdraw, interest. Para la demo: SQLite con Prisma o Drizzle, o Postgres de Vercel Marketplace si se hostea ahí. Seed con N usuarios sintéticos (p. ej. 60) para que el corte tenga volumen y el semáforo no muestre "2 usuarios".

**Depósitos.** El usuario, desde modo Wallet, transfiere ARGt a la address de la bóveda (botón "Pasar a Cuenta", que ya es un transfer de M1). El backend escucha `Transfer(from, to=bóveda)` en Arbitrum y acredita al `user_id` cuya embedded wallet es `from` (Privy expone la relación DID ↔ address). Sin memos ni direcciones derivadas.

**Retiros.** El usuario elige monto y chain; el backend descuenta del ledger y firma un `transfer` desde la bóveda de esa chain a la embedded wallet. Si la bóveda de destino no tiene saldo, el operador rebalancea con el bridge (M3). Límite por usuario y por día para la demo.

**Interés.** La bóveda deposita un porcentaje (p. ej. 70 %) en el vault de Morpho (M2). Un cron diario lee `convertToAssets` antes y después, y reparte el rendimiento pro rata al ledger como movimientos `interest`. La tasa mostrada es la real del vault menos un spread.

**Reservas.** Al bloque B: `balanceOf(bóveda)` en cada chain + `convertToAssets(balanceOf(bóveda) en el vault)`. En 24 h esto entra al Registry como `cR` **declarado** (es exactamente el estado actual de Sobrecito: `declaredMask` marca cR, verdicts y coverage como no probados). Lo que sí está **probado** es `cL`: el commitment de los pasivos totales, verificado on-chain por el HonkVerifier antes de aceptar el publish.

**Registry.** `SobrecitoRegistry` + `HonkVerifier` desplegados en Arbitrum con `Deploy.s.sol` (key_hash anclado al manifest). Un publisher single-sig (la clave del pipeline). Publicación una vez por corte.

**Corte diario (pasos, adaptados del protocolo de Sobrecito).**

1. Fijar bloque B en Arbitrum.
2. Exportar ledger a CSV `id, balance_ARGt` (T=1, o T=2 si se suma otra stablecoin del bonus).
3. `orchestrate_tree.py --csv ... --k 64 --t 1` con `SOBRECITO_MASTER_HEX` en env. Para 60 usuarios es un árbol de un lote: minutos en una M4 (la corrida de referencia de 100k×16 tardó 15,4 min; la fixture de 256×4 es del orden de minutos).
4. Leer reservas al bloque B, armar `CutInput` (cL probado, cR/verdicts/coverage declarados, attestationHash = hash del JSON de reservas).
5. `publish` al Registry con la prueba raíz.
6. Guardar openings (balance + salt + corte_id + commitment) por usuario para servir on-demand.

Si el proving no corre en tiempo en la máquina de la demo, fallback: publicar la fixture `full_cut/root` (ya verificada on-chain en tests) y marcar el corte como "datos sintéticos" en el semáforo. El flujo de la app es idéntico.

### 7.4 Pantallas nuevas

| Ruta / vista | Qué muestra |
|---|---|
| Toggle Wallet / Cuenta | Arriba, persistente |
| Cuenta · Home | Saldo en ARGt, interés acumulado hoy y total, tasa actual, badge **"Solvencia probada on-chain · último corte hace N h"** (verde si < 26 h, ámbar si vencido), botón "Verificá tu inclusión" |
| Cuenta · Pasar a Cuenta | Monto; es un transfer ARGt desde la embedded wallet a la bóveda; muestra "acreditado" cuando el backend ve el evento |
| Cuenta · Retirar | Monto + chain destino; estado pendiente/enviado con tx hash |
| Cuenta · Verificación | Pide el opening al backend, recomputa `Poseidon2(balance, salt)` en el browser y compara con el commitment del corte. Estados: verde (incluido), rojo (discrepancia, botón "reportar"), gris (corte en curso). Adaptación directa de `client-demo.tsx` de Sobrecito, cambiando la verificación mock (SHA-256 sobre fixtures) por Poseidon2 real vía `@noir-lang`/bb.js o `poseidon2` en JS |
| `/status/twin-neobank` (público) | Semáforo: veredicto ARGt, % cobertura por bucket (Arbitrum probado vs declarado), frescura, historial de cortes, link a la tx del Registry. Lee `CutPublished` con viem. Muestra el `declaredMask` en claro ("qué está probado y qué declarado") |
| Operador (opcional) | Botón "Correr corte ahora" + log del pipeline. Útil para la demo en vivo |

### 7.5 Qué es real y qué es mock en 24 h

| Pieza | Estado | Nota |
|---|---|---|
| Login Privy + embedded wallet | Real | |
| Milestones 1-3 en modo Wallet | Real | |
| Bóveda omnibus con ARGt real | Real | Fondeada con los ARGt de premio/testing |
| Depósitos y retiros on-chain | Real | Escucha de eventos + firma desde server |
| Interés desde el vault Morpho | Real (lectura) | El reparto pro rata puede correr a mano en la demo |
| Prueba ZK de pasivos (cL) | Real | Sobre el ledger de la demo, o fixture como fallback |
| Verificación on-chain del publish | Real | HonkVerifier en Arbitrum, ~1,55M gas |
| Reservas (cR), veredictos, cobertura | Declarado | Igual que el estado actual de Sobrecito; declaredMask lo dice |
| Inclusión del cliente | Parcial | El usuario verifica que su opening abre contra **su** commitment servido por el backend. Los commitments individuales no son públicos on-chain (solo C_L), así que la garantía contra omisión viene del binding que hace el auditor con view-key, no de la chain sola. Decirlo en el pitch |
| Auditor con view-key | Mock / pantalla | Reusar la UI de `/auditor` si sobra tiempo |
| Multisig 2-de-2 publisher | No | Single-sig, igual que Sobrecito hoy |

### 7.6 Plan de 24 h

| Hora | Bloque |
|---|---|
| 0-3 | Next + Privy + wagmi. M1 (balances multichain, transfer) |
| 3-5 | M2 vault (deposit/redeem) y M3 bridge (approve + bridge con fee) |
| 5-8 | Ledger + bóveda: depósitos por evento, retiros firmados, seed de usuarios |
| 8-10 | Deploy Registry + verifier en Arbitrum (`Deploy.s.sol`), primer publish con la fixture |
| 10-14 | Pipeline: CSV del ledger → `orchestrate_tree.py` → publish real. Openings |
| 14-17 | Pantallas Cuenta: home con badge, pasar a cuenta, retirar, verificación con Poseidon2 |
| 17-19 | `/status/twin-neobank` leyendo el Registry |
| 19-21 | Interés desde el vault, pulido, deploy en Vercel |
| 21-24 | Video/pitch, buffer |

En equipo de 2: uno en wallet + milestones (horas 0-5 y 14-19), otro en ledger + Sobrecito (5-14).

### 7.7 Riesgos específicos

- **Clave de la bóveda en el server**: aceptable para demo; decirlo. En producto sería Fireblocks/HSM (está en el protocolo de Sobrecito).
- **Proving en la máquina de la demo**: toolchain pineado (`nargo 1.0.0-beta.22`, `bb 5.0.0-nightly.20260522`), correrlo antes. Fallback con fixture.
- **Gas del publish en Arbitrum**: ~1,55M por verify, barato en Arbitrum. Tener ETH en la clave del publisher.
- **Jurado leyendo "custodial" como retroceso**: responder con el toggle. El usuario elige; y la cuenta custodial es la única que paga interés sin que el usuario gestione DeFi, que es lo que un neobanco vende.
- **Disclosure**: PoC no auditado, cR declarado, inclusión con binding vía auditor. Va en la app y en el pitch.

### 7.8 Alcance de monedas

Dos stablecoins: **ARGt** completa y **BOLt** como bonus.

| | ARGt | BOLt |
|---|---|---|
| Balance + transfer (M1) | Sí, en Arbitrum, Base y Polygon | Sí, en las chains donde esté desplegada |
| Vault Morpho (M2) | Sí, ARGt Prime en Arbitrum. Único lugar donde se genera rendimiento | No hay vault. Saldo sin interés |
| Bridge (M3) | Sí, Base ↔ Arbitrum ↔ Polygon | No (el bridge es solo de ARGt) |
| Modo Cuenta | Sí, con interés desde el vault | Sí, como segunda columna del ledger, sin interés |
| Prueba de pasivos | Token 0 del vector | Token 1 del vector (T=2 en `params.nr`) |

Razón: el rendimiento en pesos argentinos es la historia del neobanco ("tu sueldo en pesos rinde solo"), y BOLt suma el bonus con costo marginal (una columna más en balances, ledger y corte). Pendiente: addresses de BOLt por chain (pedir en Discord; no están públicas).

### 7.9 Reservas con Morpho adentro

La posición en el vault cuenta como reserva y es verificable on-chain (ERC-4626):

```
R al bloque B = balanceOf(bóveda) en Arbitrum + Base + Polygon   (ARGt líquido)
              + convertToAssets(vault.balanceOf(bóveda))          (ARGt en Morpho)
```

En las 24 h, `cR` va declarado (dos lecturas RPC públicas al bloque B, cualquiera las re-chequea). Roadmap F2: storage proofs de ambas lecturas dentro del circuito, reservas probadas. Ángulo de pitch: el corte diario detecta el riesgo del vault; si `convertToAssets` cae y R < L, el semáforo pasa a rojo al corte siguiente. Matiz: `convertToAssets` es valor contable; por eso se declara cobertura por bucket (líquido vs vault).

## 8. Riesgos

- Fee del bridge: hay que leer el ABI para saber cómo cotizarlo; si no hay `quote`, preguntar en Discord.
- RPC públicos de Polygon inestables (polygon-rpc.com falló; publicnode anduvo).
- Privy embedded wallet necesita gas en cada chain para la demo; cargar ETH/POL de antemano o usar paymaster.
- Addresses de las otras stablecoins: sin eso no hay bonus.
