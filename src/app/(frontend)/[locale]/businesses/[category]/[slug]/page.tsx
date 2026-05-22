import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { isMedia, mediaUrl, mediaAlt } from '@/lib/media'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

interface Props { params: Promise<{ locale: string; category: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const payload = await getPayload()
  const res = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    locale: locale as Locale,
    limit: 1,
  })
  const p = res.docs[0]
  return {
    title: p ? `${p.code} — ${p.name}` : 'Product',
    description: p?.shortDescription ?? undefined,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, category, slug } = await params
  const prefix = `/${locale}`
  const payload = await getPayload()

  const res = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    locale: locale as Locale,
    depth: 2,
    limit: 1,
  })
  const product = res.docs[0]
  if (!product) notFound()

  const catName = isMedia(product.category)
    ? ''
    : typeof product.category === 'object' && product.category !== null
      ? (product.category as { name: string }).name
      : 'Products'

  const heroImg = mediaUrl(product.constructionImage, 'card')
  const heroAlt = mediaAlt(product.constructionImage) || String(product.name)

  const galleryItems = ((product.galleryImages ?? []) as { image?: unknown }[])
    .map((g) => ({ url: mediaUrl(g.image, 'card'), alt: mediaAlt(g.image) }))
    .filter((g): g is { url: string; alt: string } => g.url !== null)

  const brochureUrl = isMedia(product.brochurePdf) ? product.brochurePdf.url : null

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-ink-600">
        <Link href={`${prefix}/businesses`} className="hover:text-brand-red">Businesses</Link>
        <span className="mx-2">›</span>
        <Link href={`${prefix}/businesses/${category}`} className="hover:text-brand-red">{catName}</Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-ink-900">{product.code}</span>
      </nav>

      {/* Hero row — image left, summary right (if image exists) */}
      {heroImg ? (
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <div className="w-full shrink-0 md:w-80">
            <div className="overflow-hidden rounded-lg border border-surface-100 bg-surface-50 p-4">
              <Image
                src={heroImg}
                alt={heroAlt}
                width={320}
                height={240}
                className="h-auto w-full object-contain"
                priority
              />
            </div>
          </div>
          <div className="flex-1">
            <ProductHeader product={product} prefix={prefix} slug={slug} />
          </div>
        </div>
      ) : (
        <ProductHeader product={product} prefix={prefix} slug={slug} />
      )}

      {/* Gallery */}
      {galleryItems.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">Gallery</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {galleryItems.map((img, i) => (
              <div key={i} className="overflow-hidden rounded-lg border border-surface-100 bg-surface-50 p-2">
                <Image
                  src={img.url}
                  alt={img.alt || String(product.name)}
                  width={300}
                  height={200}
                  className="h-40 w-full object-contain"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-10">
          {product.specsTable && product.specsTable.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold">Specifications</h2>
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {product.specsTable.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-surface-50' : ''}>
                      <td className="border border-surface-100 px-4 py-2 font-medium">{row.property}</td>
                      <td className="border border-surface-100 px-4 py-2">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {product.standards && product.standards.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold">Standards & Compliance</h2>
              <div className="flex flex-wrap gap-2">
                {product.standards.map((s, i) => (
                  <span key={i} className="rounded-full border border-brand-gold bg-brand-gold-50 px-3 py-1 text-xs font-medium">
                    {s.label}
                  </span>
                ))}
              </div>
            </section>
          )}

          {product.applications && product.applications.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold">Applications</h2>
              <ul className="list-inside list-disc space-y-1 text-ink-600">
                {product.applications.map((a, i) => (
                  <li key={i}>{a.label}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-surface-100 bg-surface-50 p-6">
            <h3 className="font-bold">Interested in this product?</h3>
            <p className="mt-2 text-sm text-ink-600">
              Get a quote or request technical details from our team.
            </p>
            <Link href={`${prefix}/enquiry?product=${product.slug}`}
              className="mt-4 block rounded-md bg-brand-red px-4 py-2.5 text-center font-semibold text-white hover:bg-brand-red-dark">
              Enquire Now
            </Link>
            {brochureUrl && (
              <a href={brochureUrl} target="_blank" rel="noopener"
                className="mt-3 block rounded-md border border-brand-red px-4 py-2.5 text-center text-sm font-semibold text-brand-red hover:bg-brand-red/5">
                📄 Download Brochure
              </a>
            )}
          </div>

          {product.relatedProducts && (product.relatedProducts as any[]).length > 0 && (
            <div className="rounded-lg border border-surface-100 p-6">
              <h3 className="mb-3 font-bold">Related Products</h3>
              <ul className="space-y-2 text-sm">
                {(product.relatedProducts as any[]).map((rp: any) => (
                  <li key={rp.id ?? rp}>
                    <Link href={`${prefix}/businesses/${category}/${rp.slug ?? rp}`}
                      className="text-brand-red hover:underline">
                      {rp.code ?? rp.name ?? 'View product'}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

/** Extracted to avoid repeating in both layout paths above */
function ProductHeader({
  product,
  prefix,
  slug,
}: {
  product: { code?: string | null; name: string; shortDescription?: string | null }
  prefix: string
  slug: string
}) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded bg-brand-red px-3 py-1 text-sm font-bold text-white">
          {product.code}
        </span>
        <h1 className="text-3xl font-extrabold sm:text-4xl">{product.name}</h1>
      </div>
      {product.shortDescription && (
        <p className="mt-4 max-w-3xl text-lg text-ink-600">{product.shortDescription}</p>
      )}
    </>
  )
}
