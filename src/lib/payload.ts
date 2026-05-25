import configPromise from '@payload-config'
import { getPayload as getPayloadInstance } from 'payload'
import { cache } from 'react'
import type { Locale } from './i18n'

/**
 * Cached Payload client — singleton across the whole process.
 * Use in Server Components and API routes.
 */
export async function getPayload() {
  return getPayloadInstance({ config: configPromise })
}

/**
 * Per-request memoized global fetchers.
 *
 * React.cache() dedupes calls within a single render pass — meaning
 * if both `generateMetadata` and the page component ask for the same
 * global, only ONE DB call happens. Across requests, the cache is
 * fresh (no stale data leaking).
 *
 * Use these instead of `payload.findGlobal({...})` for any global a
 * page reads more than once per render (which is most of them now
 * that we have pageMetadata() + page-content-driven bodies).
 */
export const getPageContent = cache(async (locale: Locale) => {
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'page-content', locale })
})

export const getHomeContent = cache(async (locale: Locale) => {
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'home-content', locale })
})

export const getStrengths = cache(async (locale: Locale) => {
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'strengths', locale })
})

export const getSiteSettings = cache(async (locale: Locale, depth = 1) => {
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'site-settings', locale, depth })
})

export const getNavigation = cache(async (locale: Locale) => {
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'navigation', locale })
})

export const getFooter = cache(async (locale: Locale) => {
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'footer', locale })
})

export const getForms = cache(async (locale: Locale) => {
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'forms', locale })
})
