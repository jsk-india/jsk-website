'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Top-nav link with active-state styling.
 *
 * "Active" = the current pathname matches the link OR is a descendant
 * (so /en/businesses/conductors/aaac still highlights the "Businesses"
 * tab, not just exact /en/businesses).
 *
 * Visual treatment:
 *   - Brand-red text colour
 *   - A 2px underline bar pinned to the bottom of the header row
 *
 * The underline uses an absolutely-positioned `after:` pseudo so it
 * doesn't affect layout / shift other links when toggled.
 */
interface Props {
  href: string
  prefix: string
  children: React.ReactNode
  /** Extra classes for the inactive base style (hover, font-size, etc). */
  className?: string
}

export function NavLink({ href, prefix, children, className = '' }: Props) {
  const pathname = usePathname()

  // Normalize href: relative ones get the locale prefix prepended.
  const fullHref = href.startsWith('/') ? `${prefix}${href === '/' ? '' : href}` : href

  // Home is a special case — only match exactly /{locale} or /{locale}/
  const isHome = href === '/' || href === '' || fullHref === prefix
  const isActive = isHome
    ? pathname === prefix || pathname === `${prefix}/`
    : pathname === fullHref || pathname.startsWith(`${fullHref}/`)

  return (
    <Link
      href={fullHref}
      aria-current={isActive ? 'page' : undefined}
      className={[
        'relative transition-colors',
        isActive
          ? 'font-semibold text-brand-red after:absolute after:-bottom-[14px] after:left-0 after:right-0 after:h-0.5 after:bg-brand-red'
          : 'hover:text-brand-red',
        className,
      ].join(' ')}
    >
      {children}
    </Link>
  )
}
