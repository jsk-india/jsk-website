import Image from 'next/image'
import { getPayload } from '@/lib/payload'
import { mediaUrl, mediaAlt } from '@/lib/media'
import { RichText } from '@/components/RichText'
import { PAGE_DEFAULTS, textOr } from '@/lib/content-defaults'
import { pageMetadata } from '@/lib/seo'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale as Locale, 'about')
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const payload = await getPayload()

  const [persons, certs, plants, page] = await Promise.all([
    payload.find({ collection: 'persons', sort: 'order', limit: 20, depth: 1 }),
    payload.find({ collection: 'certifications', locale: locale as Locale, limit: 20 }),
    payload.find({ collection: 'plants', locale: locale as Locale, limit: 10 }),
    payload.findGlobal({ slug: 'page-content', locale: locale as Locale }),
  ])

  const founder = persons.docs.find((p) => p.isFounder)
  const board = persons.docs.filter((p) => p.isBoard)
  const about = page.about ?? {}
  const d = PAGE_DEFAULTS.about

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight">
        {textOr(about.headline, d.headline)}
      </h1>

      <section className="mt-10 max-w-3xl text-ink-600 leading-relaxed">
        {about.intro ? (
          <RichText data={about.intro} />
        ) : (
          <div className="space-y-4">
            {d.introParagraphs.map((p, i) => (
              <p key={i} className={i === 0 ? 'text-lg' : ''}>{p}</p>
            ))}
          </div>
        )}
      </section>

      {/* Leadership */}
      {(founder || board.length > 0) && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold uppercase tracking-wide">
            {textOr(about.leadershipHeading, d.leadershipHeading)}
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {founder && (() => {
              const photo = mediaUrl(founder.photo, 'card') ?? mediaUrl(founder.photo)
              return (
                <div className="overflow-hidden rounded-lg border-2 border-brand-gold/30 bg-brand-gold-50/20">
                  {photo && (
                    <div className="relative aspect-[4/3] w-full bg-surface-100">
                      <Image src={photo} alt={mediaAlt(founder.photo) || founder.name} fill className="object-cover"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-red">Founder</p>
                    <h3 className="mt-2 text-xl font-bold">{founder.name}</h3>
                    <p className="mt-1 text-sm text-ink-600">{founder.role}</p>
                  </div>
                </div>
              )
            })()}
            {board.map((p) => {
              const photo = mediaUrl(p.photo, 'card') ?? mediaUrl(p.photo)
              return (
                <div key={p.id} className="overflow-hidden rounded-lg border border-surface-100 bg-white shadow-sm">
                  {photo && (
                    <div className="relative aspect-[4/3] w-full bg-surface-100">
                      <Image src={photo} alt={mediaAlt(p.photo) || p.name} fill className="object-cover"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold">{p.name}</h3>
                    <p className="mt-1 text-sm font-medium text-brand-red">{p.role}</p>
                    {p.qualifications && <p className="mt-3 text-sm text-ink-600">{p.qualifications}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Manufacturing */}
      {plants.docs.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold uppercase tracking-wide">
            {textOr(about.manufacturingHeading, d.manufacturingHeading)}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {plants.docs.map((p) => (
              <div key={p.id} className="rounded-lg border border-surface-100 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-brand-red">{p.name}</h3>
                {p.address && <p className="mt-2 text-sm text-ink-600">{p.address}</p>}
                {p.city && <p className="text-sm text-ink-600">{p.city}</p>}
                {p.area && <p className="mt-2 text-sm font-medium">Area: {p.area}</p>}
                {p.capacities && p.capacities.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm text-ink-600">
                    {(p.capacities as { label?: string; value?: string }[]).map((c, i) => (
                      <li key={i}>• {c.label}: <strong>{c.value}</strong></li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certs.docs.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold uppercase tracking-wide">
            {textOr(about.certificationsHeading, d.certificationsHeading)}
          </h2>
          <div className="mt-8 flex flex-wrap gap-4">
            {certs.docs.map((c) => (
              <div key={c.id} className="rounded-lg border border-brand-gold bg-brand-gold-50 px-6 py-4 text-center">
                <p className="font-bold">{c.name}</p>
                {c.issuer && <p className="mt-1 text-xs text-ink-600">{c.issuer}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
