import Link from 'next/link'
import Image from 'next/image'
import { WhyJSK } from '@/components/WhyJSK'
import type { Metadata } from 'next'
import { getPayload } from '@/lib/payload'
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

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'JSK Industries — Powering Growth',
    description:
      "India's trusted aluminium conductor manufacturer since 1965.",
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const prefix = `/${locale}`
  const payload = await getPayload()

  // Fetch real data from CMS
  const [productsRes, clientsRes, verticalsRes] = await Promise.all([
    payload.find({ collection: 'products', locale: locale as Locale, limit: 6, sort: 'code', where: { _status: { equals: 'published' } } }),
    payload.find({ collection: 'clients', limit: 50, sort: 'order', where: { isFeatured: { equals: true } } }),
    payload.find({ collection: 'verticals', locale: locale as Locale, limit: 3, where: { _status: { equals: 'published' } } }),
  ])

  const products = productsRes.docs
  const clients = clientsRes.docs
  const verticals = verticalsRes.docs

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative flex min-h-[70vh] items-center bg-ink-900 text-white">
        <Image src="/images/site/home-hero.jpg" alt="JSK Industries manufacturing facility" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/90 to-ink-900/40" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
            Since 1965
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            <span className="text-brand-red">Powering</span> Growth
          </h1>
          <p className="mt-6 max-w-xl text-lg text-surface-100/80">
            India&apos;s trusted aluminium conductor manufacturer.
            Conductors · Wire Rods · Trading · Future-ready Technology.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={`${prefix}/businesses`} className="rounded-md bg-brand-red px-6 py-3 font-semibold text-white hover:bg-brand-red-dark">
              Explore Businesses
            </Link>
            <Link href={`${prefix}/enquiry`} className="rounded-md border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10">
              Enquire Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-b border-surface-100 bg-surface-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:grid-cols-5">
          {[
            { value: '1965', label: 'Established' },
            { value: '35,000', label: 'sq.m Plant Area' },
            { value: '1,000+', label: 'Clients Served' },
            { value: '₹10 Bn', label: 'Group Turnover' },
            { value: 'ISO 9001', label: 'Certified' },
          ].map((s) => (
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
            Made in India. <span className="text-brand-red">Built to Last.</span> Powering Growth.
          </h2>
          <p className="mt-6 text-lg text-ink-600">
            For over five decades, JSK Industries has been at the forefront of
            aluminium conductor manufacturing — powering India&apos;s transmission
            and distribution infrastructure with quality, innovation, and integrity.
          </p>
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
