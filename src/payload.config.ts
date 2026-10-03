import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media, Projects, Users } from './collections'
import { Cta, Faq, Footer, Hero, Pricing, Process, Proof, Services, Story, Why, Work } from './globals/sections'
import { Brand, Layout, Loading, Theme } from './globals/settings'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const databaseURI = process.env.DATABASE_URI || 'file:./agency.db'

// Local development runs on SQLite (nothing to install). Production sets
// DATABASE_URI to a Postgres URL and the Postgres adapter takes over.
const isPostgres = /^postgres(ql)?:\/\//.test(databaseURI)

// Netlify's filesystem is ephemeral, so production uploads go to an
// S3-compatible bucket (Cloudflare R2 by default — any S3-compatible service
// works by changing S3_ENDPOINT). Without a bucket name the plugin disables
// itself and uploads use ./media, so local development needs nothing set.
const s3Bucket = process.env.S3_BUCKET
const s3Enabled = Boolean(s3Bucket)

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: 'dark',
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · Studio admin' },
    // Reference-style skin: custom sidebar, dashboard and help page.
    // Styles live in src/app/(payload)/admin.css.
    components: {
      Nav: '@/components/admin/Nav#Nav',
      graphics: { Logo: '@/components/admin/Logo#Logo', Icon: '@/components/admin/Logo#Mark' },
      views: {
        dashboard: { Component: '@/components/admin/Dashboard#Dashboard' },
        guide: { Component: '@/components/admin/Guide#Guide', path: '/guide' },
      },
    },
  },
  collections: [Projects, Media, Users],
  globals: [Hero, Pricing, Proof, Work, Services, Story, Process, Why, Faq, Cta, Footer, Brand, Theme, Layout, Loading],
  db: isPostgres
    ? postgresAdapter({ pool: { connectionString: databaseURI }, push: true })
    : sqliteAdapter({ client: { url: databaseURI } }),
  plugins: [
    s3Storage({
      enabled: s3Enabled,
      collections: { media: true },
      bucket: s3Bucket || 'unused',
      // disableLocalStorage defaults to true; set it false so the plugin
      // being disabled (no S3_BUCKET) still leaves local-disk uploads working.
      disableLocalStorage: s3Enabled,
      config: {
        region: process.env.S3_REGION || 'auto',
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  sharp,
  telemetry: false,
})
