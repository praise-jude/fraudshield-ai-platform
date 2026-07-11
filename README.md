# FraudShield AI

Real-time transaction fraud monitoring dashboard — Next.js (App Router) + TypeScript + Tailwind CSS, backed by Supabase.

Implements the dashboard from `design/` as a real app: Overview, Transactions, Case Management, Rules Engine, and Reports, with a simulated live transaction feed persisted to Postgres.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and fill in your Supabase project's URL and publishable/anon key:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Project structure

```
src/
  app/            # Next.js App Router (layout, page, global styles)
  components/     # Sidebar, Topbar, Toast, and per-view components
  lib/            # Supabase client, DB helpers, mock data generation, types
design/           # Original design prototype this app implements (reference only)
```

## Deployment

Deployed on Vercel with GitHub continuous deployment from `master`. Supabase holds the `fraudshield_transactions`, `fraudshield_cases`, and `fraudshield_rules` tables.
