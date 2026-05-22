import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'header',
      type: 'array',
      labels: { singular: 'Menu Item', plural: 'Menu Items' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'href', type: 'text', required: true },
        {
          name: 'children',
          type: 'array',
          labels: { singular: 'Sub Item', plural: 'Sub Items' },
          fields: [
            { name: 'label', type: 'text', required: true, localized: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      localized: true,
      defaultValue: 'Enquire Now',
    },
    {
      name: 'ctaHref',
      type: 'text',
      defaultValue: '/enquiry',
    },
    {
      name: 'announcement',
      type: 'group',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: false },
        { name: 'message', type: 'text', localized: true },
        { name: 'link', type: 'text' },
      ],
    },
  ],
}
