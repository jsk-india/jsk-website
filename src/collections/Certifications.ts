import type { CollectionConfig } from 'payload'

export const Certifications: CollectionConfig = {
  slug: 'certifications',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'issuer', 'validUntil'],
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'issuer', type: 'text', localized: true },
    { name: 'validFrom', type: 'date', admin: { position: 'sidebar' } },
    { name: 'validUntil', type: 'date', admin: { position: 'sidebar' } },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'document', type: 'upload', relationTo: 'media' },
  ],
}
