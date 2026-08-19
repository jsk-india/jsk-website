# Security Policy

## Reporting a vulnerability

If you believe you've found a security issue in this codebase or in the
deployed jskindia.in site, **do not open a public GitHub issue**.

Instead, email: **security@jskindia.in** (or the currently-designated
security contact — see the ownership listed at the top of
[`HANDOVER.md`](./HANDOVER.md)).

Please include:

- A clear description of the issue and the potential impact.
- Steps to reproduce (a proof-of-concept URL, request, or code snippet).
- Your contact info so we can acknowledge and follow up.

**Response SLA (target):**

- Acknowledge receipt within **2 business days**.
- Initial triage within **5 business days**.
- Coordinated disclosure timeline agreed within **14 days**.

We appreciate coordinated disclosure and will credit you in the release
notes if you'd like.

---

## Supported versions

Only the **currently deployed `main` branch** is supported. There are no
maintenance branches. If a security fix requires a migration or breaking
change, we ship it as fast as prudent testing allows.

---

## Threat model (short version)

The site is a **public marketing site** with an authenticated
`/admin` panel used by a small internal team. Notable trust boundaries:

- **Public → Frontend pages** — read-only, no user input beyond form
  submissions.
- **Public → Form submissions** — via Next.js server actions, written
  into write-only collections. Not readable by public.
- **Admins → `/admin`** — full CRUD on all collections/globals, gated
  by Payload's session cookies.
- **Admins → Payload REST/GraphQL API** at `/api/*` — same auth as `/admin`.

Assumed trusted:

- Vercel infrastructure and env-var storage.
- Postgres provider (Neon / Vercel Postgres / Supabase).
- Cloudflare R2 for uploaded media.
- The people you gave admin passwords to.

---

## Secret management

### The secrets we hold

| Secret                    | Where it lives                              | Blast radius                       |
| ------------------------- | ------------------------------------------- | ---------------------------------- |
| `PAYLOAD_SECRET`          | Vercel env vars                             | JWT forgery → admin takeover       |
| `DATABASE_URI`            | Vercel env vars                             | Full DB read/write                 |
| `S3_ACCESS_KEY_ID/SECRET` | Vercel env vars                             | R2 bucket read/write               |
| `RESEND_API_KEY`          | Vercel env vars                             | Can send email as our domain       |
| Admin user passwords      | Argon2 hashes in Postgres                   | Per-account admin access           |
| GitHub / Vercel / etc.    | Personal / team accounts                    | Depends on scope                   |

### Rotation cadence

| Secret               | Rotate when                                   | Recommended max age |
| -------------------- | --------------------------------------------- | ------------------- |
| `PAYLOAD_SECRET`     | Team member with prod access leaves; suspected leak | 12 months          |
| Postgres password    | Provider prompts; suspected leak              | 12 months           |
| R2 API keys          | Team member with prod access leaves; suspected leak | 6 months           |
| `RESEND_API_KEY`     | Team member with prod access leaves; suspected leak | 12 months          |
| Admin user passwords | New account, suspected phishing               | On demand           |

### How to rotate (in general)

For every secret managed via Vercel env vars, the pattern is the same:

1. Generate a **new** value in the upstream provider (R2, Resend, Postgres, etc.).
2. Add the new value to Vercel as a **second** env var (or update in place).
3. Trigger a redeploy.
4. Verify the new deploy is healthy (see smoke tests in
   [`docs/OPERATIONS.md`](./docs/OPERATIONS.md)).
5. Revoke the **old** value at the upstream provider.

See [`docs/OPERATIONS.md`](./docs/OPERATIONS.md#secret-rotation) for
step-by-step rotation procedures per service.

### Rotating `PAYLOAD_SECRET`

Special case — this signs admin JWTs. When you rotate it, **all admin
users are logged out**. They can log back in immediately. Not a big
deal for a small team; schedule it outside a busy content-editing window.

---

## Access control

### GitHub

- Only members of the current team have write access.
- `main` branch has protection: PR required, CI must pass.
- No personal access tokens with `repo` scope stored anywhere the team
  can't audit.

### Vercel

- At least two members with **Owner** role. No single point of failure.
- Everyone else: **Member** role.
- Ex-team-members removed within 24 hours of departure.

### Payload admin (`/admin`)

- Every real person has their own account. **No shared logins.**
- Roles (from `src/collections/Users.ts`):
  - `super_admin` — full access, can change roles.
  - `admin` — full CRUD on content.
  - `editor` — CRUD on most content, no user management.
  - `contributor` — limited (draft-only where applicable).
- Off-boarding: change ex-member's role to `contributor` or delete the
  account.

### Database

- Direct DB access is **admin-only** and used sparingly. Prefer
  Payload admin or migrations.
- If someone needs read-only DB access for debugging, use a
  provider-provided read-only role, not the main app credentials.

### R2 bucket

- Write access: only via the S3 keys stored in Vercel env vars.
- Read access: **public** for `jsk-media` (images must load in browsers
  without auth). This is intentional and low-risk — the bucket contains
  marketing images.
- Don't upload anything sensitive to `jsk-media`. If you need a
  private bucket, create a new one.

---

## Known safe-by-design decisions

- **Admin `/admin` route is not obscured.** Payload's admin panel lives
  at the well-known `/admin` path. Obscurity isn't security; use strong
  passwords + eventually 2FA if Payload adds it.
- **No public sign-up.** The `users` collection has no public create
  endpoint. New admins must be invited by a super-admin from `/admin`.
- **Server actions for forms.** CSRF-safe by default in Next.js;
  avoids exposing form-submit endpoints as public API.
- **Payload REST API respects collection access control.** Public GET
  is only allowed on collections that render on the public site.

---

## Known limitations / TODOs

- **No WAF beyond Vercel's built-in.** Consider Cloudflare in front of
  Vercel if abuse becomes a problem.
- **No 2FA for `/admin`** (Payload doesn't ship it as of writing).
  Compensating control: strong passwords + audit `users` collection
  regularly.
- **No rate limiting on form submissions** beyond Vercel's platform
  defaults. If spam becomes an issue, add reCAPTCHA/Turnstile.
- **No formal audit log.** Payload emits some events but they're not
  persisted long-term. Consider wiring Sentry breadcrumbs or a dedicated
  audit collection if compliance requires it.

---

## Incident response

If something goes wrong (data leak, suspicious admin activity,
defacement):

1. **Contain:** rotate all secrets listed above (start with `PAYLOAD_SECRET`
   and DB password).
2. **Preserve:** snapshot the current DB before making any changes.
   `pg_dump` or a provider PITR restore point.
3. **Investigate:** check Vercel deploy logs, Payload access logs (if
   enabled), R2 access logs, DB query logs.
4. **Communicate:** notify affected users (form submitters, if their
   data was accessed). Notify data-protection authorities if legally
   required in your jurisdiction.
5. **Post-mortem:** write a blameless post-mortem, add checks to
   prevent recurrence.

Full incident runbook lives in
[`docs/OPERATIONS.md`](./docs/OPERATIONS.md#incident-response).
