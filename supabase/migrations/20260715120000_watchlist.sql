-- Blacklist/whitelist management: org-scoped watchlist entries (customer
-- name, device, or IP) that feed into scoreTransaction() as unconditional
-- base factors, same org-scoping/RLS pattern as the rest of the schema.

create table if not exists public.fraudshield_watchlist (
  id bigint generated always as identity primary key,
  org_id uuid not null references public.fraudshield_organizations(id) on delete cascade,
  list_type text not null check (list_type in ('blacklist','whitelist')),
  entry_type text not null check (entry_type in ('customer','device','ip')),
  value text not null,
  reason text,
  created_by_user_id uuid references auth.users(id) on delete set null,
  created_by_name text,
  created_at timestamptz not null default now(),
  unique (org_id, list_type, entry_type, value)
);
create index if not exists fraudshield_watchlist_org_idx on public.fraudshield_watchlist (org_id, list_type, entry_type, value);
alter table public.fraudshield_watchlist enable row level security;

create policy "fs_watchlist_select" on public.fraudshield_watchlist
  for select to authenticated using (org_id = fraudshield_current_org());
create policy "fs_watchlist_insert" on public.fraudshield_watchlist
  for insert to authenticated with check (org_id = fraudshield_current_org());
create policy "fs_watchlist_delete" on public.fraudshield_watchlist
  for delete to authenticated using (org_id = fraudshield_current_org());
