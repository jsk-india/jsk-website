# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
where practical (for a single-app product, we're loose with MAJOR bumps).

---

## [Unreleased]

### Added

- `src/components/home/` — nine per-section components extracted from
  the homepage (`HomeHero`, `StatsSection`, `ManifestoSection`,
  `VisionMissionSection`, `FeaturedProductsSection`,
  `CertificationsStrip`, `FeaturedVerticalsSection`,
  `ClientLogosSection`, `StrengthsSection`, `EnquiryCtaSection`).
- `src/lib/form-validation.ts` — tiny reusable `readForm()` + `readFile()`
  helpers for server-action input validation with typed success unions.
- Scheduled monthly off-provider DB backups via GitHub Actions
  (`.github/workflows/db-backup.yml`); docs in `docs/BACKUPS.md`.
- Weekly Dependabot updates for npm + GitHub Actions.
- Basic CI workflow (lint + typecheck on PRs).
- Handover documentation: `README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`,
  `SECURITY.md`, `HANDOVER.md`, `docs/OPERATIONS.md`, `docs/ADMIN_GUIDE.md`,
  `docs/TROUBLESHOOTING.md`, `docs/BACKUPS.md`.
- Issue + PR templates, `CODEOWNERS`.

### Changed

- Homepage (`src/app/(frontend)/[locale]/page.tsx`) reduced from 344 to
  91 lines — now a pure orchestrator that fetches data and hands each
  slice to a self-contained section component.
- Homepage now uses the memoized global fetchers (`getSiteSettings`,
  `getHomeContent`, `getStrengths`) instead of raw `findGlobal` calls.
- All home section components import types from `@/payload-types`
  instead of casting through `Record<string, unknown>`.
- `Header.tsx` — hoisted `FALLBACK_NAV` to module scope (was recreated
  on every render) and unified desktop + mobile nav on a single
  `effectiveNav` list so they can't diverge.
- Enquiry and job-application server actions now use `readForm()` for
  consistent trimming, proper email regex, length caps (200 chars for
  names, 320 for emails per RFC 5321, 5000 for bodies), and typed
  success/error unions.

### Deprecated

### Removed

### Fixed

### Security

- Server-action inputs are now length-capped and trimmed, closing off
  the "POST 10 MB of \"message\"" abuse vector on public forms.

---

## [0.1.0] — Initial handover baseline

First tagged snapshot at the point of ownership transfer. See the git
log for the full history leading up to this point; noteworthy items:

### Added

- Next.js 16 + Payload CMS 3 + Postgres site scaffolded.
- 18 content collections + 7 globals covering products, verticals,
  clients, leadership, plants, certifications, awards, news, stories,
  investor documents, careers, and form submissions.
- Multilingual support for `en`, `hi`, `te`, `ta`.
- Cloudflare R2 media storage integration.
- Vercel deploy pipeline with auto-migrate on build.
- Legacy URL 301 redirects from the old `.htm`-based site.
- Sitemap, robots, canonical URL handling for SEO.
- Full handover documentation: README, ARCHITECTURE, CONTRIBUTING,
  SECURITY, HANDOVER, plus ops runbook and admin guide.

---

## How to update this file

When you land a PR that changes behaviour:

1. Add a bullet to the appropriate section under `[Unreleased]`.
2. When you cut a release (tag, deploy notes, etc.), move the
   `[Unreleased]` items into a new `[X.Y.Z] — YYYY-MM-DD` heading.
3. Keep entries short and user-facing. "Fixed navbar overlap on mobile"
   beats "Refactored the header component to use flex-shrink."

Section conventions:

- **Added** — new features / pages / collections.
- **Changed** — changes to existing behaviour.
- **Deprecated** — soon-to-be removed features.
- **Removed** — removed features.
- **Fixed** — bug fixes.
- **Security** — vulnerabilities fixed.
