'use server'

import { getPayload } from '@/lib/payload'
import { readFile, readForm } from '@/lib/form-validation'

export interface ApplicationState {
  success: boolean
  error?: string
}

const MAX_RESUME_BYTES = 5 * 1024 * 1024 // 5 MB

export async function submitApplication(
  _prev: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  const parsed = readForm(formData, {
    name:        { type: 'string', required: true,  maxLength: 200 },
    email:       { type: 'email',  required: true,  maxLength: 320 },
    phone:       { type: 'string',                  maxLength: 40 },
    coverLetter: { type: 'string',                  maxLength: 5000 },
    jobId:       { type: 'string',                  maxLength: 40 },
  })
  if (!parsed.ok) return { success: false, error: parsed.error }

  const resumeResult = readFile(formData, 'resume', { maxBytes: MAX_RESUME_BYTES })
  if (!resumeResult.ok) return { success: false, error: resumeResult.error }
  if (!resumeResult.file) return { success: false, error: 'Please attach your resume.' }

  const resumeFile = resumeResult.file
  const { name, email, phone, coverLetter, jobId } = parsed.data

  try {
    const payload = await getPayload()

    // 1. Upload resume as a Media document (goes to R2 in prod).
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

    // 2. Create the JobApplication pointing at the uploaded resume.
    await payload.create({
      collection: 'job-applications',
      data: {
        name,
        email,
        phone,
        coverLetter,
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
