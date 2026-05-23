import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from '@/lib/payload'
import { isMedia } from '@/lib/media'
import { localizeHref } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'

interface Props { locale: Locale }

export async function Footer({ locale }: Props) {
  const prefix = `/${locale}`
  const payload = await getPayload()

  const [settings, footer] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', locale }),
    payload.findGlobal({ slug: 'footer', locale }),
  ])

  const addresses = (settings.addresses ?? []) as {
    label?: string | null; line1?: string | null; city?: string | null;
    phone?: string | null; email?: string | null
  }[]

  const columns = (footer.columns ?? []) as {
    heading?: string | null
    links?: { label?: string | null; href?: string | null }[] | null
  }[]

  const legalLinks = (footer.legalLinks ?? []) as { label?: string | null; href?: string | null }[]
  const copyright = footer.copyrightText ?? `© ${new Date().getFullYear()} JSK Industries Pvt. Ltd. All rights reserved.`

  // Get the primary (first) address for the footer
  const primary = addresses[0]

  return (
    <footer className="border-t border-surface-100 bg-ink-900 text-surface-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div>
            <Link href={prefix} className="inline-block">
              {isMedia(settings.logoLight) && settings.logoLight.url ? (
                <Image
                  src={settings.logoLight.url}
                  alt={settings.logoLight.alt ?? 'JSK Industries'}
                  width={100}
                  height={36}
                  className="h-9 w-auto object-contain brightness-0 invert"
                />
              ) : (
                <span className="text-lg font-extrabold text-brand-gold">jsk</span>
              )}
            </Link>
            <p className="mt-1 text-sm text-ink-300">
              {(settings.tagline as string | null | undefined) ?? 'Powering Growth'}
            </p>
            <p className="mt-2 text-xs text-ink-300">Founded 1965 · Silvassa, India</p>
            {primary && (
              <address className="mt-4 text-xs not-italic text-ink-300 space-y-1">
                {primary.phone && (
                  <p><a href={`tel:${(primary.phone as string).replace(/\s/g, '')}`} className="hover:text-white">{primary.phone as string}</a></p>
                )}
                {primary.email && (
                  <p><a href={`mailto:${primary.email}`} className="hover:text-white">{primary.email as string}</a></p>
                )}
              </address>
            )}
          </div>

          {/* CMS-driven columns (if configured) */}
          {columns.length > 0 ? (
            columns.map((col, i) => (
              <div key={i}>
                <h4 className="mb-3 text-sm font-semibold text-surface-100">{col.heading}</h4>
                <ul className="space-y-2 text-sm text-ink-300">
                  {(col.links ?? []).map((l, j) => (
                    <li key={j}>
                      <Link href={localizeHref(l.href, prefix)} className="hover:text-white">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            /* Hardcoded fallback */
            <>
              <div>
                <h4 className="mb-3 text-sm font-semibold text-surface-100">Company</h4>
                <ul className="space-y-2 text-sm text-ink-300">
                  {[['About Us', `${prefix}/about`], ['Businesses', `${prefix}/businesses`], ['Manufacturing', `${prefix}/about#manufacturing`], ['Clients', `${prefix}/clients`]].map(([l, h]) => (
                    <li key={l}><Link href={h} className="hover:text-white">{l}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-3 text-sm font-semibold text-surface-100">Resources</h4>
                <ul className="space-y-2 text-sm text-ink-300">
                  {[['Investors', `${prefix}/investors`], ['News', `${prefix}/news`], ['Careers', `${prefix}/careers`], ['Contact', `${prefix}/contact`]].map(([l, h]) => (
                    <li key={l}><Link href={h} className="hover:text-white">{l}</Link></li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-600/30 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 text-xs text-ink-300 sm:px-6">
          <span>{copyright}</span>
          <div className="flex gap-4">
            {legalLinks.map((l, i) => (
              <Link key={i} href={localizeHref(l.href, prefix)} className="hover:text-white">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
