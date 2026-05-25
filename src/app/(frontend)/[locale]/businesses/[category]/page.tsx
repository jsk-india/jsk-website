import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayload, getPageContent } from '@/lib/payload'
import { mediaUrl, mediaAlt } from '@/lib/media'
import { PAGE_DEFAULTS, textOr } from '@/lib/content-defaults'
import { buildMetadata } from '@/lib/seo'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

interface Props { params: Promise<{ locale: string; category: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const payload = await getPayload()
  const cats = await payload.find({ collection: 'product-categories', where: { slug: { equals: category } }, limit: 1 })
  return buildMetadata(cats.docs[0]?.name ?? 'Products')
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category } = await params
  const prefix = `/${locale}`
  const payload = await getPayload()

  const [cats, page] = await Promise.all([
    payload.find({
      collection: 'product-categories',
      where: { slug: { equals: category } },
      locale: locale as Locale,
      limit: 1,
    }),
    getPageContent(locale as Locale),
  ])
  const cat = cats.docs[0]
  if (!cat) notFound()

  const products = await payload.find({
    collection: 'products',
    where: { category: { equals: cat.id }, _status: { equals: 'published' } },
    locale: locale as Locale,
    sort: 'code',
    depth: 1,
    limit: 50,
  })

  const t = page.categoryListing ?? {}
  const d = PAGE_DEFAULTS.categoryListing

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <nav className="mb-6 text-sm text-ink-600">
        <Link href={`${prefix}/businesses`} className="hover:text-brand-red">{textOr(t.breadcrumbBusinesses, d.breadcrumbBusinesses)}</Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-ink-900">{cat.name}</span>
      </nav>

      <h1 className="text-4xl font-extrabold uppercase tracking-tight">{cat.name}</h1>
      {cat.description && (
        <p className="mt-4 max-w-2xl text-lg text-ink-600">{cat.description}</p>
      )}

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.docs.map((p) => {
          const thumb = mediaUrl(p.constructionImage, 'thumbnail')
          return (
            <Link key={p.id} href={`${prefix}/businesses/${category}/${p.slug}`}
              className="group overflow-hidden rounded-lg border border-surface-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              {thumb && (
                <div className="flex h-36 items-center justify-center border-b border-surface-100 bg-surface-50 p-4">
                  <Image src={thumb} alt={mediaAlt(p.constructionImage) || String(p.name)} width={200} height={120} className="h-full w-auto object-contain" />
                </div>
              )}
              <div className="p-6">
                <span className="inline-block rounded bg-brand-gold-50 px-2 py-0.5 text-xs font-bold text-brand-red-dark">{p.code}</span>
                <h3 className="mt-2 text-lg font-bold group-hover:text-brand-red">{p.name}</h3>
                <p className="mt-2 text-sm text-ink-600">{p.shortDescription}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {products.docs.length === 0 && (
        <p className="mt-12 text-center text-ink-600">{textOr(t.emptyMessage, d.emptyMessage)}</p>
      )}
    </div>
  )
}
