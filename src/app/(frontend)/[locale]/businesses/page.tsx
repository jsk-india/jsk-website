import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import type { Locale } from '@/lib/i18n'

interface Props { params: Promise<{ locale: string }> }

export default async function BusinessesPage({ params }: Props) {
  const { locale } = await params
  const prefix = `/${locale}`
  const payload = await getPayload()

  const [categories, page] = await Promise.all([
    payload.find({ collection: 'product-categories', locale: locale as Locale, sort: 'order', limit: 20 }),
    payload.findGlobal({ slug: 'page-content', locale: locale as Locale }),
  ])

  const b = page.businesses ?? {}

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {b.headline && <h1 className="text-4xl font-extrabold uppercase tracking-tight">{b.headline}</h1>}
      {b.body && <p className="mt-4 max-w-2xl text-lg text-ink-600">{b.body}</p>}

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.docs.map((cat) => (
          <Link key={cat.id} href={`${prefix}/businesses/${cat.slug}`}
            className="group rounded-lg border border-surface-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <h2 className="text-2xl font-bold group-hover:text-brand-red">{cat.name}</h2>
            {cat.description && <p className="mt-3 text-ink-600">{cat.description}</p>}
          </Link>
        ))}

        {(b.newVerticalsCardTitle || b.newVerticalsCardBody) && (
          <Link href={`${prefix}/businesses/new-verticals`}
            className="group rounded-lg border-2 border-brand-gold/40 bg-brand-gold-50/30 p-8 transition hover:border-brand-gold hover:shadow-lg">
            {b.newVerticalsCardTitle && (
              <h2 className="text-2xl font-bold group-hover:text-brand-red">{b.newVerticalsCardTitle}</h2>
            )}
            {b.newVerticalsCardBody && <p className="mt-3 text-ink-600">{b.newVerticalsCardBody}</p>}
          </Link>
        )}
      </div>
    </div>
  )
}
