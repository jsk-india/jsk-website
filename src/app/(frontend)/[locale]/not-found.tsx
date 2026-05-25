import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import { PAGE_DEFAULTS, textOr } from '@/lib/content-defaults'
import { defaultLocale, type Locale } from '@/lib/i18n'

/**
 * not-found is rendered without route params on global 404s, so we
 * fetch the page-content in the default locale only. Localized 404s
 * inside [locale] routes would still need a sibling not-found file
 * if we want per-locale text — out of scope for now.
 */
export default async function NotFound() {
  const payload = await getPayload()
  const page = await payload.findGlobal({ slug: 'page-content', locale: defaultLocale as Locale })
  const nf = page.notFound ?? {}
  const d = PAGE_DEFAULTS.notFound

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-extrabold text-brand-red">{textOr(nf.code, d.code)}</p>
      <h1 className="mt-4 text-2xl font-bold">{textOr(nf.title, d.title)}</h1>
      <p className="mt-2 text-ink-600">{textOr(nf.body, d.body)}</p>
      <Link href={`/${defaultLocale}`}
        className="mt-6 rounded-md bg-brand-red px-6 py-3 font-semibold text-white hover:bg-brand-red-dark">
        {textOr(nf.ctaLabel, d.ctaLabel)}
      </Link>
    </div>
  )
}
