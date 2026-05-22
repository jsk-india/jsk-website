import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-extrabold text-brand-red">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-ink-600">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/en" className="mt-6 rounded-md bg-brand-red px-6 py-3 font-semibold text-white hover:bg-brand-red-dark">
        Go home
      </Link>
    </div>
  )
}
