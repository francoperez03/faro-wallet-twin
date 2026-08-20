-- Ledger de Cuenta (D-01/D-03). Idempotente: correr múltiples veces no rompe.
create table if not exists accounts (
  user_id text primary key,
  wallet_address text unique,
  argt_balance numeric(38, 0) not null default 0,
  bolt_balance numeric(38, 0) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists movements (
  id serial primary key,
  user_id text not null references accounts (user_id),
  type text not null check (type in ('deposit', 'withdraw', 'interest')),
  token text not null default 'ARGt',
  amount numeric(38, 0) not null,
  chain text,
  tx_hash text,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

-- D-03/D-09: idempotencia de depósitos, un tx_hash no puede acreditarse dos veces.
create unique index if not exists movements_deposit_tx_hash_idx
  on movements (tx_hash)
  where type = 'deposit';

create index if not exists movements_user_id_idx on movements (user_id);

-- Pivote de yield (circuits-mini/yield_cut): balance BASE pre-credito usado por
-- lib/cuenta/interest.ts::accrueInterest para el pro rata de cada movimiento 'interest',
-- persistido para poder reconstruir/auditar el corte sin depender del retorno en memoria
-- de esa corrida (null en movimientos anteriores a este pivote, deposit/withdraw no lo usan).
alter table movements add column if not exists base_balance numeric(38, 0);

-- last_processed_block (depósitos) y snapshot de convertToAssets (interés), D-03.
create table if not exists sync_state (
  key text primary key,
  value text
);

-- Corte mini (04-CONTEXT.md D-09): una fila por usuario incluido en cada corrida real
-- del pipeline de circuits-mini/liabilities_batch_mini. balances = [argt_balance,
-- bolt_balance] (mismo orden que el circuito), commitment = commit(balances, salt)
-- calculado con el mismo Poseidon2 que el circuito (lib/poseidon2/commit.ts). Idempotente:
-- correr el corte dos veces con el mismo corte_id no rompe (unique en la PK compuesta).
-- Reusada por el pivote de yield (circuits-mini/yield_cut, lib/sobrecito-mini/prove-yield.ts):
-- ahi balances = [balance, reward] (mismo orden que ese circuito), mismo corte_id compartido
-- namespace (los corte_id de yield y de liabilities_batch_mini nunca colisionan, cada
-- pipeline arma el suyo con un prefijo distinto).
create table if not exists openings (
  corte_id text not null,
  user_id text not null references accounts (user_id),
  balances jsonb not null,
  commitment text not null,
  created_at timestamptz not null default now(),
  primary key (corte_id, user_id)
);

create index if not exists openings_user_id_idx on openings (user_id);

-- Vision publica del pivote de yield (durabilidad del recompute de /status): B1/B2 y las dos
-- lecturas convertToAssets de cada corte, persistidas en lib/sobrecito-mini/prove-yield.ts al
-- momento del corte. Permite a YieldComparison mostrar el dato "informado por el operador"
-- cuando un nodo de archivo no esta disponible para recomputar on-chain. Idempotente: mismo
-- corte_id no rompe (PK simple, insert unico por corte).
create table if not exists yield_cuts (
  corte_id text primary key,
  block_b1 bigint,
  block_b2 bigint,
  value_b1 numeric(38, 0),
  value_b2 numeric(38, 0),
  created_at timestamptz default now()
);
