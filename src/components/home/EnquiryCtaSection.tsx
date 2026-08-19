import Link from 'next/link'
import type { HomeContent } from '@/payload-types'
import { HOME_DEFAULTS, textOr } from '@/lib/content-defaults'

interface Props {
  cta: HomeContent['enquiryCta']
  prefix: string
}

export function EnquiryCtaSection({ cta, prefix }: Props) {
  const c = cta ?? {}
  const d = HOME_DEFAULTS.enquiryCta

  return (
    <section className="bg-brand-red py-16 text-center text-white">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-3xl font-extrabold">{textOr(c.headline, d.headline)}</h2>
        <p className="mt-4 text-lg text-white/80">{textOr(c.body, d.body)}</p>
        <Link
          href={`${prefix}/enquiry`}
          className="mt-8 inline-block rounded-md border-2 border-white bg-white px-8 py-3 font-semibold text-brand-red hover:bg-transparent hover:text-white"
        >
          {textOr(c.buttonLabel, d.buttonLabel)}
        </Link>
      </div>
    </section>
  )
}
