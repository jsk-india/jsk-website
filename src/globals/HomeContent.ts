import type { GlobalConfig } from 'payload'

/**
 * HomeContent — copy that lives ONLY on the homepage.
 *
 * Grouped by section so admins can find things by visual location:
 *   manifesto      → the big "Made in India. Built to Last." block
 *   vision         → "Our Vision" block on the dark band
 *   mission        → "Our Mission" block on the dark band
 *   certifications → the white certification-badge strip
 *   enquiryCta     → the red "Ready to discuss your project?" footer band
 *   sectionHeadings → small headings/links sprinkled between sections
 *
 * Every text field is `localized: true`. If a field is empty, the
 * corresponding piece of the page is hidden (no code-level fallbacks
 * — the database is seeded with the original copy on first deploy).
 */
export const HomeContent: GlobalConfig = {
  slug: 'home-content',
  label: 'Home Content',
  admin: { group: 'Content' },
  fields: [
    {
      name: 'manifesto',
      type: 'group',
      label: 'Manifesto — “Made in India. Built to Last.”',
      fields: [
        {
          name: 'headlinePart1',
          type: 'text',
          localized: true,
          admin: { description: 'First chunk of the headline. Renders before the highlighted part.' },
        },
        {
          name: 'headlineHighlight',
          type: 'text',
          localized: true,
          admin: { description: 'Highlighted middle chunk (rendered in brand-red).' },
        },
        {
          name: 'headlinePart3',
          type: 'text',
          localized: true,
          admin: { description: 'Final chunk of the headline, rendered after the highlight.' },
        },
        { name: 'body', type: 'textarea', localized: true },
        {
          name: 'brochureButtonLabel',
          type: 'text',
          localized: true,
          admin: { description: 'Label for the brochure download button. Hidden when SiteSettings.brochure is empty.' },
        },
      ],
    },
    {
      name: 'vision',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', localized: true, admin: { description: 'e.g. "Our Vision"' } },
        { name: 'headline', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'mission',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', localized: true, admin: { description: 'e.g. "Our Mission"' } },
        { name: 'headline', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'certifications',
      type: 'group',
      label: 'Certifications Strip',
      fields: [
        { name: 'heading', type: 'text', localized: true },
        {
          name: 'items',
          type: 'array',
          labels: { singular: 'Badge', plural: 'Badges' },
          fields: [
            { name: 'label', type: 'text', required: true, localized: true },
            { name: 'hint', type: 'text', localized: true, admin: { description: 'Short caption under the label.' } },
          ],
        },
        { name: 'footnote', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'enquiryCta',
      type: 'group',
      label: 'Bottom Enquiry CTA',
      fields: [
        { name: 'headline', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'buttonLabel', type: 'text', localized: true },
      ],
    },
    {
      name: 'sectionHeadings',
      type: 'group',
      label: 'Section Headings & Links',
      admin: { description: 'Small labels sprinkled between sections.' },
      fields: [
        { name: 'productsHeading', type: 'text', localized: true, admin: { description: 'Default: "Our Products"' } },
        { name: 'viewAllProductsLink', type: 'text', localized: true, admin: { description: 'Default: "View all products →"' } },
        { name: 'verticalsHeading', type: 'text', localized: true, admin: { description: 'Default: "New Verticals"' } },
        { name: 'clientsHeading', type: 'text', localized: true, admin: { description: 'Default: "Trusted by India\'s leading companies"' } },
        { name: 'viewAllClientsLink', type: 'text', localized: true, admin: { description: 'Default: "View all clients →"' } },
      ],
    },
  ],
}
