# Supabase MCP Alignment

This repo uses Supabase MCP in **alignment-only** mode.

- Target Supabase project ref: `uygdnniouyeqvmysghbu`
- Repo source of truth: [`schema.sql`](../schema.sql)
- Runtime contract sources:
  - [`src/lib/database.types.ts`](../src/lib/database.types.ts)
  - [`src/app/actions/dealflow.ts`](../src/app/actions/dealflow.ts)
  - [`src/lib/deal-room.ts`](../src/lib/deal-room.ts)

## Policy

- Use MCP to inspect, validate, and reconcile the live Supabase project.
- Do not treat the live project as the primary source of truth.
- Do not introduce ad hoc dashboard-only changes without reflecting them back into the repo contract.

## Required Live Resources

- Public tables from `schema.sql`
- RPCs:
  - `get_active_teasers()`
  - `check_rate_limit(...)`
- Auth trigger:
  - `handle_new_user()`
- Private storage bucket:
  - `deal-room-files`

## MCP Alignment Workflow

1. Inspect the live Supabase project with MCP.
2. Compare live state against:
   - `schema.sql`
   - `src/lib/database.types.ts`
   - `src/app/actions/dealflow.ts`
3. Reconcile drift in the live project if any resource is missing or incompatible.
4. Refresh typed schema locally:
   - `npm run supabase:types`
5. Re-run repo verification:
   - `npm run lint`
   - `npm run build`

## Alignment Checklist

- `listings` contains `public_code`, seller-readiness fields, lifecycle status values, and `updated_at`
- `buyer_profiles` contains EV/revenue range fields and `investment_thesis`
- `matches` contains `match_score`, `status`, and `ai_narrative`
- `ndas` enforces one NDA per buyer/listing and supports `pending`, `signed`, `rejected`
- `deal_room_files` stores `file_path` and is backed by the `deal-room-files` private bucket
- Storage policies allow:
  - sellers to manage files for their own listings
  - signed-NDA buyers to read files only through authorized access
- `handle_new_user` still creates `public.users` rows from `auth.users`

## Notes

- Keep the current SSR + proxy auth model.
- Do not add a service-role runtime path unless the live project proves it is required.
- If the live project changes first, sync those changes back into the repo immediately.
