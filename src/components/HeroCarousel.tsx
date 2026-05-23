'use client'

/**
 * HeroCarousel — auto-rotating hero banner for the homepage.
 *
 * Reads slides from the SiteSettings global. Each slide has a background image,
 * eyebrow, headline, subheadline, and CTA. Rotates every 6s; pauses on hover.
 *
 * Zen: Simple is better than complex — no external carousel library, just useState.
 */

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

export interface HeroSlide {
  imageUrl: string
  imageAlt: string
  eyebrow?: string | null
  headline: string
  subheadline?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
}

interface Props {
  slides: HeroSlide[]
  /** Auto-advance interval in ms. Default: 6000. */
  intervalMs?: number
}

const ROTATE_MS = 6_000

export function HeroCarousel({ slides, intervalMs = ROTATE_MS }: Props) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const total = slides.length
  const goTo = useCallback((i: number) => setIndex(((i % total) + total) % total), [total])
  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  useEffect(() => {
    if (paused || total < 2) return
    const id = setTimeout(next, intervalMs)
    return () => clearTimeout(id)
  }, [index, paused, total, intervalMs, next])

  if (total === 0) return null

  return (
    <section
      className="relative flex min-h-[70vh] items-center overflow-hidden bg-ink-900 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={i !== index}
        >
          <Image
            src={s.imageUrl}
            alt={s.imageAlt}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900/90 to-ink-900/40" />
        </div>
      ))}

      {/* Active slide content */}
      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`transition-opacity duration-700 ${i === index ? 'opacity-100' : 'pointer-events-none absolute inset-0 px-4 py-24 opacity-0 sm:px-6'}`}
            aria-hidden={i !== index}
          >
            {s.eyebrow && (
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
                {s.eyebrow}
              </p>
            )}
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              {s.headline}
            </h1>
            {s.subheadline && (
              <p className="mt-6 max-w-xl text-lg text-surface-100/80">{s.subheadline}</p>
            )}
            {s.ctaLabel && s.ctaHref && (
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={s.ctaHref}
                  className="rounded-md bg-brand-red px-6 py-3 font-semibold text-white hover:bg-brand-red-dark"
                >
                  {s.ctaLabel}
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controls — only if multiple slides */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 sm:block"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 sm:block"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-brand-red' : 'w-2 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
