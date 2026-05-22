import { getPayload } from '@/lib/payload'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Our Clients' }

export default async function ClientsPage() {
  const payload = await getPayload()
  const clients = await payload.find({ collection: 'clients', sort: 'order', limit: 200 })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight">Our Clients</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-600">
        Over 1,000 satisfied customers including the Who&apos;s Who of India&apos;s power sector.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {clients.docs.map((c) => (
          <div key={c.id}
            className={`rounded-lg border p-4 text-center text-sm font-medium transition ${
              c.isFeatured
                ? 'border-brand-gold bg-brand-gold-50 text-ink-900'
                : 'border-surface-100 bg-white text-ink-600'
            }`}>
            {c.name}
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-ink-300">
        * All brand names/logos used are trademarks of their respective companies.
      </p>
    </div>
  )
}
