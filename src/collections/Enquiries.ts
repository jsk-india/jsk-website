import type { CollectionConfig } from 'payload'

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  labels: { singular: 'Enquiry', plural: 'Enquiries' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'status', 'createdAt'],
    group: 'Form Submissions',
  },
  access: {
    // Public can create (submit form), only admins can read/update
    create: () => true,
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'super_admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'company', type: 'text' },
    { name: 'country', type: 'text' },
    {
      name: 'productInterest',
      type: 'relationship',
      relationTo: 'products',
      admin: { position: 'sidebar' },
    },
    { name: 'message', type: 'textarea', required: true },
    { name: 'source', type: 'text', admin: { position: 'sidebar', description: 'Page URL where form was submitted.' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'internalNotes', type: 'textarea', admin: { position: 'sidebar' } },
  ],
}
