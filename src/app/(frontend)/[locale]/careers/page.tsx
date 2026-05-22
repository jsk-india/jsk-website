import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Careers' }

interface Props { params: Promise<{ locale: string }> }

export default async function CareersPage({ params }: Props) {
  const { locale } = await params
  const prefix = `/${locale}`
  const payload = await getPayload()

  const jobs = await payload.find({
    collection: 'job-openings',
    locale: locale as Locale,
    sort: '-postedAt',
    limit: 50,
    where: { isActive: { equals: true }, _status: { equals: 'published' } },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {/* Hero */}
      <div className="rounded-lg bg-ink-900 px-8 py-12 text-white">
        <h1 className="text-4xl font-extrabold">Join JSK Industries</h1>
        <p className="mt-4 max-w-2xl text-lg text-surface-100/80">
          Be part of a company that has powered India&apos;s transmission infrastructure for over five
          decades. We&apos;re always looking for talented engineers, technicians, and professionals.
        </p>
      </div>

      {/* Why JSK */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold uppercase tracking-wide">Why JSK</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: '🏭', title: 'State-of-art Facility', desc: '35,000 sq.m plant with modern equipment.' },
            { icon: '📈', title: 'Growth Oriented', desc: 'Continuous training and career development.' },
            { icon: '🌍', title: 'Industry Leaders', desc: 'Work with India\'s biggest power companies.' },
            { icon: '🔬', title: 'Innovation First', desc: 'New verticals in photonics, digital substations & cybersecurity.' },
          ].map((s) => (
            <div key={s.title} className="rounded-lg border border-surface-100 p-5">
              <span className="text-2xl">{s.icon}</span>
              <h3 className="mt-3 font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-ink-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open positions */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold uppercase tracking-wide">Open Positions</h2>

        {jobs.totalDocs === 0 ? (
          <div className="mt-8 rounded-lg border-2 border-dashed border-surface-100 py-16 text-center">
            <p className="text-3xl">👀</p>
            <h3 className="mt-4 text-xl font-bold">No open positions right now</h3>
            <p className="mt-2 text-ink-600">
              We&apos;re not actively hiring, but we&apos;re always interested in great talent.
            </p>
            <a href={`${prefix}/enquiry`}
              className="mt-4 inline-block rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-dark">
              Send us your resume
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
