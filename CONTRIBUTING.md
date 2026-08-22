# Contributing

Welcome. Whether you're adding a feature, fixing a bug, or updating copy
that outgrew the CMS, this doc is the shortest path to a merged PR.

---

## Ground rules

1. **Small PRs merge fast, big PRs die slow.** Aim for < 400 lines
   changed. Split up bigger work.
2. **Every PR must pass CI** (lint + typecheck). No exceptions,
   including your own.
3. **Follow the Zen of Python** even in TypeScript: readable > clever,
   flat > nested, explicit > implicit.
4. **DRY, YAGNI, SOLID.** If you're adding a second copy of something,
   stop and refactor. If you're adding a feature "for later", don't.
5. **Keep files under 600 lines.** If a file grows past that, split it —
   unless the split hurts cohesion.

---

## Local dev

See [`README.md`](./README.md) for the full setup. TL;DR:

```bash
pnpm install --frozen-lockfile
docker compose up -d
cp .env.example .env    # then edit PAYLOAD_SECRET
pnpm payload migrate
pnpm dev
```

---

## Branching

- `main` is **always deployable**. Vercel auto-deploys from it.
- Feature branches: `feat/<short-slug>` (e.g. `feat/careers-filter`).
- Fix branches: `fix/<short-slug>`.
- Chore/docs: `chore/<slug>` or `docs/<slug>`.
- Never push directly to `main` — always via PR.

Rebase your branch onto `main` before opening a PR. If conflicts pile
up, rebase again. Merge commits from `main` into your branch make
history noisy.

---

## Commit messages

We follow **Conventional Commits**. First line format:

```
<type>(<scope>): <short summary>
```

**Types:** `feat`, `fix`, `chore`, `docs`, `refactor`, `perf`, `test`,
`style`, `build`, `ci`.

**Examples** (real, from `git log`):

```
feat(nav): highlight the active tab in the top header + mobile drawer
perf(payload): dedupe global fetches per request with React.cache()
feat(cms): finish CMS-ification — forms, detail templates, SEO, 404
```

Keep the first line under 72 chars. Optional body (wrap at 100 chars)
for the *why*, not the *what* — the diff shows the what.

---

## Pull request checklist

Copy this into your PR description and tick as you go
(GitHub also loads it from `.github/PULL_REQUEST_TEMPLATE.md`):

- [ ] Branch is rebased on latest `main`.
- [ ] `pnpm lint` passes locally.
- [ ] `pnpm build` succeeds locally.
- [ ] If I changed a Payload collection or global, I ran
      `pnpm payload migrate:create` and committed the migration.
- [ ] If I added a new env var, I updated `.env.example`.
- [ ] If behaviour changed, I updated the relevant doc
      (README / ARCHITECTURE / OPERATIONS).
- [ ] Preview deploy URL smoke-tested (open the Vercel bot's comment,
      click around).
- [ ] At least one reviewer requested.

---

## Code style

### General

- **TypeScript strict mode** is on. No `any` unless you write a comment
  explaining why. `unknown` + narrowing is almost always better.
- **Named exports** over default exports (better refactoring, better
  auto-import).
- **`async`/`await`** over raw promise chains.
- No `console.log` in shipped code. Use it locally, remove before PR.
  Server actions and scripts can use `console.log` — the seed scripts
  do — but keep them tidy.
- **Import order:** external packages → `@/...` internal → relative.
  ESLint/next handles this mostly.

### React / Next.js

- **Server Components by default.** Only add `'use client'` when you
  actually need state, effects, or browser APIs.
- **Data fetching in Server Components** — use `getPayload()` from
  `@/lib/payload`, not `fetch`.
- **Global reads should use the cached fetchers** in
  [`src/lib/payload.ts`](./src/lib/payload.ts) (`getPageContent`,
  `getSiteSettings`, etc.). They dedupe per request via `React.cache()`.
- **Locale-safe hrefs**: for CMS-managed links, wrap with
  `localizeHref(href, prefix)` from `@/lib/i18n`.
- **Metadata**: use `generateMetadata` and the helpers in `@/lib/seo`.
  Don't duplicate title/description generation logic.

### Styling

- **Tailwind utility classes** in JSX. No CSS modules, no styled-components.
- Extract repeated class combos into components, not into `@apply`.
- Design tokens (colors, spacing) live in `globals.css` / Tailwind
  config — don't hardcode hex values.

### Payload collections / globals

- Every new field should have an `admin.description` so editors know
  what it's for.
- Prefer **localized** fields for anything user-visible unless there's
  a real reason not to.
- Access control: default to authenticated read/write. Only relax to
  public read when the collection is meant to be shown on the site.
- Never bypass Payload's access control with raw SQL.

---

## Working with the database

### Making schema changes

1. Edit the collection/global in `src/collections/` or `src/globals/`.
2. Run `pnpm payload migrate:create` — this generates a migration file
   in `src/migrations/` (both `.ts` and `.json`).
3. **Review the generated SQL.** If it drops a column with data, think
   twice. If you need a two-step migration for zero downtime, split it.
4. Commit the migration files (yes, both).
5. Run `pnpm payload migrate` locally to confirm it applies cleanly.
6. Regenerate types: `pnpm generate:types` (commits `src/payload-types.ts`).

### Never do this

- Don't hand-edit files in `src/migrations/`.
- Don't hand-edit `src/payload-types.ts` — it's regenerated on every
  build and your changes will vanish.
- Don't run raw SQL against production without a peer review and a backup.

---

## Content changes (no code)

If your change is **just editing website copy**, you don't need to open
a PR at all. Log into `/admin` and edit it there. See
[`docs/ADMIN_GUIDE.md`](./docs/ADMIN_GUIDE.md).

Code changes for content only make sense when:

- You're changing the **structure** of a page (adding a new section, new field).
- You're changing **fallback copy** in `src/lib/content-defaults.ts`
  (shown when the CMS is empty — rare).
- You're wiring up a **brand new page or route**.

---

## Adding a new page

1. Create `src/app/(frontend)/[locale]/<your-path>/page.tsx`.
2. Make it an `async` Server Component. Fetch content via
   `getPayload()` or the cached global helpers.
3. Export a `generateMetadata` for SEO (see other pages for examples).
4. If the page needs editable copy, add fields to `PageContent` global
   (or create a new global if it's substantial).
5. Add the route to `src/app/sitemap.ts` so it appears in
   `sitemap.xml`.
6. Update `src/middleware.ts` if a legacy URL should redirect here.
7. Add a link in `Navigation` global (via `/admin`) if it needs to be
   in the header/footer.

---

## Adding a new locale

See the "Adding a new locale is a schema change" section in
[`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## Reviewing PRs

- **Prefer questions over commands.** "What happens if X is null here?"
  beats "Handle the null case."
- **Approve small PRs quickly.** Don't hold a 30-line fix for two days.
- **Block on:** security issues, missing migrations, breaking API
  changes, broken CI. Everything else is a suggestion.
- **Test the preview deploy** for anything touching UI or content.

---

## Getting help

- **Slack/Discord channel:** _fill in your team's channel_
- **Payload Discord** (external): https://discord.com/invite/payload
- **Escalation:** ping a CODEOWNER (see `.github/CODEOWNERS`).

Happy shipping.
