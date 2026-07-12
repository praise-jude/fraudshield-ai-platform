# FraudShield AI

Real-time transaction fraud monitoring dashboard — Next.js (App Router) + TypeScript + Tailwind CSS, backed by Supabase.

Implements the dashboard from `design/` as a real app: Overview, Transactions, Case Management, Rules Engine, Reports, and an Audit Log, with organization-based auth and a simulated live transaction feed persisted to Postgres.

## Architecture

The browser never talks to Supabase's Postgres data directly for the demo dashboard data — that goes through Next.js Route Handlers under `src/app/api/`, which hold the DB credentials. Authentication itself uses Supabase Auth's own client SDK, which is designed to run in the browser (the anon key + Postgres RLS is the real security boundary there, not secrecy of the key).

```
Browser
  ├─ Supabase Auth (sign up / sign in / password reset) — direct, via src/lib/supabase/client.ts
  └─ Next.js API routes (src/app/api/**) — dashboard data + auth-aware write actions
       └─ src/lib/supabase/server.ts (cookie-aware server client, RLS-scoped)
            └─ Supabase Postgres
```

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/auth/sign-up` | POST | Validates + registers an organization (first user becomes Owner) |
| `/api/auth/sign-in` | POST | Lockout-checked sign-in, device/country recognition, audit logging |
| `/api/auth/sign-out` | POST | Logs the event, ends the session |
| `/auth/callback` | GET | Handles Supabase email confirmation / password-recovery links |
| `/api/bootstrap` | GET | Initial transactions/cases/rules; seeds the DB on first run |
| `/api/transactions/simulate` | POST | Generates + scores a transaction, persists it, opens a case if high-risk (requires `simulate:transactions`) |
| `/api/cases/[txId]` | PATCH | Advances a case: new → investigating → resolved (requires `manage:cases`) |
| `/api/rules/[id]` | PATCH | Toggles a rule's enabled state (requires `manage:rules`) |
| `/api/reports/[id]/export` | POST | Logs a report export (requires `export:reports`) |
| `/api/audit-logs` | GET | Recent org audit events (requires `view:audit_log`) |

## Auth & RBAC (Phase 1)

This shares its Supabase project with an unrelated live app ("Inventory App" / Inventra), so everything FraudShield owns is `fraudshield_`-prefixed — its own `organizations`, `profiles`, `login_attempts`, `known_devices`, and `audit_logs` tables, separate from Inventra's. Both apps' users still live in the same `auth.users` table (a Supabase project has exactly one), which is the one real tradeoff of this setup — see the plan doc for the full reasoning.

- **8 roles**: owner, administrator, fraud_analyst, compliance_officer, risk_manager, customer_support, auditor, read_only — defined with their permissions in `src/lib/permissions.ts`. Role → dashboard nav visibility is enforced both client-side (`DashboardClient.tsx` filters nav) and server-side (`requireRole()` in every write route).
- **Account lockout**: 5 failed attempts in 15 minutes locks the account, enforced via the `fraudshield_record_login_attempt` / `fraudshield_is_locked_out` Postgres functions (SECURITY DEFINER, since a failed login by definition has no session yet).
- **Device/country recognition**: `src/lib/deviceRecognition.ts` hashes the User-Agent per login and flags new devices/countries in the audit log. Country comes from a free-tier IP geolocation lookup (`src/lib/audit.ts`) — best-effort, not production-grade.
- **RLS**: every `fraudshield_*` table is scoped to the caller's own org via `fraudshield_current_org()` / `fraudshield_current_role()` (SECURITY DEFINER helpers, the standard Supabase pattern for avoiding recursive-policy issues). Rules/cases/profiles allow updates only to specific columns via column-level `GRANT`, not full-row access.

**Deliberately not built yet** (see `~/.claude/plans/warm-purring-wind.md` for the phased plan): TOTP MFA, backup codes, WebAuthn/passkeys, VPN detection, impossible-travel scoring, SSO, a dynamic (DB-driven) permission editor.

**Known local-testing limitation**: this Supabase project's default email sender has a shared, fairly low rate limit (and is also used by Inventra's real signups), so repeated local sign-up testing can hit "email rate limit exceeded." Not a code issue — verified by confirming no orphaned `auth.users` rows get created on that error. A custom SMTP provider (Resend/Postmark/SendGrid) configured in the Supabase dashboard would remove this ceiling for real usage.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and fill in your Supabase project's URL and anon key. Two copies are needed: a server-only pair (used by the dashboard's own data routes) and a `NEXT_PUBLIC_` pair (used by Supabase Auth's browser client — safe to expose, since RLS is the real boundary):

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Project structure

```
src/
  app/
    api/            # Route Handlers — dashboard data + auth actions
    auth/           # sign-up, sign-in, verify-email, forgot/reset-password pages
    ...             # layout, page (dashboard), global styles
  components/
    auth/           # AuthShell, FormField — shared auth page chrome
    views/          # Overview/Transactions/Cases/Rules/Reports/AuditLog views
    ui/             # shadcn/ui primitives
    DashboardClient.tsx  # the dashboard, role-aware
  lib/
    supabase/       # client.ts (browser), server.ts (Server Components/routes), middleware.ts (proxy)
    supabaseServer.ts    # server-only client for the demo dashboard data tables
    permissions.ts         # roles, permissions, role → permission matrix
    authGuard.ts             # requireRole() for Route Handlers
    audit.ts                   # audit log writer + IP geolocation
    deviceRecognition.ts         # new-device/new-country detection
    orgProvisioning.ts             # atomic org+owner creation post-signup
    validation/auth.ts               # Zod schemas for all auth forms
    apiClient.ts                       # browser-side fetch wrappers for dashboard routes
    rows.ts, mock.ts                     # DB row mapping, transaction generation/risk scoring
  proxy.ts          # refreshes the Supabase session cookie every request
design/             # Original design prototype this app implements (reference only)
```

## Deployment

Deployed on Vercel with GitHub continuous deployment from `master`. Supabase holds the `fraudshield_*` tables (dashboard demo data + auth/org tables), namespaced to coexist with Inventra's own tables in the same project.
