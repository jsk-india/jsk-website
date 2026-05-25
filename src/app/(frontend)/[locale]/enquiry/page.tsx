import type { Metadata } from 'next'
import { getPayload } from '@/lib/payload'
import { PAGE_DEFAULTS, textOr } from '@/lib/content-defaults'
import type { Locale } from '@/lib/i18n'
import { EnquiryForm } from './EnquiryForm'

export const metadata: Metadata = { title: 'Enquiry' }

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function EnquiryPage({ params, searchParams }: Props) {
  const { locale } = await params
  const sp = await searchParams
  const product = typeof sp.product === 'string' ? sp.product : undefined

  const payload = await getPayload()
  const page = await payload.findGlobal({ slug: 'page-content', locale: locale as Locale })
  const e = page.enquiry ?? {}
  const d = PAGE_DEFAULTS.enquiry

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight">{textOr(e.headline, d.headline)}</h1>
      <p className="mt-4 text-lg text-ink-600">
        {textOr(e.body, d.body)}
        {product && (
          <span className="mt-1 block text-sm text-brand-red">
            {textOr(e.productLabel, d.productLabel)} <strong>{product.toUpperCase()}</strong>
          </span>
        )}
      </p>
      <div className="mt-10">
        <EnquiryForm source={product ? `/businesses/${product}` : `/${locale}/enquiry`} />
      </div>
    </div>
  )
}
