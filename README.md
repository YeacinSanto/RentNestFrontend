# RentNest

A property rental platform frontend built with Next.js (App Router), consuming a REST API documented in [`api-spec.json`](./api-spec.json). Three roles are supported: **Tenant**, **Landlord**, and **Admin**.

> **Note:** This project runs on Next.js 16, which has some conventions that differ from older Next.js versions (e.g. `proxy.ts` instead of `middleware.ts`, `retry` instead of `reset` on error boundaries, ambient `PageProps`/`LayoutProps` route helpers). See `AGENTS.md` for details.

## Tech stack

- **Next.js 16** (App Router, Server Components, Server Actions)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (Radix-based components, Phosphor icons)
- **sonner** for toast notifications
- **next-themes** for light/dark mode
- **Stripe Checkout** for payments (external redirect, no client-side Stripe SDK)

## Getting started

```bash
pnpm install
pnpm dev
```


### Environment variables

Create a `.env.local` file:

```bash
# Server-only — never exposed to the browser. No NEXT_PUBLIC_ prefix on purpose,
# since all backend calls happen from Server Components / Server Actions.
BACKEND_API_URL=https://rent-nest-nu-weld.vercel.app/
```

Point this at your running backend instance (see `api-spec.json` for its contract). Swap to a deployed backend URL as needed.

## Project structure & conventions

Routes are organized into App Router route groups, each with its own private `_action/` (Server Actions) and `_components/` (route-scoped components) folders:

```
app/
├── (authGroup)/       # /login, /register
├── (publicGroup)/     # /, /properties, /properties/[id], /payment/success, /payment/cancel
├── (dashBoardGrop)/   # /dashboard/tenant, /dashboard/landlord/*, /dashboard/admin/*
├── _components/       # shared, app-wide components (Navbar, ThemeToggle, ActionToast, PropertyCard)
└── layout.tsx, page.tsx, loading.tsx, error.tsx, not-found.tsx
```

- **Server Actions** (`"use server"` files under each group's `_action/`) handle all mutations, driven by `useActionState` on the client.
- **Auth**: the backend issues JWTs via httpOnly cookies (`accessToken`, `refreshToken`) on login. Since the backend's own `Set-Cookie` is scoped to a different origin than this frontend, Server Actions read those cookies manually and forward them as `Authorization: Bearer <token>` on subsequent backend calls.
- **Route protection**: `proxy.ts` (project root) guards `/dashboard/:path*`, checking the caller's role via `GET /auth/me` and redirecting mismatches to their correct dashboard.
- **Toasts**: mutating actions surface success/error feedback via `sonner`. A reusable `ActionToast` component fires a one-shot toast after a redirect, keyed off a `?param=1` query string that it then strips from the URL.

## Routes by role

**Public**
- `/` — homepage with hero + property grid (search/filter)
- `/properties` — same browse & filter grid, without the hero section
- `/properties/[id]` — property detail, photo gallery, request-to-rent form (tenants only)
- `/payment/success`, `/payment/cancel` — Stripe Checkout outcome pages

**Any authenticated role**
- `/dashboard/profile` — edit your own name and/or password (email is immutable)

**Tenant** (`/dashboard/tenant`)
- Rental request history with status badges, payment history, review form (gated to completed rentals)
- `/dashboard/tenant/requests/[id]/pay` — Stripe payment initiation

**Landlord** (`/dashboard/landlord/*`)
- `/requests` — manage incoming rental requests (approve/reject/complete)
- `/properties` — manage own listings (create, delete, upload photos)
- `/properties/new` — create a listing
- `/properties/[id]/photos` — upload photos (up to 8, 5MB each, JPEG/PNG/WebP/AVIF)

**Admin** (`/dashboard/admin/*`)
- `/` — platform overview (user/property/pending-request counts)
- `/users` — user list with search, pagination, ban/unban
- `/properties` — every listing on the platform, any status
- `/rentals` — every rental request on the platform
- `/categories` — create property categories

## Known backend limitations

The backend (see `api-spec.json`'s top-level `notes`) has some quirks that shape this frontend's code, worth knowing before extending it:

- Almost all errors return HTTP 500 with a hardcoded, unhelpful `message` — the real reason is in the `error` field.
- List endpoints inconsistently return raw arrays vs. `{ result: [...] }`.
- `price` / `amount` are numeric strings — always `parseFloat`/`Number()` before using.
- No pagination on any endpoint (pagination on the admin users table is done client-side).
- No endpoint exists to cancel/delete a rental request, or to delete a single uploaded image (removing photos means deleting the whole listing).
- `GET /properties/:id` omits the `category` relation that `GET /properties` includes.

## Scripts

```bash
pnpm dev      # start dev server
pnpm build    # production build
pnpm start    # run production build
pnpm lint     # eslint
```
