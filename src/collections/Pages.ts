import type { CollectionConfig } from 'payload'

/**
 * Generic CMS page — used for About, Manufacturing, Quality, CSR,
 * Legal pages, etc. Content is composed from block types.
 *
 * For now ships with a RichText body; full block system (Hero, Stats,
 * LogoGrid, etc.) will be wired in incrementally.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  versions: { drafts: true },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        position: 'sidebar',
        description: 'Optional parent page for breadcrumbs.',
      },
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
