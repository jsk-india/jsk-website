import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

interface Props { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const payload = await getPayload()
  const res = await payload.find({ collection: 'verticals', where: { slug: { equals: slug } }, locale: locale as Locale, limit: 1 })
  const v = res.docs[0]
  return { title: v?.name ?? 'Vertical', description: v?.summary ?? undefined }
}

export default async function VerticalDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const prefix = `/${locale}`
  const payload = await getPayload()

  const res = await payload.find({
    collection: 'verticals',
    where: { slug: { equals: slug } },
    locale: locale as Locale,
    depth: 2,
    limit: 1,
  })
  const vertical = res.docs[0]
  if (!vertical) notFound()

  const partner = vertical.partner as { name?: string; description?: string; website?: string } | undefined

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <nav className="mb-6 text-sm text-ink-600">
        <Link href={`${prefix}/businesses`} className="hover:text-brand-red">Businesses</Link>
        <span className="mx-2">›</span>
        <Link href={`${prefix}/businesses/new-verticals`} className="hover:text-brand-red">New Verticals</Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-ink-900">{vertical.name}</span>
      </nav>

      <h1 className="text-4xl font-extrabold">{vertical.name}</h1>
      {vertical.summary && <p className="mt-4 max-w-3xl text-lg text-ink-600">{vertical.summary}</p>}

      {/* Partner info */}
      {partner?.name && (
        <div className="mt-8 rounded-lg border border-brand-gold/30 bg-brand-gold-50/30 p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-600">Technology Partner</p>
          <p className="mt-1 text-lg font-bold">{partner.name}</p>
          {partner.description && <p className="mt-2 text-sm text-ink-600">{partner.description}</p>}
          {partner.website && (
            <a href={partner.website} target="_blank" rel="noopener" className="mt-2 inline-block text-sm text-brand-red hover:underline">
              Visit partner website →
            </a>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 rounded-lg bg-ink-900 p-8 text-white">
        <h2 className="text-2xl font-bold">Interested in {vertical.name}?</h2>
        <p className="mt-2 text-surface-100/80">Get in touch with our team to discuss how this solution can benefit your operations.</p>
        <Link href={`${prefix}/enquiry`} className="mt-4 inline-block rounded-md bg-brand-red px-6 py-3 font-semibold hover:bg-brand-red-dark">
          Contact Us
        </Link>
      </div>
    </div>
  )
}
