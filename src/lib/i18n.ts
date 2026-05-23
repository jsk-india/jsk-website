/** Locale config — single source of truth for the app. */

export const locales = ['en', 'hi', 'te', 'ta'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
  te: 'తెలుగు',
  ta: 'தமிழ்',
}

export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/**
 * Prepend the locale prefix (e.g. `/en`) to an internal href.
 *
 * Leaves untouched:
 *   - external URLs (https://, http://)
 *   - mailto:, tel:, #anchor links
 *   - relative paths that don't start with `/`
 *
 * Used by Header, Footer, and any component that renders CMS-managed links.
 */
export function localizeHref(
  href: string | null | undefined,
  prefix: string,
): string {
  if (!href) return '#'
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return href
  if (!href.startsWith('/')) return href
  if (href === '/') return prefix
  return `${prefix}${href}`
}
