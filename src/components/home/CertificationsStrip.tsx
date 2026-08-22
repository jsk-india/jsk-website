import type { HomeContent } from '@/payload-types'
import { HOME_DEFAULTS, arrayOr, textOr } from '@/lib/content-defaults'

interface Props {
  certifications: HomeContent['certifications']
}

export function CertificationsStrip({ certifications }: Props) {
  const c = certifications ?? {}
  const d = HOME_DEFAULTS.certifications
  const items = arrayOr(c.items, d.items)

  return (
    <section className="border-y border-surface-100 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-ink-600">
          {textOr(c.heading, d.heading)}
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((item, i) => (
            <div key={i} className="rounded border border-surface-100 p-3 text-center">
              {item.label && <p className="text-sm font-bold text-brand-red">{item.label}</p>}
              {item.hint && <p className="mt-1 text-xs text-ink-600">{item.hint}</p>}
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-ink-600">{textOr(c.footnote, d.footnote)}</p>
      </div>
    </section>
  )
}
