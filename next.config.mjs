import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Payload calls sharp through a dynamic require that Next's output file
  // tracer can miss, so the native binary gets left out of the deployed
  // function bundle. Applies on any host that builds from traced output
  // (Vercel, Netlify's Next.js Runtime, etc.) — same fix as the portfolio.
  outputFileTracingIncludes: {
    '/*': ['node_modules/sharp/**/*', 'node_modules/@img/**/*'],
  },
}

/* Payload serves uploads through its own route with `Cache-Control: no-cache`,
   so every image is re-fetched on every page view and Netlify's CDN refuses to
   cache it (Cache-Status: fwd=bypass). Filenames are stable and Payload gives a
   new one when a file is replaced, so these are safe to cache hard. */
nextConfig.headers = async () => [
  {
    source: '/api/media/file/:path*',
    headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, s-maxage=31536000, immutable' }],
  },
  {
    // The stylesheet and behaviour script have no content hash in their names,
    // so they revalidate rather than cache blind — cheap, and a deploy is picked
    // up immediately.
    source: '/:file(styles.css|site.js)',
    headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
  },
]

export default withPayload(nextConfig)
