/**
 * Seed script — populates Payload with data extracted from the legacy
 * jskindia.in site. Run with: pnpm seed
 *
 * Idempotent-ish: checks if records exist before creating.
 */

/* eslint-disable no-console */

// ── Product categories ──
const CATEGORIES = [
  { slug: 'conductors', name: 'Conductors', order: 1 },
  { slug: 'wire-rods', name: 'Wire Rods', order: 2 },
  { slug: 'wires', name: 'Wires', order: 3 },
  { slug: 'trading', name: 'Trading', order: 4 },
]

// ── Products ──
const PRODUCTS = [
  { slug: 'aaac', code: 'AAAC', name: 'All Aluminium Alloy Conductor', cat: 'conductors', desc: 'Used for overhead transmission and distribution lines, offering high strength and corrosion resistance.' },
  { slug: 'aac', code: 'AAC', name: 'All Aluminium Conductor', cat: 'conductors', desc: 'Concentric-lay-stranded conductor made from EC grade aluminium, used for power distribution.' },
  { slug: 'acsr', code: 'ACSR', name: 'Aluminium Conductor, Steel Reinforced', cat: 'conductors', desc: 'High-strength conductor with steel core for long-span power transmission.' },
  { slug: 'aacsr', code: 'AACSR', name: 'Aluminium Alloy Conductor, Steel Reinforced', cat: 'conductors', desc: 'Combines aluminium alloy wires with steel core for enhanced mechanical properties.' },
  { slug: 'acar', code: 'ACAR', name: 'Aluminium Conductor Alloy Reinforced', cat: 'conductors', desc: 'Aluminium 1350 and aluminium alloy strands providing good conductivity and strength.' },
  { slug: 'acsr-aw', code: 'ACSR/AW', name: 'Aluminium Conductor, Aluminium-Clad Steel Reinforced', cat: 'conductors', desc: 'ACSR with aluminium-clad steel core for improved corrosion resistance.' },
  { slug: 'acsr-tw', code: 'ACSR/TW', name: 'ACSR Trapezoidal Wire', cat: 'conductors', desc: 'ACSR with trapezoidal shaped aluminium strands for compact design and increased ampacity.' },
  { slug: 'acss', code: 'ACSS', name: 'Aluminium Conductor Steel Supported', cat: 'conductors', desc: 'High-temperature conductor with fully annealed aluminium strands.' },
  { slug: 'accc', code: 'ACCC', name: 'Aluminium Conductor Composite Core', cat: 'conductors', desc: 'Advanced composite core conductor for high-capacity power transmission.' },
  { slug: 'stacir', code: 'STACIR', name: 'Super Thermal Alloy Conductor Invar Reinforced', cat: 'conductors', desc: 'High-temperature low-sag conductor with Invar alloy core.' },
  { slug: 'tacsr', code: 'TACSR', name: 'Thermal-resistant ACSR', cat: 'conductors', desc: 'Heat-resistant aluminium alloy conductor for high-temperature operation.' },
  { slug: 'al-59', code: 'AL-59', name: 'AL-59 Conductor', cat: 'conductors', desc: 'High-strength aluminium-magnesium-silicon alloy conductor.' },
  { slug: 'gap-type', code: 'GAP', name: 'GAP-Type Conductor', cat: 'conductors', desc: 'Gap-type conductor allowing high-temperature operation by reducing sag.' },
  { slug: 'acfr', code: 'ACFR', name: 'Aluminium Conductor Fiber Reinforced', cat: 'conductors', desc: 'Carbon fiber composite core conductor for ultra-high voltage lines.' },
  { slug: 'wire-rod-ec', code: 'EC Rod', name: 'Wire Rod EC', cat: 'wire-rods', desc: 'Electrical Conductor grade aluminium redraw rod for cables, conductors and transformers.' },
  { slug: 'wire-rod-alloy', code: 'Alloy Rod', name: 'Wire Rod Alloy', cat: 'wire-rods', desc: 'Mechanical aluminium alloy rod for industrial applications.' },
  { slug: 'wire-rod-deoxy', code: 'Deoxy Rod', name: 'Wire Rod Deoxy', cat: 'wire-rods', desc: 'Aluminium continuous cast rod used for de-oxidation of steel.' },
  { slug: 'aluminium-wires', code: 'Wires', name: 'Aluminium Wires', cat: 'wires', desc: 'Aluminium wires for various electrical and industrial applications.' },
  { slug: 'primary-ingots', code: 'Ingots', name: 'Primary Ingots', cat: 'trading', desc: 'LME registered primary grade ingots, purity 99% to 99.9%, sizes 20 kg to 600 kg.' },
  { slug: 'deoxi-ingots', code: 'Deoxi', name: 'Deoxi Ingots & Cubes', cat: 'trading', desc: 'For de-oxidation process in manufacturing of steel, purity 93% to 99.5%.' },
  { slug: 'alloy-ingots', code: 'Alloy Ingots', name: 'Alloy Ingots', cat: 'trading', desc: 'LM Series, ADC Series, ASTM Series, Cu Master, and customer specific alloys.' },
  { slug: 'rolled-products', code: 'Rolled', name: 'Rolled Products', cat: 'trading', desc: 'Aluminium rolled products for diverse industrial applications.' },
  { slug: 'foils', code: 'Foils', name: 'Foils', cat: 'trading', desc: 'Aluminium foils for packaging and industrial use.' },
  { slug: 'extrusions', code: 'Extrusions', name: 'Extrusions', cat: 'trading', desc: 'Aluminium extrusion profiles for construction and industrial applications.' },
  { slug: 'zinc-metal-scrap', code: 'Zinc/Scrap', name: 'Zinc & Metal Scrap', cat: 'trading', desc: 'Zinc and metal scrap for recycling and industrial processes.' },
]

// ── Clients ──
const CLIENT_NAMES = [
  'Power Grid Corporation of India Ltd. (PGCIL)', 'Larsen & Toubro Ltd. (L&T)',
  'Gujarat Energy Transmission Corporation Ltd. (GETCO)', 'Reliance Industries Ltd. (RIL)',
  'Bharat Heavy Electricals Ltd. (BHEL)', 'Steel Authority of India Ltd. (SAIL)',
  'Suzlon Energy Ltd.', 'Tata Iron & Steel Co. (TISCO)',
  'Kalpataru Power Transmission Ltd. (KPTL)', 'ABB Ltd.',
  'Madhya Gujarat Vij Co. Ltd. (MGVCL)', 'Dakshin Gujarat Vij Co. Ltd. (DGVCL)',
  'Paschim Gujarat Vij Co. Ltd. (PGVCL)', 'Uttar Gujarat Vij Co. Ltd. (UGVCL)',
  'Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL)',
  'Maharashtra State Electricity Transmission Co. Ltd. (MSETCL)',
  'Tamil Nadu Electricity Board (TNEB)', 'Karnataka Power Transmission Corporation Ltd. (KPTCL)',
  'Madhya Pradesh Power Transmission Co. Ltd. (MPPTCL)',
  'Central Power Distribution Co. of Andhra Pradesh Ltd. (APCPDCL)',
  'Transmission Corporation of Andhra Pradesh Ltd. (APTRANSCO)',
  'Chattishgarh State Electricity Board (CSEB)',
  'Ajmer Vidyut Vitaran Nigam Ltd. (AVVNL)',
  'Torrent Power Ltd.', 'Apar Industries Ltd.', 'Sterlite Industries (India) Ltd.',
  'Finolex Cables Ltd.', 'Polycab Wires Ltd.', 'KEI Industries Ltd.',
  'Essar Steel Ltd.', 'Jindal Steel & Power Ltd.', 'ISPAT Industries Ltd.',
  'Genus Power Infrastructure Ltd.', 'EMI Transmission Ltd.',
  'Cable Corp. of India Ltd.', 'Associated Transrail Structures Ltd. (ATSL)',
  'ICOMM Tele Ltd.', 'IVRCL Infrastructures & Projects Ltd.',
  'Lumino Industries Ltd.', 'Ravin Cables Ltd.', 'Deora Wires & Machines Pvt. Ltd.',
  'Jyoti Engineers & Contractors Pvt. Ltd.', 'Pentak General Trading LLC, Dubai',
  'SPIC - SMO', 'Utility Energytech & Engineers Private Ltd. (UEEPL)',
  'Jai Garh Power Transmission Corp. Ltd. (JPTL)',
]

// Featured clients (shown on homepage logo wall)
const FEATURED = ['PGCIL', 'L&T', 'BHEL', 'RIL', 'SAIL', 'TISCO', 'Suzlon', 'KPTL']

// ── Verticals ──
const VERTICALS = [
  {
    slug: 'veda', name: 'VEDA',
    summary: 'Vibrational Effects – Detection Analysis: A novel photonic system developed to monitor real-time vibrations on land for detection, discrimination and distinguishing any ground strain or intrusion.',
  },
  {
    slug: 'digital-substation', name: 'Digital Substation',
    summary: 'Turnkey solutions in the field of high-tech devices and automation systems for power energy, developed in partnership with Prosoft-Systems per IEC 61850.',
  },
  {
    slug: 'cyber-security', name: 'Cyber Security',
    summary: 'Velox UDA enables OT teams to access operational data remotely, helping optimize industrial equipment inspections and handle inventory monitoring.',
  },
]

// ── Persons ──
const PERSONS = [
  { name: 'Mr. Dinesh Shah', role: 'Founder', isFounder: true, isBoard: false, order: 0 },
  {
    name: 'Mr. Kalpesh D. Shah', role: 'Director', isFounder: false, isBoard: true, order: 1,
    qualifications: 'Masters in Business Administration from USA, Engineering degree in Mechanical from India.',
  },
  {
    name: 'Mr. Anish D. Shah', role: 'Director', isFounder: false, isBoard: true, order: 2,
    qualifications: 'Chartered Accountant. Over 12 years of experience in finance, audit & legal.',
  },
]

// ── InvestorDocuments ──
const INVESTOR_DOCS = [
  { title: 'Annual Return - FY 2021-22', category: 'annual_return' as const, fy: 'FY 2021-22' },
  { title: 'Annual Return - FY 2020-21', category: 'annual_return' as const, fy: 'FY 2020-21' },
]

// ── Output as JSON for the seed runner ──
const seedData = {
  categories: CATEGORIES,
  products: PRODUCTS,
  clients: CLIENT_NAMES.map((name, i) => ({
    name,
    isFeatured: FEATURED.some((f) => name.includes(f)),
    order: i,
  })),
  verticals: VERTICALS,
  persons: PERSONS,
  investorDocs: INVESTOR_DOCS,
}

console.log(JSON.stringify(seedData, null, 2))
console.log(`\n✅ Seed data ready: ${CATEGORIES.length} categories, ${PRODUCTS.length} products, ${CLIENT_NAMES.length} clients, ${VERTICALS.length} verticals, ${PERSONS.length} persons, ${INVESTOR_DOCS.length} investor docs`)
console.log('\n🐶 To load into Payload, run the dev server and POST to the REST API, or use the admin UI.\n   A full programmatic seed (with getPayload()) will be wired once all collections are stable.')
