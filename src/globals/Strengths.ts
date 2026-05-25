import type { GlobalConfig } from 'payload'

/**
 * Strengths — the "Why JSK" block on the homepage.
 *
 * Note: the careers page has its OWN "Why JSK" (different audience —
 * job seekers vs. customers), modeled on `PageContent.careers.whyItems`.
 * Keep this one customer-facing.
 */
export const Strengths: GlobalConfig = {
  slug: 'strengths',
  label: 'Why JSK (Homepage)',
  admin: { group: 'Content' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      admin: { description: 'Section heading, e.g. "Why JSK".' },
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Strength', plural: 'Strengths' },
      admin: { description: 'Recommended: 4 or 8 items (grid is 1/2/4 cols responsive).' },
      fields: [
        { name: 'icon', type: 'text', required: true, admin: { description: 'Single emoji, e.g. "🏭".' } },
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'body', type: 'textarea', required: true, localized: true },
      ],
    },
  ],
}
