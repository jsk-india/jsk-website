# Database Backups

Off-provider `pg_dump` backups of the production Postgres, run on a
schedule via GitHub Actions and stored in Cloudflare R2.

**Workflow file:** [`.github/workflows/db-backup.yml`](../.github/workflows/db-backup.yml)

---

## Why this exists

Our Postgres provider (Neon / Vercel Postgres / Supabase — whichever
you're on) already offers **point-in-time recovery (PITR)** for the last
7–30 days depending on plan. That's the primary backup.

This system is the **secondary, off-provider backup**. It exists for the
scenarios PITR can't rescue you from:

- The provider itself has a catastrophic incident.
- Someone (with the right creds) accidentally deletes the entire project.
- The provider changes pricing / T&Cs and you need to migrate off in a hurry.
- You want to spin up a scratch DB from prod data for testing.

Rule of thumb: **if all your backups live at the same vendor, you don't
have backups. You have hope.**

---

## What it does

Every month (03:00 UTC on the 1st), a GitHub Actions workflow:

1. Installs the PostgreSQL 16 client on an Ubuntu runner.
2. Runs `pg_dump` against the production DB, `--format=custom --compress=9`.
3. Uploads the dump to `s3://<bucket>/db-backups/jsk-<timestamp>.dump` on R2.
4. Prunes anything older than the 12 most recent backups.

You can also trigger it manually from the **Actions tab → DB Backup →
Run workflow**.

---

## One-time setup

You need to do these steps once (per environment). It's ~15 minutes.

### 1. Create a dedicated R2 bucket for backups

**Do not** reuse the `jsk-media` bucket. Backups need to be private and
have a different blast radius.

1. Cloudflare dashboard → **R2 → Create bucket**.
2. Name: `jsk-db-backups` (or whatever — record it in step 4 below).
3. Location: **Automatic** (default).
4. **Do not** enable public access. Leave it private.
5. (Optional but recommended) **Object Lifecycle Rules** → add a rule to
   permanently delete anything older than 400 days. Belt-and-suspenders
   with the workflow's own retention.

### 2. Create a scoped R2 API token

Never reuse the app's `S3_ACCESS_KEY_ID` for backups — the app's token
can read/write the media bucket. The backup token should only touch the
backup bucket.

1. Cloudflare → **R2 → Manage API Tokens → Create API Token**.
2. **Permission:** Object Read & Write.
3. **Specify buckets:** just `jsk-db-backups`.
4. **TTL:** none (long-lived — rotate manually per SECURITY.md cadence).
5. Copy the **Access Key ID**, **Secret Access Key**, and
   **Jurisdiction-specific endpoint** (looks like
   `https://<account-id>.r2.cloudflarestorage.com`).

### 3. Get a read-only-ish DB connection string

For maximum safety, `pg_dump` should connect as a **read-only** Postgres
role. On Neon:

1. Neon console → **Roles → New Role** → name it `backup_reader`.
2. Grant it `pg_read_all_data` (Neon: **Set role permissions**).
3. Copy the connection string for that role.

Alternatively, use the primary connection string. It works, it's just
overprivileged for a read-only operation.

### 4. Add the secrets to GitHub

GitHub → repo → **Settings → Secrets and variables → Actions → New
repository secret**. Add these five:

| Secret name                     | Value                                                     |
| ------------------------------- | --------------------------------------------------------- |
| `BACKUP_DATABASE_URI`           | `postgresql://backup_reader:...@host/dbname?sslmode=require` |
| `BACKUP_R2_BUCKET`              | `jsk-db-backups`                                          |
| `BACKUP_R2_ENDPOINT`            | `https://<account-id>.r2.cloudflarestorage.com`           |
| `BACKUP_R2_ACCESS_KEY_ID`       | (from step 2)                                             |
| `BACKUP_R2_SECRET_ACCESS_KEY`   | (from step 2)                                             |

### 5. Verify

- GitHub → **Actions → DB Backup → Run workflow → Run workflow** (on `main`).
- Wait 2–5 minutes.
- Check the run: all steps green, the summary shows a filename + size.
- Cloudflare R2 dashboard → `jsk-db-backups` → `db-backups/` — the file is there.

Done. The schedule will now fire on the 1st of every month.

---

## How to restore from a backup

### Download a backup

Two paths:

**Cloudflare dashboard (easy):** R2 → `jsk-db-backups` → `db-backups/`
→ click the backup → **Download**.

**AWS CLI (scriptable):**

```bash
aws s3 cp "s3://jsk-db-backups/db-backups/jsk-20260819T030000Z.dump" ./ \
  --endpoint-url="https://<account-id>.r2.cloudflarestorage.com"
```

(Configure the CLI with the backup credentials first via
`aws configure` or env vars.)

### Restore into a scratch database

**Do not restore over production.** Always into a fresh DB.

1. Provision a new empty Postgres — on the same provider (Neon: create a
   new branch) or a totally different one for a real DR drill.
2. Get its connection string as `$SCRATCH_DB_URI`.
3. Restore:

   ```bash
   pg_restore \
     --no-owner --no-acl \
     --dbname="$SCRATCH_DB_URI" \
     jsk-20260819T030000Z.dump
   ```

4. Verify:

   ```bash
   psql "$SCRATCH_DB_URI" -c "SELECT COUNT(*) FROM products;"
   psql "$SCRATCH_DB_URI" -c "SELECT COUNT(*) FROM enquiries;"
   ```

5. If you're using this to **replace** production (real disaster
   scenario), update the `DATABASE_URI` env var in Vercel and redeploy.
   Full flow in [`OPERATIONS.md → Disaster recovery`](./OPERATIONS.md#disaster-recovery).

---

## Costs

Rounding generously:

- **GitHub Actions:** 1 run/month × ~3 min = ~3 min/month. Free tier
  gives you 2,000 min/month on private repos. Effective cost: **$0**.
- **R2 storage:** 12 backups × ~50 MB (compressed) = ~600 MB. R2's free
  tier gives you 10 GB. Effective cost: **$0**.
- **R2 egress:** free (that's the whole point of R2).

If the DB grows to gigabytes, revisit — but you'll still be well within
free tiers.

---

## What's NOT backed up

**Media files in the `jsk-media` R2 bucket.** They're managed by
Cloudflare's own durability guarantees. If you want a belt-and-suspenders
backup of those too, either:

- Enable **R2 bucket versioning** on `jsk-media` (in Cloudflare dashboard).
- Or add a monthly `aws s3 sync s3://jsk-media/ s3://jsk-media-backup/`
  step to this same workflow. Trivial addition when you want it.

**Env vars / secrets.** These live in Vercel and your team's password
manager — not in this backup. Losing them means the app can't connect
to anything, but the *data* is safe.

**Uncommitted code.** It's git — every clone is a backup. Not this
system's job.

---

## Rotation & maintenance

- **Backup R2 credentials:** rotate every 6 months per
  [`SECURITY.md`](../SECURITY.md#rotation-cadence). Generate a new token
  scoped to `jsk-db-backups`, update the GitHub secret, delete the old
  token in Cloudflare.
- **`BACKUP_DATABASE_URI`:** rotate whenever you rotate the main DB
  password.
- **Retention:** the workflow keeps 12 backups. Change `RETENTION_COUNT`
  in `.github/workflows/db-backup.yml` if you want more/less.
- **Schedule:** the cron is `0 3 1 * *` (03:00 UTC on the 1st). Bump to
  weekly (`0 3 * * 1` = Mondays 03:00 UTC) if the site becomes
  higher-stakes.

---

## Verification checklist (do this quarterly)

Untested backups are worthless. Once a quarter:

- [ ] Actions tab shows all monthly runs succeeded.
- [ ] Latest backup exists in R2 at the expected path.
- [ ] Download the most recent backup.
- [ ] `pg_restore` it into a scratch DB.
- [ ] Run a couple of sanity queries — row counts match production
      (approximately, given the age of the backup).
- [ ] Log the drill result somewhere (a `docs/DR-DRILLS.md` file, or
      just an issue with the `ops` label).

If the restore fails for any reason, that's a **SEV-2** — the backup
system is broken and needs fixing before the next scheduled run.
