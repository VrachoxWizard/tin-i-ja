# DealFlow

Diskretna hrvatska M&A platforma za prodavatelje i investitore: AI procjena, anonimni teaseri, NDA workflow i privatni deal room.

## Stack

- Next.js 16 App Router
- React 19 + TypeScript
- Tailwind CSS 4
- Supabase Auth, Postgres, RLS, Storage
- Vercel AI SDK + Google Gemini

## Runtime Setup

```bash
npm install
npm run dev
```

Required runtime environment variables are listed in `.env.example`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

## Supabase Contract

The repo is the source of truth for Supabase state.

- Canonical schema: [`schema.sql`](./schema.sql)
- Typed public schema: [`src/lib/database.types.ts`](./src/lib/database.types.ts)
- Deal-room storage contract: private bucket `deal-room-files`
- Required RPCs:
  - `get_active_teasers()`
  - `check_rate_limit(...)`
- Required auth trigger:
  - `handle_new_user()`

Refresh public-schema types from the target project with:

```bash
npm run supabase:types
```

## Supabase MCP Alignment

- Target Supabase project ref: `uygdnniouyeqvmysghbu`
- MCP is used for inspection and alignment, not as the primary source of truth
- Standard sequence:
  1. Inspect live Supabase project with MCP
  2. Compare against `schema.sql`, `src/lib/database.types.ts`, and `src/app/actions/dealflow.ts`
  3. Reconcile project-side drift
  4. Refresh local types
  5. Re-run lint/build

Detailed checklist: [`docs/supabase-mcp-alignment.md`](./docs/supabase-mcp-alignment.md)

## Current App Surface

- Public pages:
  - `/`
  - `/sell`
  - `/buy`
  - `/valuate`
  - `/listings`
  - `/listings/[publicCode]`
  - `/succession`
  - `/contact`
- Auth:
  - `/login`
  - `/register`
  - `/forgot-password`
  - `/update-password`
  - `/auth/callback`
- Protected dashboards:
  - `/dashboard/buyer`
  - `/dashboard/buyer/deal-room/[listingId]`
  - `/dashboard/seller`
  - `/dashboard/seller/deal-room/[listingId]`
- Public API route:
  - `/api/valuate`

Internal mutations now run primarily through server actions rather than the older NDA/profile route handlers.

## Verification

```bash
npm run lint
npm run build
```
