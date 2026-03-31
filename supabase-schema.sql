-- Run this in Supabase SQL editor

-- Users table
create table if not exists users (
  id             uuid default gen_random_uuid() primary key,
  auth_id        uuid unique,
  username       text unique not null,
  wallet_address text unique not null,
  created_at     timestamptz default now()
);

-- Bills table
create table if not exists bills (
  id           uuid default gen_random_uuid() primary key,
  title        text not null,
  creator_id   uuid references users(id),
  total_amount numeric not null,
  status       text default 'open',
  created_at   timestamptz default now()
);

-- Splits table
create table if not exists splits (
  id         uuid default gen_random_uuid() primary key,
  bill_id    uuid references bills(id),
  username   text not null,
  amount     numeric not null,
  paid       boolean default false,
  tx_hash    text,
  paid_at    timestamptz,
  created_at timestamptz default now()
);

-- RLS: allow all for now (tighten before mainnet)
alter table users  enable row level security;
alter table bills  enable row level security;
alter table splits enable row level security;

create policy "public read users"  on users  for select using (true);
create policy "public insert users" on users for insert with check (true);
create policy "public read bills"  on bills  for select using (true);
create policy "public insert bills" on bills for insert with check (true);
create policy "public update bills" on bills for update using (true);
create policy "public read splits"  on splits for select using (true);
create policy "public insert splits" on splits for insert with check (true);
create policy "public update splits" on splits for update using (true);
