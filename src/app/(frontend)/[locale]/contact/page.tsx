import { getPayload } from '@/lib/payload'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Contact Us' }

interface Props { params: Promise<{ locale: string }> }

type Address = {
  label?: string | null; line1?: string | null; line2?: string | null;
  city?: string | null; state?: string | null; pin?: string | null;
  country?: string | null; phone?: string | null; fax?: string | null;
  email?: string | null; mapsUrl?: string | null
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const prefix = `/${locale}`
  const payload = await getPayload()

  const [settings, page] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', locale: locale as Locale }),
    payload.findGlobal({ slug: 'page-content', locale: locale as Locale }),
  ])

  const addresses = (settings.addresses ?? []) as Address[]
  const c = page.contact ?? {}

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {c.headline && <h1 className="text-4xl font-extrabold uppercase tracking-tight">{c.headline}</h1>}
      {c.body && <p className="mt-4 max-w-2xl text-lg text-ink-600">{c.body}</p>}

      {addresses.length > 0 && (
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {addresses.map((a, i) => (
            <div key={i} className="rounded-lg border border-surface-100 bg-white p-6 shadow-sm">
              {a.label && <h2 className="text-lg font-bold text-brand-red">{a.label}</h2>}
              <address className="mt-3 space-y-1 text-sm not-italic text-ink-600">
                {a.line1 && <p>{a.line1}</p>}
                {a.line2 && <p>{a.line2}</p>}
                <p>{[a.city, a.state, a.pin].filter(Boolean).join(', ')}</p>
                {a.country && a.country !== 'India' && <p>{a.country}</p>}
                {a.phone && (
                  <p className="mt-2">
                    📞 <a href={`tel:${a.phone.replace(/\s/g, '')}`} className="hover:text-brand-red">{a.phone}</a>
                  </p>
                )}
                {a.fax && <p>📠 {a.fax}</p>}
                {a.email && (
                  <p>✉️ <a href={`mailto:${a.email}`} className="text-brand-red hover:underline">{a.email}</a></p>
                )}
                {a.mapsUrl && (
                  <p className="mt-2">
                    <a href={a.mapsUrl} target="_blank" rel="noopener" className="text-xs text-brand-red hover:underline">
                      View on maps →
                    </a>
                  </p>
                )}
              </address>
            </div>
          ))}
        </div>
      )}

      {(c.enquiryCtaTitle || c.enquiryCtaBody || c.enquiryCtaButton) && (
        <div className="mt-12 rounded-lg bg-brand-red p-8 text-center text-white">
          {c.enquiryCtaTitle && <h2 className="text-2xl font-bold">{c.enquiryCtaTitle}</h2>}
          {c.enquiryCtaBody && <p className="mt-2 text-white/80">{c.enquiryCtaBody}</p>}
          {c.enquiryCtaButton && (
            <a href={`${prefix}/enquiry`}
              className="mt-4 inline-block rounded-md border-2 border-white bg-white px-6 py-3 font-semibold text-brand-red hover:bg-transparent hover:text-white">
              {c.enquiryCtaButton}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
