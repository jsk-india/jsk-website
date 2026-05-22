import type { CollectionConfig } from 'payload'

export const Stories: CollectionConfig = {
  slug: 'stories',
  labels: { singular: 'Story', plural: 'Stories' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'sector', 'publishedAt', 'status'],
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'hero', type: 'upload', relationTo: 'media' },
    {
      name: 'sector',
      type: 'select',
      options: [
        { label: 'Power T&D', value: 'power_td' },
        { label: 'Railway', value: 'railway' },
        { label: 'Renewable Energy', value: 'renewable' },
        { label: 'Steel / Metal', value: 'steel' },
        { label: 'Other', value: 'other' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'summary', type: 'textarea', localized: true },
    { name: 'body', type: 'richText', localized: true },
    { name: 'client', type: 'relationship', relationTo: 'clients', admin: { position: 'sidebar' } },
    { name: 'productsUsed', type: 'relationship', relationTo: 'products', hasMany: true },
    { name: 'publishedAt', type: 'date', required: true, admin: { position: 'sidebar' } },
    { name: 'author', type: 'text' },
    {
      name: 'seo',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
