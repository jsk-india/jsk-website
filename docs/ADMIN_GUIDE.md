# Admin Guide (for the Content Team)

This guide is for the **marketing, content, HR, and investor-relations
folks** who use `/admin` to manage the site. No coding knowledge
required.

If something in this guide is confusing, tell an engineer — the guide
should get better, not the reader smarter.

---

## Getting in

- URL: **https://jskindia.in/admin**
- Log in with the email + password given to you by your super-admin.
- If you forgot your password: click **Forgot password** — you'll get a
  reset email. If email doesn't arrive within a few minutes, ask a
  super-admin to reset it for you from the Users list.

**Security basics:**

- Never share your login.
- Use a password manager. Use a long, unique password.
- Log out on shared/public computers.

---

## The admin layout (a 30-second tour)

- **Left sidebar** — everything you can edit, grouped:
  - **Collections** (many-of items): Products, News Articles, Job Openings, etc.
  - **Globals** (one-of items): Site Settings, Navigation, Footer, Home Content, Page Content, Forms.
- **Top bar** — language switcher (English / Hindi / Telugu / Tamil),
  your user menu.
- **Main area** — whatever you're editing.

Green pill = published. Grey pill = draft. Some collections
(News, Stories, Products, Verticals) support drafts; others don't.

---

## The mental model

- **Collections** = things you have *many* of. Each product is a row.
  Each news article is a row. Job openings, one per row.
- **Globals** = things you have *one* of. There's only one Home Content,
  one Site Settings, one Footer.

Both are editable. Both are localized (see below).

---

## Multilingual editing

Every localized field has a **language pill** at the top of the field.

- Switch language using the **language switcher** in the top-right of the admin.
- The page reloads showing that language's version of every field.
- **Save each language separately.** Editing in English then switching
  to Hindi does NOT auto-save your English changes.

**Fallback behaviour on the public site:**

- If Hindi is missing, the site falls back to English.
- If English is missing too, the site shows whatever default the
  developer coded in (usually reasonable text).

**Best practice:** always fill English first, then translate. If a
translation isn't ready, leave it blank — English will show instead.

---

## Common tasks

### Update copy on the home page

1. Sidebar → **Globals → Home Content**.
2. Edit whatever you need.
3. Click **Save** (top right).
4. Refresh the live site to verify.

### Change the header or footer navigation

1. Sidebar → **Globals → Navigation** (or **Footer**).
2. Reorder, add, or remove links.
3. Each link needs a **label** (visible text) and **href** (URL).
4. Internal links: use `/about`, `/careers`, etc. (no domain).
5. External links: full `https://…`.
6. Save.

### Add a new news article

1. Sidebar → **Collections → News Articles → Create New**.
2. Fill in title, slug (auto-generates from title), body, hero image, published date.
3. **Status: Published** to make it live. **Status: Draft** to save
   without publishing.
4. Save.

The article will appear at `/en/news/<slug>` and in the news listing.

### Add a job opening

1. Sidebar → **Job Openings → Create New**.
2. Fill in the role details.
3. Save. Appears on `/en/careers`.

Applications submitted via the site land in **Job Applications**
collection (see below).

### View form submissions (Contact, Enquiry, Job)

1. Sidebar:
   - **Contact Messages** — from the Contact form.
   - **Enquiries** — from the Enquiry form.
   - **Job Applications** — from the Careers apply form.
2. Click a submission to see the details.
3. These are **read-only for editors** (nobody can edit what someone
   else submitted — data integrity).

**Export:** currently no one-click CSV export. Ping engineering if you
need one — it's a quick script.

### Upload an image

Two ways:

- **Directly:** Sidebar → **Media → Create New** → upload → save.
  Now available for insertion elsewhere.
- **Inline:** Most fields that accept an image let you upload on the
  spot. Look for the **Upload** or **Select Media** button.

**Image tips:**

- Provide meaningful **alt text** — accessibility + SEO.
- Prefer **WebP or high-quality JPG** at reasonable dimensions
  (< 2000px wide is plenty for hero images).
- Files > 5 MB will be slow to upload; compress with
  [Squoosh](https://squoosh.app) first.

### Update product info

1. Sidebar → **Products** → find the product → edit → save.
2. To add a new product: **Create New**. Set the category
   (Conductors, Wire Rods, Wires, Trading).
3. Set **Status: Published** to make it live.

### Update leadership / plant / client info

Same pattern:

1. Sidebar → **Persons** (leadership) / **Plants** / **Clients**.
2. Edit or create.
3. Save.

### Add an investor document (annual return, filing)

1. Sidebar → **Investor Documents → Create New**.
2. Upload the PDF as the file.
3. Set category (Annual Return, Filing, etc.) and financial year.
4. Save. Appears on `/en/investors`.

### Update form labels / placeholders

Yes, even the words like "Your name" and "Submit" are editable.

1. Sidebar → **Globals → Forms**.
2. Edit label / placeholder text (per language).
3. Save.

---

## Publishing workflow (for content with drafts)

Applies to **News, Stories, Products, Verticals**:

1. Edit content, set **Status: Draft** to save privately.
2. Preview isn't wired up as a per-doc preview yet — if you want to see
   a draft on the site, temporarily flip to Published, look, flip back.
   (Not ideal — ping engineering if you want proper draft preview.)
3. When ready: **Status: Published**, Save. Live within seconds.

---

## Rich text editor tips

The body fields use a rich text editor (Lexical). Basics:

- **Bold / Italic / Underline** — standard shortcuts (Cmd/Ctrl + B/I/U).
- **Headings** — dropdown or Markdown-style: type `## ` at the start of a line.
- **Links** — select text → link button → paste URL.
- **Lists** — the bullet / numbered list buttons.
- **Images** — the image button; either upload or pick from Media.

**Pasting from Word / Google Docs:** paste **as plain text** (Cmd/Ctrl +
Shift + V) to avoid dragging in weird formatting. Then format inside
the editor.

---

## Language switcher — a warning

When you switch the language in the top-right, **any unsaved edits are
lost.** Always save first, then switch.

---

## Roles — what can I do?

Ask your super-admin what your role is. Rough guide:

| Role          | Can edit content | Can manage users | Can change site settings |
| ------------- | ---------------- | ---------------- | ------------------------ |
| Contributor   | Some (drafts)    | No               | No                       |
| Editor        | Yes              | No               | Limited                  |
| Admin         | Yes              | Yes              | Yes                      |
| Super Admin   | Yes              | Yes + roles      | Yes                      |

If a button is greyed out, that's your role's access control at work —
not a bug. Ask a super-admin if you think you need more access.

---

## Things you should NOT touch (and why)

- **Users → role field** — only super-admins can change this. Doing it
  wrong could lock people out.
- **Migrations** — you won't see these in the admin, but if an
  engineer mentions them, don't ask to run them from a spreadsheet.
- **Media files that are referenced elsewhere** — if you delete a
  photo that's used in a product page, the product page will show a
  broken image. When in doubt, replace instead of delete.
- **Site Settings → domain / URL fields** — these feed into SEO tags.
  Wrong values = broken canonical URLs = SEO regression.

---

## What to do when...

### ...I edited something and it's not showing on the live site

1. Did you **save**?
2. Did you save in the **right language**? Switch the language switcher
   and check.
3. Is the item's **status** set to Published?
4. Hard-refresh your browser (Cmd/Ctrl + Shift + R). CDN caches for a
   couple of minutes sometimes.
5. Still not showing? Ping engineering with the exact URL and the field
   you edited.

### ...I accidentally deleted something

Payload doesn't have a built-in "trash / restore" UI. But:

- The database has backups (see [`OPERATIONS.md`](./OPERATIONS.md#database-backup--restore)).
- Ping an engineer within a few hours — they can restore from backup.
- The sooner you tell them, the easier the restore.

### ...the admin is really slow or won't load

- Try a hard refresh (Cmd/Ctrl + Shift + R).
- Try a different browser (Chrome / Firefox / Safari).
- Try incognito mode.
- Check your internet.
- Still bad? Ping engineering. Could be a Vercel / Postgres blip.

### ...I can't log in

- Wrong password? Use **Forgot password**.
- Account disabled? Ask your super-admin.
- Getting a 500 error? Screenshot it and ping engineering.

---

## Who to ask for what

- **"How do I edit X?"** — this guide first, then ping the person who
  onboarded you.
- **"I need a new content type / new page"** — engineering.
- **"I need to bulk-import 200 items"** — engineering (they'll write a
  script).
- **"Something's broken"** — engineering, with a screenshot + the URL.
- **"I need admin access for a new hire"** — your super-admin.

---

## Cheatsheet — the fastest path to common changes

| I want to change...                    | Where to go                                 |
| -------------------------------------- | ------------------------------------------- |
| Home page hero copy                    | Globals → Home Content                      |
| Header menu                            | Globals → Navigation                        |
| Footer menu / copyright                | Globals → Footer                            |
| Site name / logo / socials             | Globals → Site Settings                     |
| Copy on About / Clients / Careers page | Globals → Page Content                      |
| Form field labels / placeholders       | Globals → Forms                             |
| Add a product                          | Collections → Products → Create New         |
| Add a news article                     | Collections → News Articles → Create New    |
| Add a job opening                      | Collections → Job Openings → Create New     |
| Add a client logo                      | Collections → Clients → Create New          |
| Add a certification                    | Collections → Certifications → Create New   |
| Add an investor doc                    | Collections → Investor Documents → Create New |
| View contact form submissions          | Collections → Contact Messages              |
| View enquiries                         | Collections → Enquiries                     |
| View job applications                  | Collections → Job Applications              |
| Add a new admin user (super-admin only)| Collections → Users → Create New            |

That's it. Good luck, and don't be afraid to click around — you can't
break anything by *looking*.
