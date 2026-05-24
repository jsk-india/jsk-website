'use client'

/**
 * LocaleSwitcher — accessible click-to-open dropdown for changing site language.
 *
 * Receives the resolved list of enabled languages as props from the server
 * Header/MobileNav. Preserves the current path on switch (e.g. `/en/about`
 * → `/hi/about`) instead of always sending users back to `/${loc}`.
 *
 * Closes automatically on: option click, ESC, click outside, route change.
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/lib/i18n'

export interface LanguageOption {
  code: Locale
  label: string        // Display label (native name preferred, e.g. "हिन्दी")
  flag?: string | null // Optional emoji flag/icon
}

interface Props {
  /** Currently active locale — controls the button label + highlighted option. */
  current: Locale
  /** Enabled languages to show in the dropdown, in display order. */
  options: LanguageOption[]
  /**
   * Layout variant.
   * - `compact`: small button for desktop header.
   * - `block`:   full-width button for mobile drawer.
   */
  variant?: 'compact' | 'block'
}

/** Strip the leading `/{locale}` segment from a pathname. Returns the rest (or ''). */
function stripLocale(pathname: string, locales: readonly string[]): string {
  for (const loc of locales) {
    if (pathname === `/${loc}`) return ''
    if (pathname.startsWith(`/${loc}/`)) return pathname.slice(loc.length + 1)
  }
  return pathname === '/' ? '' : pathname
}

export function LocaleSwitcher({ current, options, variant = 'compact' }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const rootRef = useRef<HTMLDivElement>(null)

  /** Close on route change. */
  useEffect(() => { setOpen(false) }, [pathname])

  /** Close on ESC + click-outside. */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDocClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDocClick)
    }
  }, [open])

  if (options.length === 0) return null

  const currentOption = options.find((o) => o.code === current) ?? options[0]
  const localeCodes = options.map((o) => o.code)
  const restOfPath = stripLocale(pathname, localeCodes)

  const buttonBase = 'inline-flex items-center gap-1.5 rounded-md border border-surface-100 bg-white text-ink-900 hover:border-brand-red hover:text-brand-red transition'
  const buttonSize =
    variant === 'compact'
      ? 'px-2.5 py-1.5 text-xs font-medium'
      : 'w-full justify-between px-3 py-2.5 text-sm font-medium'

  return (
    <div ref={rootRef} className={`relative ${variant === 'block' ? 'w-full' : ''}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`${buttonBase} ${buttonSize}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
      >
        <span className="flex items-center gap-1.5">
          {currentOption.flag && <span aria-hidden>{currentOption.flag}</span>}
          <span>{currentOption.label}</span>
        </span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.25" strokeLinecap="round"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className={`absolute z-50 mt-1 min-w-[10rem] overflow-hidden rounded-md border border-surface-100 bg-white py-1 shadow-lg ${
            variant === 'compact' ? 'right-0' : 'left-0 right-0'
          }`}
        >
          {options.map((opt) => {
            const isActive = opt.code === current
            const href = `/${opt.code}${restOfPath}`
            return (
              <li key={opt.code} role="option" aria-selected={isActive}>
                <Link
                  href={href}
                  className={`flex items-center gap-2 px-3 py-2 text-sm transition ${
                    isActive
                      ? 'bg-brand-red text-white'
                      : 'text-ink-900 hover:bg-surface-50 hover:text-brand-red'
                  }`}
                >
                  {opt.flag && <span aria-hidden>{opt.flag}</span>}
                  <span className="flex-1">{opt.label}</span>
                  {isActive && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
