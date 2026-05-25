import Link from 'next/link'
import Image from 'next/image'
import { HeroCarousel, type HeroSlide } from '@/components/HeroCarousel'
import type { Metadata } from 'next'
import { getPayload } from '@/lib/payload'
import { isMedia, mediaUrl, mediaAlt } from '@/lib/media'
import type { Locale } from '@/lib/i18n'
import {
  HOME_DEFAULTS,
  STRENGTHS_DEFAULTS,
  PRODUCT_IMAGE_FALLBACKS,
  VERTICAL_IMAGE_FALLBACKS,
  clientLogoFallback,
  textOr,
  arrayOr,
} from '@/lib/content-defaults'

import { buildMetadata } from '@/lib/seo'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(
    'Powering Growth',
    "India's trusted aluminium conductor manufacturer since 1965. ₹30 Billion company, exports to 30+ countries, LME-listed, NABL accredited.",
  )
}

/** Fallback hero used when SiteSettings has no slides configured. */
const DEFAULT_HERO: HeroSlide = {
  imageUrl: '/images/site/home-hero.jpg',
  imageAlt: 'JSK Industries manufacturing facility',
  eyebrow: 'Since 1965',
  headline: 'Powering Growth',
  subheadline:
    "India's trusted aluminium conductor manufacturer. Conductors · Wire Rods · Trading · Future-ready Technology.",
  ctaLabel: 'Explore Businesses',
  ctaHref: '/businesses',
}

/** Default stats used when SiteSettings.stats is empty. */
const DEFAULT_STATS = [
  { value: '60+',      label: 'Years Experience' },
  { value: '₹30 Bn',   label: 'Group Turnover' },
  { value: '1,08,408', label: 'MT Capacity' },
  { value: '500+',     label: 'Satisfied Customers' },
  { value: '30+',      label: 'Countries Exported' },
]

type Stat = { value: string; label: string }

function resolveSlides(cmsSlides: unknown, locale: string): HeroSlide[] {
  if (!Array.isArray(cmsSlides) || cmsSlides.length === 0) {
    return [{ ...DEFAULT_HERO, ctaHref: `/${locale}${DEFAULT_HERO.ctaHref}` }]
  }
  return cmsSlides
    .map((slide: Record<string, unknown>): HeroSlide | null => {
      const url = mediaUrl(slide.image, 'hero') ?? mediaUrl(slide.image)
      if (!url) return null
      const ctaHref = (slide.ctaHref as string) || '/businesses'
      return {
        imageUrl: url,
        imageAlt: mediaAlt(slide.image) || (slide.headline as string) || 'JSK Industries',
        eyebrow: (slide.eyebrow as string) ?? null,
        headline: (slide.headline as string) ?? '',
        subheadline: (slide.subheadline as string) ?? null,
        ctaLabel: (slide.ctaLabel as string) ?? null,
        ctaHref: ctaHref.startsWith('/') ? `/${locale}${ctaHref}` : ctaHref,
      }
    })
    .filter((s): s is HeroSlide => s !== null)
}

function resolveStats(cmsStats: unknown): Stat[] {
  if (!Array.isArray(cmsStats) || cmsStats.length === 0) return DEFAULT_STATS
  return cmsStats
    .map((s: Record<string, unknown>): Stat | null => {
      const value = typeof s.value === 'string' ? s.value.trim() : ''
      const label = typeof s.label === 'string' ? s.label.trim() : ''
      if (!value || !label) return null
      return { value, label }
    })
    .filter((s): s is Stat => s !== null)
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const prefix = `/${locale}`
  const payload = await getPayload()

  const [productsRes, clientsRes, verticalsRes, settings, home, strengths] = await Promise.all([
    payload.find({ collection: 'products', locale: locale as Locale, depth: 1, limit: 6, sort: 'code', where: { _status: { equals: 'published' } } }),
    payload.find({ collection: 'clients', depth: 1, limit: 50, sort: 'order', where: { isFeatured: { equals: true } } }),
    payload.find({ collection: 'verticals', locale: locale as Locale, depth: 1, limit: 3, where: { _status: { equals: 'published' } } }),
    payload.findGlobal({ slug: 'site-settings', locale: locale as Locale, depth: 2 }),
    payload.findGlobal({ slug: 'home-content', locale: locale as Locale }),
    payload.findGlobal({ slug: 'strengths', locale: locale as Locale }),
  ])

  const products = productsRes.docs
  const clients = clientsRes.docs
  const verticals = verticalsRes.docs

  const slides = resolveSlides(settings.heroSlides, locale)
  const stats = resolveStats(settings.stats)
  const brochureUrl = isMedia(settings.brochure) ? settings.brochure.url : null

  // ── Merge CMS values with hardcoded fallbacks ──
  const manifesto = home.manifesto ?? {}
  const vision = home.vision ?? {}
  const mission = home.mission ?? {}
  const certs = home.certifications ?? {}
  const cta = home.enquiryCta ?? {}
  const headings = home.sectionHeadings ?? {}

  const m = HOME_DEFAULTS.manifesto
  const v = HOME_DEFAULTS.vision
  const ms = HOME_DEFAULTS.mission
  const cd = HOME_DEFAULTS.certifications
  const cta_d = HOME_DEFAULTS.enquiryCta
  const sh = HOME_DEFAULTS.sectionHeadings

  const certItems = arrayOr(certs.items as { label?: string | null; hint?: string | null }[] | null | undefined, cd.items)
  const strengthItems = arrayOr(
    strengths.items as { icon?: string | null; title?: string | null; body?: string | null }[] | null | undefined,
    STRENGTHS_DEFAULTS.items,
  )

  return (
    <>
      <HeroCarousel slides={slides} />

      {/* ── STATS ── */}
      <section className="border-b border-surface-100 bg-surface-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-brand-red sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-sm text-ink-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {textOr(manifesto.headlinePart1, m.headlinePart1)}{' '}
            <span className="text-brand-red">{textOr(manifesto.headlineHighlight, m.headlineHighlight)}</span>{' '}
            {textOr(manifesto.headlinePart3, m.headlinePart3)}
          </h2>
          <p className="mt-6 text-lg text-ink-600">{textOr(manifesto.body, m.body)}</p>
          {brochureUrl && (
            <a
              href={brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-md border-2 border-brand-red px-6 py-3 font-semibold text-brand-red hover:bg-brand-red hover:text-white"
            >
              📄 {textOr(manifesto.brochureButtonLabel, m.brochureButtonLabel)}
            </a>
          )}
        </div>
      </section>

      {/* ── VISION & MISSION ── */}
      <section className="bg-ink-900 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">{textOr(vision.eyebrow, v.eyebrow)}</p>
            <h3 className="mt-3 text-2xl font-bold">{textOr(vision.headline, v.headline)}</h3>
            <p className="mt-4 text-surface-100/80">{textOr(vision.body, v.body)}</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">{textOr(mission.eyebrow, ms.eyebrow)}</p>
            <h3 className="mt-3 text-2xl font-bold">{textOr(mission.headline, ms.headline)}</h3>
            <p className="mt-4 text-surface-100/80">{textOr(mission.body, ms.body)}</p>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      {products.length > 0 && (
        <section className="bg-surface-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="mb-10 text-center text-2xl font-bold uppercase tracking-wide">
              {textOr(headings.productsHeading, sh.productsHeading)}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => {
                const img =
                  mediaUrl(p.cardImage, 'card') ?? mediaUrl(p.cardImage) ??
                  mediaUrl(p.constructionImage, 'card') ?? mediaUrl(p.constructionImage) ??
                  PRODUCT_IMAGE_FALLBACKS[p.slug] ?? null
                return (
                  <Link key={p.id} href={`${prefix}/businesses/conductors/${p.slug}`}
                    className="group rounded-lg border border-surface-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    {img && (
                      <div className="mb-4 flex h-20 items-center justify-center">
                        <img src={img} alt={mediaAlt(p.cardImage) || p.name} className="h-full w-auto object-contain" />
                      </div>
                    )}
                    {p.code && (
                      <span className="inline-block rounded bg-brand-gold-50 px-2 py-0.5 text-xs font-bold text-brand-red-dark">
                        {p.code}
                      </span>
                    )}
                    <h3 className="mt-2 text-lg font-bold group-hover:text-brand-red">{p.name}</h3>
                    {p.shortDescription && <p className="mt-2 text-sm text-ink-600">{p.shortDescription}</p>}
                  </Link>
                )
              })}
            </div>
            <div className="mt-8 text-center">
              <Link href={`${prefix}/businesses`} className="text-sm font-semibold text-brand-red hover:underline">
                {textOr(headings.viewAllProductsLink, sh.viewAllProductsLink)}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CERTIFICATIONS STRIP ── */}
      <section className="border-y border-surface-100 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-ink-600">
            {textOr(certs.heading, cd.heading)}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {certItems.map((c, i) => (
              <div key={i} className="rounded border border-surface-100 p-3 text-center">
                {c.label && <p className="text-sm font-bold text-brand-red">{c.label}</p>}
                {c.hint && <p className="mt-1 text-xs text-ink-600">{c.hint}</p>}
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-ink-600">{textOr(certs.footnote, cd.footnote)}</p>
        </div>
      </section>

      {/* ── NEW VERTICALS ── */}
      {verticals.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="mb-10 text-center text-2xl font-bold uppercase tracking-wide">
              {textOr(headings.verticalsHeading, sh.verticalsHeading)}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {verticals.map((v) => {
                const img =
                  mediaUrl(v.cardImage, 'card') ?? mediaUrl(v.cardImage) ??
                  mediaUrl(v.heroImage, 'card') ?? mediaUrl(v.heroImage) ??
                  VERTICAL_IMAGE_FALLBACKS[v.slug] ?? null
                return (
                  <Link key={v.id} href={`${prefix}/businesses/new-verticals/${v.slug}`}
                    className="group overflow-hidden rounded-lg border-2 border-brand-gold/30 bg-brand-gold-50/30 transition hover:border-brand-gold hover:shadow-md">
                    {img && (
                      <div className="h-40 overflow-hidden bg-ink-900">
                        <img src={img} alt={mediaAlt(v.cardImage) || mediaAlt(v.heroImage) || v.name}
                          className="h-full w-full object-cover opacity-80 transition group-hover:scale-105" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold group-hover:text-brand-red">{v.name}</h3>
                      {v.summary && <p className="mt-3 text-sm text-ink-600">{v.summary}</p>}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CLIENTS ── */}
      {clients.length > 0 && (
        <section className="border-y border-surface-100 bg-surface-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-ink-600">
              {textOr(headings.clientsHeading, sh.clientsHeading)}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {clients.map((c) => {
                const logo = mediaUrl(c.logo, 'card') ?? mediaUrl(c.logo) ?? clientLogoFallback(c.name)
                return (
                  <div key={c.id} className="flex h-16 items-center rounded bg-white px-4 shadow-sm">
                    {logo ? (
                      <Image
                        src={logo}
                        alt={mediaAlt(c.logo) || c.name}
                        width={120}
                        height={48}
                        className="h-8 w-auto object-contain grayscale transition hover:grayscale-0"
                        title={c.name}
                      />
                    ) : (
                      <span className="text-xs font-medium text-ink-600">{c.name}</span>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-6 text-center">
              <Link href={`${prefix}/clients`} className="text-sm font-semibold text-brand-red hover:underline">
                {textOr(headings.viewAllClientsLink, sh.viewAllClientsLink)}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── WHY JSK (Strengths) ── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-10 text-center text-2xl font-bold uppercase tracking-wide">
            {textOr(strengths.heading, STRENGTHS_DEFAULTS.heading)}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {strengthItems.map((s, i) => (
              <div key={i} className="rounded-lg border border-surface-100 p-5">
                {s.icon && <span className="text-2xl">{s.icon}</span>}
                {s.title && <h3 className="mt-3 font-bold">{s.title}</h3>}
                {s.body && <p className="mt-1 text-sm text-ink-600">{s.body}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENQUIRY CTA ── */}
      <section className="bg-brand-red py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-extrabold">{textOr(cta.headline, cta_d.headline)}</h2>
          <p className="mt-4 text-lg text-white/80">{textOr(cta.body, cta_d.body)}</p>
          <Link href={`${prefix}/enquiry`}
            className="mt-8 inline-block rounded-md border-2 border-white bg-white px-8 py-3 font-semibold text-brand-red hover:bg-transparent hover:text-white">
            {textOr(cta.buttonLabel, cta_d.buttonLabel)}
          </Link>
        </div>
      </section>
    </>
  )
}
