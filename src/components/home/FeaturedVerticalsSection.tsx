import Link from 'next/link'
import type { HomeContent, Vertical } from '@/payload-types'
import { mediaUrl, mediaAlt } from '@/lib/media'
import { HOME_DEFAULTS, VERTICAL_IMAGE_FALLBACKS, textOr } from '@/lib/content-defaults'

interface Props {
  verticals: Vertical[]
  headings: HomeContent['sectionHeadings']
  prefix: string
}

export function FeaturedVerticalsSection({ verticals, headings, prefix }: Props) {
  if (verticals.length === 0) return null
  const h = headings ?? {}
  const d = HOME_DEFAULTS.sectionHeadings

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-10 text-center text-2xl font-bold uppercase tracking-wide">
          {textOr(h.verticalsHeading, d.verticalsHeading)}
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {verticals.map((v) => (
            <VerticalCard key={v.id} vertical={v} prefix={prefix} />
          ))}
        </div>
      </div>
    </section>
  )
}

function VerticalCard({ vertical, prefix }: { vertical: Vertical; prefix: string }) {
  const img =
    mediaUrl(vertical.cardImage, 'card') ?? mediaUrl(vertical.cardImage) ??
    mediaUrl(vertical.heroImage, 'card') ?? mediaUrl(vertical.heroImage) ??
    VERTICAL_IMAGE_FALLBACKS[vertical.slug] ?? null

  return (
    <Link
      href={`${prefix}/businesses/new-verticals/${vertical.slug}`}
      className="group overflow-hidden rounded-lg border-2 border-brand-gold/30 bg-brand-gold-50/30 transition hover:border-brand-gold hover:shadow-md"
    >
      {img && (
        <div className="h-40 overflow-hidden bg-ink-900">
          {/* eslint-disable-next-line @next/next/no-img-element -- cards use raw <img> for consistent object-fit behaviour across R2/local sources */}
          <img
            src={img}
            alt={mediaAlt(vertical.cardImage) || mediaAlt(vertical.heroImage) || vertical.name}
            className="h-full w-full object-cover opacity-80 transition group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold group-hover:text-brand-red">{vertical.name}</h3>
        {vertical.summary && <p className="mt-3 text-sm text-ink-600">{vertical.summary}</p>}
      </div>
    </Link>
  )
}
