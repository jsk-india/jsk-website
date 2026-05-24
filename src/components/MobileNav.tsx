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
import { createPortal } from 'react-dom'
import { localizeHref, type Locale } from '@/lib/i18n'
import { LocaleSwitcher, type LanguageOption } from './LocaleSwitcher'

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
  languages: LanguageOption[]
}

export function MobileNav({ locale, prefix, items, ctaLabel, ctaHref, brochureUrl, languages }: Props) {
  const [open, setOpen] = useState(false)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  /** Wait for client mount so we can safely portal to document.body. */
  useEffect(() => { setMounted(true) }, [])

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

  /**
   * Portal the backdrop + drawer to document.body so they escape the
   * header's stacking context (z-[80]). Without this, page content
   * with its own stacking contexts can render ABOVE the drawer.
   */
  const overlay = mounted && createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[90] bg-ink-900/60 backdrop-blur-sm transition-opacity md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden
      />

      {/* Drawer panel */}
      <aside
        id="mobile-nav-drawer"
        className={`fixed right-0 top-0 z-[100] flex h-dvh w-80 max-w-[85vw] flex-col overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        {/* Drawer header — brand bar with title + close button */}
        <div className="flex items-center justify-between bg-brand-red px-5 py-4 text-white">
          <span className="text-sm font-bold uppercase tracking-widest">Menu</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-white/10"
            aria-label="Close menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
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

          <div className="space-y-2 pt-2">
            <span className="block text-xs font-semibold uppercase tracking-widest text-ink-600">Language</span>
            <LocaleSwitcher current={locale} options={languages} variant="block" />
          </div>
        </div>
      </aside>
    </>,
    document.body,
  )

  return (
    <>
      {/* Hamburger button — stays inside the header where it belongs */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-md border border-brand-red bg-white text-brand-red shadow-sm hover:bg-brand-red hover:text-white"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
          <line x1="4" y1="7"  x2="20" y2="7"  />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      {/* Portaled overlay — rendered at document.body to escape header stacking context */}
      {overlay}
    </>
  )
}
