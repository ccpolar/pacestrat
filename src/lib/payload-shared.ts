import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  Field,
  GlobalAfterChangeHook,
  GlobalConfig,
  LivePreviewConfig,
  PayloadRequest,
} from 'payload'
import { revalidatePath } from 'next/cache'

/* ---------- Cache refresh ----------
   The public page is prerendered. These hooks push it out of the cache the
   moment something is published. revalidatePath only works inside a Next
   request, so seed/CLI runs skip it quietly (same pattern as the portfolio). */

const flush = (req: PayloadRequest) => {
  for (const path of ['/', '/content.json']) {
    try {
      revalidatePath(path)
    } catch {
      req.payload.logger.debug(`Skipped revalidating ${path} (no request scope)`)
    }
  }
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, req }) => {
  flush(req)
  return doc
}
export const revalidateDoc: CollectionAfterChangeHook = ({ doc, req }) => {
  flush(req)
  return doc
}
export const revalidateDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  flush(req)
  return doc
}

/* ---------- Live preview ----------
   Built from the admin's own request so the preview follows whatever host
   you're on (localhost now, the real domain later). */

export const adminOrigin = (req: PayloadRequest) => {
  const h = req.headers
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? (host?.startsWith('localhost') ? 'http' : 'https')
  return host ? `${proto}://${host}` : process.env.NEXT_PUBLIC_SERVER_URL || ''
}

export const breakpoints: LivePreviewConfig['breakpoints'] = [
  { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
  { label: 'Tablet', name: 'tablet', width: 820, height: 1180 },
  { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
]

/* ---------- Global factory ---------- */

type SiteGlobalArgs = {
  slug: string
  label: string
  group: 'Site' | 'Settings'
  description?: string
  fields: Field[]
  /** Section anchor to scroll the preview to. */
  anchor?: string
}

/**
 * Every editable part of the page is a global built from this, so they all
 * share drafts (Save draft / Publish), private reads, live preview and the
 * cache refresh on publish.
 */
export const siteGlobal = ({ slug, label, group, description, fields, anchor }: SiteGlobalArgs): GlobalConfig => ({
  slug,
  label,
  admin: {
    group,
    description,
    livePreview: {
      url: ({ req }) => `${adminOrigin(req)}/preview?global=${slug}${anchor ? `#${anchor}` : ''}`,
      breakpoints,
    },
  },
  // Content only leaves the server through the page renderer, which uses the
  // local API. The REST API stays private so drafts can't be read publicly.
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  versions: { drafts: true, max: 25 },
  hooks: { afterChange: [revalidateGlobal] },
  fields,
})
