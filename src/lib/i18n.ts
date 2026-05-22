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
