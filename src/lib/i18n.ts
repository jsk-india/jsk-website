/** Locale config — single source of truth for the app.
 *
 * Adding a new language?
 *   1. Add the ISO code to `locales` below.
 *   2. Add its display info to `localeMeta` below.
 *   3. Run `npx payload migrate:create` and deploy.
 *
 * The list of *installable* locales is intentionally build-time:
 * Payload generates DB columns per locale at schema-compile time, so a
 * fully runtime-dynamic locale list isn't possible. But admins CAN
 * enable/disable/reorder languages via Site Settings > Languages.
 */

export const locales = ['en', 'hi', 'te', 'ta'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

/** Per-locale presentation metadata. Single source of truth for native names + flags. */
export const localeMeta: Record<Locale, { label: string; flag: string }> = {
  en: { label: 'English',   flag: '🇬🇧' },
  hi: { label: 'हिन्दी',    flag: '🇮🇳' },
  te: { label: 'తెలుగు',   flag: '🇮🇳' },
  ta: { label: 'தமிழ்',     flag: '🇮🇳' },
}

/** @deprecated Use `localeMeta[code].label`. Kept for compatibility. */
export const localeLabels: Record<Locale, string> = Object.fromEntries(
  (Object.entries(localeMeta) as [Locale, { label: string }][]).map(([code, m]) => [code, m.label]),
) as Record<Locale, string>

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
