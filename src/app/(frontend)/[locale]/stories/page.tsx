import { getPayload } from '@/lib/payload'
import { PAGE_DEFAULTS, textOr } from '@/lib/content-defaults'
import { pageMetadata } from '@/lib/seo'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale as Locale, 'stories')
}

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
  const d = PAGE_DEFAULTS.stories

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight">{textOr(s.headline, d.headline)}</h1>
      <p className="mt-4 text-lg text-ink-600">{textOr(s.body, d.body)}</p>

      {stories.totalDocs === 0 ? (
        <div className="mt-16 rounded-lg border-2 border-dashed border-surface-100 py-20 text-center">
          <p className="text-3xl">📖</p>
          <h2 className="mt-4 text-xl font-bold">{textOr(s.emptyTitle, d.emptyTitle)}</h2>
          <p className="mt-2 text-ink-600">{textOr(s.emptyBody, d.emptyBody)}</p>
        </div>
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
