import { getPayload, getPageContent } from '@/lib/payload'
import { PAGE_DEFAULTS, textOr } from '@/lib/content-defaults'
import { pageMetadata } from '@/lib/seo'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale as Locale, 'clients')
}

export default async function ClientsPage({ params }: Props) {
  const { locale } = await params
  const payload = await getPayload()

  const [clients, page] = await Promise.all([
    payload.find({ collection: 'clients', sort: 'order', limit: 200 }),
    getPageContent(locale as Locale),
  ])

  const c = page.clients ?? {}
  const d = PAGE_DEFAULTS.clients

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight">{textOr(c.headline, d.headline)}</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-600">{textOr(c.body, d.body)}</p>

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

      <p className="mt-8 text-center text-xs text-ink-300">{textOr(c.footnote, d.footnote)}</p>
    </div>
  )
}
