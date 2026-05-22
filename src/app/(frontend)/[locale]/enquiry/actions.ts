'use server'

import { getPayload } from '@/lib/payload'

export interface EnquiryState {
  success: boolean
  error?: string
}

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const company = formData.get('company') as string
  const country = formData.get('country') as string
  const message = formData.get('message') as string
  const source = formData.get('source') as string

  // Basic validation
  if (!name || !email || !message) {
    return { success: false, error: 'Name, email, and message are required.' }
  }
  if (!email.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  try {
    const payload = await getPayload()
    await payload.create({
      collection: 'enquiries',
      data: { name, email, phone, company, country, message, source, status: 'new' },
    })
    return { success: true }
  } catch (err) {
    console.error('Enquiry submission error:', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
