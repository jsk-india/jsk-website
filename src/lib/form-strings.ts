/**
 * Build form `strings` props from the Forms CMS global, with hardcoded
 * fallbacks per field so missing translations never show blank labels.
 */
import { getPayload } from './payload'
import { FORM_DEFAULTS, textOr } from './content-defaults'
import type { Locale } from './i18n'
import type { EnquiryStrings } from '@/app/(frontend)/[locale]/enquiry/EnquiryForm'
import type { ApplicationStrings } from '@/app/(frontend)/[locale]/careers/[slug]/ApplicationForm'

export async function loadFormStrings(locale: Locale): Promise<{
  enquiry: EnquiryStrings
  application: ApplicationStrings
}> {
  const payload = await getPayload()
  const forms = await payload.findGlobal({ slug: 'forms', locale })

  const e = (forms.enquiry ?? {}) as Partial<EnquiryStrings>
  const a = (forms.application ?? {}) as Partial<ApplicationStrings>
  const ed = FORM_DEFAULTS.enquiry
  const ad = FORM_DEFAULTS.application

  return {
    enquiry: {
      nameLabel:          textOr(e.nameLabel,          ed.nameLabel),
      emailLabel:         textOr(e.emailLabel,         ed.emailLabel),
      phoneLabel:         textOr(e.phoneLabel,         ed.phoneLabel),
      companyLabel:       textOr(e.companyLabel,       ed.companyLabel),
      countryLabel:       textOr(e.countryLabel,       ed.countryLabel),
      countryDefault:     textOr(e.countryDefault,     ed.countryDefault),
      messageLabel:       textOr(e.messageLabel,       ed.messageLabel),
      messagePlaceholder: textOr(e.messagePlaceholder, ed.messagePlaceholder),
      submitLabel:        textOr(e.submitLabel,        ed.submitLabel),
      submittingLabel:    textOr(e.submittingLabel,    ed.submittingLabel),
      successTitle:       textOr(e.successTitle,       ed.successTitle),
      successBody:        textOr(e.successBody,        ed.successBody),
    },
    application: {
      nameLabel:              textOr(a.nameLabel,              ad.nameLabel),
      emailLabel:             textOr(a.emailLabel,             ad.emailLabel),
      phoneLabel:             textOr(a.phoneLabel,             ad.phoneLabel),
      resumeLabel:            textOr(a.resumeLabel,            ad.resumeLabel),
      resumeHint:             textOr(a.resumeHint,             ad.resumeHint),
      coverLetterLabel:       textOr(a.coverLetterLabel,       ad.coverLetterLabel),
      coverLetterPlaceholder: textOr(a.coverLetterPlaceholder, ad.coverLetterPlaceholder),
      submitLabel:            textOr(a.submitLabel,            ad.submitLabel),
      submittingLabel:        textOr(a.submittingLabel,        ad.submittingLabel),
      successTitle:           textOr(a.successTitle,           ad.successTitle),
      successBodyTemplate:    textOr(a.successBodyTemplate,    ad.successBodyTemplate),
    },
  }
}
