import { getContent } from '@/lib/content'
import { renderDocument } from '@/lib/document'

// Prerendered, and refreshed on publish by the hooks in lib/payload-shared.ts.
export const dynamic = 'force-static'

/** The public landing page: plain server-rendered HTML, no React on the client. */
export async function GET() {
  const content = await getContent()
  const html = renderDocument(content, process.env.NEXT_PUBLIC_SERVER_URL || '')
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
