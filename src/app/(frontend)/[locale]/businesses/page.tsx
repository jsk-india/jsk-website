import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import type { Locale } from '@/lib/i18n'

interface Props { params: Promise<{ locale: string }> }

export default async function BusinessesPage({ params }: Props) {
  const { locale } = await params
  const prefix = `/${locale}`
  const payload = await getPayload()

  const categories = await payload.find({
    collection: 'product-categories',
    locale: locale as Locale,
    sort: 'order',
    limit: 20,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight">Businesses</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-600">
        JSK Industries manufactures and trades a comprehensive range of aluminium
        products for the power sector and beyond.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.docs.map((cat) => (
          <Link key={cat.id} href={`${prefix}/businesses/${cat.slug}`}
            className="group rounded-lg border border-surface-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <h2 className="text-2xl font-bold group-hover:text-brand-red">{cat.name}</h2>
            {cat.description && <p className="mt-3 text-ink-600">{cat.description}</p>}
          </Link>
        ))}

        {/* New Verticals card */}
        <Link href={`${prefix}/businesses/new-verticals`}
          className="group rounded-lg border-2 border-brand-gold/40 bg-brand-gold-50/30 p-8 transition hover:border-brand-gold hover:shadow-lg">
          <h2 className="text-2xl font-bold group-hover:text-brand-red">New Verticals</h2>
          <p className="mt-3 text-ink-600">
            VEDA, Digital Substation, Cyber Security — future-ready technology verticals.
          </p>
        </Link>
      </div>
    </div>
  )
}
