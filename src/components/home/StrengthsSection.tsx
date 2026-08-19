import type { Strength } from '@/payload-types'
import { STRENGTHS_DEFAULTS, arrayOr, textOr } from '@/lib/content-defaults'

interface Props {
  strengths: Strength
}

export function StrengthsSection({ strengths }: Props) {
  const items = arrayOr(strengths.items, STRENGTHS_DEFAULTS.items)
  if (items.length === 0) return null

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-10 text-center text-2xl font-bold uppercase tracking-wide">
          {textOr(strengths.heading, STRENGTHS_DEFAULTS.heading)}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s, i) => (
            <div key={i} className="rounded-lg border border-surface-100 p-5">
              {s.icon && <span className="text-2xl">{s.icon}</span>}
              {s.title && <h3 className="mt-3 font-bold">{s.title}</h3>}
              {s.body && <p className="mt-1 text-sm text-ink-600">{s.body}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
