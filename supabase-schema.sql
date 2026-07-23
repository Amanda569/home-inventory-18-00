create table if not exists public.household_inventory (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.household_inventory enable row level security;

create policy "allow anon shared household access"
on public.household_inventory
for all
to anon
using (true)
with check (true);
