import type { Metadata } from 'next'
import { getPayload } from './payload'
import { PAGE_DEFAULTS, textOr } from './content-defaults'
import type { Locale } from './i18n'

/**
 * One source of truth for page <title> generation.
 *
 *   <CMS headline> · <SUFFIX>
 *
 * If the CMS field is empty, falls back to the hardcoded default in
 * PAGE_DEFAULTS — same fallback chain as the page body itself.
 */
const SUFFIX = 'JSK Industries'

type PageKey = keyof typeof PAGE_DEFAULTS

interface PageSeoSource {
  headline?: string | null
  body?: string | null
  heroTitle?: string | null
  heroBody?: string | null
}

/**
 * Build Next.js `<Metadata>` for a PageContent-backed page.
 * Pulls the matching group from the global, with code-level fallback.
 */
export async function pageMetadata(locale: Locale, page: PageKey): Promise<Metadata> {
  const payload = await getPayload()
  const content = await payload.findGlobal({ slug: 'page-content', locale })

  // PageContent groups are typed as `unknown` here — cast loosely.
  const group = ((content as unknown as Record<string, PageSeoSource | undefined>)[page] ?? {}) as PageSeoSource
  const defaults = PAGE_DEFAULTS[page] as Partial<{ headline: string; body: string; heroTitle: string; heroBody: string }>

  const headline = textOr(group.headline ?? group.heroTitle, defaults.headline ?? defaults.heroTitle ?? '')
  const description = textOr(group.body ?? group.heroBody, defaults.body ?? defaults.heroBody ?? '')

  return {
    title: headline ? `${headline} · ${SUFFIX}` : SUFFIX,
    description: description || undefined,
  }
}

/** Free-form metadata builder for non-PageContent pages (homepage, detail templates). */
export function buildMetadata(title: string | null | undefined, description?: string | null): Metadata {
  const t = title && title.trim() !== '' ? title.trim() : null
  return {
    title: t ? `${t} · ${SUFFIX}` : SUFFIX,
    description: description?.trim() || undefined,
  }
}
