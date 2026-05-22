import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About Us' }

interface Props { params: Promise<{ locale: string }> }

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const prefix = `/${locale}`
  const payload = await getPayload()

  const persons = await payload.find({ collection: 'persons', sort: 'order', limit: 20 })
  const certs = await payload.find({ collection: 'certifications', limit: 20 })
  const plants = await payload.find({ collection: 'plants', limit: 10 })

  const founder = persons.docs.find((p) => p.isFounder)
  const board = persons.docs.filter((p) => p.isBoard)

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight">About JSK Industries</h1>

      {/* Intro */}
      <section className="mt-10 max-w-3xl space-y-4 text-ink-600 leading-relaxed">
        <p className="text-lg">
          <strong className="text-ink-900">An Emerging Name in the Power Sector.</strong> JSK Industries
          Pvt. Ltd. is a leading Aluminium Conductor manufacturer specializing in Power Transmission &
          Distribution Conductors, Aluminium Wire Rods, and Aluminium Alloys.
        </p>
        <p>
          Established in <strong>1965</strong> by <strong>Mr. Dinesh Shah</strong>, the company carries
          out manufacturing in its state-of-the-art, ISO 9001 certified facility at Silvassa. A
          technology-driven engineering organization, JSK Industries is well-diversified and ranks
          amongst the largest private sector aluminium conductor manufacturing companies in India.
        </p>
        <p>
          The Company is known for initiating new processes, products and materials. A strong
          customer-focused approach and a constant quest for quality has enabled JSK to attain and
          sustain leadership in all lines of business.
        </p>
      </section>

      {/* Leadership */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold uppercase tracking-wide">Leadership</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {founder && (
            <div className="rounded-lg border-2 border-brand-gold/30 bg-brand-gold-50/20 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-red">Founder</p>
              <h3 className="mt-2 text-xl font-bold">{founder.name}</h3>
              <p className="mt-1 text-sm text-ink-600">{founder.role}</p>
            </div>
          )}
          {board.map((p) => (
            <div key={p.id} className="rounded-lg border border-surface-100 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">{p.name}</h3>
              <p className="mt-1 text-sm font-medium text-brand-red">{p.role}</p>
              {p.qualifications && <p className="mt-3 text-sm text-ink-600">{p.qualifications}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Manufacturing */}
      {plants.docs.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold uppercase tracking-wide">Manufacturing Facilities</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {plants.docs.map((p) => (
              <div key={p.id} className="rounded-lg border border-surface-100 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-brand-red">{p.name}</h3>
                {p.address && <p className="mt-2 text-sm text-ink-600">{p.address}</p>}
                {p.city && <p className="text-sm text-ink-600">{p.city}</p>}
                {p.area && <p className="mt-2 text-sm font-medium">Area: {p.area}</p>}
                {p.capacities && p.capacities.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm text-ink-600">
                    {p.capacities.map((c, i) => (
                      <li key={i}>• {c.label}: <strong>{c.value}</strong></li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certs.docs.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold uppercase tracking-wide">Certifications</h2>
          <div className="mt-8 flex flex-wrap gap-4">
            {certs.docs.map((c) => (
              <div key={c.id} className="rounded-lg border border-brand-gold bg-brand-gold-50 px-6 py-4 text-center">
                <p className="font-bold">{c.name}</p>
                {c.issuer && <p className="mt-1 text-xs text-ink-600">{c.issuer}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
