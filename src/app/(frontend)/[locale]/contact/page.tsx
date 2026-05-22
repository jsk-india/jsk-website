import { getPayload } from '@/lib/payload'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Contact Us' }

interface Props { params: Promise<{ locale: string }> }

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const prefix = `/${locale}`
  const payload = await getPayload()
  const settings = await payload.findGlobal({ slug: 'site-settings', locale })

  const addresses = (settings.addresses ?? []) as {
    label?: string; line1?: string; line2?: string; city?: string;
    state?: string; pin?: string; country?: string;
    phone?: string; fax?: string; email?: string; mapsUrl?: string
  }[]

  // Fallback addresses if CMS not yet configured
  const fallback = [
    { label: 'Corporate Office', line1: '9, A. K. Naik Marg, CST', city: 'Mumbai — 400 001', phone: '+91 22 6625 3700', fax: '+91 22 6655 0780', email: 'jsk@jskindia.in' },
    { label: 'Works (Sayli)', line1: 'Survey No. 369/1/1/2, Behind Siyaram Silk Mills', city: 'Village Sayli, Silvassa — 396 230, U.T. of D. & N.H.' },
    { label: 'Works (Rakholi)', line1: 'Survey No. 126/1-B, Near Rakholi School', city: 'Rakholi, Silvassa — 396 240, U.T. of D. & N.H.' },
    { label: 'Branch Office', line1: '1201, Landmark, Anandnagar Road, Satellite', city: 'Ahmedabad — 380015' },
  ]

  const displayAddresses = addresses.length > 0 ? addresses : fallback

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight">Contact Us</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-600">
        Reach out to our team at any of our offices across India.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {displayAddresses.map((a, i) => (
          <div key={i} className="rounded-lg border border-surface-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-brand-red">{a.label}</h2>
            <address className="mt-3 space-y-1 text-sm not-italic text-ink-600">
              <p>{a.line1}</p>
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

      <div className="mt-12 rounded-lg bg-brand-red p-8 text-center text-white">
        <h2 className="text-2xl font-bold">Have a product enquiry?</h2>
        <p className="mt-2 text-white/80">Use our enquiry form for a faster response.</p>
        <a href={`${prefix}/enquiry`}
          className="mt-4 inline-block rounded-md border-2 border-white bg-white px-6 py-3 font-semibold text-brand-red hover:bg-transparent hover:text-white">
          Go to Enquiry Form
        </a>
      </div>
    </div>
  )
}
