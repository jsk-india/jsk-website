import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Products } from '@/collections/Products'
import { ProductCategories } from '@/collections/ProductCategories'
import { Verticals } from '@/collections/Verticals'
import { Clients } from '@/collections/Clients'
import { Persons } from '@/collections/Persons'
import { Certifications } from '@/collections/Certifications'
import { Awards } from '@/collections/Awards'
import { NewsArticles } from '@/collections/NewsArticles'
import { Stories } from '@/collections/Stories'
import { Plants } from '@/collections/Plants'
import { InvestorDocuments } from '@/collections/InvestorDocuments'
import { JobOpenings } from '@/collections/JobOpenings'
import { JobApplications } from '@/collections/JobApplications'
import { Enquiries } from '@/collections/Enquiries'
import { ContactMessages } from '@/collections/ContactMessages'

// Globals
import { SiteSettings } from '@/globals/SiteSettings'
import { Navigation } from '@/globals/Navigation'
import { Footer } from '@/globals/Footer'

import { locales, defaultLocale } from '@/lib/i18n'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' | JSK Admin' },
  },

  editor: lexicalEditor(),

  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
  }),

  localization: {
    locales: locales.map((code) => ({
      code,
      label: { en: code.toUpperCase() },
    })),
    defaultLocale,
    fallback: true,
  },

  collections: [
    // Core
    Users,
    Media,
    Pages,
    // Products
    ProductCategories,
    Products,
    Verticals,
    // Company
    Persons,
    Clients,
    Plants,
    Certifications,
    Awards,
    // Content
    NewsArticles,
    Stories,
    // Investors
    InvestorDocuments,
    // Careers
    JobOpenings,
    JobApplications,
    // Forms
    Enquiries,
    ContactMessages,
  ],

  globals: [SiteSettings, Navigation, Footer],

  plugins: [
    s3Storage({
      collections: { media: true },
      bucket: process.env.S3_BUCKET ?? 'jsk-media',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
        },
        region: 'auto',
        forcePathStyle: false,
      },
    }),
  ],

  secret: process.env.PAYLOAD_SECRET || 'UNSAFE-DEFAULT-SECRET',
  sharp,

  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
})
