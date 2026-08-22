import type { HomeContent } from '@/payload-types'
import { HOME_DEFAULTS, textOr } from '@/lib/content-defaults'

interface Props {
  vision: HomeContent['vision']
  mission: HomeContent['mission']
}

export function VisionMissionSection({ vision, mission }: Props) {
  const v = vision ?? {}
  const m = mission ?? {}
  const vd = HOME_DEFAULTS.vision
  const md = HOME_DEFAULTS.mission

  return (
    <section className="bg-ink-900 py-16 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-2">
        <Panel eyebrow={textOr(v.eyebrow, vd.eyebrow)} headline={textOr(v.headline, vd.headline)} body={textOr(v.body, vd.body)} />
        <Panel eyebrow={textOr(m.eyebrow, md.eyebrow)} headline={textOr(m.headline, md.headline)} body={textOr(m.body, md.body)} />
      </div>
    </section>
  )
}

function Panel({ eyebrow, headline, body }: { eyebrow: string; headline: string; body: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">{eyebrow}</p>
      <h3 className="mt-3 text-2xl font-bold">{headline}</h3>
      <p className="mt-4 text-surface-100/80">{body}</p>
    </div>
  )
}
