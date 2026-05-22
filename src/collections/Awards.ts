import type { CollectionConfig } from 'payload'

export const Awards: CollectionConfig = {
  slug: 'awards',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'year', 'issuer'],
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'year', type: 'number', required: true, admin: { position: 'sidebar' } },
    { name: 'issuer', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'description', type: 'textarea', localized: true },
  ],
}
