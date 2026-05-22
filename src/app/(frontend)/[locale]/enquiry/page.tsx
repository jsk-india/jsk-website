import type { Metadata } from 'next'
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight">Enquiry</h1>
      <p className="mt-4 text-lg text-ink-600">
        Fill out the form below and our team will get back to you within 24 hours.
        {product && (
          <span className="mt-1 block text-sm text-brand-red">
            Enquiring about: <strong>{product.toUpperCase()}</strong>
          </span>
        )}
      </p>
      <div className="mt-10">
        <EnquiryForm source={product ? `/businesses/${product}` : `/${locale}/enquiry`} />
      </div>
    </div>
  )
}
