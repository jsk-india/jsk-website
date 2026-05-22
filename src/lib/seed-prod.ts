/**
 * Production seeder — writes all legacy data directly into Payload.
 * Run against any DB: DATABASE_URI=... tsx src/lib/seed-prod.ts
 * Idempotent: skips records that already exist (matched by slug/name).
 */
import { getPayload } from './payload'

const payload = await getPayload()

// ─── helpers ────────────────────────────────────────────────────────────────

async function upsertBySlug(
  collection: string,
  slug: string,
  data: Record<string, unknown>,
) {
  const existing = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1 } as any)
  if (existing.totalDocs > 0) { process.stdout.write(`  skip ${collection}/${slug}\n`); return existing.docs[0] }
  const doc = await payload.create({ collection, data } as any)
  process.stdout.write(`  ✅ ${collection}/${slug}\n`)
  return doc
}

async function upsertByName(collection: string, name: string, data: Record<string, unknown>) {
  const existing = await payload.find({ collection, where: { name: { equals: name } }, limit: 1 } as any)
  if (existing.totalDocs > 0) { process.stdout.write(`  skip ${collection}/${name}\n`); return existing.docs[0] }
  const doc = await payload.create({ collection, data } as any)
  process.stdout.write(`  ✅ ${collection}/${name}\n`)
  return doc
}

// ─── 1. Categories ──────────────────────────────────────────────────────────
console.log('\n📦 Categories')
const catMap: Record<string, number> = {}
for (const c of [
  { slug: 'conductors', name: 'Conductors', order: 1 },
  { slug: 'wire-rods',  name: 'Wire Rods',  order: 2 },
  { slug: 'wires',      name: 'Wires',       order: 3 },
  { slug: 'trading',    name: 'Trading',     order: 4 },
]) {
  const doc = await upsertBySlug('product-categories', c.slug, c)
  catMap[c.slug] = doc.id
}

// ─── 2. Products ────────────────────────────────────────────────────────────
console.log('\n⚡ Products')
for (const p of [
  { slug: 'aaac',     code: 'AAAC',     name: 'All Aluminium Alloy Conductor',                        cat: 'conductors', desc: 'Used for overhead transmission and distribution lines, offering high strength and corrosion resistance.' },
  { slug: 'aac',      code: 'AAC',      name: 'All Aluminium Conductor',                              cat: 'conductors', desc: 'Concentric-lay-stranded conductor made from EC grade aluminium, used for power distribution.' },
  { slug: 'acsr',     code: 'ACSR',     name: 'Aluminium Conductor, Steel Reinforced',                cat: 'conductors', desc: 'High-strength conductor with steel core for long-span power transmission.' },
  { slug: 'aacsr',    code: 'AACSR',    name: 'Aluminium Alloy Conductor, Steel Reinforced',          cat: 'conductors', desc: 'Combines aluminium alloy wires with steel core for enhanced mechanical properties.' },
  { slug: 'acar',     code: 'ACAR',     name: 'Aluminium Conductor Alloy Reinforced',                 cat: 'conductors', desc: 'Aluminium 1350 and aluminium alloy strands providing good conductivity and strength.' },
  { slug: 'acsr-aw',  code: 'ACSR/AW',  name: 'Aluminium Conductor, Aluminium-Clad Steel Reinforced', cat: 'conductors', desc: 'ACSR with aluminium-clad steel core for improved corrosion resistance.' },
  { slug: 'acsr-tw',  code: 'ACSR/TW',  name: 'ACSR Trapezoidal Wire',                               cat: 'conductors', desc: 'ACSR with trapezoidal shaped aluminium strands for compact design and increased ampacity.' },
  { slug: 'acss',     code: 'ACSS',     name: 'Aluminium Conductor Steel Supported',                  cat: 'conductors', desc: 'High-temperature conductor with fully annealed aluminium strands.' },
  { slug: 'accc',     code: 'ACCC',     name: 'Aluminium Conductor Composite Core',                   cat: 'conductors', desc: 'Advanced composite core conductor for high-capacity power transmission.' },
  { slug: 'stacir',   code: 'STACIR',   name: 'Super Thermal Alloy Conductor Invar Reinforced',       cat: 'conductors', desc: 'High-temperature low-sag conductor with Invar alloy core.' },
  { slug: 'tacsr',    code: 'TACSR',    name: 'Thermal-resistant ACSR',                               cat: 'conductors', desc: 'Heat-resistant aluminium alloy conductor for high-temperature operation.' },
  { slug: 'al-59',    code: 'AL-59',    name: 'AL-59 Conductor',                                      cat: 'conductors', desc: 'High-strength aluminium alloy conductor with 59% IACS conductivity.' },
  { slug: 'gap-type', code: 'GAP',      name: 'GAP-Type Conductor',                                   cat: 'conductors', desc: 'Ultra-high-capacity conductor with gap between core and aluminium strands for high-temp operation.' },
  { slug: 'acfr',     code: 'ACFR',     name: 'Aluminium Conductor with Fibre Reinforced Core',       cat: 'conductors', desc: 'Lightweight fibre-reinforced core conductor for long-span applications.' },
  { slug: 'wire-rod-ec',    code: 'EC ROD',    name: 'Aluminium Wire Rod — EC Grade',    cat: 'wire-rods', desc: 'Electrical conductor grade aluminium wire rod, 9.5mm diameter, for cable and conductor manufacturing.' },
  { slug: 'wire-rod-alloy', code: 'ALLOY ROD', name: 'Aluminium Alloy Wire Rod',        cat: 'wire-rods', desc: 'High-strength aluminium alloy wire rod for overhead conductor stranding.' },
  { slug: 'wire-rod-deoxy', code: 'DEOXY ROD', name: 'De-oxidised Aluminium Wire Rod',  cat: 'wire-rods', desc: 'De-oxidised aluminium rod for welding wire and other special applications.' },
  { slug: 'aluminium-wires',  code: 'AL WIRE',  name: 'Aluminium Wires',             cat: 'wires',   desc: 'EC grade aluminium wires for use in power cables and conductor stranding.' },
  { slug: 'alloy-wires',      code: 'ALLOY WIRE', name: 'Aluminium Alloy Wires',     cat: 'wires',   desc: 'High-strength aluminium alloy wires for overhead line conductors.' },
  { slug: 'primary-ingots',  code: 'P-INGOT',  name: 'Primary Aluminium Ingots',   cat: 'trading', desc: 'LME-grade primary aluminium ingots (P0610, P1020) for trading and industrial use.' },
  { slug: 'alloy-ingots',    code: 'A-INGOT',  name: 'Aluminium Alloy Ingots',     cat: 'trading', desc: 'Aluminium alloy ingots for de-oxidation and special alloy applications.' },
  { slug: 'deoxy-ingots',    code: 'D-INGOT',  name: 'De-oxidised Aluminium',      cat: 'trading', desc: 'De-oxidised aluminium for steel and stainless steel manufacturing.' },
  { slug: 'billets',         code: 'BILLET',   name: 'Aluminium Billets',          cat: 'trading', desc: 'Aluminium billets for extrusion applications.' },
  { slug: 'rolled-products', code: 'ROLLED',   name: 'Rolled Products',            cat: 'trading', desc: 'Aluminium sheets, plates, coils, and foils.' },
  { slug: 'zinc-products',   code: 'ZINC',     name: 'Zinc Metal & Scrap',         cat: 'trading', desc: 'Zinc ingots and scrap for galvanizing and die casting.' },
]) {
  await upsertBySlug('products', p.slug, {
    slug: p.slug,
    code: p.code,
    name: p.name,
    shortDescription: p.desc,
    category: catMap[p.cat],
    _status: 'published',
  })
}

// ─── 3. Clients ─────────────────────────────────────────────────────────────
console.log('\n🤝 Clients')
const CLIENTS = [
  { name: 'Power Grid Corporation of India Ltd. (PGCIL)',          isFeatured: true,  order: 1 },
  { name: 'Larsen & Toubro Ltd. (L&T)',                            isFeatured: true,  order: 2 },
  { name: 'BHEL',                                                  isFeatured: true,  order: 3 },
  { name: 'Reliance Industries Ltd. (RIL)',                        isFeatured: true,  order: 4 },
  { name: 'Suzlon Energy Ltd.',                                    isFeatured: true,  order: 5 },
  { name: 'Steel Authority of India Ltd. (SAIL)',                  isFeatured: true,  order: 6 },
  { name: 'Tata Iron & Steel Co. (TISCO)',                         isFeatured: true,  order: 7 },
  { name: 'Kalpataru Power Transmission Ltd. (KPTL)',              isFeatured: true,  order: 8 },
  { name: 'ABB Ltd.',                                              isFeatured: false, order: 9 },
  { name: 'Madhya Gujarat Vij Co. Ltd. (MGVCL)',                   isFeatured: false, order: 10 },
  { name: 'Dakshin Gujarat Vij Co. Ltd. (DGVCL)',                  isFeatured: false, order: 11 },
  { name: 'Paschim Gujarat Vij Co. Ltd. (PGVCL)',                  isFeatured: false, order: 12 },
  { name: 'Uttar Gujarat Vij Co. Ltd. (UGVCL)',                    isFeatured: false, order: 13 },
  { name: 'Maharashtra State Electricity Distribution Co. (MSEDCL)', isFeatured: false, order: 14 },
  { name: 'Maharashtra State Electricity Transmission Co. (MSETCL)', isFeatured: false, order: 15 },
  { name: 'Tamil Nadu Electricity Board (TNEB)',                   isFeatured: false, order: 16 },
  { name: 'Karnataka Power Transmission Corp. (KPTCL)',            isFeatured: false, order: 17 },
  { name: 'Madhya Pradesh Power Transmission Co. (MPPTCL)',        isFeatured: false, order: 18 },
  { name: 'Central Power Distribution Co. of AP (APCPDCL)',        isFeatured: false, order: 19 },
  { name: 'Transmission Corp. of Andhra Pradesh (APTRANSCO)',      isFeatured: false, order: 20 },
  { name: 'Chattishgarh State Electricity Board (CSEB)',           isFeatured: false, order: 21 },
  { name: 'Ajmer Vidyut Vitaran Nigam Ltd. (AVVNL)',               isFeatured: false, order: 22 },
  { name: 'Torrent Power Ltd.',                                    isFeatured: false, order: 23 },
  { name: 'Apar Industries Ltd.',                                  isFeatured: false, order: 24 },
  { name: 'Sterlite Industries (India) Ltd.',                      isFeatured: false, order: 25 },
  { name: 'Finolex Cables Ltd.',                                   isFeatured: false, order: 26 },
  { name: 'Polycab Wires Ltd.',                                    isFeatured: false, order: 27 },
  { name: 'KEI Industries Ltd.',                                   isFeatured: false, order: 28 },
  { name: 'Essar Steel Ltd.',                                      isFeatured: false, order: 29 },
  { name: 'Jindal Steel & Power Ltd.',                             isFeatured: false, order: 30 },
  { name: 'Genus Power Infrastructure Ltd.',                       isFeatured: false, order: 31 },
  { name: 'EMI Transmission Ltd.',                                 isFeatured: false, order: 32 },
  { name: 'Cable Corp. of India Ltd.',                             isFeatured: false, order: 33 },
  { name: 'Associated Transrail Structures Ltd. (ATSL)',           isFeatured: false, order: 34 },
  { name: 'Torrent Power Ltd.',                                    isFeatured: false, order: 35 },
  { name: 'Apar Industries Ltd.',                                  isFeatured: false, order: 36 },
  { name: 'Pentak General Trading LLC, Dubai',                     isFeatured: false, order: 37 },
  { name: 'Utility Energytech & Engineers Pvt. Ltd. (UEEPL)',      isFeatured: false, order: 38 },
  { name: 'Jai Garh Power Transmission Corp. Ltd. (JPTL)',         isFeatured: false, order: 39 },
]
for (const c of CLIENTS) await upsertByName('clients', c.name, c)

// ─── 4. Verticals ────────────────────────────────────────────────────────────
console.log('\n🚀 Verticals')
for (const v of [
  { slug: 'veda',               name: 'VEDA',               summary: 'Vibrational Effects – Detection Analysis: A novel photonic system developed to monitor real-time vibrations on land for detection, discrimination and distinguishing any ground strain or intrusion.', _status: 'published' },
  { slug: 'digital-substation', name: 'Digital Substation', summary: 'Turnkey solutions in the field of high-tech devices and automation systems for power energy, developed in partnership with Prosoft-Systems per IEC 61850.', _status: 'published' },
  { slug: 'cyber-security',     name: 'Cyber Security',     summary: 'Velox UDA enables OT teams to access operational data remotely, helping optimize industrial equipment inspections and handle inventory monitoring.', _status: 'published' },
]) await upsertBySlug('verticals', v.slug, v)

// ─── 5. Leadership ───────────────────────────────────────────────────────────
console.log('\n👤 Persons')
for (const p of [
  { name: 'Mr. Dinesh Shah',    role: 'Founder',   isFounder: true,  isBoard: false, order: 0 },
  { name: 'Mr. Kalpesh D. Shah', role: 'Director', isFounder: false, isBoard: true,  order: 1, qualifications: 'Masters in Business Administration from USA, Engineering degree in Mechanical from India.' },
  { name: 'Mr. Anish D. Shah',  role: 'Director',  isFounder: false, isBoard: true,  order: 2, qualifications: 'Chartered Accountant. Over 12 years of experience in finance, audit & legal.' },
]) await upsertByName('persons', p.name, p)

// ─── 6. Certifications ───────────────────────────────────────────────────────
console.log('\n📋 Certifications')
for (const c of [
  { name: 'ISO 9001:2015', issuer: 'Bureau Veritas' },
  { name: 'PGCIL Approved', issuer: 'Power Grid Corporation of India Ltd.' },
]) await upsertByName('certifications', c.name, c)

// ─── 7. Plants ───────────────────────────────────────────────────────────────
console.log('\n🏭 Plants')
for (const p of [
  { slug: 'sayli',   name: 'Sayli Plant',   address: 'Survey No. 369/1/1/2, Behind Siyaram Silk Mills Limited', city: 'Sayli, Silvassa — 396 230', area: '35,000 sq.m', capacities: [{ label: 'Conductor Stranding', value: '60,000 KMTS/year' }, { label: 'Wire Rod', value: '30,000 MT/year' }] },
  { slug: 'rakholi', name: 'Rakholi Plant', address: 'Survey No. 126/1-B, Near Rakholi School',                 city: 'Rakholi, Silvassa — 396 240',  capacities: [{ label: 'Wires & Conductors', value: 'Additional capacity' }] },
]) await upsertBySlug('plants', p.slug, p)

// ─── 8. Investor Docs ────────────────────────────────────────────────────────
console.log('\n📊 Investor Documents')
for (const d of [
  { title: 'Annual Return - FY 2021-22', category: 'annual_return', fy: 'FY 2021-22', publishedAt: '2022-09-30T00:00:00.000Z' },
  { title: 'Annual Return - FY 2020-21', category: 'annual_return', fy: 'FY 2020-21', publishedAt: '2021-09-30T00:00:00.000Z' },
  { title: 'Secretarial Compliance Report - FY 2021-22', category: 'secretarial_compliance', fy: 'FY 2021-22', publishedAt: '2022-05-30T00:00:00.000Z' },
]) {
  const existing = await payload.find({ collection: 'investor-documents', where: { title: { equals: d.title } }, limit: 1 } as any)
  if (existing.totalDocs > 0) { process.stdout.write(`  skip ${d.title}\n`); continue }
  await payload.create({ collection: 'investor-documents', data: d } as any)
  process.stdout.write(`  ✅ ${d.title}\n`)
}

console.log('\n🎉 Production seed complete!\n')
process.exit(0)
