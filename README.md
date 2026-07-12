# FraudShield AI

Real-time transaction fraud monitoring dashboard — Next.js (App Router) + TypeScript + Tailwind CSS, backed by Supabase.

Implements the dashboard from `design/` as a real app: Overview, Transactions, Case Management, Rules Engine, and Reports, with a simulated live transaction feed persisted to Postgres.

## Architecture

The browser never talks to Supabase directly. All business logic — transaction risk scoring, case creation, rule updates, report export logging — lives server-side in Next.js Route Handlers under `src/app/api/`, which are the only thing holding Supabase credentials.

```
Browser (src/lib/apiClient.ts)
  → Next.js API routes (src/app/api/**)
    → src/lib/supabaseServer.ts (server-only Supabase client)
      → Supabase Postgres (RLS scoped to exactly what each route needs)
```

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/bootstrap` | GET | Initial transactions/cases/rules; seeds the DB on first run |
| `/api/transactions/simulate` | POST | Generates + scores a transaction, persists it, opens a case if high-risk |
| `/api/cases/[txId]` | PATCH | Advances a case: new → investigating → resolved |
| `/api/rules/[id]` | PATCH | Toggles a rule's enabled state |
| `/api/reports/[id]/export` | POST | Logs a report export |

Database access is locked down with per-operation Postgres RLS policies and column-level grants (e.g. rules can only have their `enabled` column updated; transactions are insert/select-only, never updated or deleted).

### Request auth

The four write routes (`simulate`, `cases`, `rules`, `reports/export`) require a signed, `httpOnly` session cookie (`fs_session`) issued by `src/proxy.ts` when the page is first loaded. The cookie is an HMAC of a timestamp keyed by `API_SHARED_SECRET`, checked via `src/lib/authToken.ts` — the secret itself is never sent to the browser, only the signed token is, and the browser can't read or forge it. This isn't user authentication (no identity, no login), it just stops external scripts from hitting the write API directly without going through the app. `GET /api/bootstrap` is read-only and unprotected.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and fill in your Supabase project's URL/anon key and a random `API_SHARED_SECRET`. All server-only (no `NEXT_PUBLIC_` prefix) — never exposed to the browser:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
API_SHARED_SECRET=
```

## Project structure

```
src/
  app/
    api/          # Route Handlers — the backend
    ...           # layout, page, global styles
  components/     # Sidebar, Topbar, Toast, and per-view components
  lib/
    supabaseServer.ts  # server-only Supabase client (never bundled into the browser)
    authToken.ts         # session cookie signing/verification for write routes
    apiClient.ts           # browser-side fetch wrappers for the API routes
    rows.ts                  # DB row <-> app type mapping
    mock.ts                    # transaction generation, risk scoring, static data defs
  proxy.ts          # issues the session cookie on page load
design/           # Original design prototype this app implements (reference only)
```

## Deployment

Deployed on Vercel with GitHub continuous deployment from `master`. Supabase holds the `fraudshield_transactions`, `fraudshield_cases`, `fraudshield_rules`, and `fraudshield_report_exports` tables.
