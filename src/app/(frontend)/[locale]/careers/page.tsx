import Link from 'next/link'
import { getPayload, getPageContent } from '@/lib/payload'
import { PAGE_DEFAULTS, textOr, arrayOr } from '@/lib/content-defaults'
import { pageMetadata } from '@/lib/seo'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale as Locale, 'careers')
}

export default async function CareersPage({ params }: Props) {
  const { locale } = await params
  const prefix = `/${locale}`
  const payload = await getPayload()

  const [jobs, page] = await Promise.all([
    payload.find({
      collection: 'job-openings', locale: locale as Locale, sort: '-postedAt', limit: 50,
      where: { isActive: { equals: true }, _status: { equals: 'published' } },
    }),
    getPageContent(locale as Locale),
  ])

  const c = page.careers ?? {}
  const d = PAGE_DEFAULTS.careers
  const whyItems = arrayOr(
    c.whyItems as { icon?: string | null; title?: string | null; body?: string | null }[] | null | undefined,
    d.whyItems,
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {/* Hero */}
      <div className="rounded-lg bg-ink-900 px-8 py-12 text-white">
        <h1 className="text-4xl font-extrabold">{textOr(c.heroTitle, d.heroTitle)}</h1>
        <p className="mt-4 max-w-2xl text-lg text-surface-100/80">{textOr(c.heroBody, d.heroBody)}</p>
      </div>

      {/* Why JSK (employer-side) */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold uppercase tracking-wide">{textOr(c.whyHeading, d.whyHeading)}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyItems.map((s, i) => (
            <div key={i} className="rounded-lg border border-surface-100 p-5">
              {s.icon && <span className="text-2xl">{s.icon}</span>}
              {s.title && <h3 className="mt-3 font-bold">{s.title}</h3>}
              {s.body && <p className="mt-1 text-sm text-ink-600">{s.body}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Open positions */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold uppercase tracking-wide">{textOr(c.openPositionsHeading, d.openPositionsHeading)}</h2>

        {jobs.totalDocs === 0 ? (
          <div className="mt-8 rounded-lg border-2 border-dashed border-surface-100 py-16 text-center">
            <p className="text-3xl">👀</p>
            <h3 className="mt-4 text-xl font-bold">{textOr(c.emptyTitle, d.emptyTitle)}</h3>
            <p className="mt-2 text-ink-600">{textOr(c.emptyBody, d.emptyBody)}</p>
            <a href={`${prefix}/enquiry`}
              className="mt-4 inline-block rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-dark">
              {textOr(c.emptyCtaLabel, d.emptyCtaLabel)}
            </a>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {jobs.docs.map((job) => (
              <Link key={job.id} href={`${prefix}/careers/${job.slug}`}
                className="group flex items-center justify-between rounded-lg border border-surface-100 bg-white p-6 shadow-sm transition hover:border-brand-red/30 hover:shadow-md">
                <div>
                  <h3 className="font-bold group-hover:text-brand-red">{job.title}</h3>
                  <div className="mt-1 flex flex-wrap gap-3 text-sm text-ink-600">
                    {job.department && <span>🏢 {job.department}</span>}
                    {job.location && <span>📍 {job.location}</span>}
                    {job.employmentType && (
                      <span className="rounded-full bg-brand-gold-50 px-2 py-0.5 text-xs font-medium text-brand-red-dark capitalize">
                        {(job.employmentType as string).replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-sm font-semibold text-brand-red">Apply →</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
