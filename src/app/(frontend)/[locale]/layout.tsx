import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { RouteProgressBar } from '@/components/RouteProgressBar'
import { isValidLocale } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'

interface Props {
  children: ReactNode
  params: Promise<{ locale: string }>
}

/**
 * Per-locale layout — wraps all /[locale]/* pages with header + footer.
 * Validates the locale segment; 404s on bogus values.
 */
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  return (
    <>
      <RouteProgressBar />
      <Header locale={locale as Locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale as Locale} />
    </>
  )
}
