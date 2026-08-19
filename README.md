# JSK Website

Marketing + corporate site for **JSK Industries Pvt. Ltd.** (jskindia.in).
Built as a headless-CMS-driven site so non-devs can edit everything (copy,
images, products, news, careers, forms) from a friendly `/admin` panel — no
code deploys required for content changes.

> **New owner? Start here.** This README is the "run it in 15 minutes" guide.
> For the full handover, work through the docs listed in
> [Documentation index](#documentation-index) below.

---

## Stack at a glance

| Layer            | Choice                                                    |
| ---------------- | --------------------------------------------------------- |
| Framework        | **Next.js 16** (App Router, React Server Components)      |
| Language         | TypeScript 6, React 19                                    |
| CMS              | **Payload CMS 3** (embedded — same Next.js process)       |
| Database         | **PostgreSQL 16** (via `@payloadcms/db-postgres`)         |
| Media storage    | **Cloudflare R2** (S3-compatible, via `@payloadcms/storage-s3`) |
| Styling          | Tailwind CSS 4                                            |
| Package manager  | **pnpm** (frozen lockfile in CI)                          |
| Hosting          | **Vercel** (region `sin1` — Singapore)                    |
| Node             | ≥ 20                                                      |

The Payload admin lives at **`/admin`** on the same domain as the frontend
(`/`). No separate backend to deploy — one app, one deploy.

---

## Run it locally (the 5-step recipe)

### 1. Prereqs

- **Node.js ≥ 20** (`nvm install 20` if you're stuck in the past)
- **pnpm** (`npm i -g pnpm`)
- **Docker** (for the local Postgres — or bring your own Postgres 14+)

### 2. Clone + install

```bash
git clone https://github.com/adityakoukuntla25/jsk-website.git
cd jsk-website
pnpm install --frozen-lockfile
```

### 3. Start Postgres

```bash
docker compose up -d
```

That spins up Postgres 16 on `localhost:5432` with:

- user: `jsk`
- password: `jsk`
- database: `jsk_website`

(Config in [`docker-compose.yml`](./docker-compose.yml).)

### 4. Environment variables

Copy the example and edit as needed:

```bash
cp .env.example .env
```

Minimum required for local dev:

```env
DATABASE_URI=postgresql://jsk:jsk@localhost:5432/jsk_website
PAYLOAD_SECRET=any-long-random-string-you-like
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

You can leave the S3 / Resend / analytics vars commented out — local dev
falls back to filesystem uploads and no-op email.

See the full list in the [Environment variables](#-environment-variables) section below.

### 5. Migrate + run

```bash
pnpm payload migrate       # apply all DB migrations
pnpm dev                   # start Next.js on http://localhost:3000
```

Then visit:

- **Frontend:** http://localhost:3000 (auto-redirects to `/en`)
- **Admin:** http://localhost:3000/admin

First time in the admin, Payload will prompt you to **create the first
super-admin user**. Do that, log in, and you're off.

### 6. (Optional) Seed sample data

Two ways, pick your poison:

```bash
# A. Full TS seeder — runs against whatever DB your .env points to
pnpm seed

# B. Quick REST-API seeder — hits the running dev server
#    (requires an admin user + password wired into the script)
./scripts/seed-via-api.sh
```

The TS seeder ([`src/lib/seed.ts`](./src/lib/seed.ts)) is idempotent — safe
to re-run.

---

## Common scripts

| Command                    | What it does                                            |
| -------------------------- | ------------------------------------------------------- |
| `pnpm dev`                 | Start Next dev server (hot reload, includes admin)      |
| `pnpm build`               | Production build (Next.js)                              |
| `pnpm start`               | Run the production build                                |
| `pnpm lint`                | ESLint (next/core-web-vitals)                           |
| `pnpm payload`             | The Payload CLI (see subcommands below)                 |
| `pnpm payload migrate`     | Apply pending DB migrations                             |
| `pnpm payload migrate:create` | Generate a new migration from schema changes         |
| `pnpm generate:types`      | Regenerate `src/payload-types.ts` from collections      |
| `pnpm seed`                | Run the full seed script                                |

---

## Environment variables

All in [`.env.example`](./.env.example). Grouped by purpose:

### Database (required)

```env
DATABASE_URI=postgresql://user:pass@host:5432/dbname
```

On **Vercel**, this points to the managed Postgres — see [Hosting](#-hosting-on-vercel).
On **local**, it points to the Docker container above.

### Payload (required)

```env
PAYLOAD_SECRET=<32+ chars of randomness>
```

Used to sign JWTs for admin sessions and encrypt sensitive data at rest.
**Never commit this.** Generate one with:

```bash
openssl rand -base64 48
```

### Media storage — Cloudflare R2 (required in prod, optional in dev)

```env
S3_BUCKET=jsk-media
S3_ACCESS_KEY_ID=<r2 access key>
S3_SECRET_ACCESS_KEY=<r2 secret>
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
S3_REGION=auto
```

We use **Cloudflare R2** because it's S3-compatible, has zero egress fees,
and plays nice with Vercel's image optimizer.

To get these:

1. Log into Cloudflare → **R2** → create bucket `jsk-media` (or whatever).
2. **R2 → Manage API Tokens** → create token with `Object Read & Write` on that bucket.
3. Copy the endpoint (looks like `https://abc123.r2.cloudflarestorage.com`).
4. Paste into Vercel env vars (see [Hosting](#-hosting-on-vercel)).

If you leave these blank locally, Payload falls back to storing uploads on
the local filesystem under `public/media/` (which is gitignored).

### Site URL

```env
NEXT_PUBLIC_SITE_URL=https://jskindia.in   # prod
NEXT_PUBLIC_SITE_URL=http://localhost:3000 # dev
```

Used for canonical URLs, `sitemap.xml`, `robots.txt`, and Open Graph tags.

### Optional

```env
RESEND_API_KEY=re_xxx                # transactional email (contact/enquiry forms)
NEXT_PUBLIC_GA4_ID=G-XXXXX           # Google Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=jskindia.in
```

---

## Hosting on Vercel

### The setup

- **Project:** connected to the `main` branch of
  `github.com/adityakoukuntla25/jsk-website`.
- **Framework preset:** Next.js (auto-detected).
- **Region:** `sin1` (Singapore) — closest to the user base in India.
  Configured in [`vercel.json`](./vercel.json).
- **Install command:** `pnpm install --frozen-lockfile`
- **Build command** (from `vercel.json`):

  ```bash
  payload generate:importmap && \
  payload generate:types && \
  payload migrate && \
  next build
  ```

  In order: (1) rebuild the admin importmap, (2) regenerate TS types from
  collections, (3) run any pending DB migrations, (4) build Next.js. The
  `migrate` step means **every deploy auto-migrates the DB** — so keep
  migrations backwards-compatible for zero-downtime rollouts.

### Environment variables on Vercel

Set these in **Project → Settings → Environment Variables** for all three
environments (Production, Preview, Development):

| Variable                    | Where it comes from                    |
| --------------------------- | -------------------------------------- |
| `DATABASE_URI`              | Vercel Postgres (or Neon / Supabase — see below) |
| `PAYLOAD_SECRET`            | Generated once, never rotated casually |
| `S3_BUCKET`                 | `jsk-media`                            |
| `S3_ACCESS_KEY_ID`          | Cloudflare R2 dashboard                |
| `S3_SECRET_ACCESS_KEY`      | Cloudflare R2 dashboard                |
| `S3_ENDPOINT`               | `https://<r2-account-id>.r2.cloudflarestorage.com` |
| `NEXT_PUBLIC_SITE_URL`      | `https://jskindia.in`                  |
| `RESEND_API_KEY`            | Resend dashboard (optional)            |

**Preview deploys** can (and should) point to a separate Postgres branch
and a separate R2 bucket so you don't stomp on production data.

### Database options

The `DATABASE_URI` accepts any Postgres 14+ connection string. Current
production uses **Vercel Postgres** (which is Neon under the hood), but any
of these work identically:

- Vercel Postgres → `postgres://default:xxx@ep-xxx.us-east-1.postgres.vercel-storage.com/verceldb`
- Neon → `postgres://user:pass@ep-xxx.neon.tech/dbname?sslmode=require`
- Supabase → `postgres://postgres:pass@db.xxx.supabase.co:5432/postgres`
- Self-hosted → whatever your ops team gives you

**Important:** the connection string needs `?sslmode=require` for
Neon/Supabase. Vercel Postgres handles this automatically.

### The `.env.production.local` file

**Local-only** file (gitignored) that some maintainers keep around to run
production-DB commands from their laptop, e.g.:

```bash
# Connects to prod DB from local machine — DANGER, use sparingly
tsx src/lib/seed-prod.ts
```

Don't ever commit this. If you need prod DB access, pull the vars from
Vercel (`vercel env pull .env.production.local`).

### Domain

- Apex domain `jskindia.in` → CNAME/A → Vercel.
- Vercel handles TLS auto-renewal (Let's Encrypt).
- `www.jskindia.in` → 308 redirect to apex (configured in Vercel domains UI).

---

## Content workflow (for the new owner)

1. Log into `/admin` with a super-admin account.
2. Editable content lives in two places:
   - **Collections** (many items): Products, News, Job Openings, Clients, etc.
   - **Globals** (singletons): Site Settings, Navigation, Footer, Home Content, Page Content.
3. All content is **localized** across `en`, `hi`, `te`, `ta` (English, Hindi,
   Telugu, Tamil). The admin has a language switcher in the top-right.
4. Forms (Contact, Enquiry, Job Application) submit into their own
   collections and can be exported as CSV from the admin.

There's a **role system** (`super_admin`, `admin`, `editor`, `contributor`)
defined in [`src/collections/Users.ts`](./src/collections/Users.ts). Only
super-admins can promote users.

---

## Where things live (quick tour)

```
src/
  app/
    (frontend)/[locale]/…    # public site, all locale-prefixed
    (payload)/admin/…        # /admin panel
    (payload)/api/…          # Payload REST + GraphQL routes
  collections/               # Payload collections (Products, Pages, …)
  globals/                   # Payload globals (SiteSettings, Navigation, …)
  components/                # React components (Header, Footer, …)
  lib/                       # Payload client, i18n, seed scripts
  middleware.ts              # Locale routing + legacy 301 redirects
  migrations/                # Auto-generated DB migrations — DO NOT hand-edit
  payload-types.ts           # Auto-generated TS types — DO NOT hand-edit
payload.config.ts            # The one Payload config to rule them all
next.config.ts               # Next.js config (wrapped in withPayload)
vercel.json                  # Deploy config (build command, region)
docker-compose.yml           # Local Postgres
```

Full deep-dive in [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## Troubleshooting

**"Can't connect to Postgres" on `pnpm dev`**
→ Run `docker compose up -d`. Check `docker ps` shows the container is `Up`.

**"Migration failed" on Vercel deploy**
→ Someone probably pushed a schema change without generating a migration.
Locally run `pnpm payload migrate:create`, commit the new migration file
under `src/migrations/`, redeploy.

**Admin says "no importmap"**
→ Run `pnpm payload generate:importmap`. Vercel does this at build time
automatically.

**"Images 404 in prod"**
→ Check R2 env vars are set. Check `next.config.ts` has your R2 hostname
in `images.remotePatterns` (currently allows `*.r2.cloudflarestorage.com`
and `*.jskindia.in`).

**"PAYLOAD_SECRET is using default value" warning**
→ You forgot to set `PAYLOAD_SECRET` in `.env`. Fix it before shipping.

**More problems, more answers:** see [`docs/TROUBLESHOOTING.md`](./docs/TROUBLESHOOTING.md)
for the full list.

---

## Documentation index

Everything a new team needs, in reading order:

**Start here:**

1. [`README.md`](./README.md) (you are here) — quickstart + env setup.
2. [`HANDOVER.md`](./HANDOVER.md) — ownership-transfer checklist
   (accounts, credentials, DNS, first-week smoke tests).
3. [`ARCHITECTURE.md`](./ARCHITECTURE.md) — the "why", the folder
   structure, request lifecycle, and design decisions.

**For developers:**

4. [`CONTRIBUTING.md`](./CONTRIBUTING.md) — git workflow, PR checklist,
   code style.
5. [`docs/TROUBLESHOOTING.md`](./docs/TROUBLESHOOTING.md) — common
   local + prod problems and their fixes.

**For operators / on-call:**

6. [`docs/OPERATIONS.md`](./docs/OPERATIONS.md) — deploy, rollback,
   DB backup/restore, secret rotation, incident response.
7. [`docs/BACKUPS.md`](./docs/BACKUPS.md) — scheduled off-provider
   `pg_dump` backups (setup + restore procedure).
8. [`SECURITY.md`](./SECURITY.md) — vuln reporting, secret rotation
   policy, threat model.

**For content editors (marketing / HR / IR):**

9. [`docs/ADMIN_GUIDE.md`](./docs/ADMIN_GUIDE.md) — using `/admin` to
   edit content. No coding required.

**Ongoing:**

10. [`CHANGELOG.md`](./CHANGELOG.md) — what shipped when.
11. [`.github/`](./.github/) — PR + issue templates, CI workflow,
    CODEOWNERS, Dependabot config, scheduled DB backup workflow.

**External:**

- [Payload CMS docs](https://payloadcms.com/docs) — the CMS framework.
- [Next.js App Router docs](https://nextjs.org/docs/app) — routing, RSC, server actions.

---

## License

Proprietary — © JSK Industries Pvt. Ltd. All rights reserved.
