import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import type { Locale } from '@/lib/i18n'

interface Props { params: Promise<{ locale: string }> }

export default async function NewVerticalsPage({ params }: Props) {
  const { locale } = await params
  const prefix = `/${locale}`
  const payload = await getPayload()

  const verticals = await payload.find({
    collection: 'verticals',
    locale: locale as Locale,
    limit: 10,
    where: { _status: { equals: 'published' } },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <nav className="mb-6 text-sm text-ink-600">
        <Link href={`${prefix}/businesses`} className="hover:text-brand-red">Businesses</Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-ink-900">New Verticals</span>
      </nav>

      <h1 className="text-4xl font-extrabold uppercase tracking-tight">New Verticals</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-600">
        With an aim to set the highest standards of inclusive growth with Research & Innovation,
        Power Quality and Data Safety under the Make in India campaign.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {verticals.docs.map((v) => (
          <Link key={v.id} href={`${prefix}/businesses/new-verticals/${v.slug}`}
            className="group rounded-lg border-2 border-brand-gold/30 bg-brand-gold-50/30 p-8 transition hover:border-brand-gold hover:shadow-lg">
            <h2 className="text-2xl font-bold group-hover:text-brand-red">{v.name}</h2>
            <p className="mt-3 text-ink-600">{v.summary}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-brand-red">Learn more →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
