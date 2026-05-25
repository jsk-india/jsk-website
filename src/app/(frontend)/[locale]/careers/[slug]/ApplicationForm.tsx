'use client'

import { useActionState } from 'react'
import { submitApplication, type ApplicationState } from './actions'

const initial: ApplicationState = { success: false }

export interface ApplicationStrings {
  nameLabel: string
  emailLabel: string
  phoneLabel: string
  resumeLabel: string
  resumeHint: string
  coverLetterLabel: string
  coverLetterPlaceholder: string
  submitLabel: string
  submittingLabel: string
  successTitle: string
  /** Template — `{jobTitle}` placeholder will be substituted. */
  successBodyTemplate: string
}

export function ApplicationForm({
  jobId,
  jobTitle,
  strings,
}: {
  jobId: string
  jobTitle: string
  strings: ApplicationStrings
}) {
  const [state, action, pending] = useActionState(submitApplication, initial)

  if (state.success) {
    // Substitute {jobTitle} in the success message — admin can rewrite freely.
    const parts = strings.successBodyTemplate.split('{jobTitle}')
    return (
      <div className="rounded-lg border-2 border-green-200 bg-green-50 p-8 text-center">
        <p className="text-3xl">🎉</p>
        <h3 className="mt-2 text-xl font-bold text-green-800">{strings.successTitle}</h3>
        <p className="mt-1 text-sm text-green-700">
          {parts[0]}
          {parts.length > 1 && <strong>{jobTitle}</strong>}
          {parts.slice(1).join(jobTitle)}
        </p>
      </div>
    )
  }

  const input = 'mt-1 w-full rounded-md border border-surface-100 px-3 py-2 text-sm focus:border-brand-red focus:outline-none'

  return (
    <form action={action} encType="multipart/form-data" className="space-y-6">
      <input type="hidden" name="jobId" value={jobId} />

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
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium">{strings.phoneLabel}</label>
        <input id="phone" name="phone" type="tel" className={input} />
      </div>

      <div>
        <label htmlFor="resume" className="block text-sm font-medium">
          {strings.resumeLabel} <span className="text-xs text-ink-600">{strings.resumeHint}</span>
        </label>
        <input id="resume" name="resume" type="file" required accept=".pdf,.doc,.docx"
          className="mt-1 w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-brand-red file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-red-dark" />
      </div>

      <div>
        <label htmlFor="coverLetter" className="block text-sm font-medium">{strings.coverLetterLabel}</label>
        <textarea id="coverLetter" name="coverLetter" rows={4} placeholder={strings.coverLetterPlaceholder} className={input} />
      </div>

      <button type="submit" disabled={pending}
        className="w-full rounded-md bg-brand-red px-6 py-3 font-semibold text-white hover:bg-brand-red-dark disabled:opacity-50 sm:w-auto">
        {pending ? strings.submittingLabel : strings.submitLabel}
      </button>
    </form>
  )
}
