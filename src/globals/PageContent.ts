import type { GlobalConfig } from 'payload'

/**
 * PageContent — intros, empty states, and section headings for every
 * non-homepage page. One global with one group per page route so
 * admins can find content by the URL it belongs to.
 *
 * Convention:
 *   - `headline`     → the H1
 *   - `body`         → intro paragraph(s) below the H1
 *   - `empty*`       → fallback messaging when a collection has no rows
 *
 * No code-level fallbacks: if a field is empty, the corresponding piece
 * of the page is hidden. Initial values are seeded into the DB on first
 * deploy so the live site never goes blank.
 */
export const PageContent: GlobalConfig = {
  slug: 'page-content',
  label: 'Page Content',
  admin: { group: 'Content' },
  fields: [
    // ── /about ─────────────────────────────────────────────────────
    {
      name: 'about',
      type: 'group',
      label: '/about',
      fields: [
        { name: 'headline', type: 'text', localized: true },
        { name: 'intro', type: 'richText', localized: true, admin: { description: 'Multi-paragraph intro shown under the H1.' } },
        { name: 'leadershipHeading', type: 'text', localized: true },
        { name: 'manufacturingHeading', type: 'text', localized: true },
        { name: 'certificationsHeading', type: 'text', localized: true },
      ],
    },

    // ── /businesses ────────────────────────────────────────────────
    {
      name: 'businesses',
      type: 'group',
      label: '/businesses',
      fields: [
        { name: 'headline', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'newVerticalsCardTitle', type: 'text', localized: true, admin: { description: 'Title on the special "New Verticals" card.' } },
        { name: 'newVerticalsCardBody', type: 'textarea', localized: true },
      ],
    },

    // ── /businesses/new-verticals ──────────────────────────────────
    {
      name: 'newVerticals',
      type: 'group',
      label: '/businesses/new-verticals',
      fields: [
        { name: 'headline', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
      ],
    },

    // ── /clients ───────────────────────────────────────────────────
    {
      name: 'clients',
      type: 'group',
      label: '/clients',
      fields: [
        { name: 'headline', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'footnote', type: 'text', localized: true, admin: { description: 'e.g. trademark disclaimer.' } },
      ],
    },

    // ── /news ──────────────────────────────────────────────────────
    {
      name: 'news',
      type: 'group',
      label: '/news',
      fields: [
        { name: 'headline', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'emptyTitle', type: 'text', localized: true, admin: { description: 'Shown when there are no published articles.' } },
        { name: 'emptyBody', type: 'textarea', localized: true },
      ],
    },

    // ── /stories ───────────────────────────────────────────────────
    {
      name: 'stories',
      type: 'group',
      label: '/stories',
      fields: [
        { name: 'headline', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'emptyTitle', type: 'text', localized: true },
        { name: 'emptyBody', type: 'textarea', localized: true },
      ],
    },

    // ── /careers ───────────────────────────────────────────────────
    {
      name: 'careers',
      type: 'group',
      label: '/careers',
      fields: [
        { name: 'heroTitle', type: 'text', localized: true },
        { name: 'heroBody', type: 'textarea', localized: true },
        { name: 'whyHeading', type: 'text', localized: true, admin: { description: 'Heading above the employer-value-props grid.' } },
        {
          name: 'whyItems',
          type: 'array',
          labels: { singular: 'Reason', plural: 'Reasons' },
          admin: { description: 'Why join JSK as an employee. Recommended: 4 items.' },
          fields: [
            { name: 'icon', type: 'text', required: true },
            { name: 'title', type: 'text', required: true, localized: true },
            { name: 'body', type: 'textarea', required: true, localized: true },
          ],
        },
        { name: 'openPositionsHeading', type: 'text', localized: true },
        { name: 'emptyTitle', type: 'text', localized: true, admin: { description: 'Shown when no positions are open.' } },
        { name: 'emptyBody', type: 'textarea', localized: true },
        { name: 'emptyCtaLabel', type: 'text', localized: true },
      ],
    },

    // ── /contact ───────────────────────────────────────────────────
    {
      name: 'contact',
      type: 'group',
      label: '/contact',
      fields: [
        { name: 'headline', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'enquiryCtaTitle', type: 'text', localized: true, admin: { description: 'Bottom red banner — title.' } },
        { name: 'enquiryCtaBody', type: 'text', localized: true },
        { name: 'enquiryCtaButton', type: 'text', localized: true },
      ],
    },

    // ── /enquiry ───────────────────────────────────────────────────
    {
      name: 'enquiry',
      type: 'group',
      label: '/enquiry',
      fields: [
        { name: 'headline', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'productLabel', type: 'text', localized: true, admin: { description: 'Prefix shown when ?product=... is in the URL, e.g. "Enquiring about:".' } },
      ],
    },

    // ── /investors ─────────────────────────────────────────────────
    {
      name: 'investors',
      type: 'group',
      label: '/investors',
      fields: [
        { name: 'headline', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'emptyMessage', type: 'text', localized: true, admin: { description: 'Shown when no documents are published.' } },
      ],
    },
  ],
}
