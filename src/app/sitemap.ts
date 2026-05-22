import type { MetadataRoute } from 'next'
import { getPayload } from '@/lib/payload'
import { locales } from '@/lib/i18n'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jskbharat.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Wrap DB queries in try/catch — build must succeed even on a fresh DB
  let products = { docs: [] as any[] }
  let verticals = { docs: [] as any[] }
  let news = { docs: [] as any[] }
  let jobs = { docs: [] as any[] }

  try {
    const payload = await getPayload()
    ;[products, verticals, news, jobs] = await Promise.all([
      payload.find({ collection: 'products', limit: 200, where: { _status: { equals: 'published' } } }),
      payload.find({ collection: 'verticals', limit: 50, where: { _status: { equals: 'published' } } }),
      payload.find({ collection: 'news-articles', limit: 200, where: { _status: { equals: 'published' } } }),
      payload.find({ collection: 'job-openings', limit: 100, where: { isActive: { equals: true } } }),
    ])
  } catch {
    // DB not ready yet (e.g. fresh deploy before migration) — return static routes only
  }

  const staticRoutes = [
    '', '/about', '/businesses', '/clients', '/investors',
    '/news', '/stories', '/careers', '/contact', '/enquiry',
    '/businesses/conductors', '/businesses/wire-rods', '/businesses/wires',
    '/businesses/trading', '/businesses/new-verticals',
  ]

  const urls: MetadataRoute.Sitemap = []

  // Static pages — one entry per locale
  for (const route of staticRoutes) {
    urls.push({
      url: `${BASE}/en${route}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${BASE}/${loc}${route}`])
        ),
      },
    })
  }

  // Products
  for (const p of products.docs) {
    const catSlug = typeof p.category === 'object' && p.category !== null
      ? (p.category as { slug?: string }).slug ?? 'conductors'
      : 'conductors'
    urls.push({ url: `${BASE}/en/businesses/${catSlug}/${p.slug}`, lastModified: new Date(p.updatedAt as string) })
  }

  // Verticals
  for (const v of verticals.docs) {
    urls.push({ url: `${BASE}/en/businesses/new-verticals/${v.slug}`, lastModified: new Date(v.updatedAt as string) })
  }

  // News
  for (const a of news.docs) {
    urls.push({ url: `${BASE}/en/news/${a.slug}`, lastModified: new Date(a.updatedAt as string) })
  }

  // Jobs
  for (const j of jobs.docs) {
    urls.push({ url: `${BASE}/en/careers/${j.slug}`, lastModified: new Date(j.updatedAt as string) })
  }

  return urls
}
