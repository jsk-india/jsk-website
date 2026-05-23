import Link from 'next/link'
import { WhyJSK } from '@/components/WhyJSK'
import { HeroCarousel, type HeroSlide } from '@/components/HeroCarousel'
import type { Metadata } from 'next'
import { getPayload } from '@/lib/payload'
import { isMedia, mediaUrl, mediaAlt } from '@/lib/media'
import type { Locale } from '@/lib/i18n'

/** Map product slugs to legacy image files */
const PRODUCT_IMAGES: Record<string, string> = {
  aaac: '/images/products/aaac.gif',
  aac: '/images/products/aac.gif',
  acsr: '/images/products/acsr.gif',
  aacsr: '/images/products/aacsr.gif',
  acar: '/images/products/acar.gif',
  'acsr-aw': '/images/products/acsr-aw.gif',
  'acsr-tw': '/images/products/acsr-tw.gif',
  acss: '/images/products/acss.jpg',
  accc: '/images/products/accc.jpg',
  stacir: '/images/products/stacir.jpg',
  tacsr: '/images/products/tacsr.jpg',
  'al-59': '/images/products/al-59.jpg',
  'gap-type': '/images/products/gap-conductor.jpg',
}

const VERTICAL_IMAGES: Record<string, string> = {
  veda: '/images/verticals/veda.jpeg',
  'digital-substation': '/images/verticals/Prosoft-slider.png',
  'cyber-security': '/images/verticals/Velox-slider.png',
}

const CLIENT_LOGOS: Record<string, string> = {
  BHEL: '/images/clients/logo-bhel.gif',
  'L&T': '/images/clients/logo-lt.gif',
  RIL: '/images/clients/logo-ril.gif',
  SAIL: '/images/clients/logo-sail.gif',
  TISCO: '/images/clients/logo-tatasteel.gif',
  Suzlon: '/images/clients/logo-suzlon.gif',
  MPPTCL: '/images/clients/logo-mpptcl.gif',
  Apar: '/images/clients/logo-apar.gif',
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

/** Stat shown in the homepage stats strip. */
type Stat = { value: string; label: string }

/** Fallback stats used when SiteSettings.stats is empty. */
const DEFAULT_STATS: Stat[] = [
  { value: '60+',      label: 'Years Experience' },
  { value: '₹30 Bn',   label: 'Group Turnover' },
  { value: '1,08,408', label: 'MT Capacity' },
  { value: '500+',     label: 'Satisfied Customers' },
  { value: '30+',      label: 'Countries Exported' },
]

/** Resolve stats from CMS, falling back to defaults if not configured. */
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

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'JSK Industries — Powering Growth',
    description:
      "India's trusted aluminium conductor manufacturer since 1965. ₹30 Billion company, exports to 30+ countries, LME-listed, NABL accredited.",
  }
}

/** Resolve hero slides from CMS, falling back to a default static slide. */
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

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const prefix = `/${locale}`
  const payload = await getPayload()

  const [productsRes, clientsRes, verticalsRes, settings] = await Promise.all([
    payload.find({ collection: 'products', locale: locale as Locale, limit: 6, sort: 'code', where: { _status: { equals: 'published' } } }),
    payload.find({ collection: 'clients', limit: 50, sort: 'order', where: { isFeatured: { equals: true } } }),
    payload.find({ collection: 'verticals', locale: locale as Locale, limit: 3, where: { _status: { equals: 'published' } } }),
    payload.findGlobal({ slug: 'site-settings', depth: 2 }),
  ])

  const products = productsRes.docs
  const clients = clientsRes.docs
  const verticals = verticalsRes.docs

  const slides = resolveSlides(settings.heroSlides, locale)
  const stats = resolveStats(settings.stats)
  const brochureUrl = isMedia(settings.brochure) ? settings.brochure.url : null

  return (
    <>
      {/* ── HERO (CMS-driven carousel) ── */}
      <HeroCarousel slides={slides} />

      {/* ── STATS — CMS-driven via Site Settings > Homepage Stats ── */}
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

      {/* ── ABOUT / MANIFESTO ── */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Made in India. <span className="text-brand-red">Built to Last.</span> Powering Growth.
          </h2>
          <p className="mt-6 text-lg text-ink-600">
            After six decades of leadership in the aluminium sector, JSK Industries is now a
            name to reckon with in the power sector. We rank amongst the largest aluminium
            conductor manufacturing companies in the world — known for initiating new processes,
            products, and materials.
          </p>
          {brochureUrl && (
            <a
              href={brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-md border-2 border-brand-red px-6 py-3 font-semibold text-brand-red hover:bg-brand-red hover:text-white"
            >
              📄 Download Company Brochure
            </a>
          )}
        </div>
      </section>

      {/* ── VISION & MISSION (from brochure) ── */}
      <section className="bg-ink-900 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">Our Vision</p>
            <h3 className="mt-3 text-2xl font-bold">500 GW Energy Transmission by 2030</h3>
            <p className="mt-4 text-surface-100/80">
              To lead the energy sector by providing cutting-edge, reliable, and sustainable
              solutions that power the world&apos;s infrastructure, foster technological
              advancement, and contribute to a cleaner, more connected future.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">Our Mission</p>
            <h3 className="mt-3 text-2xl font-bold">Continuous Improvement &amp; Value Addition</h3>
            <p className="mt-4 text-surface-100/80">
              Harnessing and using our learnings to drive continuous improvement, value addition,
              and all-round corporate social responsibility while maintaining our core values.
            </p>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS (from CMS) ── */}
      <section className="bg-surface-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-10 text-center text-2xl font-bold uppercase tracking-wide">Our Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link key={p.id} href={`${prefix}/businesses/conductors/${p.slug}`}
                className="group rounded-lg border border-surface-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                {PRODUCT_IMAGES[p.slug] && (
                  <div className="mb-4 flex h-20 items-center justify-center">
                    <img src={PRODUCT_IMAGES[p.slug]} alt={p.name} className="h-full w-auto object-contain" />
                  </div>
                )}
                <span className="inline-block rounded bg-brand-gold-50 px-2 py-0.5 text-xs font-bold text-brand-red-dark">
                  {p.code}
                </span>
                <h3 className="mt-2 text-lg font-bold group-hover:text-brand-red">{p.name}</h3>
                <p className="mt-2 text-sm text-ink-600">{p.shortDescription}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href={`${prefix}/businesses`} className="text-sm font-semibold text-brand-red hover:underline">
              View all products →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS STRIP ── */}
      <section className="border-y border-surface-100 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-ink-600">
            Certified, Accredited &amp; Recognized
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: 'ISO 9001:2015',     hint: 'Quality Management' },
              { label: 'ISO 14001:2015',    hint: 'Environment' },
              { label: 'OHSAS 18001',       hint: 'Health & Safety' },
              { label: 'LME Listed',        hint: 'London Metal Exchange' },
              { label: 'NABL Accredited',   hint: 'ISO/IEC 17025 Lab' },
              { label: 'RETIE Certified',   hint: 'Latin American Market' },
            ].map((c) => (
              <div key={c.label} className="rounded border border-surface-100 p-3 text-center">
                <p className="text-sm font-bold text-brand-red">{c.label}</p>
                <p className="mt-1 text-xs text-ink-600">{c.hint}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-ink-600">
            ICRA &ldquo;A Grade&rdquo; rated · Authorized Economic Operator (Govt. of India) · Approved by PGCIL &amp; all major Indian utilities
          </p>
        </div>
      </section>

      {/* ── NEW VERTICALS (from CMS) ── */}
      {verticals.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="mb-10 text-center text-2xl font-bold uppercase tracking-wide">New Verticals</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {verticals.map((v) => (
                <Link key={v.id} href={`${prefix}/businesses/new-verticals/${v.slug}`}
                  className="group overflow-hidden rounded-lg border-2 border-brand-gold/30 bg-brand-gold-50/30 transition hover:border-brand-gold hover:shadow-md">
                  {VERTICAL_IMAGES[v.slug] && (
                    <div className="h-40 overflow-hidden bg-ink-900">
                      <img src={VERTICAL_IMAGES[v.slug]} alt={v.name} className="h-full w-full object-cover opacity-80 transition group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold group-hover:text-brand-red">{v.name}</h3>
                    <p className="mt-3 text-sm text-ink-600">{v.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CLIENTS (from CMS) ── */}
      {clients.length > 0 && (
        <section className="border-y border-surface-100 bg-surface-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-ink-600">
              Trusted by India&apos;s leading companies
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {clients.map((c) => {
                const logoKey = Object.keys(CLIENT_LOGOS).find((k) => c.name.includes(k))
                const logo = logoKey ? CLIENT_LOGOS[logoKey] : null
                return (
                  <div key={c.id} className="flex h-16 items-center rounded bg-white px-4 shadow-sm">
                    {logo ? (
                      <img src={logo} alt={c.name} className="h-8 w-auto grayscale transition hover:grayscale-0" title={c.name} />
                    ) : (
                      <span className="text-xs font-medium text-ink-600">{c.name}</span>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-6 text-center">
              <Link href={`${prefix}/clients`} className="text-sm font-semibold text-brand-red hover:underline">
                View all clients →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── WHY JSK ── */}
      <WhyJSK />

      {/* ── ENQUIRY CTA ── */}
      <section className="bg-brand-red py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-extrabold">Ready to discuss your project?</h2>
          <p className="mt-4 text-lg text-white/80">
            Get in touch for product enquiries, quotes, or partnership discussions.
          </p>
          <Link href={`${prefix}/enquiry`}
            className="mt-8 inline-block rounded-md border-2 border-white bg-white px-8 py-3 font-semibold text-brand-red hover:bg-transparent hover:text-white">
            Get a Quote
          </Link>
        </div>
      </section>
    </>
  )
}
