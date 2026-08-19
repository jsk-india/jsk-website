import type { HomeContent } from '@/payload-types'
import { HOME_DEFAULTS, textOr } from '@/lib/content-defaults'

interface Props {
  manifesto: HomeContent['manifesto']
  brochureUrl: string | null
}

export function ManifestoSection({ manifesto, brochureUrl }: Props) {
  const m = manifesto ?? {}
  const d = HOME_DEFAULTS.manifesto

  return (
    <section className="py-16 text-center">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {textOr(m.headlinePart1, d.headlinePart1)}{' '}
          <span className="text-brand-red">{textOr(m.headlineHighlight, d.headlineHighlight)}</span>{' '}
          {textOr(m.headlinePart3, d.headlinePart3)}
        </h2>
        <p className="mt-6 text-lg text-ink-600">{textOr(m.body, d.body)}</p>
        {brochureUrl && (
          <a
            href={brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-md border-2 border-brand-red px-6 py-3 font-semibold text-brand-red hover:bg-brand-red hover:text-white"
          >
            {textOr(m.brochureButtonLabel, d.brochureButtonLabel)}
          </a>
        )}
      </div>
    </section>
  )
}
