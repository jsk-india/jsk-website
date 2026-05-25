import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from '@/lib/payload'
import { mediaUrl, mediaAlt } from '@/lib/media'
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
  const payload = await getPayload()

  const [articles, page] = await Promise.all([
    payload.find({
      collection: 'news-articles', locale: locale as Locale, sort: '-publishedAt', limit: 20, depth: 1,
      where: { _status: { equals: 'published' } },
    }),
    payload.findGlobal({ slug: 'page-content', locale: locale as Locale }),
  ])

  const n = page.news ?? {}

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {n.headline && <h1 className="text-4xl font-extrabold uppercase tracking-tight">{n.headline}</h1>}
      {n.body && <p className="mt-4 text-lg text-ink-600">{n.body}</p>}

      {articles.totalDocs === 0 ? (
        (n.emptyTitle || n.emptyBody) && (
          <div className="mt-16 rounded-lg border-2 border-dashed border-surface-100 py-20 text-center">
            <p className="text-3xl">📰</p>
            {n.emptyTitle && <h2 className="mt-4 text-xl font-bold">{n.emptyTitle}</h2>}
            {n.emptyBody && <p className="mt-2 text-ink-600">{n.emptyBody}</p>}
          </div>
        )
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.docs.map((a) => {
            const cover = mediaUrl(a.cover, 'card') ?? mediaUrl(a.cover)
            const prefix = `/${locale}`
            return (
              <Link key={a.id} href={`${prefix}/news/${a.slug}`}
                className="group overflow-hidden rounded-lg border border-surface-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                {cover && (
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-100">
                    <Image src={cover} alt={mediaAlt(a.cover) || (a.title as string)} fill
                      className="object-cover transition group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-ink-600">
                    <span className="rounded-full bg-brand-gold-50 px-2 py-0.5 font-medium text-brand-red-dark">
                      {CATEGORY_LABELS[a.category as string] ?? a.category}
                    </span>
                    <span>
                      {new Date(a.publishedAt as string).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h2 className="mt-2 text-lg font-bold group-hover:text-brand-red">{a.title}</h2>
                  {a.summary && <p className="mt-2 text-sm text-ink-600 line-clamp-3">{a.summary}</p>}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
