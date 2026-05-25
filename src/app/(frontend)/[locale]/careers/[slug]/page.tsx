import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { PAGE_DEFAULTS, textOr } from '@/lib/content-defaults'
import { buildMetadata } from '@/lib/seo'
import { loadFormStrings } from '@/lib/form-strings'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'
import { ApplicationForm } from './ApplicationForm'

interface Props { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const payload = await getPayload()
  const res = await payload.find({
    collection: 'job-openings', where: { slug: { equals: slug } },
    locale: locale as Locale, limit: 1,
  })
  const job = res.docs[0]
  return buildMetadata(job ? `${job.title} — Careers` : 'Job Opening')
}

export default async function JobDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const prefix = `/${locale}`
  const payload = await getPayload()

  const [res, page, formStrings] = await Promise.all([
    payload.find({
      collection: 'job-openings',
      where: { slug: { equals: slug }, isActive: { equals: true } },
      locale: locale as Locale,
      limit: 1,
    }),
    payload.findGlobal({ slug: 'page-content', locale: locale as Locale }),
    loadFormStrings(locale as Locale),
  ])
  const job = res.docs[0]
  if (!job) notFound()

  const responsibilities = (job.responsibilities ?? []) as { item?: string }[]
  const qualifications = (job.qualifications ?? []) as { item?: string }[]
  const cd = page.careerDetail ?? {}
  const d = PAGE_DEFAULTS.careerDetail

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <nav className="mb-6 text-sm text-ink-600">
        <Link href={`${prefix}/careers`} className="hover:text-brand-red">{textOr(cd.breadcrumbCareers, d.breadcrumbCareers)}</Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-ink-900">{job.title}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Job details */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold sm:text-4xl">{job.title}</h1>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-ink-600">
              {job.department && <span>🏢 {job.department}</span>}
              {job.location && <span>📍 {job.location}</span>}
              {job.employmentType && (
                <span className="rounded-full bg-brand-gold-50 px-2 py-0.5 text-xs font-medium text-brand-red-dark capitalize">
                  {(job.employmentType as string).replace('_', ' ')}
                </span>
              )}
            </div>
          </div>

          {responsibilities.length > 0 && (
            <section>
              <h2 className="text-xl font-bold">{textOr(cd.responsibilitiesHeading, d.responsibilitiesHeading)}</h2>
              <ul className="mt-4 list-inside list-disc space-y-2 text-ink-600">
                {responsibilities.map((r, i) => r.item && <li key={i}>{r.item}</li>)}
              </ul>
            </section>
          )}

          {qualifications.length > 0 && (
            <section>
              <h2 className="text-xl font-bold">{textOr(cd.qualificationsHeading, d.qualificationsHeading)}</h2>
              <ul className="mt-4 list-inside list-disc space-y-2 text-ink-600">
                {qualifications.map((q, i) => q.item && <li key={i}>{q.item}</li>)}
              </ul>
            </section>
          )}

          <section>
            <h2 className="text-xl font-bold">{textOr(cd.applyHeading, d.applyHeading)}</h2>
            <div className="mt-6">
              <ApplicationForm jobId={String(job.id)} jobTitle={String(job.title)} strings={formStrings.application} />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-surface-100 bg-surface-50 p-6">
            <h3 className="font-bold">{textOr(cd.summaryHeading, d.summaryHeading)}</h3>
            <dl className="mt-3 space-y-2 text-sm">
              {job.department && <div><dt className="text-ink-600">{textOr(cd.departmentLabel, d.departmentLabel)}</dt><dd className="font-medium">{job.department}</dd></div>}
              {job.location && <div><dt className="text-ink-600">{textOr(cd.locationLabel, d.locationLabel)}</dt><dd className="font-medium">{job.location}</dd></div>}
              {job.employmentType && <div><dt className="text-ink-600">{textOr(cd.typeLabel, d.typeLabel)}</dt><dd className="font-medium capitalize">{(job.employmentType as string).replace('_', ' ')}</dd></div>}
              {job.postedAt && (
                <div>
                  <dt className="text-ink-600">{textOr(cd.postedLabel, d.postedLabel)}</dt>
                  <dd className="font-medium">
                    {new Date(job.postedAt as string).toLocaleDateString(locale, {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>
    </div>
  )
}
