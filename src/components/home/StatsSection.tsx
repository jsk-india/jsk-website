import type { SiteSetting } from '@/payload-types'

/**
 * Fallback stats used when SiteSettings.stats is empty in the CMS.
 * Kept alongside the component so it's obvious what shape is expected.
 */
const DEFAULT_STATS: ReadonlyArray<{ value: string; label: string }> = [
  { value: '60+',      label: 'Years Experience' },
  { value: '₹30 Bn',   label: 'Group Turnover' },
  { value: '1,08,408', label: 'MT Capacity' },
  { value: '500+',     label: 'Satisfied Customers' },
  { value: '30+',      label: 'Countries Exported' },
]

interface Props {
  stats: SiteSetting['stats']
}

export function StatsSection({ stats }: Props) {
  const items = resolveStats(stats)
  if (items.length === 0) return null

  return (
    <section className="border-b border-surface-100 bg-surface-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:grid-cols-5">
        {items.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-bold text-brand-red sm:text-3xl">{s.value}</p>
            <p className="mt-1 text-sm text-ink-600">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/**
 * Coerce the CMS `stats` array (nullable rows with nullable strings)
 * into a clean list of { value, label }. Falls back to DEFAULT_STATS
 * when the CMS list is empty — matches historical behaviour.
 */
function resolveStats(cms: SiteSetting['stats']): { value: string; label: string }[] {
  if (!cms || cms.length === 0) return [...DEFAULT_STATS]
  const cleaned = cms
    .map(({ value, label }) => ({ value: value?.trim() ?? '', label: label?.trim() ?? '' }))
    .filter((s) => s.value && s.label)
  return cleaned.length > 0 ? cleaned : [...DEFAULT_STATS]
}
