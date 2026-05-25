'use client'

import { useActionState } from 'react'
import { submitEnquiry, type EnquiryState } from './actions'

const initial: EnquiryState = { success: false }

export interface EnquiryStrings {
  nameLabel: string
  emailLabel: string
  phoneLabel: string
  companyLabel: string
  countryLabel: string
  countryDefault: string
  messageLabel: string
  messagePlaceholder: string
  submitLabel: string
  submittingLabel: string
  successTitle: string
  successBody: string
}

export function EnquiryForm({ source, strings }: { source?: string; strings: EnquiryStrings }) {
  const [state, action, pending] = useActionState(submitEnquiry, initial)

  if (state.success) {
    return (
      <div className="rounded-lg border-2 border-green-200 bg-green-50 p-8 text-center">
        <p className="text-2xl">✅</p>
        <h3 className="mt-2 text-lg font-bold text-green-800">{strings.successTitle}</h3>
        <p className="mt-1 text-sm text-green-700">{strings.successBody}</p>
      </div>
    )
  }

  const input = 'mt-1 w-full rounded-md border border-surface-100 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red'

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="source" value={source ?? ''} />

      {state.error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">{strings.nameLabel}</label>
          <input id="name" name="name" type="text" required className={input} />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">{strings.emailLabel}</label>
          <input id="email" name="email" type="email" required className={input} />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">{strings.phoneLabel}</label>
          <input id="phone" name="phone" type="tel" className={input} />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium">{strings.companyLabel}</label>
          <input id="company" name="company" type="text" className={input} />
        </div>
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium">{strings.countryLabel}</label>
        <input id="country" name="country" type="text" defaultValue={strings.countryDefault} className={input} />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">{strings.messageLabel}</label>
        <textarea id="message" name="message" required rows={5} placeholder={strings.messagePlaceholder} className={input} />
      </div>

      <button type="submit" disabled={pending}
        className="w-full rounded-md bg-brand-red px-6 py-3 font-semibold text-white hover:bg-brand-red-dark disabled:opacity-50 sm:w-auto">
        {pending ? strings.submittingLabel : strings.submitLabel}
      </button>
    </form>
  )
}
