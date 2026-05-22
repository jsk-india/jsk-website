import type { CollectionConfig } from 'payload'

export const Plants: CollectionConfig = {
  slug: 'plants',
  labels: { singular: 'Plant', plural: 'Manufacturing Plants' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'address', type: 'textarea' },
    { name: 'city', type: 'text', admin: { position: 'sidebar' } },
    { name: 'area', type: 'text', admin: { description: 'e.g. 35,000 sq.m' } },
    {
      name: 'capacities',
      type: 'array',
      labels: { singular: 'Capacity', plural: 'Capacities' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'photos',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'certifications', type: 'relationship', relationTo: 'certifications', hasMany: true },
  ],
}
