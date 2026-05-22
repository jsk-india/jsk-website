import type { CollectionConfig } from 'payload'

export const Certifications: CollectionConfig = {
  slug: 'certifications',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'issuer', 'validUntil'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'issuer', type: 'text' },
    { name: 'validFrom', type: 'date', admin: { position: 'sidebar' } },
    { name: 'validUntil', type: 'date', admin: { position: 'sidebar' } },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'document', type: 'upload', relationTo: 'media' },
  ],
}
