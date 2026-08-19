/**
 * Tiny form-validation helpers for server actions.
 *
 * We deliberately don't pull in Zod / Yup — the site has 2 forms with
 * ~6 fields each. A dependency and its docs cost more than these 60
 * lines. If forms multiply, revisit.
 *
 * Usage:
 *   const fields = readForm(formData, {
 *     name:    { type: 'string', required: true, maxLength: 200 },
 *     email:   { type: 'email',  required: true },
 *     phone:   { type: 'string', maxLength: 40 },
 *     message: { type: 'string', required: true, maxLength: 5000 },
 *   })
 *   if (!fields.ok) return { success: false, error: fields.error }
 *   // fields.data is typed as { name: string; email: string; phone: string; message: string }
 */

// Reasonable email pattern — RFC-perfect email regex is a myth. This
// catches the top 99% of typos and rejects the obvious junk, which is
// what a marketing-site form needs.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export type FieldSpec = {
  type: 'string' | 'email'
  required?: boolean
  maxLength?: number
  minLength?: number
}

export type ReadResult<S extends Record<string, FieldSpec>> =
  | { ok: true; data: { [K in keyof S]: string } }
  | { ok: false; error: string }

/**
 * Read + validate a FormData against a spec object. Trims every value.
 * Returns a discriminated union so callers can early-return on error
 * without dropping type safety on the happy path.
 */
export function readForm<S extends Record<string, FieldSpec>>(
  formData: FormData,
  spec: S,
): ReadResult<S> {
  const data = {} as { [K in keyof S]: string }

  for (const [key, rules] of Object.entries(spec) as [keyof S & string, FieldSpec][]) {
    const raw = formData.get(key)
    const value = typeof raw === 'string' ? raw.trim() : ''

    if (rules.required && value === '') {
      return { ok: false, error: `${humanize(key)} is required.` }
    }
    if (rules.minLength && value.length > 0 && value.length < rules.minLength) {
      return { ok: false, error: `${humanize(key)} must be at least ${rules.minLength} characters.` }
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return { ok: false, error: `${humanize(key)} must be under ${rules.maxLength} characters.` }
    }
    if (rules.type === 'email' && value !== '' && !EMAIL_RE.test(value)) {
      return { ok: false, error: 'Please enter a valid email address.' }
    }

    data[key] = value
  }

  return { ok: true, data }
}

/** "coverLetter" → "Cover letter". Used in error messages. */
function humanize(key: string): string {
  const spaced = key.replace(/([A-Z])/g, ' $1').toLowerCase()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

/**
 * Safely pull a File out of FormData. Returns null when missing/empty.
 * Enforces a max size so a malicious client can't force us to buffer
 * arbitrarily large uploads.
 */
export function readFile(
  formData: FormData,
  key: string,
  { maxBytes }: { maxBytes: number },
): { ok: true; file: File | null } | { ok: false; error: string } {
  const raw = formData.get(key)
  if (!raw || !(raw instanceof File) || raw.size === 0) return { ok: true, file: null }
  if (raw.size > maxBytes) {
    const maxMb = Math.round(maxBytes / (1024 * 1024))
    return { ok: false, error: `File must be under ${maxMb} MB.` }
  }
  return { ok: true, file: raw }
}
