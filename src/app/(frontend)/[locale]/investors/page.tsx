import { getPayload } from '@/lib/payload'
import { isMedia } from '@/lib/media'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'

const CATEGORY_LABELS: Record<string, string> = {
  annual_report: 'Annual Reports',
  financial_result: 'Financial Results',
  shareholding_pattern: 'Shareholding Pattern',
  corporate_governance: 'Corporate Governance',
  corporate_announcement: 'Corporate Announcements',
  notice: 'Notices',
  agm: 'Annual General Meeting',
  postal_ballot: 'Postal Ballot',
  annual_return: 'Annual Returns',
  policy: 'Company Policies',
  credit_rating: 'Credit Rating',
  disclosure: 'Disclosures (LODR)',
  secretarial_compliance: 'Secretarial Compliance',
  iepf: 'IEPF',
  committee_composition: 'Committee Composition',
  investor_grievance: 'Investor Grievance',
  corporate_presentation: 'Corporate Presentations',
  other: 'Other',
}

export const metadata: Metadata = { title: 'Investors' }

interface Props { params: Promise<{ locale: string }> }

export default async function InvestorsPage({ params }: Props) {
  const { locale } = await params
  const payload = await getPayload()

  const [docs, page] = await Promise.all([
    payload.find({ collection: 'investor-documents', locale: locale as Locale, sort: '-publishedAt', depth: 1, limit: 200 }),
    payload.findGlobal({ slug: 'page-content', locale: locale as Locale }),
  ])

  const inv = page.investors ?? {}

  // Group by category
  const grouped: Record<string, typeof docs.docs> = {}
  for (const doc of docs.docs) {
    const cat = (doc.category as string) || 'other'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(doc)
  }

  const categoryOrder = Object.keys(CATEGORY_LABELS)

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {inv.headline && <h1 className="text-4xl font-extrabold uppercase tracking-tight">{inv.headline}</h1>}
      {inv.body && <p className="mt-4 max-w-2xl text-lg text-ink-600">{inv.body}</p>}

      {docs.totalDocs === 0 ? (
        inv.emptyMessage && <p className="mt-12 text-center text-ink-600">{inv.emptyMessage}</p>
      ) : (
        <div className="mt-12 space-y-6">
          {categoryOrder.filter((cat) => grouped[cat]).map((cat) => (
            <details key={cat} className="group rounded-lg border border-surface-100 bg-white">
              <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-bold hover:bg-surface-50">
                <span>{CATEGORY_LABELS[cat] ?? cat}</span>
                <span className="text-sm text-ink-600">{grouped[cat].length} doc{grouped[cat].length > 1 ? 's' : ''}</span>
              </summary>
              <div className="border-t border-surface-100 px-6 py-4">
                <table className="w-full text-sm">
                  <tbody>
                    {grouped[cat].map((doc) => (
                      <tr key={doc.id} className="border-b border-surface-50 last:border-0">
                        <td className="py-3 pr-4 font-medium">{doc.title}</td>
                        <td className="py-3 pr-4 text-ink-600">{doc.fy || ''}</td>
                        <td className="py-3 text-right">
                          {isMedia(doc.file) && doc.file.url ? (
                            <a href={doc.file.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-red hover:underline">📄 Download</a>
                          ) : doc.externalUrl ? (
                            <a href={doc.externalUrl} target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">View →</a>
                          ) : (
                            <span className="text-ink-300">Coming soon</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}
