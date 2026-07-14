-- Phase 2: org-scope the demo dataset (transactions/cases/rules/report_exports
-- had no org_id at all — every org shared one global pool), add explainable
-- scoring storage, configurable rules, and investigation-console tables
-- (notes, timeline events).

-- --- org scoping -----------------------------------------------------------

alter table public.fraudshield_transactions
  add column if not exists org_id uuid references public.fraudshield_organizations(id) on delete cascade,
  add column if not exists risk_factors jsonb;

alter table public.fraudshield_cases
  add column if not exists org_id uuid references public.fraudshield_organizations(id) on delete cascade,
  add column if not exists resolution text check (resolution in ('confirmed_fraud','false_positive','resolved_legitimate'));

alter table public.fraudshield_report_exports
  add column if not exists org_id uuid references public.fraudshield_organizations(id) on delete cascade;

-- fraudshield_rules.id was a fixed text PK ('r1'..'r6'); make it
-- default-generated so orgs can create their own rules, and org-scope it.
alter table public.fraudshield_rules
  add column if not exists org_id uuid references public.fraudshield_organizations(id) on delete cascade,
  add column if not exists rule_type text check (rule_type in ('amount_threshold','country_risk','device_risk','velocity_count')),
  add column if not exists config jsonb,
  alter column id set default gen_random_uuid()::text;

-- --- investigation console tables ------------------------------------------

create table if not exists public.fraudshield_case_notes (
  id bigint generated always as identity primary key,
  tx_id text not null references public.fraudshield_transactions(id) on delete cascade,
  org_id uuid not null references public.fraudshield_organizations(id) on delete cascade,
  author_user_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  note text not null,
  created_at timestamptz not null default now()
);
create index if not exists fraudshield_case_notes_tx_idx on public.fraudshield_case_notes (tx_id, created_at);

create table if not exists public.fraudshield_case_events (
  id bigint generated always as identity primary key,
  tx_id text not null references public.fraudshield_transactions(id) on delete cascade,
  org_id uuid not null references public.fraudshield_organizations(id) on delete cascade,
  event_type text not null,
  actor_user_id uuid references auth.users(id) on delete set null,
  actor_name text,
  detail jsonb,
  created_at timestamptz not null default now()
);
create index if not exists fraudshield_case_events_tx_idx on public.fraudshield_case_events (tx_id, created_at);

alter table public.fraudshield_case_notes enable row level security;
alter table public.fraudshield_case_events enable row level security;

-- --- RLS: replace open anon policies with org-scoped authenticated ones ----

drop policy if exists "fraudshield_transactions_select" on public.fraudshield_transactions;
drop policy if exists "fraudshield_transactions_insert" on public.fraudshield_transactions;
create policy "fs_transactions_select" on public.fraudshield_transactions
  for select to authenticated using (org_id = fraudshield_current_org());
create policy "fs_transactions_insert" on public.fraudshield_transactions
  for insert to authenticated with check (org_id = fraudshield_current_org());

drop policy if exists "fraudshield_cases_select" on public.fraudshield_cases;
drop policy if exists "fraudshield_cases_insert" on public.fraudshield_cases;
drop policy if exists "fraudshield_cases_update_status" on public.fraudshield_cases;
create policy "fs_cases_select" on public.fraudshield_cases
  for select to authenticated using (org_id = fraudshield_current_org());
create policy "fs_cases_insert" on public.fraudshield_cases
  for insert to authenticated with check (org_id = fraudshield_current_org());
create policy "fs_cases_update" on public.fraudshield_cases
  for update to authenticated using (org_id = fraudshield_current_org()) with check (org_id = fraudshield_current_org());
revoke update on public.fraudshield_cases from authenticated;
grant update (status, resolution) on public.fraudshield_cases to authenticated;

drop policy if exists "fraudshield_rules_select" on public.fraudshield_rules;
drop policy if exists "fraudshield_rules_update_enabled" on public.fraudshield_rules;
create policy "fs_rules_select" on public.fraudshield_rules
  for select to authenticated using (org_id = fraudshield_current_org());
create policy "fs_rules_insert" on public.fraudshield_rules
  for insert to authenticated with check (org_id = fraudshield_current_org());
create policy "fs_rules_update" on public.fraudshield_rules
  for update to authenticated using (org_id = fraudshield_current_org()) with check (org_id = fraudshield_current_org());
revoke update on public.fraudshield_rules from authenticated;
grant update (name, description, enabled, rule_type, config) on public.fraudshield_rules to authenticated;

drop policy if exists "fraudshield_report_exports_select" on public.fraudshield_report_exports;
drop policy if exists "fraudshield_report_exports_insert" on public.fraudshield_report_exports;
create policy "fs_report_exports_select" on public.fraudshield_report_exports
  for select to authenticated using (org_id = fraudshield_current_org());
create policy "fs_report_exports_insert" on public.fraudshield_report_exports
  for insert to authenticated with check (org_id = fraudshield_current_org());

create policy "fs_case_notes_select" on public.fraudshield_case_notes
  for select to authenticated using (org_id = fraudshield_current_org());
create policy "fs_case_notes_insert" on public.fraudshield_case_notes
  for insert to authenticated with check (org_id = fraudshield_current_org());

create policy "fs_case_events_select" on public.fraudshield_case_events
  for select to authenticated using (org_id = fraudshield_current_org());
create policy "fs_case_events_insert" on public.fraudshield_case_events
  for insert to authenticated with check (org_id = fraudshield_current_org());

-- Old globally-seeded demo rows (no org_id) are now invisible under the new
-- RLS and orphaned; clean them out so bootstrap re-seeds cleanly per-org.
delete from public.fraudshield_cases where org_id is null;
delete from public.fraudshield_transactions where org_id is null;
delete from public.fraudshield_rules where org_id is null;
delete from public.fraudshield_report_exports where org_id is null;
