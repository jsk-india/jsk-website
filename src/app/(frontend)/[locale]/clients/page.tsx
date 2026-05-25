import { getPayload } from '@/lib/payload'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Our Clients' }

interface Props { params: Promise<{ locale: string }> }

export default async function ClientsPage({ params }: Props) {
  const { locale } = await params
  const payload = await getPayload()

  const [clients, page] = await Promise.all([
    payload.find({ collection: 'clients', sort: 'order', limit: 200 }),
    payload.findGlobal({ slug: 'page-content', locale: locale as Locale }),
  ])

  const c = page.clients ?? {}

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {c.headline && <h1 className="text-4xl font-extrabold uppercase tracking-tight">{c.headline}</h1>}
      {c.body && <p className="mt-4 max-w-2xl text-lg text-ink-600">{c.body}</p>}

      <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {clients.docs.map((client) => (
          <div key={client.id}
            className={`rounded-lg border p-4 text-center text-sm font-medium transition ${
              client.isFeatured
                ? 'border-brand-gold bg-brand-gold-50 text-ink-900'
                : 'border-surface-100 bg-white text-ink-600'
            }`}>
            {client.name}
          </div>
        ))}
      </div>

      {c.footnote && <p className="mt-8 text-center text-xs text-ink-300">{c.footnote}</p>}
    </div>
  )
}
