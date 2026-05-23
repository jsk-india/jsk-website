import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'logo',
      label: 'Logo (light background)',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'logoLight',
      label: 'Logo (dark background — for footer)',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'brandName',
      type: 'text',
      required: true,
      defaultValue: 'JSK Industries Pvt. Ltd.',
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      defaultValue: 'Powering Growth',
    },
    {
      name: 'primaryEmail',
      type: 'email',
      defaultValue: 'jsk@jskindia.in',
    },
    {
      name: 'primaryPhone',
      type: 'text',
      defaultValue: '+91 22 6625 3700',
    },
    {
      name: 'addresses',
      type: 'array',
      labels: { singular: 'Address', plural: 'Addresses' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'line1', type: 'text', required: true },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text' },
        { name: 'pin', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'India' },
        { name: 'phone', type: 'text' },
        { name: 'fax', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'mapsUrl', type: 'text' },
      ],
    },
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'linkedin', type: 'text' },
        { name: 'twitter', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },
    {
      name: 'defaultSeoImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'brochure',
      label: 'Company Brochure (PDF)',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Shown as a download link in the header.' },
    },
    {
      name: 'heroSlides',
      label: 'Homepage Hero Slides',
      type: 'array',
      labels: { singular: 'Slide', plural: 'Slides' },
      admin: { description: 'Rotating hero banner on the homepage. Leave empty to use the default static hero.' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'eyebrow', type: 'text', localized: true, admin: { description: 'Small text above the headline (e.g. "Since 1965").' } },
        { name: 'headline', type: 'text', required: true, localized: true },
        { name: 'subheadline', type: 'textarea', localized: true },
        { name: 'ctaLabel', type: 'text', localized: true, defaultValue: 'Explore Businesses' },
        { name: 'ctaHref', type: 'text', defaultValue: '/businesses' },
      ],
    },
    {
      name: 'stats',
      label: 'Homepage Stats',
      type: 'array',
      labels: { singular: 'Stat', plural: 'Stats' },
      admin: {
        description:
          'Headline numbers shown below the hero (e.g. "60+ Years Experience"). Leave empty to use built-in defaults. Recommended: 5 items so the row fills evenly at lg.',
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: { description: 'The big number / figure, e.g. "60+", "\u20B930 Bn", "1,08,408".' },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          admin: { description: 'Short caption below the value, e.g. "Years Experience".' },
        },
      ],
    },
  ],
}
