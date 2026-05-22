const STRENGTHS = [
  { icon: '🏭', title: 'Integrated Mfg', body: 'State-of-the-art 35,000 sq.m facility at Silvassa.' },
  { icon: '✅', title: 'PGCIL Approved', body: 'Approved by Power Grid Corporation for conductors & wire rods.' },
  { icon: '📦', title: 'Timely Delivery', body: 'Manufacturing systems geared to meet customer deadlines.' },
  { icon: '🔬', title: 'Quality System', body: 'ISO 9001 certified with in-process control & error prevention.' },
  { icon: '🌍', title: '1,000+ Clients', body: "Serving India's Who's Who — PGCIL, L&T, BHEL, Tata, RIL…" },
  { icon: '💰', title: 'Sound Financials', body: '₹10 Bn group turnover with consistent growth trajectory.' },
  { icon: '👨‍🔬', title: 'Qualified Team', body: 'Experienced & technically sound professionals at every level.' },
  { icon: '⚡', title: 'Innovation', body: 'New verticals: VEDA, Digital Substations, Cyber Security.' },
]

export function WhyJSK() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-10 text-center text-2xl font-bold uppercase tracking-wide">Why JSK</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STRENGTHS.map((s) => (
            <div key={s.title} className="rounded-lg border border-surface-100 p-5">
              <span className="text-2xl">{s.icon}</span>
              <h3 className="mt-3 font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-ink-600">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
