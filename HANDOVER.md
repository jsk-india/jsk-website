# Ownership Handover Checklist

> This is the "you own this now" document. Work through every item, tick
> the boxes, and don't skip anything — the annoying half-hour of admin
> today saves the 3am panic later.

Assume nothing is transferred until it's ticked. If you hit an item you
can't complete, open an issue and ping the previous owner before the
handover window closes.

---

## Contact for handover questions

- **Previous owner:** Aditya Koukuntla (see git log for email)
- **Handover window:** _fill in agreed dates_
- **Escalation:** _fill in escalation contact_

---

## 1. Source code & Git

- [ ] Added as **Owner** or **Admin** on the GitHub repo
      (`github.com/adityakoukuntla25/jsk-website`).
- [ ] Repo transferred to your GitHub org, OR you're comfortable with it
      staying on the previous owner's account with you as admin.
      (Transfer via **Settings → General → Transfer ownership**.)
- [ ] Old owner's personal access tokens revoked.
- [ ] Branch protection rules reviewed on `main`:
      - Require PR before merge?
      - Require passing CI checks?
      - Require code review?
- [ ] `CODEOWNERS` file updated with your team's GitHub handles.
- [ ] Webhooks reviewed (Vercel is the main one — should stay).
- [ ] Deploy keys / SSH keys audited under **Settings → Deploy keys**.

## 2. Hosting — Vercel

- [ ] Vercel project transferred to your team/org.
      (Vercel → **Project → Settings → Advanced → Transfer Project**.)
- [ ] You have at least two people with **Owner** role on the Vercel team.
- [ ] Billing card is now on your team's account, not the previous owner's.
- [ ] All **Environment Variables** copied over (verify via
      `vercel env pull .env.production.local` and diff against the list
      in [`README.md`](./README.md)).
- [ ] Custom domains show as **Verified** in Vercel.
- [ ] Old owner's Vercel account removed from the project.
- [ ] Analytics + Speed Insights subscriptions moved (if paid).

## 3. Database — Postgres

_Provider: Vercel Postgres / Neon / Supabase — fill in yours._

- [ ] Provider account access transferred (add your team, remove old owner).
- [ ] Billing card updated.
- [ ] Connection string in Vercel matches what's live in the provider dashboard.
- [ ] **Backup schedule verified.** Confirm point-in-time recovery
      window (typically 7 days on Neon free / 30 days on paid).
- [ ] Test a restore into a scratch database — see
      [`docs/OPERATIONS.md`](./docs/OPERATIONS.md#database-backup--restore).
- [ ] Read-only replica credentials (if any) rotated.
- [ ] Off-provider `pg_dump` backups configured — see
      [`docs/BACKUPS.md`](./docs/BACKUPS.md) for one-time setup
      (dedicated R2 bucket + scoped API token + 5 GitHub secrets).
- [ ] Ran the DB Backup workflow manually once to confirm end-to-end.

## 4. Media storage — Cloudflare R2

- [ ] Cloudflare account transferred, OR you've been added as an
      Administrator member.
- [ ] Billing card updated.
- [ ] R2 bucket `jsk-media` is accessible; you can list objects.
- [ ] **R2 API tokens rotated.** Generate new keys, update in Vercel env
      vars, redeploy, confirm images load, revoke old keys.
- [ ] Bucket public-read policy verified (images should load without auth).
- [ ] Bucket versioning / lifecycle rules reviewed.
- [ ] Custom domain for R2 (if any, e.g. `media.jskindia.in`) — DNS
      still pointing to R2.

## 5. DNS & Domain

- [ ] Registrar login (GoDaddy / Namecheap / etc.) — access transferred.
- [ ] Domain auto-renewal enabled, payment method updated.
- [ ] Domain expiry date noted: _fill in_ — set a calendar reminder for
      30 days before.
- [ ] Cloudflare (if used as DNS) — you have Super Admin.
- [ ] All DNS records inventoried:
      - [ ] Apex `A` / `ALIAS` → Vercel
      - [ ] `www` → Vercel (or redirect)
      - [ ] `MX` records for email
      - [ ] `TXT` for SPF/DKIM/DMARC
      - [ ] Any subdomains (`admin.`, `media.`, `staging.`)
- [ ] SSL certs — Vercel handles auto-renew; nothing to do, but confirm
      cert is valid on all listed subdomains.

## 6. Email

- [ ] Transactional email provider (Resend / SendGrid / Postmark) —
      account transferred, `RESEND_API_KEY` rotated.
- [ ] Sending domain verified (DKIM/SPF) — check provider dashboard.
- [ ] Test email sent from Contact + Enquiry forms end-to-end.
- [ ] Alias inboxes (`contact@jskindia.in`, `hr@jskindia.in`,
      `investors@jskindia.in`) — forwarding rules audited.

## 7. Admin (CMS) users

- [ ] At least **two** super-admin accounts exist in `/admin`.
- [ ] Old owner's admin account removed OR downgraded to `editor`.
- [ ] Content team accounts audited — each real human has their own login
      (no shared accounts).
- [ ] Password reset flow tested (make sure email delivery works).
- [ ] `PAYLOAD_SECRET` — decide whether to rotate.
      Rotating logs everyone out but is otherwise safe. Recommended if
      the previous team ever exported it locally.

## 8. Third-party services

Check each of these and either take ownership or unwire:

- [ ] **Google Analytics / GA4** — property transferred, admin access granted.
- [ ] **Google Search Console** — verified owner access.
- [ ] **Plausible** (if used) — team ownership transferred.
- [ ] **Sentry / error monitoring** (if any) — access transferred.
- [ ] **Uptime monitoring** (Better Stack / UptimeRobot / etc.) —
      access transferred, alert destinations updated to your team's Slack/email.
- [ ] **Any other API keys** in `.env` — audit and rotate.

## 9. Documentation you now own

Located in this repo — read each once, then keep them updated:

- [ ] [`README.md`](./README.md) — the intro & quickstart
- [ ] [`ARCHITECTURE.md`](./ARCHITECTURE.md) — the "why"
- [ ] [`CONTRIBUTING.md`](./CONTRIBUTING.md) — how to submit changes
- [ ] [`SECURITY.md`](./SECURITY.md) — vulnerability reporting & rotation policy
- [ ] [`CHANGELOG.md`](./CHANGELOG.md) — what shipped when
- [ ] [`docs/OPERATIONS.md`](./docs/OPERATIONS.md) — runbook
- [ ] [`docs/ADMIN_GUIDE.md`](./docs/ADMIN_GUIDE.md) — for the content team
- [ ] [`docs/TROUBLESHOOTING.md`](./docs/TROUBLESHOOTING.md) — common issues

## 10. First-week smoke tests

Do these on **day one** of ownership — before you promise anyone SLAs:

- [ ] Clone the repo fresh on a new machine, follow README, get it
      running locally end-to-end. Any friction? Update the README.
- [ ] Log into `/admin`, edit one word on the home page, save, verify it
      updates on the live site.
- [ ] Submit the Contact form on the live site with a test message,
      confirm it appears in `/admin → Contact Messages` and email arrives.
- [ ] Submit an Enquiry, Job Application — same drill.
- [ ] Trigger a manual redeploy from Vercel dashboard — should succeed.
- [ ] Open an old preview URL — should either work or 404 cleanly.
- [ ] Test the rollback procedure in
      [`docs/OPERATIONS.md`](./docs/OPERATIONS.md) on a preview deploy.
- [ ] Read the last 20 commits (`git log --oneline -20`) to get a feel
      for the pace and style of work.

## 11. Credentials vault

Recommended: store all of these in a **team password manager** (1Password,
Bitwarden, Vaultwarden). Never in Slack, never in email, never in a
Google Doc.

Items to store:

- GitHub org owner recovery codes
- Vercel team recovery codes
- Cloudflare 2FA backup codes
- Domain registrar login + 2FA backup
- Postgres connection string (production)
- R2 access keys (production)
- `PAYLOAD_SECRET`
- `RESEND_API_KEY` (or equivalent)
- Any GA4 / Search Console recovery info

## 12. Sign-off

- [ ] All checkboxes above are ticked or explicitly waived (with reason
      documented below).
- [ ] Both parties have signed off in writing (email or PR comment).

**Handover completed on:** _fill date_
**New owner:** _fill name_
**Signed off by previous owner:** _fill name_

Waived items (with rationale):

- _(none)_
