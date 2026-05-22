import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

interface Props { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const payload = await getPayload()
  const res = await payload.find({ collection: 'news-articles', where: { slug: { equals: slug } }, locale: locale as Locale, limit: 1 })
  const a = res.docs[0]
  return { title: a?.title ?? 'News', description: a?.summary ?? undefined }
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const prefix = `/${locale}`
  const payload = await getPayload()

  const res = await payload.find({
    collection: 'news-articles',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    locale: locale as Locale,
    limit: 1,
  })
  const article = res.docs[0]
  if (!article) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <nav className="mb-6 text-sm text-ink-600">
        <Link href={`${prefix}/news`} className="hover:text-brand-red">News</Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-ink-900">{article.title}</span>
      </nav>
      <p className="text-sm text-ink-600">
        {new Date(article.publishedAt as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        {article.author && <> · {article.author}</>}
      </p>
      <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{article.title}</h1>
      {article.summary && <p className="mt-4 text-lg text-ink-600">{article.summary}</p>}
      <div className="mt-8 text-sm text-ink-300">Full article body coming soon.</div>
    </div>
  )
}
