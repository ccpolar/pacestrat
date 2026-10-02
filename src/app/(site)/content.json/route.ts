import { getContent } from '@/lib/content'

export const dynamic = 'force-static'

/** The published content in the shape documented in SCHEMA.md. */
export async function GET() {
  return Response.json(await getContent())
}
