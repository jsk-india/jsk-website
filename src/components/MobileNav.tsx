'use client'

/**
 * MobileNav — hamburger-button driven drawer for small viewports.
 *
 * Receives nav data as plain props (no Payload calls) — the parent
 * <Header> server component does the fetching and passes everything in.
 * Keeps this component cheap and easy to test.
 *
 * Closes automatically on: link click, ESC, click outside, viewport resize ≥ md.
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { localeLabels, locales, localizeHref, type Locale } from '@/lib/i18n'

export interface MobileNavItem {
  label?: string | null
  href?: string | null
  children?: { label?: string | null; href?: string | null }[] | null
}

interface Props {
  locale: Locale
  prefix: string
  items: MobileNavItem[]
  ctaLabel: string
  ctaHref: string
  brochureUrl?: string | null
}

export function MobileNav({ locale, prefix, items, ctaLabel, ctaHref, brochureUrl }: Props) {
  const [open, setOpen] = useState(false)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const pathname = usePathname()

  /** Close drawer on route change. */
  useEffect(() => { setOpen(false) }, [pathname])

  /** Close on ESC + lock body scroll while open. */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  /** Close if viewport grows past md (768px) — mobile menu becomes irrelevant. */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = (e: MediaQueryListEvent) => { if (e.matches) setOpen(false) }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <>
      {/* Hamburger button — only visible on mobile */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-900 hover:bg-surface-100"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="4" y1="7"  x2="20" y2="7"  />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-ink-900/50 backdrop-blur-sm transition-opacity md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden
      />

      {/* Drawer panel */}
      <aside
        id="mobile-nav-drawer"
        className={`fixed right-0 top-0 z-[70] flex h-full w-80 max-w-[85vw] flex-col overflow-y-auto bg-white shadow-2xl transition-transform md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-surface-100 px-5 py-4">
          <span className="text-sm font-semibold uppercase tracking-widest text-ink-600">Menu</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-900 hover:bg-surface-100"
            aria-label="Close menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="6"  x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        </div>

        {/* Nav list */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {items.map((item, i) => {
              const hasChildren = !!item.children && item.children.length > 0
              const isExpanded = expandedIdx === i
              return (
                <li key={i}>
                  <div className="flex items-stretch">
                    <Link
                      href={localizeHref(item.href, prefix)}
                      className="flex-1 rounded-md px-3 py-3 text-base font-medium text-ink-900 hover:bg-surface-50 hover:text-brand-red"
                    >
                      {item.label}
                    </Link>
                    {hasChildren && (
                      <button
                        type="button"
                        onClick={() => setExpandedIdx(isExpanded ? null : i)}
                        className="inline-flex w-10 items-center justify-center rounded-md text-ink-600 hover:bg-surface-50"
                        aria-label={isExpanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
                        aria-expanded={isExpanded}
                      >
                        <svg
                          width="18" height="18" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                          className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {hasChildren && isExpanded && (
                    <ul className="mt-1 ml-3 space-y-1 border-l-2 border-surface-100 pl-3">
                      {item.children!.map((c, j) => (
                        <li key={j}>
                          <Link
                            href={localizeHref(c.href, prefix)}
                            className="block rounded-md px-3 py-2 text-sm text-ink-600 hover:bg-surface-50 hover:text-brand-red"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer of drawer: CTA, brochure, locale switcher */}
        <div className="space-y-3 border-t border-surface-100 px-5 py-4">
          <Link
            href={localizeHref(ctaHref, prefix)}
            className="block rounded-md bg-brand-red px-4 py-3 text-center text-sm font-semibold text-white hover:bg-brand-red-dark"
          >
            {ctaLabel}
          </Link>

          {brochureUrl && (
            <a
              href={brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-md border border-brand-red px-4 py-3 text-center text-sm font-semibold text-brand-red hover:bg-brand-red hover:text-white"
            >
              📄 Download Brochure
            </a>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="w-full text-xs font-semibold uppercase tracking-widest text-ink-600">Language</span>
            {locales.map((loc) => (
              <Link
                key={loc}
                href={`/${loc}`}
                className={`rounded px-2 py-1 text-xs ${
                  loc === locale
                    ? 'bg-brand-red text-white'
                    : 'border border-surface-100 text-ink-600 hover:bg-surface-50'
                }`}
              >
                {localeLabels[loc]}
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
