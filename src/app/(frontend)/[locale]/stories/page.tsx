import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Stories & Case Studies' }

interface Props { params: Promise<{ locale: string }> }

export default async function StoriesPage({ params }: Props) {
  const { locale } = await params
  const prefix = `/${locale}`
  const payload = await getPayload()

  const stories = await payload.find({
    collection: 'stories',
    locale: locale as Locale,
    sort: '-publishedAt',
    limit: 20,
    where: { _status: { equals: 'published' } },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight">Stories</h1>
      <p className="mt-4 text-lg text-ink-600">
        Case studies, project highlights, and stories from the field.
      </p>

      {stories.totalDocs === 0 ? (
        <div className="mt-16 rounded-lg border-2 border-dashed border-surface-100 py-20 text-center">
          <p className="text-3xl">📖</p>
          <h2 className="mt-4 text-xl font-bold">Stories coming soon</h2>
          <p className="mt-2 text-ink-600">
            We&apos;re working on our first case studies. Have a project to share?{' '}
            <a href={`${prefix}/contact`} className="text-brand-red hover:underline">Get in touch.</a>
          </p>
        </div>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stories.docs.map((s) => (
            <article key={s.id} className="rounded-lg border border-surface-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">{s.title}</h2>
              {s.summary && <p className="mt-2 text-sm text-ink-600">{s.summary}</p>}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
