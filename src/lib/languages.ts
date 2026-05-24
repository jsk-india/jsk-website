/**
 * Resolves the list of languages to show in the LocaleSwitcher dropdown.
 *
 * Combines:
 *   - The build-time `locales` list (the only locales Payload knows about)
 *   - The CMS `SiteSettings.languages` config (admin can enable/disable,
 *     reorder, and override labels/flags per locale)
 *
 * If a locale isn't in the CMS config, it's included with defaults from
 * `localeMeta` — so removing a locale from the CMS doesn't accidentally
 * hide it (admins must explicitly toggle `enabled = false`).
 */

import { locales, localeMeta, type Locale } from './i18n'
import type { LanguageOption } from '@/components/LocaleSwitcher'

/** Shape of an item in `SiteSettings.languages` (matches Payload field config). */
export interface CmsLanguage {
  code?: Locale | string | null
  enabled?: boolean | null
  order?: number | null
  nativeLabel?: string | null
  flag?: string | null
}

/** Build the ordered, enabled list of languages for the LocaleSwitcher. */
export function resolveLanguages(cmsLanguages: unknown): LanguageOption[] {
  const cmsByCode = new Map<Locale, CmsLanguage>()
  if (Array.isArray(cmsLanguages)) {
    for (const entry of cmsLanguages as CmsLanguage[]) {
      const code = entry?.code
      if (typeof code === 'string' && (locales as readonly string[]).includes(code)) {
        cmsByCode.set(code as Locale, entry)
      }
    }
  }

  // Start from the build-time list so a locale missing from the CMS still shows.
  const merged = locales.map((code, i): LanguageOption & { order: number; enabled: boolean } => {
    const cms = cmsByCode.get(code)
    const meta = localeMeta[code]
    return {
      code,
      label: cms?.nativeLabel?.trim() || meta.label,
      flag: cms?.flag?.trim() || meta.flag,
      // Default enabled = true when CMS hasn't been configured for this locale.
      enabled: cms?.enabled ?? true,
      // Stable secondary sort: original position in `locales` if no CMS order.
      order: typeof cms?.order === 'number' ? cms.order : i,
    }
  })

  return merged
    .filter((l) => l.enabled)
    .sort((a, b) => a.order - b.order)
    .map(({ code, label, flag }) => ({ code, label, flag }))
}
