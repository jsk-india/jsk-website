# Operations Runbook

Practical, step-by-step procedures for keeping jskindia.in alive and
healthy. Read this once end-to-end when you take over, then keep it
open in a tab.

Cross-refs: [`README.md`](../README.md), [`ARCHITECTURE.md`](../ARCHITECTURE.md),
[`SECURITY.md`](../SECURITY.md).

---

## Table of contents

1. [Deploy](#deploy)
2. [Rollback](#rollback)
3. [Database backup & restore](#database-backup--restore)
4. [Migrations in production](#migrations-in-production)
5. [Media (R2) operations](#media-r2-operations)
6. [Secret rotation](#secret-rotation)
7. [Monitoring & alerting](#monitoring--alerting)
8. [Incident response](#incident-response)
9. [Common maintenance tasks](#common-maintenance-tasks)
10. [Disaster recovery](#disaster-recovery)

---

## Deploy

### Normal deploy (the happy path)

Push to `main`. Vercel picks it up automatically.

```bash
git checkout main
git pull
# ... your changes ...
git commit -m "feat: something"
git push origin main
```

Watch the deploy in the Vercel dashboard. Build takes ~2–4 minutes.

### What Vercel actually runs (from `vercel.json`)

```
pnpm install --frozen-lockfile
payload generate:importmap
payload generate:types
payload migrate
next build
```

So every deploy also migrates the database. If migrations fail, the
deploy fails and the previous version stays live.

### Manual redeploy without a new commit

Vercel dashboard → **Deployments** → find the current production
deploy → **⋯** menu → **Redeploy**. Uncheck "Use existing build cache"
if you want a fresh install.

### Deploying a specific commit

Vercel dashboard → **Deployments** → find the commit → **Promote to
Production**.

### Preview deploys

Every PR gets a preview URL posted by the Vercel bot. Preview deploys
use the same env vars as production **unless** you scope specific vars
to only "Production" in the Vercel env settings. For safety, scope
`DATABASE_URI` and R2 keys to preview-specific values if you don't want
previews writing to prod data.

---

## Rollback

If a deploy breaks production, you have three options — in order of
speed:

### Option A: Instant rollback via Vercel (fastest — 10 seconds)

1. Vercel dashboard → **Deployments**.
2. Find the last known-good deploy (green checkmark).
3. Click **⋯** → **Promote to Production**.

That's it. The DNS-level swap is instant. Users on in-flight requests
finish on the old code; new requests hit the promoted deploy.

**Caveat:** if the bad deploy ran a database migration, the DB is now
ahead of the code. See [Rollback with a bad migration](#rollback-with-a-bad-migration).

### Option B: Revert the commit and re-deploy

```bash
git revert <bad-commit-sha>
git push origin main
```

Slower (waits for a new build) but clean git history.

### Option C: Rollback with a bad migration

If the migration was destructive (dropped a column, changed a type):

1. Promote the last-good deploy in Vercel (Option A above).
2. **Do not** re-run migrations against the old code — the schema
   mismatches will hurt.
3. Restore the database from the pre-migration snapshot (see
   [Database backup & restore](#database-backup--restore) below).
4. Fix the migration on a branch, test locally, PR, deploy.

**Prevention:** always write backwards-compatible migrations
(two-step for destructive changes). See
[`ARCHITECTURE.md`](../ARCHITECTURE.md#zero-downtime-rule).

---

## Database backup & restore

### Which provider?

Check the `DATABASE_URI` host to identify:

- `*.postgres.vercel-storage.com` → Vercel Postgres (Neon under the hood)
- `*.neon.tech` → Neon directly
- `*.supabase.co` → Supabase
- Anything else → check with the previous owner

### Backup — Vercel Postgres / Neon

Neon does **point-in-time recovery** automatically:

- Free tier: 7-day recovery window.
- Paid tiers: up to 30 days.

To create a snapshot manually:

1. Neon console → your project → **Branches** → **Create branch** from
   `main` at "now" (or a specific timestamp).
2. This gives you a full copy-on-write branch you can restore from or
   dump.

### Backup — Supabase

Supabase → **Database → Backups**. Daily backups on Pro plan; PITR on
higher tiers.

### On-demand `pg_dump` backup

> Scheduled off-provider backups already run monthly — see
> [`BACKUPS.md`](./BACKUPS.md). This section is for ad-hoc dumps
> (e.g., before a risky migration).

Regardless of provider, you can always take a manual dump:

```bash
# Pull env vars from Vercel first if you don't have DATABASE_URI locally
vercel env pull .env.production.local

# Set the URI
source .env.production.local

# Dump
pg_dump "$DATABASE_URI" \
  --no-owner --no-acl \
  --format=custom \
  --file="jsk-$(date +%Y%m%d-%H%M).dump"
```

Store the file somewhere durable (R2, S3, encrypted external drive).
**Don't commit dumps to git.**

### Restore — provider PITR (preferred)

Neon / Supabase / Vercel Postgres all offer a "restore to point-in-time"
button in their console. Fastest path, no data movement needed. Use
this unless you specifically need to restore from a dump.

Rough Neon flow:

1. Neon console → **Branches** → **Restore**.
2. Pick a timestamp (before the incident).
3. Neon creates a new branch with that data.
4. Update Vercel `DATABASE_URI` to the new branch's connection string.
5. Redeploy.
6. Verify. When happy, delete the old branch.

### Restore from `pg_dump`

Into a **fresh** database:

```bash
pg_restore \
  --no-owner --no-acl \
  --dbname="$DATABASE_URI" \
  jsk-YYYYMMDD-HHMM.dump
```

Never restore over a live production DB. Create a new database, restore
into it, verify, then repoint the app.

### Restore drill

Do a **restore drill quarterly**. Untested backups aren't backups.

```bash
# Create a scratch DB, restore into it, run a query, confirm counts
psql "$SCRATCH_DB_URI" -c "SELECT COUNT(*) FROM products;"
```

---

## Migrations in production

### Normal migration flow

Migrations run as part of the Vercel build (`payload migrate` in
`vercel.json`). You don't need to do anything special. The `main` build
either succeeds (with the migration applied) or fails (rolling back to
the prior deploy, prior schema).

### Migration failed on deploy — what now?

1. Vercel deploy log shows the failing SQL.
2. **The previous deploy is still serving traffic** — no user impact.
3. Fix locally:
   ```bash
   pnpm payload migrate    # reproduce the failure locally
   # inspect the offending migration in src/migrations/
   ```
4. Amend the migration or write a new one that unblocks the situation.
5. Commit, push, deploy again.

### Manually running a migration against production

Only if you truly need to (e.g., you added a data-only migration and
don't want to trigger a full build):

```bash
vercel env pull .env.production.local
export DATABASE_URI=$(grep DATABASE_URI .env.production.local | cut -d'=' -f2- | tr -d '"')

pnpm payload migrate
```

Do this from a branch that's in sync with `main`. Do it during a low-traffic
window.

### Undoing a migration

Payload migrations have `down()` functions. To roll back the most recent:

```bash
pnpm payload migrate:down
```

**Warning:** `down()` migrations are best-effort. They can lose data
(e.g., dropping a column). Never run `down` in production without a
fresh backup and a very clear head.

---

## Media (R2) operations

### Listing bucket contents

```bash
# Using the AWS CLI configured with R2 creds
aws s3 ls s3://jsk-media/ \
  --endpoint-url=https://<account-id>.r2.cloudflarestorage.com
```

Or use Cloudflare dashboard → **R2** → your bucket → **Objects**.

### Bulk-uploading legacy media

If a big content dump lands (e.g., an entire product photoshoot),
easiest path is:

1. Upload via Payload admin (`/admin → Media`) — one at a time. Slow.
2. Or upload directly to R2 via `aws s3 sync`, then create Media docs
   pointing at them via a one-shot script. Faster but bypasses
   Payload's alt-text prompt.

### Emergency: R2 is down

Cloudflare R2 is highly available; outages are rare but happen. If it
does:

- Images on the site will 404 or 5xx.
- The site itself keeps serving (HTML renders fine).
- Wait it out — Cloudflare's status page usually resolves within an hour.

There's no failover configured. If R2 outages become a recurring
problem, mirror the bucket to another S3-compatible provider and
update `S3_ENDPOINT`.

### R2 → local sync (for backup / local dev)

```bash
aws s3 sync s3://jsk-media/ ./r2-backup/ \
  --endpoint-url=https://<account-id>.r2.cloudflarestorage.com
```

Consider running this monthly to a separate location. Cloudflare's
durability is great but "durable" ≠ "immune to your team accidentally
deleting the bucket."

---

## Secret rotation

General pattern: **generate new → deploy → verify → revoke old.**
Never revoke old before verifying new.

### `PAYLOAD_SECRET`

```bash
openssl rand -base64 48
```

1. Vercel dashboard → **Settings → Environment Variables**.
2. Edit `PAYLOAD_SECRET`, paste new value, save.
3. Redeploy production.
4. Log into `/admin` — you'll be logged out; log back in.
5. Verify all admins can log in.

Impact: everyone logged out. Schedule off-hours.

### Postgres password

Depends on provider. Neon example:

1. Neon console → **Roles → default** → **Reset password**.
2. Copy the new connection string.
3. Vercel dashboard → update `DATABASE_URI`.
4. Redeploy.
5. Verify site loads, admin logs in, forms submit.

**Zero-downtime option:** create a second Postgres role with the same
permissions, update Vercel to use it, redeploy, then delete the old
role.

### R2 API keys

1. Cloudflare → **R2 → Manage API Tokens** → **Create API Token**
   with same scope as existing (`Object Read & Write` on `jsk-media`).
2. Copy the new Access Key ID + Secret.
3. Vercel dashboard → update `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY`.
4. Redeploy.
5. Verify: upload a test image via `/admin → Media`.
6. Cloudflare → revoke the old token.

### `RESEND_API_KEY`

1. Resend dashboard → **API Keys** → **Create API Key**.
2. Update in Vercel, redeploy.
3. Test: submit a Contact form on the live site, confirm email arrives.
4. Delete the old key in Resend.

---

## Monitoring & alerting

### What's monitored today

Baseline (assumed) — verify each after handover:

- **Vercel dashboard** — build status, function errors, bandwidth.
- **Cloudflare R2 dashboard** — storage usage, request counts.
- **Postgres provider dashboard** — connection count, storage, query stats.

### What's *not* monitored (add these)

- **Uptime pings** — set up Better Stack, UptimeRobot, or Cronitor
  to hit `https://jskindia.in/en` every 1–5 minutes and alert if it 5xx's.
- **Error tracking** — Sentry integration in the Next app would catch
  server-side crashes and unhandled rejections.
- **Log aggregation** — Vercel keeps 1 day of logs on Hobby, 7 days on
  Pro. If you need longer retention, ship logs to Axiom / Logtail /
  Datadog.

### Recommended alert routing

- **Critical (site down):** SMS + phone call to on-call.
- **Warning (elevated errors):** Slack channel.
- **Info (deploy notifications):** Slack channel.

---

## Incident response

### Severity tiers

- **SEV-1** — site down, data loss, or breach.
- **SEV-2** — degraded functionality (forms broken, admin unreachable).
- **SEV-3** — minor bug affecting some users.

### SEV-1 playbook

1. **Acknowledge** in your team channel within 5 minutes. Assign an
   incident lead.
2. **Assess** — what's broken, what's the blast radius?
3. **Rollback first, investigate later.** Use Vercel instant rollback
   (see [Rollback](#rollback)) to restore service.
4. **Communicate** — post a public status update if the outage is
   visible.
5. **Preserve evidence** — snapshot logs, DB state, HTTP requests. Do
   NOT delete anything until the post-mortem is written.
6. **Fix on a branch, PR, deploy** — never hotfix directly on `main`
   without a review, even under pressure.
7. **Post-mortem** — within 5 business days. Blameless. Include:
   timeline, root cause, contributing factors, action items with
   owners and deadlines.

### If it's a breach (SEV-1 + security)

Follow the SEV-1 playbook AND:

1. Rotate **all** secrets (see [Secret rotation](#secret-rotation)).
2. Force-logout all admin users by rotating `PAYLOAD_SECRET`.
3. Audit the `users` collection for accounts you don't recognize.
4. Audit form-submission collections for exfiltration.
5. Check Vercel + Cloudflare + DB provider audit logs for the incident window.
6. Notify affected users if their submitted data was accessed. Comply
   with local data-protection law (GDPR, DPDP Act, etc.) for
   notification timelines.

---

## Common maintenance tasks

### Add a new admin user

Log into `/admin` as super-admin → **Users → Create New**. Set role
appropriately (start with `editor` unless they need more).

### Remove an admin user (offboarding)

Log into `/admin` → **Users** → find them → **Delete** (or downgrade
role to `contributor` if you want to preserve authorship history).

### Change the site's default language

Edit `defaultLocale` in `src/lib/i18n.ts`. Deploy. The middleware will
now redirect `/` to the new default.

### Add a new locale

See [`ARCHITECTURE.md`](../ARCHITECTURE.md#adding-a-new-locale-is-a-schema-change).

### Bulk-export form submissions

1. `/admin → Enquiries` (or Contact Messages / Job Applications).
2. Currently no built-in CSV export — either:
   - Copy from the list view, paste into Sheets.
   - Or run a one-off script using `getPayload().find({ collection: 'enquiries' })`.

If this becomes frequent, add a CSV export endpoint (small server action).

### Reindex sitemap

Sitemap is generated on the fly by `src/app/sitemap.ts` — no reindexing
needed. Just make sure new dynamic pages (e.g., new product slugs) are
included in the sitemap logic.

### Purge Vercel edge cache

Vercel dashboard → **Deployments** → current deploy → **⋯ → Purge Cache**.

---

## Disaster recovery

Worst-case scenarios and how to survive them.

### The entire Vercel account is compromised or deleted

1. New Vercel account/team.
2. Connect it to the GitHub repo — new project.
3. Set all env vars (from your team password manager — you *did* store
   them there, right?).
4. Deploy. Vercel builds from `main`, runs migrations against the
   existing DB, media in R2 is untouched.
5. Update DNS at the registrar to point at the new Vercel project.
6. Done. Downtime measured in hours (mostly DNS propagation).

### The Postgres provider explodes and loses everything

1. Provision a new Postgres (any Postgres 14+ provider).
2. Restore from your most recent off-provider `pg_dump` (you *did* take
   one, right?).
3. Update Vercel `DATABASE_URI`, redeploy.
4. Estimated downtime: 30 min — 2 hrs.
5. **Data loss window** = time since last backup. If you rely purely on
   provider PITR and the provider is gone, you're at zero. This is why
   the runbook recommends periodic off-provider `pg_dump`s.

### R2 bucket is deleted

If bucket versioning was enabled: restore versions. If not: sad face.

1. Recreate the bucket.
2. Restore from your R2 → local sync backup (see
   [Media (R2) operations](#media-r2-operations)).
3. In the worst case, `Media` records will point to missing files.
   Site works but shows broken images until you re-upload.

### The GitHub repo is deleted

You have local clones. Push one to a new remote. Set up GitHub webhook
to Vercel again. Move on.

**Lesson:** the source of truth for **content** is Postgres. The source
of truth for **media** is R2. The source of truth for **code** is git
(distributed by nature). Keep backups of the first two off-provider and
you're resilient.
