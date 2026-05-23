/**
 * Seed the Navigation global with the canonical JSK menu structure.
 * Idempotent — running multiple times just overwrites the header array.
 *
 * Usage:
 *   DATABASE_URI=... PAYLOAD_SECRET=... tsx src/lib/seed-navigation.ts
 */
import { getPayload } from './payload'

const payload = await getPayload()

const HEADER_MENU = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Businesses',
    href: '/businesses',
    children: [
      { label: 'Conductors',     href: '/businesses/conductors' },
      { label: 'Wire Rods',      href: '/businesses/wire-rods' },
      { label: 'Wires',          href: '/businesses/wires' },
      { label: 'Trading',        href: '/businesses/trading' },
      { label: 'New Verticals',  href: '/businesses/new-verticals' },
    ],
  },
  { label: 'Clients',   href: '/clients' },
  { label: 'Investors', href: '/investors' },
  { label: 'News',      href: '/news' },
  { label: 'Careers',   href: '/careers' },
  { label: 'Contact',   href: '/contact' },
]

console.log('🧭 Updating Navigation global…')
await payload.updateGlobal({
  slug: 'navigation',
  data: {
    header: HEADER_MENU,
    ctaLabel: 'Enquire Now',
    ctaHref: '/enquiry',
  } as never, // localized fields make strict typing painful; data shape matches schema
})

console.log(`✅ Navigation updated: ${HEADER_MENU.length} top-level items, ${HEADER_MENU.filter((i) => i.children).reduce((n, i) => n + (i.children?.length ?? 0), 0)} sub-items`)
process.exit(0)
