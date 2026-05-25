/**
 * One-time seed for the new CMS globals: HomeContent, Strengths, PageContent.
 *
 * Run this AFTER the migration creates the empty tables, BEFORE deploying.
 * It populates the English (default) locale with the previously hardcoded
 * copy so the live site doesn't go blank between deploy and admin edits.
 *
 * Usage:
 *   cp .env.production.local .env  # or set DATABASE_URI inline
 *   npx tsx scripts/seed-page-content.ts
 *   # restore your normal .env
 *
 * Idempotent: re-running overwrites the en locale with the same content.
 * Non-en locales (hi/te/ta) are NOT touched — leave those for admins.
 */

import { getPayload } from 'payload'
import config from '../payload.config'

/** Minimal Lexical rich-text helper — builds a paragraph block. */
function paragraph(text: string) {
  return {
    type: 'paragraph',
    version: 1,
    children: [{ type: 'text', text, version: 1, format: 0, detail: 0, mode: 'normal' as const, style: '' }],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
  }
}

/** Multi-paragraph rich text body. */
function richTextBody(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      version: 1,
      children: paragraphs.map(paragraph),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
    },
  }
}

async function main() {
  const payload = await getPayload({ config })

  // ────────────────────────────────────────────────────────────────
  // HomeContent
  // ────────────────────────────────────────────────────────────────
  await payload.updateGlobal({
    slug: 'home-content',
    locale: 'en',
    data: {
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
          { label: 'ISO 9001:2015',  hint: 'Quality Management' },
          { label: 'ISO 14001:2015', hint: 'Environment' },
          { label: 'OHSAS 18001',    hint: 'Health & Safety' },
          { label: 'LME Listed',     hint: 'London Metal Exchange' },
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
    },
  })
  console.log('✓ Seeded home-content')

  // ────────────────────────────────────────────────────────────────
  // Strengths (homepage Why JSK)
  // ────────────────────────────────────────────────────────────────
  await payload.updateGlobal({
    slug: 'strengths',
    locale: 'en',
    data: {
      heading: 'Why JSK',
      items: [
        { icon: '🏭',   title: 'Integrated Mfg',    body: 'State-of-the-art 35,000 sq.m facility at Silvassa.' },
        { icon: '✅',   title: 'PGCIL Approved',    body: 'Approved by Power Grid Corporation for conductors & wire rods.' },
        { icon: '📦',   title: 'Timely Delivery',   body: 'Manufacturing systems geared to meet customer deadlines.' },
        { icon: '🔬',   title: 'Quality System',    body: 'ISO 9001 certified with in-process control & error prevention.' },
        { icon: '🌍',   title: '1,000+ Clients',    body: "Serving India's Who's Who — PGCIL, L&T, BHEL, Tata, RIL…" },
        { icon: '💰',   title: 'Sound Financials',  body: '₹30 Bn group turnover with consistent growth trajectory.' },
        { icon: '👨‍🔬', title: 'Qualified Team',     body: 'Experienced & technically sound professionals at every level.' },
        { icon: '⚡',   title: 'Innovation',        body: 'New verticals: VEDA, Digital Substations, Cyber Security.' },
      ],
    },
  })
  console.log('✓ Seeded strengths')

  // ────────────────────────────────────────────────────────────────
  // PageContent — all the per-page intros + empty states
  // ────────────────────────────────────────────────────────────────
  await payload.updateGlobal({
    slug: 'page-content',
    locale: 'en',
    data: {
      about: {
        headline: 'About JSK Industries',
        intro: richTextBody([
          'An Emerging Name in the Power Sector. JSK Industries Pvt. Ltd. is a leading Aluminium Conductor manufacturer specializing in Power Transmission & Distribution Conductors, Aluminium Wire Rods, and Aluminium Alloys.',
          'Established in 1965 by Mr. Dinesh Shah, the company carries out manufacturing in its state-of-the-art, ISO 9001 certified facility at Silvassa. A technology-driven engineering organization, JSK Industries is well-diversified and ranks amongst the largest private sector aluminium conductor manufacturing companies in India.',
          'The Company is known for initiating new processes, products and materials. A strong customer-focused approach and a constant quest for quality has enabled JSK to attain and sustain leadership in all lines of business.',
        ]),
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
    },
  })
  console.log('✓ Seeded page-content')

  console.log('\n🐶 All page content seeded successfully (en locale).')
  console.log('   Hindi / Telugu / Tamil translations: add via admin UI.\n')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
