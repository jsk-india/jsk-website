'use client'

/**
 * RouteProgressBar — thin top-of-page progress indicator during navigation.
 *
 * Why this exists:
 *   Next.js App Router server-renders each page, which can take ~500ms-2s on a
 *   slow connection. Without feedback, every link click feels "dead" for that
 *   window. This component intercepts internal link clicks and shows a bar
 *   that animates 0→90% during the request, then snaps to 100% on completion.
 *
 * Zen: One way to do it — no external dependency (nprogress et al), just
 * usePathname + a CSS transition.
 */

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

/** Width % the bar holds at while waiting for the new page (never reaches 100 until done). */
const HOLD_WIDTH = 90

export function RouteProgressBar() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  /** When the path actually changes, finish the bar and fade out. */
  useEffect(() => {
    if (!visible) return
    setProgress(100)
    const fadeId = setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 250)
    return () => clearTimeout(fadeId)
    // We deliberately don't list `visible` — only path changes matter here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  /** Intercept all clicks; start the bar for internal-link navigations. */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Ignore modifier clicks (cmd/ctrl/shift open in new tab)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return

      const anchor = (e.target as HTMLElement | null)?.closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return
      if (anchor.target === '_blank') return
      if (anchor.hasAttribute('download')) return
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      if (/^https?:\/\//.test(href) && !href.includes(window.location.host)) return

      // It's an internal navigation — start showing the bar
      setVisible(true)
      setProgress(HOLD_WIDTH)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] h-0.5 w-full"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 200ms' }}
    >
      <div
        className="h-full bg-brand-red shadow-[0_0_8px_rgba(220,38,38,0.7)]"
        style={{
          width: `${progress}%`,
          transition:
            progress === 100
              ? 'width 200ms ease-out'
              : 'width 3000ms cubic-bezier(0.1, 0.9, 0.3, 1)',
        }}
      />
    </div>
  )
}
