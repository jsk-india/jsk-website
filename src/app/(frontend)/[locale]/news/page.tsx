import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'News & Updates' }

interface Props { params: Promise<{ locale: string }> }

const CATEGORY_LABELS: Record<string, string> = {
  press: 'Press Release', event: 'Event', award: 'Award',
  exhibition: 'Exhibition', announcement: 'Announcement',
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params
  const prefix = `/${locale}`
  const payload = await getPayload()

  const articles = await payload.find({
    collection: 'news-articles',
    locale: locale as Locale,
    sort: '-publishedAt',
    limit: 20,
    where: { _status: { equals: 'published' } },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight">News & Updates</h1>
      <p className="mt-4 text-lg text-ink-600">
        The latest from JSK Industries — press releases, events, awards, and announcements.
      </p>

      {articles.totalDocs === 0 ? (
        <div className="mt-16 rounded-lg border-2 border-dashed border-surface-100 py-20 text-center">
          <p className="text-3xl">📰</p>
          <h2 className="mt-4 text-xl font-bold">News coming soon</h2>
          <p className="mt-2 text-ink-600">
            We&apos;ll be sharing updates here shortly. In the meantime,
            feel free to <a href={`${prefix}/contact`} className="text-brand-red hover:underline">get in touch</a>.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.docs.map((a) => (
            <Link key={a.id} href={`${prefix}/news/${a.slug}`}
              className="group rounded-lg border border-surface-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-ink-600">
                  <span className="rounded-full bg-brand-gold-50 px-2 py-0.5 font-medium text-brand-red-dark">
                    {CATEGORY_LABELS[a.category as string] ?? a.category}
                  </span>
                  <span>{new Date(a.publishedAt as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <h2 className="mt-2 text-lg font-bold group-hover:text-brand-red">{a.title}</h2>
                {a.summary && <p className="mt-2 text-sm text-ink-600 line-clamp-3">{a.summary}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
