import type { CollectionConfig } from 'payload'

/** SEBI-style investor relations document categories. */
const INVESTOR_CATEGORIES = [
  { label: 'Annual Reports', value: 'annual_report' },
  { label: 'Financial Results', value: 'financial_result' },
  { label: 'Shareholding Pattern', value: 'shareholding_pattern' },
  { label: 'Corporate Governance', value: 'corporate_governance' },
  { label: 'Corporate Announcements', value: 'corporate_announcement' },
  { label: 'Notices', value: 'notice' },
  { label: 'AGM', value: 'agm' },
  { label: 'Postal Ballot', value: 'postal_ballot' },
  { label: 'Annual Returns', value: 'annual_return' },
  { label: 'Company Policies', value: 'policy' },
  { label: 'Credit Rating', value: 'credit_rating' },
  { label: 'Disclosures (LODR)', value: 'disclosure' },
  { label: 'Secretarial Compliance', value: 'secretarial_compliance' },
  { label: 'IEPF', value: 'iepf' },
  { label: 'Committee Composition', value: 'committee_composition' },
  { label: 'Investor Grievance', value: 'investor_grievance' },
  { label: 'Corporate Presentations', value: 'corporate_presentation' },
  { label: 'Other', value: 'other' },
] as const

export const InvestorDocuments: CollectionConfig = {
  slug: 'investor-documents',
  labels: { singular: 'Investor Document', plural: 'Investor Documents' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'fy', 'publishedAt'],
    group: 'Investors',
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [...INVESTOR_CATEGORIES],
      admin: { position: 'sidebar' },
    },
    {
      name: 'subCategory',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Optional sub-grouping within a category.',
      },
    },
    {
      name: 'fy',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'e.g. FY 2023-24',
      },
    },
    { name: 'description', type: 'richText', localized: true },
    { name: 'file', type: 'upload', relationTo: 'media' },
    {
      name: 'externalUrl',
      type: 'text',
      admin: { description: 'Alternative to file upload — link to external doc.' },
    },
    { name: 'publishedAt', type: 'date', required: true, admin: { position: 'sidebar' } },
  ],
}
