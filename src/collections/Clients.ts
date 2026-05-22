import type { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sector', 'isFeatured', 'order'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'sector',
      type: 'select',
      options: [
        { label: 'Utility / SEB', value: 'utility' },
        { label: 'EPC Contractor', value: 'epc' },
        { label: 'Manufacturer', value: 'manufacturer' },
        { label: 'Trader / Distributor', value: 'trader' },
        { label: 'Steel / Metal', value: 'steel' },
        { label: 'Renewable Energy', value: 'renewable' },
        { label: 'Other', value: 'other' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'website', type: 'text' },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show on homepage logo wall.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
