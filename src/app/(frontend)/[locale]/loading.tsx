/**
 * loading.tsx — automatic skeleton during route transitions.
 *
 * Next.js renders this instantly when a nested route is server-fetching.
 * Pairs with <RouteProgressBar /> for full click→nav feedback coverage.
 */

export default function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6" aria-busy aria-live="polite">
      <div className="animate-pulse space-y-4">
        <div className="h-10 w-2/3 rounded bg-surface-100" />
        <div className="h-4 w-1/2 rounded bg-surface-100" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-lg border border-surface-100 bg-white p-6">
              <div className="h-20 rounded bg-surface-100" />
              <div className="h-4 w-1/3 rounded bg-surface-100" />
              <div className="h-4 w-full rounded bg-surface-100" />
              <div className="h-4 w-2/3 rounded bg-surface-100" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  )
}
