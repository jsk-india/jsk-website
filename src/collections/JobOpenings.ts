import type { CollectionConfig } from 'payload'

export const JobOpenings: CollectionConfig = {
  slug: 'job-openings',
  labels: { singular: 'Job Opening', plural: 'Job Openings' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'department', 'location', 'isActive'],
    group: 'Careers',
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'department', type: 'text', admin: { position: 'sidebar' } },
    { name: 'location', type: 'text', admin: { position: 'sidebar' } },
    {
      name: 'employmentType',
      type: 'select',
      options: [
        { label: 'Full-time', value: 'full_time' },
        { label: 'Part-time', value: 'part_time' },
        { label: 'Contract', value: 'contract' },
        { label: 'Internship', value: 'internship' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'description', type: 'richText', localized: true },
    {
      name: 'responsibilities',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true, localized: true }],
    },
    {
      name: 'qualifications',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true, localized: true }],
    },
    { name: 'postedAt', type: 'date', admin: { position: 'sidebar' } },
    { name: 'closesAt', type: 'date', admin: { position: 'sidebar' } },
    { name: 'isActive', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
