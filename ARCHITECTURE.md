# Architecture

> Companion doc to [`README.md`](./README.md). The README tells you *how*
> to run this thing; this doc tells you *why* it's shaped the way it is.
>
> Target audience: a new engineer taking over the codebase who needs to
> ship a feature or fix a bug within their first week.

---

## Design goals (the "why")

1. **Non-devs edit content.** Marketing should be able to update copy,
   images, product specs, news posts, and job openings without a
   pull-request or a deploy. → **Payload CMS**, embedded.
2. **One deploy, one repo.** No separate backend project, no "which
   service is down?" ambiguity. → Payload runs *inside* the Next.js
   process. Same URL, same build, same logs.
3. **Multilingual out of the box.** Site targets India (Hindi, Telugu,
   Tamil) + international (English). → Payload's built-in localization
   + a `[locale]` route segment.
4. **SEO-friendly & fast.** Corporate marketing site — Google traffic
   matters. → React Server Components, static-ish rendering, `sitemap.ts`,
   `robots.ts`, canonical URLs, 301 redirects from the legacy site.
5. **Cheap to run.** → Vercel free/Pro tier + managed Postgres +
   Cloudflare R2 (zero egress). No Kubernetes, no VMs.
6. **Boring & typed.** Auto-generated TS types from Payload collections
   mean the compiler catches most content-shape mistakes.

---

## The stack (with reasoning)

| Layer     | Choice                            | Why not X?                                              |
| --------- | --------------------------------- | ------------------------------------------------------- |
| Frontend  | Next.js 16 App Router             | RSC + colocated data fetching = simple mental model.    |
| CMS       | Payload 3 (self-hosted, embedded) | Sanity/Contentful = SaaS lock-in + $$. Strapi = clunky. |
| DB        | Postgres 16                       | Relational content, easy backups, SQL is boring-good.  |
| Media     | Cloudflare R2 (S3 API)            | S3 = egress fees. R2 = zero egress, same API.          |
| Auth      | Payload built-in (JWT cookies)    | Admin-only auth; no public login flow to design.       |
| Styling   | Tailwind CSS 4                    | Fast, tree-shakes to ~10KB, no CSS-in-JS overhead.     |
| Hosting   | Vercel                            | Zero-config Next.js. Preview deploys per PR.           |
| Package   | pnpm                              | Faster than npm, saner than yarn, works with Vercel.   |

---

## Folder layout

```
jsk-website/
├── payload.config.ts          # Payload config — collections, globals, DB, S3
├── next.config.ts             # Next config, wrapped with withPayload()
├── vercel.json                # Build command + region pinning
├── docker-compose.yml         # Local Postgres for dev
├── .env.example               # Env var contract
│
├── public/                    # Static assets (logos, hero images, legacy pics)
│   └── images/…
│
├── scripts/
│   ├── seed-page-content.ts   # Populate PageContent global
│   └── seed-via-api.sh        # Bash seeder that hits REST API
│
└── src/
    ├── app/
    │   ├── (frontend)/        # Route group: public site
    │   │   ├── globals.css
    │   │   ├── layout.tsx     # Root HTML shell
    │   │   ├── page.tsx       # Redirect stub (→ /en)
    │   │   └── [locale]/      # All localized pages live here
    │   │       ├── layout.tsx # Header + Footer wrapper
    │   │       ├── page.tsx   # Home
    │   │       ├── about/
    │   │       ├── businesses/[category]/[slug]/
    │   │       ├── careers/[slug]/
    │   │       ├── clients/
    │   │       ├── contact/
    │   │       ├── enquiry/
    │   │       ├── investors/
    │   │       ├── news/[slug]/
    │   │       ├── stories/
    │   │       ├── loading.tsx
    │   │       └── not-found.tsx
    │   │
    │   ├── (payload)/         # Route group: CMS admin + API
    │   │   ├── layout.tsx     # Empty shell so admin has its own <html>
    │   │   ├── admin/[[...segments]]/
    │   │   └── api/[...slug]/route.ts   # Payload REST + GraphQL catch-all
    │   │
    │   ├── robots.ts          # /robots.txt
    │   └── sitemap.ts         # /sitemap.xml
    │
    ├── collections/           # Payload collections (rows in DB)
    │   ├── Users.ts           # Admin users (auth-enabled)
    │   ├── Media.ts           # Uploaded files (→ R2)
    │   ├── Pages.ts           # Free-form marketing pages
    │   ├── Products.ts        # Cable/conductor products
    │   ├── ProductCategories.ts
    │   ├── Verticals.ts       # New business verticals (VEDA, Digital SS, …)
    │   ├── Clients.ts
    │   ├── Persons.ts         # Leadership team
    │   ├── Plants.ts          # Manufacturing plants
    │   ├── Certifications.ts
    │   ├── Awards.ts
    │   ├── NewsArticles.ts
    │   ├── Stories.ts
    │   ├── InvestorDocuments.ts
    │   ├── JobOpenings.ts
    │   ├── JobApplications.ts # Submitted by form
    │   ├── Enquiries.ts       # Submitted by form
    │   └── ContactMessages.ts # Submitted by form
    │
    ├── globals/               # Payload globals (singletons)
    │   ├── SiteSettings.ts    # Brand info, socials, contact
    │   ├── Navigation.ts      # Header links
    │   ├── Footer.ts          # Footer links + text
    │   ├── HomeContent.ts     # Home page copy
    │   ├── Strengths.ts       # "Our strengths" section
    │   ├── PageContent.ts     # Per-page copy (~13KB config)
    │   └── Forms.ts           # Form labels + placeholders (i18n)
    │
    ├── components/            # React (client + server) components
    │   ├── Header.tsx, MobileNav.tsx, NavLink.tsx
    │   ├── Footer.tsx
    │   ├── HeroCarousel.tsx
    │   ├── LocaleSwitcher.tsx
    │   ├── RichText.tsx       # Renders Lexical richtext JSON
    │   └── RouteProgressBar.tsx
    │
    ├── lib/
    │   ├── payload.ts         # getPayload() singleton + cached global fetchers
    │   ├── i18n.ts            # Locale list, helpers, localizeHref()
    │   ├── languages.ts
    │   ├── seo.ts             # generateMetadata helpers
    │   ├── media.ts           # URL helpers for R2/local media
    │   ├── form-strings.ts    # Fallback form labels
    │   ├── content-defaults.ts # Hardcoded copy fallbacks (in case CMS empty)
    │   ├── seed.ts            # Dev seeder
    │   ├── seed-prod.ts       # Prod seeder (idempotent)
    │   └── seed-navigation.ts
    │
    ├── middleware.ts          # Locale routing + legacy 301 redirects
    │
    ├── migrations/            # Auto-generated SQL migrations — DO NOT hand-edit
    │   ├── index.ts           # Registered list
    │   └── 20260522_190605.{ts,json}, …
    │
    ├── payload-types.ts       # Auto-generated TS types — DO NOT hand-edit
    └── types.d.ts             # Ambient type shims
```

### Why the `(frontend)` and `(payload)` route groups?

Next.js **route groups** (parenthesized folders) let us share a URL
namespace but use *different* root layouts. `(payload)/admin` renders its
own HTML shell without our marketing site's `<Header>` and `<Footer>`,
while `(frontend)` gets the full public chrome. Both live under `/` — no
subdomain gymnastics.

---

## Request lifecycle

### A. Frontend page (e.g., `GET /en/about`)

```
Browser
  │
  ▼
middleware.ts
  ├─ Is it a legacy URL (e.g. /corporate-profile/vision-mission.htm)?
  │     → 301 to /en/about
  ├─ Is it "/"?
  │     → 307 to /en
  └─ Otherwise → next()
  │
  ▼
app/(frontend)/[locale]/layout.tsx
  ├─ Validate locale (`en` | `hi` | `te` | `ta`) — 404 if bogus
  └─ Render <Header/> + <children/> + <Footer/>
  │
  ▼
app/(frontend)/[locale]/about/page.tsx  (async RSC)
  ├─ getPageContent(locale)   ─┐
  ├─ getSiteSettings(locale)  ─┤  all React.cache()-memoized,
  ├─ getStrengths(locale)     ─┤  so multiple calls in one render
  └─ …                        ─┘  hit the DB once.
  │
  ▼
Payload → Postgres → response HTML (streamed)
```

Key win: **`React.cache()` around every global fetcher** in
[`src/lib/payload.ts`](./src/lib/payload.ts). Both `generateMetadata` and
the page component often need the same global (`site-settings`,
`page-content`). Without the cache, that's 2× DB round trips per page.
With it, one.

### B. Admin (e.g., `GET /admin/collections/products`)

```
Browser → app/(payload)/admin/[[...segments]]/page.tsx
         → Payload's built-in admin UI (React) renders in-place
         → Client-side hits /api/products?… (the REST catch-all)
```

### C. API (e.g., `POST /api/enquiries`)

```
Browser → app/(payload)/api/[...slug]/route.ts
         → REST_POST(config) handler from @payloadcms/next
         → Payload validates + writes to Postgres
         → JSON response
```

### D. Form submission (server action)

E.g. the enquiry form uses a Next.js **server action**
([`src/app/(frontend)/[locale]/enquiry/actions.ts`](./src/app/\(frontend\)/[locale]/enquiry/actions.ts)):

```
Client form submits → server action → getPayload().create({ collection: 'enquiries', ... })
                    → optional: send email via Resend
                    → return { ok: true }  (client shows toast)
```

No API endpoint needed — server actions are secure by default (Next signs
the RPC endpoint).

---

## Data model

### Collections (rows)

| Collection          | Purpose                                    | Localized fields |
| ------------------- | ------------------------------------------ | ---------------- |
| `users`             | Admin login accounts (with `role`)         | —                |
| `media`             | Uploaded files, stored in R2               | alt text         |
| `pages`             | Free-form marketing pages (rare — most content lives in globals) |  |
| `products`          | Cable/conductor products                   |                |
| `product-categories` | Groupings for products                    |                |
| `verticals`         | New business verticals                     |                |
| `clients`           | Client logos + names                       | name             |
| `persons`           | Leadership team                            |                |
| `plants`            | Manufacturing plants                       |                |
| `certifications`    | ISO certs etc.                             |                |
| `awards`            | Awards received                            |                |
| `news-articles`     | Press releases / news                      |                |
| `stories`           | Long-form storytelling                     |                |
| `investor-documents`| Annual returns, filings                    | title            |
| `job-openings`      | Open positions                             |                |
| `job-applications`  | Form submissions from careers page         | — (write-only)   |
| `enquiries`         | Form submissions from enquiry page         | — (write-only)   |
| `contact-messages`  | Form submissions from contact page         | — (write-only)   |

The three `*-applications`/`enquiries`/`contact-messages` collections are
**write-only from the public** (via server actions) and read-only in the
admin — no public GET.

### Globals (singletons)

Configured in [`payload.config.ts`](./payload.config.ts):

- `site-settings` — brand name, logo, socials, contact email/phone.
- `navigation` — header menu structure.
- `footer` — footer link columns + copyright.
- `home-content` — the homepage hero, features, callout blocks.
- `strengths` — the "Our Strengths" section shown on multiple pages.
- `page-content` — per-page marketing copy (about, clients, careers, etc.).
  Huge — see [`src/globals/PageContent.ts`](./src/globals/PageContent.ts).
- `forms` — labels/placeholders for all forms (fully i18n).

**Why so many globals?** Cleaner than jamming every editable string into
a single mega-object. Each global maps to one editorial "screen" in the
admin, so a marketing person editing the home page only sees home-page
fields.

---

## Internationalization

Config lives in **one file**: [`src/lib/i18n.ts`](./src/lib/i18n.ts).

```ts
export const locales = ['en', 'hi', 'te', 'ta'] as const
export const defaultLocale: Locale = 'en'
```

### How it works

1. **URL structure:** every public page is prefixed with a locale segment
   → `/en/about`, `/hi/about`, `/te/about`, `/ta/about`.
2. **Middleware** ([`src/middleware.ts`](./src/middleware.ts)) redirects
   `/` → `/en` and blocks bogus locales.
3. **Payload localization**: each localized field becomes a `_locales`
   JSON column in Postgres. Payload fetches the right locale based on the
   `locale` param passed to `findGlobal`/`find`.
4. **Locale-safe hrefs**: use `localizeHref(href, prefix)` from `i18n.ts`
   for CMS-managed links so they get the locale prefix without breaking
   external URLs.

### Adding a new locale is a schema change

Payload creates DB columns per locale at compile time. To add, say,
Marathi:

1. Add `'mr'` to `locales` in `src/lib/i18n.ts`.
2. Add its `label`/`flag` to `localeMeta`.
3. Run `pnpm payload migrate:create` — generates a migration that adds
   `_mr` columns everywhere.
4. Commit and deploy — Vercel's build command runs the migration.

---

## Media (uploads)

Configured in `payload.config.ts` via `s3Storage()`:

- **Bucket:** `jsk-media` on Cloudflare R2 (S3-compatible API).
- **Endpoint:** `https://<account-id>.r2.cloudflarestorage.com`.
- **Access control:** bucket set to public read via R2 dashboard so
  `<Image>` can load directly. Uploads are authenticated (signed via
  Payload) but reads are public.
- **CDN:** R2 is fronted by Cloudflare, so egress is free and cached
  globally.
- **In dev:** if S3 env vars are empty, Payload writes to
  `public/media/` (gitignored) — no cloud account needed.

`next.config.ts` whitelists `*.r2.cloudflarestorage.com` and
`*.jskindia.in` in `images.remotePatterns` so Next's image optimizer will
process them.

---

## Migrations

Payload generates **SQL migrations** from schema changes.

- Location: [`src/migrations/`](./src/migrations/) (~7 files as of this writing).
- Each migration has a `.ts` (with `up`/`down` functions) and a `.json`
  (the schema snapshot Payload diffs against).
- Registered in [`src/migrations/index.ts`](./src/migrations/index.ts) —
  this is imported by Payload at runtime.
- **Never hand-edit migrations.** If you must patch data, write a new
  migration.

### Workflow when you change a collection

```bash
# 1. Edit src/collections/Foo.ts (add/remove/rename a field)
# 2. Generate a migration:
pnpm payload migrate:create
# 3. Inspect the generated file in src/migrations/
# 4. Commit both the .ts and .json files
# 5. Push. Vercel runs `payload migrate` on next build.
```

### Zero-downtime rule

Vercel deploys new code *before* the migration finishes on some setups.
To be safe: **make all migrations backwards-compatible** with the
previous code version. Two-step for breaking changes:

1. Deploy A: add the new column/table alongside the old one; write to both.
2. Deploy B: stop writing to the old one, drop it.

---

## Seeding

Three seed paths, use the right tool for the job:

| Script                       | When to use                                        |
| ---------------------------- | -------------------------------------------------- |
| `pnpm seed` (`src/lib/seed.ts`) | Local dev — reset your local DB to a known state |
| `tsx src/lib/seed-prod.ts`   | Prod — first-time bootstrap of a fresh DB          |
| `./scripts/seed-via-api.sh`  | Quick smoke test via REST API (needs live server)  |
| `scripts/seed-page-content.ts` | Just re-seed the `page-content` global           |

All are **idempotent** (skip existing records by slug/name).

---

## Legacy URL redirects

The old `.htm`-based site had URLs like
`/corporate-profile/vision-mission.htm`. We preserve SEO juice by
301-redirecting each one in
[`src/middleware.ts`](./src/middleware.ts) to its modern equivalent
(`/en/about`).

The redirect map is a plain `Record<string, string>`. To add more, just
edit the object — no build step needed (middleware runs at the edge).

---

## Security notes

- **`PAYLOAD_SECRET`** signs admin JWTs. Rotating it logs everyone out
  but is otherwise safe. **Never commit it.**
- **Role-based access** in `Users` collection: only `super_admin` can
  change other users' roles. Other roles have progressively less power
  (see individual collection `access` blocks — some are inconsistent, TODO).
- **Form submissions** go through server actions, which are CSRF-safe
  by default in Next.js.
- **No public write endpoints** on any content collection — the API
  respects Payload's access control which defaults to admin-only.
- **R2 bucket** is public *read* only (so images work). Writes are
  authenticated via S3 keys held server-side only.

---

## Deploy pipeline

```
git push origin main
   │
   ▼
GitHub webhook → Vercel
   │
   ▼
Vercel build (in region sin1)
   ├─ pnpm install --frozen-lockfile
   ├─ payload generate:importmap    (rebuild admin bundle imports)
   ├─ payload generate:types        (regenerate payload-types.ts)
   ├─ payload migrate               (apply pending DB migrations)
   └─ next build                    (build the Next app)
   │
   ▼
Deploy to Vercel edge + serverless functions
   │
   ▼
Custom domain jskindia.in serves the new deploy
```

**PR previews:** every PR gets a `*.vercel.app` preview URL. Ideally
configure it to hit a separate `preview` Postgres branch (Neon supports
this natively) to avoid corrupting prod data.

---

## Testing

Honest truth: there are **no automated tests** in the repo right now.
For a marketing site with a CMS, the ROI on unit tests is low, but if
you're planning to add features:

- **Playwright** for a handful of critical-path E2E tests (home loads,
  form submits, admin login).
- **Vitest** for pure functions in `src/lib/` (i18n helpers, SEO
  builders).

The build itself acts as an integration test — a broken TS type or a bad
migration will fail the Vercel deploy before it ships.

---

## Known quirks & gotchas

1. **`payload-types.ts` is 52 KB** and auto-generated. If git shows a
   huge diff there after a schema change, that's expected — commit it.
2. **Migrations dated 2026** — this is intentional; Payload uses
   sortable-string timestamps that don't need to match wall-clock.
3. **`content-defaults.ts` and `form-strings.ts`** are code-level
   fallbacks for when the CMS is empty (e.g., on a fresh DB with no
   seed). Keep them in sync with the global schema, or don't — they're
   only used when Payload returns nothing.
4. **`dev` script sets `NODE_OPTIONS='--no-deprecation'`** to hide
   noisy warnings from deep transitive deps. Remove it when Node/Next
   catches up.
5. The `scripts/` folder is `exclude`d from the main `tsconfig.json` —
   run those files with `tsx` directly.

---

## Roadmap-ish

Stuff that would be nice to add but isn't blocking:

- [ ] Playwright smoke tests
- [ ] CI (GitHub Actions) — lint + typecheck on PRs
- [ ] Uniform access-control audit across all collections
- [ ] Sentry / error reporting
- [ ] Uptime monitoring (Better Stack / UptimeRobot)
- [ ] R2 → Vercel image optimization caching config
- [ ] Split `PageContent.ts` (12 KB) into per-page globals if it grows more

---

## Getting help

- **Payload CMS Discord:** https://discord.com/invite/payload — very
  active, maintainers respond.
- **Next.js discussions:** https://github.com/vercel/next.js/discussions
- Original author: Aditya Koukuntla (see git history for contact).

Good luck, and don't be afraid to break `main` — Vercel's rollback is one
click. 
