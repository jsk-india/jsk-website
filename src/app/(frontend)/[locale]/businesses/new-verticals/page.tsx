import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import { PAGE_DEFAULTS, textOr } from '@/lib/content-defaults'
import type { Locale } from '@/lib/i18n'

interface Props { params: Promise<{ locale: string }> }

export default async function NewVerticalsPage({ params }: Props) {
  const { locale } = await params
  const prefix = `/${locale}`
  const payload = await getPayload()

  const [verticals, page] = await Promise.all([
    payload.find({ collection: 'verticals', locale: locale as Locale, limit: 10, where: { _status: { equals: 'published' } } }),
    payload.findGlobal({ slug: 'page-content', locale: locale as Locale }),
  ])

  const nv = page.newVerticals ?? {}
  const d = PAGE_DEFAULTS.newVerticals
  const headline = textOr(nv.headline, d.headline)

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <nav className="mb-6 text-sm text-ink-600">
        <Link href={`${prefix}/businesses`} className="hover:text-brand-red">Businesses</Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-ink-900">{headline}</span>
      </nav>

      <h1 className="text-4xl font-extrabold uppercase tracking-tight">{headline}</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-600">{textOr(nv.body, d.body)}</p>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {verticals.docs.map((v) => (
          <Link key={v.id} href={`${prefix}/businesses/new-verticals/${v.slug}`}
            className="group rounded-lg border-2 border-brand-gold/30 bg-brand-gold-50/30 p-8 transition hover:border-brand-gold hover:shadow-lg">
            <h2 className="text-2xl font-bold group-hover:text-brand-red">{v.name}</h2>
            {v.summary && <p className="mt-3 text-ink-600">{v.summary}</p>}
            <span className="mt-4 inline-block text-sm font-semibold text-brand-red">Learn more →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
