/**
 * Content defaults — code-level fallbacks for every CMS field that
 * holds user-facing copy.
 *
 * Pattern:
 *   const value = cmsValue ?? CONTENT_DEFAULTS.section.field
 *
 * Why bother when the CMS is seeded with the same text?
 *   - If an admin clears a field by mistake, the site still renders.
 *   - When new locales (hi/te/ta) are added before translations, the
 *     default (English) text shows instead of a blank section.
 *   - Fresh environments (preview, local dev) work without re-seeding.
 *
 * Single source of truth: edit a string here AND the matching field
 * in admin if you want both to track. CMS edits always win at runtime.
 */

// ────────────────────────────────────────────────────────────────────
// Tiny merge helpers
// ────────────────────────────────────────────────────────────────────

/**
 * Returns `cms` if it's a non-empty string, else `fallback`.
 * Treats null/undefined/empty string the same — fallback wins.
 */
export function textOr<T extends string | null | undefined>(
  cms: T,
  fallback: string,
): string {
  return typeof cms === 'string' && cms.trim() !== '' ? cms : fallback
}

/**
 * Returns `cms` if it's a non-empty array, else `fallback`.
 * Used for CMS arrays where empty = "fall back to defaults" rather
 * than "intentionally show nothing".
 */
export function arrayOr<T>(cms: T[] | null | undefined, fallback: T[]): T[] {
  return Array.isArray(cms) && cms.length > 0 ? cms : fallback
}

// ────────────────────────────────────────────────────────────────────
// Homepage
// ────────────────────────────────────────────────────────────────────

export const HOME_DEFAULTS = {
  manifesto: {
    headlinePart1: 'Made in India.',
    headlineHighlight: 'Built to Last.',
    headlinePart3: 'Powering Growth.',
    body:
      'After six decades of leadership in the aluminium sector, JSK Industries is now a ' +
      'name to reckon with in the power sector. We rank amongst the largest aluminium ' +
      'conductor manufacturing companies in the world — known for initiating new processes, ' +
      'products, and materials.',
    brochureButtonLabel: 'Download Company Brochure',
  },
  vision: {
    eyebrow: 'Our Vision',
    headline: '500 GW Energy Transmission by 2030',
    body:
      "To lead the energy sector by providing cutting-edge, reliable, and sustainable " +
      "solutions that power the world's infrastructure, foster technological advancement, " +
      "and contribute to a cleaner, more connected future.",
  },
  mission: {
    eyebrow: 'Our Mission',
    headline: 'Continuous Improvement & Value Addition',
    body:
      'Harnessing and using our learnings to drive continuous improvement, value addition, ' +
      'and all-round corporate social responsibility while maintaining our core values.',
  },
  certifications: {
    heading: 'Certified, Accredited & Recognized',
    items: [
      { label: 'ISO 9001:2015',   hint: 'Quality Management' },
      { label: 'ISO 14001:2015',  hint: 'Environment' },
      { label: 'OHSAS 18001',     hint: 'Health & Safety' },
      { label: 'LME Listed',      hint: 'London Metal Exchange' },
      { label: 'NABL Accredited', hint: 'ISO/IEC 17025 Lab' },
      { label: 'RETIE Certified', hint: 'Latin American Market' },
    ],
    footnote:
      'ICRA "A Grade" rated · Authorized Economic Operator (Govt. of India) · ' +
      'Approved by PGCIL & all major Indian utilities',
  },
  enquiryCta: {
    headline: 'Ready to discuss your project?',
    body: 'Get in touch for product enquiries, quotes, or partnership discussions.',
    buttonLabel: 'Get a Quote',
  },
  sectionHeadings: {
    productsHeading: 'Our Products',
    viewAllProductsLink: 'View all products →',
    verticalsHeading: 'New Verticals',
    clientsHeading: "Trusted by India's leading companies",
    viewAllClientsLink: 'View all clients →',
  },
}

// ────────────────────────────────────────────────────────────────────
// Strengths (homepage Why JSK)
// ────────────────────────────────────────────────────────────────────

export const STRENGTHS_DEFAULTS = {
  heading: 'Why JSK',
  items: [
    { icon: '🏭',   title: 'Integrated Mfg',   body: 'State-of-the-art 35,000 sq.m facility at Silvassa.' },
    { icon: '✅',   title: 'PGCIL Approved',   body: 'Approved by Power Grid Corporation for conductors & wire rods.' },
    { icon: '📦',   title: 'Timely Delivery',  body: 'Manufacturing systems geared to meet customer deadlines.' },
    { icon: '🔬',   title: 'Quality System',   body: 'ISO 9001 certified with in-process control & error prevention.' },
    { icon: '🌍',   title: '1,000+ Clients',   body: "Serving India's Who's Who — PGCIL, L&T, BHEL, Tata, RIL…" },
    { icon: '💰',   title: 'Sound Financials', body: '₹30 Bn group turnover with consistent growth trajectory.' },
    { icon: '👨‍🔬', title: 'Qualified Team',    body: 'Experienced & technically sound professionals at every level.' },
    { icon: '⚡',   title: 'Innovation',       body: 'New verticals: VEDA, Digital Substations, Cyber Security.' },
  ],
}

// ────────────────────────────────────────────────────────────────────
// PageContent — one bucket per page route
// ────────────────────────────────────────────────────────────────────

export const PAGE_DEFAULTS = {
  about: {
    headline: 'About JSK Industries',
    /** Plain-text paragraphs used when the CMS rich-text intro is empty. */
    introParagraphs: [
      'An Emerging Name in the Power Sector. JSK Industries Pvt. Ltd. is a leading Aluminium Conductor manufacturer specializing in Power Transmission & Distribution Conductors, Aluminium Wire Rods, and Aluminium Alloys.',
      'Established in 1965 by Mr. Dinesh Shah, the company carries out manufacturing in its state-of-the-art, ISO 9001 certified facility at Silvassa. A technology-driven engineering organization, JSK Industries is well-diversified and ranks amongst the largest private sector aluminium conductor manufacturing companies in India.',
      'The Company is known for initiating new processes, products and materials. A strong customer-focused approach and a constant quest for quality has enabled JSK to attain and sustain leadership in all lines of business.',
    ],
    leadershipHeading: 'Leadership',
    manufacturingHeading: 'Manufacturing Facilities',
    certificationsHeading: 'Certifications',
  },
  businesses: {
    headline: 'Businesses',
    body: 'JSK Industries manufactures and trades a comprehensive range of aluminium products for the power sector and beyond.',
    newVerticalsCardTitle: 'New Verticals',
    newVerticalsCardBody: 'VEDA, Digital Substation, Cyber Security — future-ready technology verticals.',
  },
  newVerticals: {
    headline: 'New Verticals',
    body: 'With an aim to set the highest standards of inclusive growth with Research & Innovation, Power Quality and Data Safety under the Make in India campaign.',
  },
  clients: {
    headline: 'Our Clients',
    body: "Over 1,000 satisfied customers including the Who's Who of India's power sector.",
    footnote: '* All brand names/logos used are trademarks of their respective companies.',
  },
  news: {
    headline: 'News & Updates',
    body: 'The latest from JSK Industries — press releases, events, awards, and announcements.',
    emptyTitle: 'News coming soon',
    emptyBody: "We'll be sharing updates here shortly. In the meantime, feel free to get in touch.",
  },
  stories: {
    headline: 'Stories',
    body: 'Case studies, project highlights, and stories from the field.',
    emptyTitle: 'Stories coming soon',
    emptyBody: "We're working on our first case studies. Have a project to share? Get in touch.",
  },
  careers: {
    heroTitle: 'Join JSK Industries',
    heroBody: "Be part of a company that has powered India's transmission infrastructure for over five decades. We're always looking for talented engineers, technicians, and professionals.",
    whyHeading: 'Why JSK',
    whyItems: [
      { icon: '🏭', title: 'State-of-art Facility', body: '35,000 sq.m plant with modern equipment.' },
      { icon: '📈', title: 'Growth Oriented',       body: 'Continuous training and career development.' },
      { icon: '🌍', title: 'Industry Leaders',      body: "Work with India's biggest power companies." },
      { icon: '🔬', title: 'Innovation First',      body: 'New verticals in photonics, digital substations & cybersecurity.' },
    ],
    openPositionsHeading: 'Open Positions',
    emptyTitle: 'No open positions right now',
    emptyBody: "We're not actively hiring, but we're always interested in great talent.",
    emptyCtaLabel: 'Send us your resume',
  },
  contact: {
    headline: 'Contact Us',
    body: 'Reach out to our team at any of our offices across India.',
    enquiryCtaTitle: 'Have a product enquiry?',
    enquiryCtaBody: 'Use our enquiry form for a faster response.',
    enquiryCtaButton: 'Go to Enquiry Form',
  },
  enquiry: {
    headline: 'Enquiry',
    body: 'Fill out the form below and our team will get back to you within 24 hours.',
    productLabel: 'Enquiring about:',
  },
  investors: {
    headline: 'Investor Relations',
    body: 'JSK Industries is committed to transparency and timely disclosure. Access our financial reports, governance documents, and regulatory filings below.',
    emptyMessage: 'Investor documents will be published here soon.',
  },

  // ── Detail page templates (reused across all detail routes) ──
  productDetail: {
    galleryHeading: 'Gallery',
    specificationsHeading: 'Specifications',
    standardsHeading: 'Standards & Compliance',
    applicationsHeading: 'Applications',
    ctaTitle: 'Interested in this product?',
    ctaBody: 'Get a quote or request technical details from our team.',
    ctaButton: 'Enquire Now',
    brochureButton: '📄 Download Brochure',
    relatedHeading: 'Related Products',
    breadcrumbBusinesses: 'Businesses',
  },
  verticalDetail: {
    partnerEyebrow: 'Technology Partner',
    visitPartnerLink: 'Visit partner website →',
    ctaTitleTemplate: 'Interested in {name}?',
    ctaBody: 'Get in touch with our team to discuss how this solution can benefit your operations.',
    ctaButton: 'Contact Us',
    breadcrumbBusinesses: 'Businesses',
    breadcrumbNewVerticals: 'New Verticals',
  },
  careerDetail: {
    responsibilitiesHeading: 'Responsibilities',
    qualificationsHeading: 'Qualifications',
    applyHeading: 'Apply Now',
    summaryHeading: 'Job Summary',
    departmentLabel: 'Department',
    locationLabel: 'Location',
    typeLabel: 'Type',
    postedLabel: 'Posted',
    breadcrumbCareers: 'Careers',
  },
  newsDetail: {
    breadcrumbNews: 'News',
    emptyBodyMessage: 'No content yet.',
  },
  categoryListing: {
    breadcrumbBusinesses: 'Businesses',
    emptyMessage: 'No products in this category yet. Check back soon!',
  },
  notFound: {
    code: '404',
    title: 'Page not found',
    body: "The page you're looking for doesn't exist or has been moved.",
    ctaLabel: 'Go home',
  },
  loading: {
    srLabel: 'Loading…',
  },
}

// ────────────────────────────────────────────────────────────────────
// Forms (Enquiry + Application)
// ────────────────────────────────────────────────────────────────────

export const FORM_DEFAULTS = {
  enquiry: {
    nameLabel: 'Name *',
    emailLabel: 'Email *',
    phoneLabel: 'Phone',
    companyLabel: 'Company',
    countryLabel: 'Country',
    countryDefault: 'India',
    messageLabel: 'Message *',
    messagePlaceholder: 'Tell us about your requirements...',
    submitLabel: 'Submit Enquiry',
    submittingLabel: 'Submitting...',
    successTitle: 'Thank you!',
    successBody: 'Your enquiry has been submitted. Our team will get back to you shortly.',
  },
  application: {
    nameLabel: 'Full Name *',
    emailLabel: 'Email *',
    phoneLabel: 'Phone',
    resumeLabel: 'Resume / CV *',
    resumeHint: '(PDF, DOC · max 5 MB)',
    coverLetterLabel: 'Cover Letter',
    coverLetterPlaceholder: "Tell us why you'd be a great fit...",
    submitLabel: 'Submit Application',
    submittingLabel: 'Submitting...',
    successTitle: 'Application submitted!',
    successBodyTemplate: "Thank you for applying for {jobTitle}. We'll be in touch soon.",
  },
}

// ────────────────────────────────────────────────────────────────────
// Investor + News category labels
// ────────────────────────────────────────────────────────────────────

export const INVESTOR_CATEGORY_LABELS: Record<string, string> = {
  annual_report: 'Annual Reports',
  financial_result: 'Financial Results',
  shareholding_pattern: 'Shareholding Pattern',
  corporate_governance: 'Corporate Governance',
  corporate_announcement: 'Corporate Announcements',
  notice: 'Notices',
  agm: 'Annual General Meeting',
  postal_ballot: 'Postal Ballot',
  annual_return: 'Annual Returns',
  policy: 'Company Policies',
  credit_rating: 'Credit Rating',
  disclosure: 'Disclosures (LODR)',
  secretarial_compliance: 'Secretarial Compliance',
  iepf: 'IEPF',
  committee_composition: 'Committee Composition',
  investor_grievance: 'Investor Grievance',
  corporate_presentation: 'Corporate Presentations',
  other: 'Other',
}

export const NEWS_CATEGORY_LABELS: Record<string, string> = {
  press: 'Press Release',
  event: 'Event',
  award: 'Award',
  exhibition: 'Exhibition',
  announcement: 'Announcement',
}

/** Build a label lookup that prefers CMS overrides, then falls back. */
export function mergeCategoryLabels(
  cmsLabels: { value?: string | null; label?: string | null }[] | null | undefined,
  defaults: Record<string, string>,
): Record<string, string> {
  const merged = { ...defaults }
  if (Array.isArray(cmsLabels)) {
    for (const item of cmsLabels) {
      if (item.value && item.label) merged[item.value] = item.label
    }
  }
  return merged
}

// ────────────────────────────────────────────────────────────────────
// Footer
// ────────────────────────────────────────────────────────────────────

export const FOOTER_DEFAULTS = {
  tagline: 'Powering Growth',
  foundedStrip: 'Founded 1965 · Silvassa, India',
  copyright: (year: number) => `© ${year} JSK Industries Pvt. Ltd. All rights reserved.`,
  /** Used when Footer.columns global has no entries. */
  columns: (prefix: string) => [
    {
      heading: 'Company',
      links: [
        { label: 'About Us',      href: `${prefix}/about` },
        { label: 'Businesses',    href: `${prefix}/businesses` },
        { label: 'Manufacturing', href: `${prefix}/about#manufacturing` },
        { label: 'Clients',       href: `${prefix}/clients` },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Investors', href: `${prefix}/investors` },
        { label: 'News',      href: `${prefix}/news` },
        { label: 'Careers',   href: `${prefix}/careers` },
        { label: 'Contact',   href: `${prefix}/contact` },
      ],
    },
  ],
}

// ────────────────────────────────────────────────────────────────────
// Image maps — legacy slug→file fallbacks for cards
// ────────────────────────────────────────────────────────────────────
// These tile into the /public/images/ tree shipped with the migration.
// Used as a LAST resort when the matching collection doc has no
// cardImage / constructionImage / heroImage / logo upload set.

export const PRODUCT_IMAGE_FALLBACKS: Record<string, string> = {
  aaac:         '/images/products/aaac.gif',
  aac:          '/images/products/aac.gif',
  acsr:         '/images/products/acsr.gif',
  aacsr:        '/images/products/aacsr.gif',
  acar:         '/images/products/acar.gif',
  'acsr-aw':    '/images/products/acsr-aw.gif',
  'acsr-tw':    '/images/products/acsr-tw.gif',
  acss:         '/images/products/acss.jpg',
  accc:         '/images/products/accc.jpg',
  stacir:       '/images/products/stacir.jpg',
  tacsr:        '/images/products/tacsr.jpg',
  'al-59':      '/images/products/al-59.jpg',
  'gap-type':   '/images/products/gap-conductor.jpg',
}

export const VERTICAL_IMAGE_FALLBACKS: Record<string, string> = {
  veda:                  '/images/verticals/veda.jpeg',
  'digital-substation':  '/images/verticals/Prosoft-slider.png',
  'cyber-security':      '/images/verticals/Velox-slider.png',
}

/** Matched by `Client.name.includes(key)` so partial matches work too. */
export const CLIENT_LOGO_FALLBACKS: Record<string, string> = {
  BHEL:    '/images/clients/logo-bhel.gif',
  'L&T':   '/images/clients/logo-lt.gif',
  RIL:     '/images/clients/logo-ril.gif',
  SAIL:    '/images/clients/logo-sail.gif',
  TISCO:   '/images/clients/logo-tatasteel.gif',
  Suzlon:  '/images/clients/logo-suzlon.gif',
  MPPTCL:  '/images/clients/logo-mpptcl.gif',
  Apar:    '/images/clients/logo-apar.gif',
}

/** Best-match lookup: returns the first key that appears in `name`. */
export function clientLogoFallback(name: string): string | null {
  const key = Object.keys(CLIENT_LOGO_FALLBACKS).find((k) => name.includes(k))
  return key ? CLIENT_LOGO_FALLBACKS[key] : null
}
