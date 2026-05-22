const STATS = [
  { value: '1965', label: 'Established' },
  { value: '35,000', label: 'sq.m Plant Area' },
  { value: '1,000+', label: 'Clients Served' },
  { value: '₹10 Bn', label: 'Group Turnover' },
  { value: 'ISO 9001', label: 'Certified' },
]

export function HomeStats() {
  return (
    <section className="border-b border-surface-100 bg-surface-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:grid-cols-5">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-bold text-brand-red sm:text-3xl">{s.value}</p>
            <p className="mt-1 text-sm text-ink-600">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
