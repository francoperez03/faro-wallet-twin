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

-- last_processed_block (depósitos) y snapshot de convertToAssets (interés), D-03.
create table if not exists sync_state (
  key text primary key,
  value text
);
