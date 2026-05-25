import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { RichText } from '@/components/RichText'
import { mediaUrl, mediaAlt } from '@/lib/media'
import { PAGE_DEFAULTS, textOr } from '@/lib/content-defaults'
import { buildMetadata } from '@/lib/seo'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

interface Props { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const payload = await getPayload()
  const res = await payload.find({
    collection: 'news-articles',
    where: { slug: { equals: slug } },
    locale: locale as Locale,
    limit: 1,
  })
  const a = res.docs[0]
  return buildMetadata(a?.title ?? 'News', a?.summary ?? undefined)
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const prefix = `/${locale}`
  const payload = await getPayload()

  const [res, page] = await Promise.all([
    payload.find({
      collection: 'news-articles',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      locale: locale as Locale,
      depth: 2,
      limit: 1,
    }),
    payload.findGlobal({ slug: 'page-content', locale: locale as Locale }),
  ])
  const article = res.docs[0]
  if (!article) notFound()

  const cover = mediaUrl(article.cover, 'hero') ?? mediaUrl(article.cover)
  const t = page.newsDetail ?? {}
  const d = PAGE_DEFAULTS.newsDetail

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <nav className="mb-6 text-sm text-ink-600">
        <Link href={`${prefix}/news`} className="hover:text-brand-red">{textOr(t.breadcrumbNews, d.breadcrumbNews)}</Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-ink-900">{article.title}</span>
      </nav>

      <p className="text-sm text-ink-600">
        {new Date(article.publishedAt as string).toLocaleDateString(locale, {
          day: 'numeric', month: 'long', year: 'numeric',
        })}
        {article.author && <> · {article.author}</>}
      </p>

      <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{article.title}</h1>

      {article.summary && <p className="mt-4 text-lg text-ink-600">{article.summary}</p>}

      {cover && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg bg-surface-100">
          <Image src={cover} alt={mediaAlt(article.cover) || (article.title as string)} fill priority className="object-cover" sizes="(min-width: 768px) 768px, 100vw" />
        </div>
      )}

      {article.body ? (
        <RichText data={article.body} className="mt-10" />
      ) : (
        <p className="mt-10 text-ink-300">{textOr(t.emptyBodyMessage, d.emptyBodyMessage)}</p>
      )}
    </article>
  )
}
