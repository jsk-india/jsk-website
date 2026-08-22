import { HeroCarousel, type HeroSlide } from '@/components/HeroCarousel'
import type { SiteSetting } from '@/payload-types'
import { mediaUrl, mediaAlt } from '@/lib/media'

/**
 * Static fallback used when SiteSettings.heroSlides is empty.
 * Kept here so it lives with the code that consumes it.
 */
const DEFAULT_HERO: HeroSlide = {
  imageUrl: '/images/site/home-hero.jpg',
  imageAlt: 'JSK Industries manufacturing facility',
  eyebrow: 'Since 1965',
  headline: 'Powering Growth',
  subheadline:
    "India's trusted aluminium conductor manufacturer. Conductors · Wire Rods · Trading · Future-ready Technology.",
  ctaLabel: 'Explore Businesses',
  ctaHref: '/businesses',
}

interface Props {
  slides: SiteSetting['heroSlides']
  locale: string
}

export function HomeHero({ slides, locale }: Props) {
  return <HeroCarousel slides={resolveSlides(slides, locale)} />
}

/**
 * Coerce CMS hero slides (with nullable everything) into fully-formed
 * HeroSlide objects. Drops slides with no image. Prefixes internal CTA
 * hrefs with the current locale.
 */
function resolveSlides(cmsSlides: SiteSetting['heroSlides'], locale: string): HeroSlide[] {
  const prefix = `/${locale}`
  if (!cmsSlides || cmsSlides.length === 0) {
    return [{ ...DEFAULT_HERO, ctaHref: `${prefix}${DEFAULT_HERO.ctaHref}` }]
  }

  return cmsSlides
    .map((slide): HeroSlide | null => {
      const url = mediaUrl(slide.image, 'hero') ?? mediaUrl(slide.image)
      if (!url) return null
      const ctaHref = slide.ctaHref ?? '/businesses'
      return {
        imageUrl: url,
        imageAlt: mediaAlt(slide.image) || slide.headline || 'JSK Industries',
        eyebrow: slide.eyebrow ?? null,
        headline: slide.headline ?? '',
        subheadline: slide.subheadline ?? null,
        ctaLabel: slide.ctaLabel ?? null,
        ctaHref: ctaHref.startsWith('/') ? `${prefix}${ctaHref}` : ctaHref,
      }
    })
    .filter((s): s is HeroSlide => s !== null)
}
