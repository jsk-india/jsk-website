<!--
Thanks for the PR! Keep it small, keep it focused, ship it fast.
See CONTRIBUTING.md for the full guide.
-->

## What & why

<!-- One or two sentences: what does this PR do, and why does it exist?
     The diff shows the "how" — you don't need to repeat it here. -->

## Screenshots / video

<!-- If this changes anything visible, drop before/after screenshots
     or a Loom link. Delete this section if it doesn't apply. -->

## Checklist

- [ ] Branch is rebased on latest `main`.
- [ ] `pnpm lint` passes locally.
- [ ] `pnpm build` succeeds locally.
- [ ] If I changed a Payload collection or global, I ran
      `pnpm payload migrate:create` and committed the migration files
      (both `.ts` and `.json`).
- [ ] `src/payload-types.ts` was regenerated if I touched collections/globals.
- [ ] If I added a new env var, I updated `.env.example`.
- [ ] If behaviour changed, I updated the relevant doc(s):
      README / ARCHITECTURE / OPERATIONS / ADMIN_GUIDE.
- [ ] I smoke-tested the Vercel preview URL.
- [ ] Reviewer(s) requested.

## Related issues

<!-- e.g. Closes #123, Refs #456 -->
