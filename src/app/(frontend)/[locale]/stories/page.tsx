import { getPayload } from '@/lib/payload'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Stories & Case Studies' }

interface Props { params: Promise<{ locale: string }> }

export default async function StoriesPage({ params }: Props) {
  const { locale } = await params
  const payload = await getPayload()

  const [stories, page] = await Promise.all([
    payload.find({
      collection: 'stories', locale: locale as Locale, sort: '-publishedAt', limit: 20,
      where: { _status: { equals: 'published' } },
    }),
    payload.findGlobal({ slug: 'page-content', locale: locale as Locale }),
  ])

  const s = page.stories ?? {}

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {s.headline && <h1 className="text-4xl font-extrabold uppercase tracking-tight">{s.headline}</h1>}
      {s.body && <p className="mt-4 text-lg text-ink-600">{s.body}</p>}

      {stories.totalDocs === 0 ? (
        (s.emptyTitle || s.emptyBody) && (
          <div className="mt-16 rounded-lg border-2 border-dashed border-surface-100 py-20 text-center">
            <p className="text-3xl">📖</p>
            {s.emptyTitle && <h2 className="mt-4 text-xl font-bold">{s.emptyTitle}</h2>}
            {s.emptyBody && <p className="mt-2 text-ink-600">{s.emptyBody}</p>}
          </div>
        )
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stories.docs.map((story) => (
            <article key={story.id} className="rounded-lg border border-surface-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">{story.title}</h2>
              {story.summary && <p className="mt-2 text-sm text-ink-600">{story.summary}</p>}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
