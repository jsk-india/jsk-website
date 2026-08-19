import type { Metadata } from 'next'
import {
  getPayload,
  getHomeContent,
  getSiteSettings,
  getStrengths,
} from '@/lib/payload'
import { isMedia } from '@/lib/media'
import type { Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'

import { HomeHero } from '@/components/home/HomeHero'
import { StatsSection } from '@/components/home/StatsSection'
import { ManifestoSection } from '@/components/home/ManifestoSection'
import { VisionMissionSection } from '@/components/home/VisionMissionSection'
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection'
import { CertificationsStrip } from '@/components/home/CertificationsStrip'
import { FeaturedVerticalsSection } from '@/components/home/FeaturedVerticalsSection'
import { ClientLogosSection } from '@/components/home/ClientLogosSection'
import { StrengthsSection } from '@/components/home/StrengthsSection'
import { EnquiryCtaSection } from '@/components/home/EnquiryCtaSection'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(
    'Powering Growth',
    "India's trusted aluminium conductor manufacturer since 1965. ₹30 Billion company, exports to 30+ countries, LME-listed, NABL accredited.",
  )
}

/**
 * Homepage — pure orchestrator.
 *
 * Fetches everything in parallel, then hands each slice of data to a
 * self-contained section component in `@/components/home/`. Each section
 * owns its own fallback logic and markup so adding/removing/reordering
 * sections is a one-line change here.
 */
export default async function HomePage({ params }: Props) {
  const { locale: rawLocale } = await params
  const locale = rawLocale as Locale
  const prefix = `/${locale}`
  const payload = await getPayload()

  // Six parallel fetches — cached globals + collection queries.
  const [productsRes, clientsRes, verticalsRes, settings, home, strengths] = await Promise.all([
    payload.find({
      collection: 'products',
      locale,
      depth: 1,
      limit: 6,
      sort: 'code',
      where: { _status: { equals: 'published' } },
    }),
    payload.find({
      collection: 'clients',
      depth: 1,
      limit: 50,
      sort: 'order',
      where: { isFeatured: { equals: true } },
    }),
    payload.find({
      collection: 'verticals',
      locale,
      depth: 1,
      limit: 3,
      where: { _status: { equals: 'published' } },
    }),
    getSiteSettings(locale, 2),
    getHomeContent(locale),
    getStrengths(locale),
  ])

  const brochureUrl = isMedia(settings.brochure) ? settings.brochure.url ?? null : null

  return (
    <>
      <HomeHero slides={settings.heroSlides} locale={locale} />
      <StatsSection stats={settings.stats} />
      <ManifestoSection manifesto={home.manifesto} brochureUrl={brochureUrl} />
      <VisionMissionSection vision={home.vision} mission={home.mission} />
      <FeaturedProductsSection products={productsRes.docs} headings={home.sectionHeadings} prefix={prefix} />
      <CertificationsStrip certifications={home.certifications} />
      <FeaturedVerticalsSection verticals={verticalsRes.docs} headings={home.sectionHeadings} prefix={prefix} />
      <ClientLogosSection clients={clientsRes.docs} headings={home.sectionHeadings} prefix={prefix} />
      <StrengthsSection strengths={strengths} />
      <EnquiryCtaSection cta={home.enquiryCta} prefix={prefix} />
    </>
  )
}
