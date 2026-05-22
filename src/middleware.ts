import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { defaultLocale, locales } from '@/lib/i18n'

/**
 * Legacy URL → new URL redirects (301).
 * Sourced from SPEC.md §12 migration plan.
 */
const REDIRECTS: Record<string, string> = {
  '/corporate-profile/corporate-profile.htm': '/about',
  '/corporate-profile/vision-mission.htm': '/about',
  '/corporate-profile/investors.htm': '/investors',
  '/manufacturing-facility/manufacturing-facility.htm': '/about#manufacturing',
  '/quality/quality.htm': '/about#certifications',
  '/quality/testing-facilities.htm': '/about#certifications',
  '/quality/certifications.htm': '/about#certifications',
  '/clientele/clientele.htm': '/clients',
  '/contact/contact.htm': '/contact',
  '/enquiries/enquiries.htm': '/enquiry',
  '/careers/apply-now.htm': '/careers',
  '/general-info/sitemap.htm': '/',
  '/products-services/products-services.htm': '/businesses/conductors',
  '/products-services/new-verticals.html': '/businesses/new-verticals',
  '/products-services/veda.html': '/businesses/new-verticals/veda',
  '/products-services/digital-substation.html': '/businesses/new-verticals/digital-substation',
  '/products-services/cyber-security.html': '/businesses/new-verticals/cyber-security',
  '/products-services/aaac.htm': '/businesses/conductors/aaac',
  '/products-services/aac.htm': '/businesses/conductors/aac',
  '/products-services/acsr.htm': '/businesses/conductors/acsr',
  '/products-services/aacsr.htm': '/businesses/conductors/aacsr',
  '/products-services/acar.htm': '/businesses/conductors/acar',
  '/products-services/acsr-aw.htm': '/businesses/conductors/acsr-aw',
  '/products-services/acsr-tw.htm': '/businesses/conductors/acsr-tw',
  '/products-services/acss.htm': '/businesses/conductors/acss',
  '/products-services/accc.htm': '/businesses/conductors/accc',
  '/products-services/stacir.htm': '/businesses/conductors/stacir',
  '/products-services/tacsr.htm': '/businesses/conductors/tacsr',
  '/products-services/al-59-conductor.htm': '/businesses/conductors/al-59',
  '/products-services/gap-conductor.htm': '/businesses/conductors/gap-type',
  '/products-services/acfr.htm': '/businesses/conductors/acfr',
  '/products-services/rod.htm': '/businesses/wire-rods/wire-rod-ec',
  '/products-services/alloy.htm': '/businesses/wire-rods/wire-rod-alloy',
  '/products-services/deoxy.htm': '/businesses/wire-rods/wire-rod-deoxy',
  '/products-services/wires.htm': '/businesses/wires/aluminium-wires',
  '/trading/ingots.htm': '/businesses/trading/primary-ingots',
  '/trading/rolled-products.htm': '/businesses/trading',
  '/trading/foils.htm': '/businesses/trading',
  '/trading/extrusions.htm': '/businesses/trading',
  '/trading/zinc-metal-scrap.htm': '/businesses/trading',
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Handle legacy redirects (301)
  const legacy = REDIRECTS[pathname] ?? REDIRECTS[pathname.replace(/\/$/, '')]
  if (legacy) {
    const url = request.nextUrl.clone()
    url.pathname = `/${defaultLocale}${legacy}`
    return NextResponse.redirect(url, 301)
  }

  // 2. Root `/` → default locale
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = `/${defaultLocale}`
    return NextResponse.redirect(url, 307)
  }

  // 3. Skip admin + api + static paths
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/media') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
