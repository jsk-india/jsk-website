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
        {
          name: 'categoryLabels',
          type: 'array',
          admin: { description: 'Translate the category badges on article cards. Match `value` to the select option keys (e.g. "press", "event").' },
          fields: [
            { name: 'value', type: 'text', required: true, admin: { description: 'The internal key. DO NOT translate this.' } },
            { name: 'label', type: 'text', required: true, localized: true },
          ],
        },
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
        {
          name: 'categoryLabels',
          type: 'array',
          admin: { description: 'Translate the category names shown above each document group. Match `value` to the select option keys (e.g. "annual_report").' },
          fields: [
            { name: 'value', type: 'text', required: true, admin: { description: 'The internal key (e.g. annual_report). DO NOT translate this.' } },
            { name: 'label', type: 'text', required: true, localized: true },
          ],
        },
      ],
    },

    // ── /businesses/[category]/[product] (product detail template) ─
    {
      name: 'productDetail',
      type: 'group',
      label: 'Product Detail Page (template)',
      admin: { description: 'Strings reused across every product detail page.' },
      fields: [
        { name: 'galleryHeading',        type: 'text', localized: true },
        { name: 'specificationsHeading', type: 'text', localized: true },
        { name: 'standardsHeading',      type: 'text', localized: true },
        { name: 'applicationsHeading',   type: 'text', localized: true },
        { name: 'ctaTitle',              type: 'text', localized: true },
        { name: 'ctaBody',               type: 'textarea', localized: true },
        { name: 'ctaButton',             type: 'text', localized: true },
        { name: 'brochureButton',        type: 'text', localized: true },
        { name: 'relatedHeading',        type: 'text', localized: true },
        { name: 'breadcrumbBusinesses',  type: 'text', localized: true, admin: { description: 'Breadcrumb root label ("Businesses").' } },
      ],
    },

    // ── /businesses/new-verticals/[slug] (vertical detail template) ─
    {
      name: 'verticalDetail',
      type: 'group',
      label: 'Vertical Detail Page (template)',
      fields: [
        { name: 'partnerEyebrow',     type: 'text', localized: true, admin: { description: 'Small label above partner block, e.g. "Technology Partner".' } },
        { name: 'visitPartnerLink',   type: 'text', localized: true },
        { name: 'ctaTitleTemplate',   type: 'text', localized: true, admin: { description: 'Use {name} as a placeholder for the vertical name.' } },
        { name: 'ctaBody',            type: 'textarea', localized: true },
        { name: 'ctaButton',          type: 'text', localized: true },
        { name: 'breadcrumbBusinesses',   type: 'text', localized: true },
        { name: 'breadcrumbNewVerticals', type: 'text', localized: true },
      ],
    },

    // ── /careers/[slug] (career detail template) ───────────────────
    {
      name: 'careerDetail',
      type: 'group',
      label: 'Career Detail Page (template)',
      fields: [
        { name: 'responsibilitiesHeading', type: 'text', localized: true },
        { name: 'qualificationsHeading',   type: 'text', localized: true },
        { name: 'applyHeading',            type: 'text', localized: true },
        { name: 'summaryHeading',          type: 'text', localized: true },
        { name: 'departmentLabel',         type: 'text', localized: true },
        { name: 'locationLabel',           type: 'text', localized: true },
        { name: 'typeLabel',               type: 'text', localized: true },
        { name: 'postedLabel',             type: 'text', localized: true },
        { name: 'breadcrumbCareers',       type: 'text', localized: true },
      ],
    },

    // ── /news/[slug] (news detail template) ────────────────────────
    {
      name: 'newsDetail',
      type: 'group',
      label: 'News Detail Page (template)',
      fields: [
        { name: 'breadcrumbNews', type: 'text', localized: true },
        { name: 'emptyBodyMessage', type: 'text', localized: true, admin: { description: 'Shown when an article has no body content yet.' } },
      ],
    },

    // ── /businesses/[category] (category listing template) ─────────
    {
      name: 'categoryListing',
      type: 'group',
      label: 'Product Category Page (template)',
      fields: [
        { name: 'breadcrumbBusinesses', type: 'text', localized: true },
        { name: 'emptyMessage',         type: 'text', localized: true },
      ],
    },

    // ── 404 page ───────────────────────────────────────────────────
    {
      name: 'notFound',
      type: 'group',
      label: '404 / Not Found',
      fields: [
        { name: 'code',     type: 'text',     localized: true, admin: { description: 'Big number shown (e.g. "404").' } },
        { name: 'title',    type: 'text',     localized: true },
        { name: 'body',     type: 'textarea', localized: true },
        { name: 'ctaLabel', type: 'text',     localized: true },
      ],
    },

    // ── Loading skeleton ──────────────────────────────────────────
    {
      name: 'loading',
      type: 'group',
      label: 'Loading Skeleton',
      admin: { description: 'Only the screen-reader-only text — the visual skeleton is purely structural.' },
      fields: [
        { name: 'srLabel', type: 'text', localized: true, admin: { description: 'e.g. "Loading…"' } },
      ],
    },
  ],
}

