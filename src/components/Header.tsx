import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from '@/lib/payload'
import { localizeHref } from '@/lib/i18n'
import { isMedia } from '@/lib/media'
import { resolveLanguages } from '@/lib/languages'
import { LocaleSwitcher } from './LocaleSwitcher'
import { MobileNav, type MobileNavItem } from './MobileNav'
import { NavLink } from './NavLink'
import type { Locale } from '@/lib/i18n'

interface Props { locale: Locale }

type NavItem = {
  label?: string | null
  href?: string | null
  children?: { label?: string | null; href?: string | null }[] | null
}

export async function Header({ locale }: Props) {
  const prefix = `/${locale}`
  const payload = await getPayload()
  const [nav, settings] = await Promise.all([
    payload.findGlobal({ slug: 'navigation', locale }),
    payload.findGlobal({ slug: 'site-settings', depth: 1 }),
  ])
  const logoMedia = isMedia(settings.logo) ? settings.logo : null
  const brochureUrl = isMedia(settings.brochure) ? settings.brochure.url : null
  const navItems = (nav.header ?? []) as NavItem[]
  const languages = resolveLanguages(settings.languages)

  /**
   * The same nav items we render on desktop, falling back to a hardcoded
   * list when CMS Navigation hasn't been set up yet. Mobile drawer uses
   * this directly so the two stay in sync.
   */
  const FALLBACK_NAV: MobileNavItem[] = [
    { label: 'Home',       href: '/' },
    { label: 'About',      href: '/about' },
    { label: 'Businesses', href: '/businesses' },
    { label: 'Clients',    href: '/clients' },
    { label: 'Investors',  href: '/investors' },
    { label: 'News',       href: '/news' },
    { label: 'Careers',    href: '/careers' },
    { label: 'Contact',    href: '/contact' },
  ]
  const effectiveNav: MobileNavItem[] = navItems.length > 0 ? navItems : FALLBACK_NAV
  const ctaLabel = nav.ctaLabel ?? 'Enquire Now'
  const ctaHref = nav.ctaHref ?? '/enquiry'
  const announcement = nav.announcement as { enabled?: boolean; message?: string; link?: string } | null

  return (
    <>
      {/* Announcement bar */}
      {announcement?.enabled && announcement.message && (
        <div className="bg-brand-red py-2 text-center text-xs font-medium text-white">
          {announcement.link ? (
            <a href={announcement.link} className="hover:underline">{announcement.message}</a>
          ) : announcement.message}
        </div>
      )}

      <header className="sticky top-0 z-[80] border-b border-surface-100 bg-surface-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo — CMS-driven, falls back to text */}
          <Link href={prefix} className="flex items-center gap-2">
            {logoMedia?.url ? (
              <Image
                src={logoMedia.url}
                alt={logoMedia.alt ?? 'JSK Industries'}
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            ) : (
              <>
                <span className="text-xl font-extrabold tracking-tight text-brand-red">jsk</span>
                <span className="hidden text-xs text-ink-600 sm:block">Powering Growth</span>
              </>
            )}
          </Link>

          {/* Nav — from CMS, fallback to defaults. Active item is
              highlighted via <NavLink> (reads usePathname). */}
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {(navItems.length > 0 ? navItems : FALLBACK_NAV).map((item, i) => (
              <div key={i} className="relative group">
                <NavLink href={item.href ?? '#'} prefix={prefix}>
                  {item.label}
                </NavLink>
                {'children' in item && item.children && item.children.length > 0 && (
                  <div className="absolute left-0 top-full hidden min-w-40 rounded-md border border-surface-100 bg-white shadow-lg group-hover:block">
                    {item.children.map((c, j) => (
                      <Link key={j} href={localizeHref(c.href, prefix)}
                        className="block px-4 py-2 text-sm hover:bg-surface-50 hover:text-brand-red">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Locale switcher — hidden on mobile, MobileNav has its own */}
            <div className="hidden sm:block">
              <LocaleSwitcher current={locale} options={languages} variant="compact" />
            </div>

            {brochureUrl && (
              <a
                href={brochureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden rounded-md border border-brand-red px-3 py-2 text-xs font-semibold text-brand-red hover:bg-brand-red hover:text-white lg:inline-block"
              >
                📄 Brochure
              </a>
            )}
            <Link href={localizeHref(ctaHref, prefix)}
              className="hidden rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark md:inline-block">
              {ctaLabel}
            </Link>

            {/* Mobile menu — hamburger + drawer (md:hidden internally) */}
            <MobileNav
              locale={locale}
              prefix={prefix}
              items={effectiveNav}
              ctaLabel={ctaLabel}
              ctaHref={ctaHref}
              brochureUrl={brochureUrl}
              languages={languages}
            />
          </div>
        </div>
      </header>
    </>
  )
}
