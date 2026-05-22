'use client'

import { useActionState } from 'react'
import { submitEnquiry, type EnquiryState } from './actions'

const initial: EnquiryState = { success: false }

export function EnquiryForm({ source }: { source?: string }) {
  const [state, action, pending] = useActionState(submitEnquiry, initial)

  if (state.success) {
    return (
      <div className="rounded-lg border-2 border-green-200 bg-green-50 p-8 text-center">
        <p className="text-2xl">✅</p>
        <h3 className="mt-2 text-lg font-bold text-green-800">Thank you!</h3>
        <p className="mt-1 text-sm text-green-700">
          Your enquiry has been submitted. Our team will get back to you shortly.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="source" value={source ?? ''} />

      {state.error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Name *</label>
          <input id="name" name="name" type="text" required
            className="mt-1 w-full rounded-md border border-surface-100 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email *</label>
          <input id="email" name="email" type="email" required
            className="mt-1 w-full rounded-md border border-surface-100 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
          <input id="phone" name="phone" type="tel"
            className="mt-1 w-full rounded-md border border-surface-100 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red" />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium">Company</label>
          <input id="company" name="company" type="text"
            className="mt-1 w-full rounded-md border border-surface-100 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red" />
        </div>
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium">Country</label>
        <input id="country" name="country" type="text" defaultValue="India"
          className="mt-1 w-full rounded-md border border-surface-100 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red" />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">Message *</label>
        <textarea id="message" name="message" required rows={5}
          placeholder="Tell us about your requirements..."
          className="mt-1 w-full rounded-md border border-surface-100 px-3 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red" />
      </div>

      <button type="submit" disabled={pending}
        className="w-full rounded-md bg-brand-red px-6 py-3 font-semibold text-white hover:bg-brand-red-dark disabled:opacity-50 sm:w-auto">
        {pending ? 'Submitting...' : 'Submit Enquiry'}
      </button>
    </form>
  )
}
