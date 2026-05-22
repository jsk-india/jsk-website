'use server'

import { getPayload } from '@/lib/payload'

export interface ApplicationState {
  success: boolean
  error?: string
}

export async function submitApplication(
  _prev: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const coverLetter = formData.get('coverLetter') as string
  const jobId = formData.get('jobId') as string
  const resumeFile = formData.get('resume') as File | null

  if (!name || !email) return { success: false, error: 'Name and email are required.' }
  if (!email.includes('@')) return { success: false, error: 'Please enter a valid email address.' }
  if (!resumeFile || resumeFile.size === 0) return { success: false, error: 'Please attach your resume.' }
  if (resumeFile.size > 5 * 1024 * 1024) return { success: false, error: 'Resume must be under 5 MB.' }

  try {
    const payload = await getPayload()

    // Upload resume to media collection
    const buffer = Buffer.from(await resumeFile.arrayBuffer())
    const mediaDoc = await payload.create({
      collection: 'media',
      data: { alt: `Resume — ${name}` },
      file: {
        data: buffer,
        mimetype: resumeFile.type,
        name: resumeFile.name,
        size: resumeFile.size,
      },
    })

    await payload.create({
      collection: 'job-applications',
      data: {
        name, email, phone, coverLetter,
        jobOpening: jobId ? Number(jobId) : undefined,
        resumeFile: mediaDoc.id,
        status: 'new',
        source: 'website',
      },
    })

    return { success: true }
  } catch (err) {
    console.error('Application error:', err)
    return { success: false, error: 'Something went wrong. Please try again or email us directly.' }
  }
}
