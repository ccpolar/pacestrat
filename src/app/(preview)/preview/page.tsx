import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { getRawContent } from '@/lib/content'

import { Preview } from './Preview'

export const dynamic = 'force-dynamic'

type Args = { searchParams: Promise<Record<string, string | undefined>> }

/**
 * The admin's live-preview pane. Shows drafts, so it's only available to a
 * logged-in editor; everyone else is sent to the login screen.
 */
export default async function PreviewPage({ searchParams }: Args) {
  const h = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: h })
  if (!user) redirect('/admin/login')

  const { global, collection, id } = await searchParams
  const raw = await getRawContent({ draft: true })
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')

  return (
    <Preview
      raw={raw}
      origin={`${proto}://${host}`}
      global={global}
      projectId={collection === 'projects' ? id : undefined}
    />
  )
}
