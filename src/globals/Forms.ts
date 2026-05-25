import type { GlobalConfig } from 'payload'

/**
 * Forms — every user-facing string in the contact / enquiry / job
 * application forms, so admins can translate them.
 *
 * Client form components can't read globals directly. The wrapping
 * server pages fetch this global and pass the relevant group down
 * as a `strings` prop.
 */
export const Forms: GlobalConfig = {
  slug: 'forms',
  label: 'Forms',
  admin: { group: 'Content' },
  fields: [
    {
      name: 'enquiry',
      type: 'group',
      label: 'Enquiry Form',
      fields: [
        { name: 'nameLabel',          type: 'text',     localized: true },
        { name: 'emailLabel',         type: 'text',     localized: true },
        { name: 'phoneLabel',         type: 'text',     localized: true },
        { name: 'companyLabel',       type: 'text',     localized: true },
        { name: 'countryLabel',       type: 'text',     localized: true },
        { name: 'countryDefault',     type: 'text',     admin: { description: 'Default pre-filled in the country input. Not localized (it\'s the actual default value).' } },
        { name: 'messageLabel',       type: 'text',     localized: true },
        { name: 'messagePlaceholder', type: 'text',     localized: true },
        { name: 'submitLabel',        type: 'text',     localized: true },
        { name: 'submittingLabel',    type: 'text',     localized: true },
        { name: 'successTitle',       type: 'text',     localized: true },
        { name: 'successBody',        type: 'textarea', localized: true },
      ],
    },
    {
      name: 'application',
      type: 'group',
      label: 'Job Application Form',
      fields: [
        { name: 'nameLabel',               type: 'text',     localized: true },
        { name: 'emailLabel',              type: 'text',     localized: true },
        { name: 'phoneLabel',              type: 'text',     localized: true },
        { name: 'resumeLabel',             type: 'text',     localized: true, admin: { description: 'e.g. "Resume / CV *"' } },
        { name: 'resumeHint',              type: 'text',     localized: true, admin: { description: 'Small text after the label, e.g. "(PDF, DOC · max 5 MB)"' } },
        { name: 'coverLetterLabel',       type: 'text',     localized: true },
        { name: 'coverLetterPlaceholder', type: 'text',     localized: true },
        { name: 'submitLabel',            type: 'text',     localized: true },
        { name: 'submittingLabel',        type: 'text',     localized: true },
        { name: 'successTitle',           type: 'text',     localized: true },
        { name: 'successBodyTemplate',    type: 'textarea', localized: true, admin: { description: 'Use {jobTitle} as a placeholder for the job name.' } },
      ],
    },
  ],
}
