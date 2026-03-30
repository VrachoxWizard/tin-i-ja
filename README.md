# DealFlow — Croatian M&A Marketplace

> A premium, end-to-end web platform for buying and selling businesses in Croatia.
> AI-powered valuations, anonymised blind teasers, NDA-gated deal rooms, and buyer–seller matchmaking.

**Live:** <https://tin-i-ja.vercel.app/>
**Repo:** <https://github.com/VrachoxWizard/tin-i-ja>

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.2 (App Router, Turbopack) |
| **Runtime** | React 19, TypeScript 5 (strict) |
| **Styling** | Tailwind CSS 4, tw-animate-css, Framer Motion |
| **UI** | shadcn/ui (Radix primitives), Lucide icons, custom GlowCard glass components |
| **Backend** | Supabase (PostgreSQL, Auth, RLS, Storage) |
| **AI** | Vercel AI SDK + Google Gemini (valuations & blind teaser generation) |
| **Auth** | Supabase Auth with `@supabase/ssr` (cookie-based sessions) |
| **Security** | `isomorphic-dompurify` (XSS sanitisation), proxy-level route protection |
| **Deploy** | Vercel |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local
# Fill in: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, GOOGLE_GENERATIVE_AI_API_KEY

# 3. Run dev server
npm run dev        # http://localhost:3000

# 4. Build for production
npm run build
npm start
```

### Required Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI API key for Gemini |
| `NEXT_PUBLIC_SITE_URL` | Production URL (used in password reset emails) |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/                  # Auth pages (shared layout with branding sidebar)
│   │   ├── login/               # Login page + server action
│   │   ├── register/            # Register page with role selection (buyer/seller)
│   │   ├── logout/              # Logout server action
│   │   ├── forgot-password/     # Password reset request
│   │   └── update-password/     # Set new password (after email link)
│   │
│   ├── (public)/                # Public pages (shared layout with Header/Footer)
│   │   ├── page.tsx             # Landing page (/)
│   │   ├── listings/            # Browse listings with search/filter/sort
│   │   │   └── [id]/            # Listing detail page (blind teaser view)
│   │   ├── buy/                 # Buyer journey landing
│   │   ├── sell/                # Seller journey landing
│   │   ├── valuate/             # AI Valuator Wizard
│   │   └── succession/          # Succession planning landing
│   │
│   ├── dashboard/               # Protected dashboard area
│   │   ├── buyer/               # Buyer dashboard + NDA tracking
│   │   │   └── deal-room/[id]   # NDA-gated Deal Room (full company data)
│   │   └── seller/              # Seller dashboard + NDA management
│   │
│   ├── api/                     # API Routes
│   │   ├── valuate/             # AI valuation (public, no auth)
│   │   ├── listings/create-teaser/  # AI blind teaser generation (auth)
│   │   ├── buyers/profile/      # Save buyer profile for matchmaking (auth)
│   │   ├── nda/request/         # Request NDA on a listing (auth, buyer)
│   │   └── nda/approve/         # Approve/reject NDA (auth, seller+owner)
│   │
│   ├── auth/callback/           # Supabase auth callback (code exchange)
│   ├── error.tsx                # Global error boundary
│   ├── not-found.tsx            # Global 404 page
│   └── layout.tsx               # Root layout (fonts, theme, Toaster)
│
├── components/
│   ├── features/                # Domain-specific components
│   │   ├── ValuatorWizard.tsx   # Multi-step AI valuation wizard
│   │   ├── TeaserCard.tsx       # Listing teaser card
│   │   ├── ListingsFilters.tsx  # Search bar, sidebar filters, sort (client)
│   │   ├── NdaActions.tsx       # Approve/reject NDA buttons (client)
│   │   ├── NdaRequestButton.tsx # Request NDA / status display (client)
│   │   ├── SellerOnboardingForm.tsx
│   │   ├── BuyerOnboardingForm.tsx
│   │   ├── SellerDashboardContent.tsx
│   │   └── BuyerDashboardContent.tsx
│   ├── sections/                # Landing page sections (Hero, Features, CTA, etc.)
│   ├── shared/                  # Header, Footer, shared layout parts
│   └── ui/                      # shadcn/ui primitives + GlowCard
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts            # Server-side Supabase client (cookies)
│   │   ├── client.ts            # Browser-side Supabase client
│   │   └── middleware.ts        # Supabase session refresh helper
│   ├── sanitize.ts              # DOMPurify-based HTML sanitisation
│   ├── env.ts                   # Environment variable validation
│   ├── matching.ts              # Buyer–seller matchmaking logic
│   └── utils.ts                 # cn() helper
│
└── proxy.ts                     # Next.js 16 proxy (middleware replacement)
                                 # Route protection + role-based redirects
```

---

## Route Map (21 routes)

| Route | Type | Auth | Description |
|---|---|---|---|
| `/` | Static | No | Landing page |
| `/listings` | Dynamic | No | Browse blind teasers (search, filter, sort) |
| `/listings/[id]` | Dynamic | No | Listing detail + NDA request |
| `/buy` | Static | No | Buyer journey landing |
| `/sell` | Static | No | Seller journey landing |
| `/valuate` | Static | No | AI Valuator Wizard |
| `/succession` | Static | No | Succession planning |
| `/login` | Static | No | Login |
| `/register` | Static | No | Register with role selection |
| `/forgot-password` | Static | No | Password reset request |
| `/update-password` | Static | Session | Set new password |
| `/dashboard/buyer` | Dynamic | Yes | Buyer dashboard (NDAs, profile) |
| `/dashboard/buyer/deal-room/[id]` | Dynamic | Yes + NDA | Full company data after signed NDA |
| `/dashboard/seller` | Dynamic | Yes | Seller dashboard (listings, NDA requests) |
| `/api/valuate` | API | No | AI valuation endpoint |
| `/api/listings/create-teaser` | API | Yes | AI blind teaser generation |
| `/api/buyers/profile` | API | Yes | Save buyer profile |
| `/api/nda/request` | API | Yes | Request NDA |
| `/api/nda/approve` | API | Yes + Owner | Approve/reject NDA |
| `/auth/callback` | API | - | Supabase auth code exchange |

---

## Key Features & Status

### Completed

- **AI Valuator Wizard** — Multi-step form → Gemini generates DCF/multiples valuation report
- **AI Blind Teaser Generation** — Seller submits financials → AI creates anonymised HTML teaser
- **Listings Marketplace** — Server-side search, industry/region/EBITDA filters, sort
- **Listing Detail Page** — Financial overview, blind teaser, NDA request sidebar
- **NDA Flow (full cycle)** — Buyer requests → Seller approves/rejects → Deal Room unlocks
- **Deal Room** — NDA-gated page with full company data, seller contact, documents section
- **Role-Based Auth** — Registration with buyer/seller selection, role-based dashboard routing
- **Password Reset** — Forgot password → email link → update password
- **Auth Callback** — Handles Supabase email verification & password reset redirects
- **XSS Protection** — All `dangerouslySetInnerHTML` sanitised via `isomorphic-dompurify`
- **Route Protection** — `proxy.ts` guards `/dashboard/*`, redirects unauthenticated users
- **Error Handling** — Global, public, and dashboard error boundaries + 404 page + loading skeletons
- **Logout** — Server action that signs out and redirects to `/login`
- **Environment Validation** — Startup check for required env vars

### Supabase Database Tables

| Table | Purpose |
|---|---|
| `users` | User profiles (extends Supabase Auth) |
| `listings` | Business listings with financials, teaser, status |
| `ndas` | NDA records (buyer_id, listing_id, status, signed_at) |
| `buyer_profiles` | Buyer preferences for matchmaking |
| `deal_room_files` | Documents uploaded to Deal Rooms |

### Security

- All DB-mutating API routes verify `supabase.auth.getUser()` before proceeding
- NDA approve/reject verifies the authenticated user owns the listing (join check)
- No server-side secrets (`SERVICE_ROLE_KEY`, etc.) exposed in client code
- Supabase RLS enforced at the database level
- AI-generated HTML sanitised before rendering (whitelist of safe tags/attributes)
- `proxy.ts` redirects unauthenticated users away from protected routes

---

## Database RPC

| Function | Description |
|---|---|
| `get_active_teasers()` | Returns anonymised teaser data for all active listings |

---

## Deployment

Deployed on **Vercel** with automatic builds from `main` branch.

```bash
# Verify build locally before pushing
npm run build
```

Environment variables must be set in Vercel project settings.

---

## Development Notes

- **Tailwind 4** uses the new `@import "tailwindcss"` syntax (no `tailwind.config.ts`)
- **Next.js 16** uses `proxy.ts` instead of `middleware.ts` for request interception
- **React 19** — `useFormStatus`, server actions, `async` server components are used throughout
- **`searchParams`** in page components is `Promise<{...}>` in Next.js 16 (must be `await`-ed)
- Tailwind class shorthand warnings (e.g. `bg-white/[0.02]` → `bg-white/2`) are cosmetic and pre-existing — safe to batch-fix in a polish pass
