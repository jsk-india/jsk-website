import Link from 'next/link'
import type { HomeContent, Product } from '@/payload-types'
import { mediaUrl, mediaAlt } from '@/lib/media'
import { HOME_DEFAULTS, PRODUCT_IMAGE_FALLBACKS, textOr } from '@/lib/content-defaults'

interface Props {
  products: Product[]
  headings: HomeContent['sectionHeadings']
  prefix: string
}

export function FeaturedProductsSection({ products, headings, prefix }: Props) {
  if (products.length === 0) return null
  const h = headings ?? {}
  const d = HOME_DEFAULTS.sectionHeadings

  return (
    <section className="bg-surface-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-10 text-center text-2xl font-bold uppercase tracking-wide">
          {textOr(h.productsHeading, d.productsHeading)}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} prefix={prefix} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href={`${prefix}/businesses`} className="text-sm font-semibold text-brand-red hover:underline">
            {textOr(h.viewAllProductsLink, d.viewAllProductsLink)}
          </Link>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, prefix }: { product: Product; prefix: string }) {
  const img =
    mediaUrl(product.cardImage, 'card') ?? mediaUrl(product.cardImage) ??
    mediaUrl(product.constructionImage, 'card') ?? mediaUrl(product.constructionImage) ??
    PRODUCT_IMAGE_FALLBACKS[product.slug] ?? null

  return (
    <Link
      href={`${prefix}/businesses/conductors/${product.slug}`}
      className="group rounded-lg border border-surface-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {img && (
        <div className="mb-4 flex h-20 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- product logos are tiny + varied aspect ratios; next/image adds overhead here */}
          <img src={img} alt={mediaAlt(product.cardImage) || product.name} className="h-full w-auto object-contain" />
        </div>
      )}
      {product.code && (
        <span className="inline-block rounded bg-brand-gold-50 px-2 py-0.5 text-xs font-bold text-brand-red-dark">
          {product.code}
        </span>
      )}
      <h3 className="mt-2 text-lg font-bold group-hover:text-brand-red">{product.name}</h3>
      {product.shortDescription && <p className="mt-2 text-sm text-ink-600">{product.shortDescription}</p>}
    </Link>
  )
}
