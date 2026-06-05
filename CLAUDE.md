# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing website + lightweight CMS/admin for **Portal Services Digital** (also branded "Portal Home"), a SaaS for cleaning/service businesses. It is a Next.js 15 App Router app (React 19, TypeScript strict, Tailwind 3) with two distinct surfaces:

1. **Public marketing site** at `/[locale]` — internationalized (en/es/pt) via `next-intl`. Rendered statically.
2. **`/hq` admin panel** — a password-gated control center for editing marketing content, leads, and business data, backed by Supabase. `noindex`, excluded from i18n routing.

## Commands

```bash
npm run dev      # next dev — local dev server
npm run build    # next build — production build (run this to typecheck the whole app)
npm run start    # next start — serve the production build
npm run lint     # next lint (eslint-config-next)
```

There is **no test suite** and no test runner configured. `npm run build` is the main correctness gate (TypeScript is `strict`). There is no separate `tsc` script; type errors surface via build or the editor.

Path alias: `@/*` maps to the repo root (e.g. `@/lib/marketing`, `@/components/...`).

## Environment variables

The app degrades gracefully when these are unset (Supabase helpers return `null`, public pages fall back to static content) — so local dev works without them, but `/hq` won't authenticate.

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — used by the cookie-based SSR client (`lib/supabase/server.ts`).
- `SUPABASE_SERVICE_ROLE_KEY` — service-role client (`lib/supabase/admin.ts`), bypasses RLS; **server-only**.
- `NEXT_PUBLIC_SITE_URL` — base URL for password-reset redirects (defaults to `https://portalservices.digital`).

## Routing & i18n architecture

`middleware.ts` runs `next-intl` middleware with `localePrefix: 'always'` and `localeDetection: false` — every public URL is prefixed (`/en`, `/es`, `/pt`), and the browser's `Accept-Language` is intentionally ignored (always defaults to `en`). Locales and `defaultLocale` are defined once in `i18n.ts`; translations live in `messages/{en,es,pt}.json`.

The middleware `matcher` **excludes** `hq`, `api`, `_next`, `_vercel`, and any path with a file extension. That's why `/hq/*` is not locale-prefixed and not subject to i18n.

- `app/page.tsx` redirects `/` → `/en`.
- `app/[locale]/layout.tsx` wraps pages in `NextIntlClientProvider` and calls `setRequestLocale` (required for static rendering). `generateStaticParams` pre-renders all locales.
- `app/layout.tsx` is the root layout: fonts (Inter + Poppins via `next/font`), global SEO metadata, and `SoftwareApplication` JSON-LD.

When adding a translated string, add the key to **all three** message files and read it via `getTranslations`/`useTranslations` namespaces.

## /hq admin & Supabase

Auth model is an **email allowlist**, not open signup:

- Login is email + password (`signInWithPassword` server action in `app/hq/actions.ts`). Magic-link callback still exists at `app/hq/auth/callback/route.ts`.
- Every `/hq` page and every mutating server action calls `requireMarketingAdmin()` (`lib/marketing.ts`), which verifies the Supabase session **and** that the user's email exists in the `marketing_admins` table. Pages redirect to `/hq/login` on failure; actions throw `Unauthorized`.
- `/hq` pages are `export const dynamic = 'force-dynamic'` (no caching of admin data).
- Password reset uses `sendPasswordReset` → always shows "check your inbox" even for non-admins (no email enumeration).

Two Supabase clients, both `import 'server-only'`:
- `lib/supabase/server.ts` → `createClient()` — anon key, cookie-backed SSR client. Use for the user's own session/auth.
- `lib/supabase/admin.ts` → `createAdminClient()` — service-role, **bypasses RLS**. Only call after verifying the caller via `requireMarketingAdmin`.

### CMS content model

`marketing_content` is a key-value store: one JSONB `content` blob per `section` (primary key). This lets section shapes evolve without schema migrations. Helpers in `lib/marketing.ts`:
- `getDoc<T>(section)` / `getCollection<T>(section)` — generic single-doc / array fetch.
- `getMarketingSection<T>(section)` — typed fetch for the classic sections (`pricing | testimonials | faq | hero | cta_banner`).

Writes go through server actions in `app/hq/actions.ts`:
- `saveMarketingSection(section, content)` — upsert + `revalidatePath` for `/`, `/en`, `/es`, `/pt`.
- `saveSitePatch(locale, patch)` — reads `site_<locale>`, **deep-merges** the patch (`lib/deep-merge.ts`) so independent editors don't clobber each other, then upserts and revalidates.

> **Important current state:** `lib/branding.ts#getBranding()` returns `DEFAULT_BRANDING` statically — the comment notes "Public render is fully static (no Supabase at request time) to guarantee uptime. CMS-driven branding/publish is temporarily disabled." So the public site currently renders from `next-intl` JSON + hardcoded defaults; HQ editors persist to Supabase but those values are not yet read back into the live public pages. Keep this in mind before assuming an HQ edit will show on the site.

### Migrations

SQL in `supabase/migrations/` is applied **manually** in the Supabase SQL editor / `supabase db push` — there is no automated migration runner here. These tables live in the **same Supabase project as the main SaaS app**. Tables: `marketing_content`, `marketing_admins` (allowlist), `marketing_leads` (public-insertable demo/contact submissions, server-only reads). To grant admin access, insert the email into `marketing_admins`.

## Components

There are **multiple generations** of marketing components — know which is live before editing:

- `components/v2/marketing/*` — **the current public homepage** (`app/[locale]/page.tsx` composes `Nav`, `Hero`, `TrustBand`, `PortalsGrid`, `HowItWorks`, `Pricing`, `Faq`, `Cta`, `Footer` from here). These read copy from `next-intl`, not Supabase.
- `components/*` (root: `Nav`, `Footer`, `Hero`, `Pricing`, `FAQ`, etc.) — older set, still used by the `/[locale]/terms`, `/privacy`, and `/docs` subpages.
- `components/psd/*` — an earlier design variant; **not referenced** by any current page (legacy).
- `components/hq/*` — admin UI: `Shell` (sidebar + header layout), `Sidebar`/`MobileNav`/`nav-items` (HQ navigation), `ops/` (dashboard), and the editors (`SiteEditor`, `BrandingEditor`, `PortalsEditor`, `ContractsEditor`, `CollectionManager`, `fields`).
- `components/ui/*` — shared primitives (`Button`, `Card`, `Badge`, `DeviceFrame`).

Most components are React Server Components by default; mark client components with `'use client'` only where interactivity requires it.

## Styling

Tailwind (`tailwind.config.ts`) with a custom palette — note the dual light/dark intent:
- `brand` (blue scale) + `accent` (cyan) — primary brand; `brand-gradient` and `mesh-1` background images.
- Light marketing surfaces: `canvas`, `paper`, `cloud`; dark text `graphite-{1..4}`; borders `line`.
- Dark surfaces (hero/CTA/footer and the dark `/hq` chrome): `ink`/`navy` scales, plus legacy `surface`/`text` aliases.

Two scoped CSS design-system files complement Tailwind: `app/psd.css` (`.psd` scope, CSS variables overridable via `lib/branding.ts#brandingStyle`) and `app/hqx.css` (`.hqx` scope for the admin dashboard). Use `cn()` from `lib/cn.ts` (clsx + tailwind-merge) to compose class names.

## Conventions

- Always guard `/hq` server code with `requireMarketingAdmin()` before touching the admin/service-role client.
- Keep service-role usage server-side (`import 'server-only'`); never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.
- After mutating marketing content, call `revalidatePath` for affected public routes (the existing actions show the pattern).
- HQ UI copy is primarily in Spanish; public copy is fully translated across en/es/pt.
