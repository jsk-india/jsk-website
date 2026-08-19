'use server'

import { getPayload } from '@/lib/payload'
import { readForm } from '@/lib/form-validation'

export interface EnquiryState {
  success: boolean
  error?: string
}

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const parsed = readForm(formData, {
    name:    { type: 'string', required: true,  maxLength: 200 },
    email:   { type: 'email',  required: true,  maxLength: 320 },
    phone:   { type: 'string',                  maxLength: 40 },
    company: { type: 'string',                  maxLength: 200 },
    country: { type: 'string',                  maxLength: 100 },
    message: { type: 'string', required: true,  maxLength: 5000, minLength: 5 },
    source:  { type: 'string',                  maxLength: 100 },
  })
  if (!parsed.ok) return { success: false, error: parsed.error }

  try {
    const payload = await getPayload()
    await payload.create({
      collection: 'enquiries',
      data: { ...parsed.data, status: 'new' },
    })
    return { success: true }
  } catch (err) {
    console.error('Enquiry submission error:', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
