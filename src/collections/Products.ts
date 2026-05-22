import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code', 'category', 'status'],
  },
  versions: { drafts: true },
  fields: [
    // ── Core ──
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'code',
      type: 'text',
      admin: {
        description: 'e.g. AAAC, ACSR/AW — displayed as badge on card.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'product-categories',
      required: true,
      admin: { position: 'sidebar' },
    },

    // ── Content ──
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Shown on listing cards. Keep under 200 chars.',
      },
    },
    {
      name: 'longDescription',
      type: 'richText',
      localized: true,
    },

    // ── Specs ──
    {
      name: 'standards',
      type: 'array',
      labels: { singular: 'Standard', plural: 'Standards' },
      fields: [
        { name: 'label', type: 'text', required: true },
      ],
      admin: {
        description: 'e.g. IS 398, ASTM B232, IEC 61089',
      },
    },
    {
      name: 'applications',
      type: 'array',
      labels: { singular: 'Application', plural: 'Applications' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
      ],
    },
    {
      name: 'specsTable',
      type: 'array',
      labels: { singular: 'Row', plural: 'Rows' },
      admin: { description: 'Key-value rows for the specifications table.' },
      fields: [
        { name: 'property', type: 'text', required: true, localized: true },
        { name: 'value', type: 'text', required: true },
      ],
    },

    // ── Media ──
    {
      name: 'constructionImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Cross-section / construction diagram.' },
    },
    {
      name: 'galleryImages',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'brochurePdf',
      type: 'upload',
      relationTo: 'media',
    },

    // ── Relations ──
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: { position: 'sidebar' },
    },

    // ── SEO ──
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
