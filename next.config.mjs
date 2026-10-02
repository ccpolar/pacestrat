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

export default withPayload(nextConfig)
