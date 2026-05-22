import type { CollectionConfig } from 'payload'

export const Persons: CollectionConfig = {
  slug: 'persons',
  labels: { singular: 'Person', plural: 'Leadership' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'isFounder', 'isBoard', 'order'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true, localized: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'richText', localized: true },
    { name: 'qualifications', type: 'textarea', localized: true },
    { name: 'linkedinUrl', type: 'text' },
    {
      name: 'isFounder',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'isBoard',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
