-- FraudShield AI Platform — initial schema, own dedicated Supabase project.
-- Consolidated final-state migration (this app's schema previously existed
-- only as ad-hoc SQL mistakenly applied to a different project's database —
-- this is the first real migration tracked in this repo).

create table if not exists public.fraudshield_transactions (
  id text primary key,
  customer text not null,
  country text not null,
  device text not null,
  device_icon text not null,
  ip text not null,
  currency_symbol text not null,
  amount numeric not null,
  amount_display text not null,
  risk_score int not null check (risk_score >= 0 and risk_score <= 100),
  status_label text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.fraudshield_cases (
  id bigint generated always as identity primary key,
  tx_id text not null references public.fraudshield_transactions(id) on delete cascade,
  status text not null default 'new' check (status in ('new', 'investigating', 'resolved')),
  created_at timestamptz not null default now()
);

create table if not exists public.fraudshield_rules (
  id text primary key,
  name text not null,
  description text not null,
  enabled boolean not null default true
);

create table if not exists public.fraudshield_report_exports (
  id bigint generated always as identity primary key,
  report_id text not null,
  report_name text not null,
  exported_at timestamptz not null default now()
);

alter table public.fraudshield_transactions enable row level security;
alter table public.fraudshield_cases enable row level security;
alter table public.fraudshield_rules enable row level security;
alter table public.fraudshield_report_exports enable row level security;

-- Transactions are immutable once written (no update/delete policy => denied by default).
create policy "fraudshield_transactions_select" on public.fraudshield_transactions
  for select to anon using (true);
create policy "fraudshield_transactions_insert" on public.fraudshield_transactions
  for insert to anon with check (true);

create policy "fraudshield_cases_select" on public.fraudshield_cases
  for select to anon using (true);
create policy "fraudshield_cases_insert" on public.fraudshield_cases
  for insert to anon with check (true);
create policy "fraudshield_cases_update_status" on public.fraudshield_cases
  for update to anon using (true) with check (true);
revoke update on public.fraudshield_cases from anon;
grant update (status) on public.fraudshield_cases to anon;

-- Rules: read + toggle enabled only. No insert/delete — the rule set is
-- fixed and seeded below.
create policy "fraudshield_rules_select" on public.fraudshield_rules
  for select to anon using (true);
create policy "fraudshield_rules_update_enabled" on public.fraudshield_rules
  for update to anon using (true) with check (true);
revoke update on public.fraudshield_rules from anon;
grant update (enabled) on public.fraudshield_rules to anon;

create policy "fraudshield_report_exports_select" on public.fraudshield_report_exports
  for select to anon using (true);
create policy "fraudshield_report_exports_insert" on public.fraudshield_report_exports
  for insert to anon with check (true);

insert into public.fraudshield_rules (id, name, description, enabled) values
  ('r1', 'Block transactions above ₦500,000', 'Requires manual approval for any single transaction exceeding this threshold.', true),
  ('r2', 'Blacklisted country check', 'Automatically flags transactions originating from high-risk jurisdictions.', true),
  ('r3', 'New device verification', 'Require additional 2FA when a transaction comes from an unrecognized device.', true),
  ('r4', 'Outside business hours flag', 'Flags large transactions initiated between 12am–6am local time.', true),
  ('r5', 'Velocity check', 'Flags accounts with more than 20 transactions within a 2-minute window.', true),
  ('r6', 'Impossible travel detection', 'Flags logins from two distant locations within an implausible time window.', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Auth / organization schema — namespaced fraudshield_* to avoid any
-- collision, shares auth.users with this project's own Supabase Auth.
-- ---------------------------------------------------------------------------
create table if not exists public.fraudshield_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  org_type text not null check (org_type in ('bank','fintech','ecommerce','insurance','crypto_exchange','payment_gateway','other')),
  business_registration_number text,
  country text not null,
  state text,
  address text,
  official_email text not null,
  phone text,
  website text,
  mfa_enforced boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.fraudshield_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid not null references public.fraudshield_organizations(id) on delete cascade,
  full_name text not null,
  job_title text,
  role text not null check (role in ('owner','administrator','fraud_analyst','compliance_officer','risk_manager','customer_support','auditor','read_only')),
  status text not null default 'active' check (status in ('active','invited','suspended')),
  created_at timestamptz not null default now()
);

create table if not exists public.fraudshield_login_attempts (
  id bigint generated always as identity primary key,
  email text not null,
  ip text,
  success boolean not null,
  created_at timestamptz not null default now()
);
create index if not exists fraudshield_login_attempts_email_idx on public.fraudshield_login_attempts (email, created_at desc);

create table if not exists public.fraudshield_known_devices (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  device_hash text not null,
  user_agent text,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  last_ip text,
  last_country text,
  unique (user_id, device_hash)
);

create table if not exists public.fraudshield_audit_logs (
  id bigint generated always as identity primary key,
  org_id uuid references public.fraudshield_organizations(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  ip_address text,
  user_agent text,
  country text,
  metadata jsonb,
  created_at timestamptz not null default now()
);
create index if not exists fraudshield_audit_logs_org_idx on public.fraudshield_audit_logs (org_id, created_at desc);

alter table public.fraudshield_organizations enable row level security;
alter table public.fraudshield_profiles enable row level security;
alter table public.fraudshield_login_attempts enable row level security;
alter table public.fraudshield_known_devices enable row level security;
alter table public.fraudshield_audit_logs enable row level security;

create or replace function public.fraudshield_current_org() returns uuid
language sql security definer stable set search_path = public as $$
  select org_id from fraudshield_profiles where id = auth.uid();
$$;

create or replace function public.fraudshield_current_role() returns text
language sql security definer stable set search_path = public as $$
  select role from fraudshield_profiles where id = auth.uid();
$$;

-- Org registration: called post-email-confirmation (see /auth/callback), once a
-- real session exists. Atomically creates the org + the caller as its owner.
create or replace function public.fraudshield_register_organization(
  p_org_name text, p_org_type text, p_business_registration_number text,
  p_country text, p_state text, p_address text, p_official_email text,
  p_phone text, p_website text, p_full_name text, p_job_title text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  if exists (select 1 from fraudshield_profiles where id = v_uid) then
    return (select org_id from fraudshield_profiles where id = v_uid);
  end if;

  insert into fraudshield_organizations
    (name, org_type, business_registration_number, country, state, address, official_email, phone, website)
  values
    (p_org_name, p_org_type, p_business_registration_number, p_country, p_state, p_address, p_official_email, p_phone, p_website)
  returning id into v_org_id;

  insert into fraudshield_profiles (id, org_id, full_name, job_title, role, status)
  values (v_uid, v_org_id, p_full_name, p_job_title, 'owner', 'active');

  insert into fraudshield_audit_logs (org_id, user_id, event_type)
  values (v_org_id, v_uid, 'organization_created');

  return v_org_id;
end;
$$;
grant execute on function public.fraudshield_register_organization to authenticated;

-- Login attempt recording + lockout check, both callable pre-auth (anon), since
-- a failed login by definition has no session yet.
create or replace function public.fraudshield_record_login_attempt(
  p_email text, p_ip text, p_user_agent text, p_success boolean
) returns boolean
language plpgsql security definer set search_path = public as $$
declare
  v_recent_failures int;
  v_locked boolean;
begin
  insert into fraudshield_login_attempts (email, ip, success) values (p_email, p_ip, p_success);
  insert into fraudshield_audit_logs (event_type, ip_address, user_agent, metadata)
  values (case when p_success then 'login_success' else 'login_failed' end, p_ip, p_user_agent, jsonb_build_object('email', p_email));

  select count(*) into v_recent_failures from fraudshield_login_attempts
  where email = p_email and success = false and created_at > now() - interval '15 minutes';
  v_locked := v_recent_failures >= 5;

  if v_locked and not p_success then
    insert into fraudshield_audit_logs (event_type, ip_address, user_agent, metadata)
    values ('account_lockout', p_ip, p_user_agent, jsonb_build_object('email', p_email));
  end if;

  return v_locked;
end;
$$;
grant execute on function public.fraudshield_record_login_attempt to anon, authenticated;

create or replace function public.fraudshield_is_locked_out(p_email text) returns boolean
language sql security definer stable set search_path = public as $$
  select count(*) >= 5 from fraudshield_login_attempts
  where email = p_email and success = false and created_at > now() - interval '15 minutes';
$$;
grant execute on function public.fraudshield_is_locked_out to anon, authenticated;

create policy "fs_org_select" on public.fraudshield_organizations
  for select to authenticated using (id = fraudshield_current_org());

create policy "fs_profiles_select" on public.fraudshield_profiles
  for select to authenticated using (org_id = fraudshield_current_org());
create policy "fs_profiles_update_self" on public.fraudshield_profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.fraudshield_profiles from authenticated;
grant update (full_name, job_title) on public.fraudshield_profiles to authenticated;

create policy "fs_devices_all_self" on public.fraudshield_known_devices
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "fs_audit_insert_self" on public.fraudshield_audit_logs
  for insert to authenticated with check (user_id = auth.uid());
create policy "fs_audit_select_org" on public.fraudshield_audit_logs
  for select to authenticated using (
    org_id = fraudshield_current_org() and fraudshield_current_role() in ('owner','administrator','auditor','compliance_officer')
  );
