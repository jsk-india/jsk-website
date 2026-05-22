import { redirect } from 'next/navigation'
import { defaultLocale } from '@/lib/i18n'

/** Root `/` redirects to default locale. */
export default function RootPage() {
  redirect(`/${defaultLocale}`)
}
