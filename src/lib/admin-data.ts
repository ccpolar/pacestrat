import type { Payload } from 'payload'

import { GLOBAL_SLUGS } from './assemble'

/* Read-only helpers for the admin sidebar and dashboard. */

export type GlobalStatus = {
  slug: string
  label: string
  /** Latest saved version is a draft that hasn't been published yet. */
  hasDraft: boolean
  updatedAt: string | null
}

const label = (payload: Payload, slug: string) => {
  const g = payload.config.globals.find((x) => x.slug === slug)
  return typeof g?.label === 'string' ? g.label : slug
}

/** Draft/published state of every global plus projects with unpublished changes. */
export async function getStatus(payload: Payload) {
  const globals: GlobalStatus[] = await Promise.all(
    GLOBAL_SLUGS.map(async (slug) => {
      const v = await payload.findGlobalVersions({ slug: slug as any, limit: 1, sort: '-updatedAt', depth: 0 })
      const latest = v.docs[0] as any
      return {
        slug,
        label: label(payload, slug),
        hasDraft: latest?.version?._status === 'draft',
        updatedAt: latest?.updatedAt ?? null,
      }
    }),
  )
  const projects = await payload.find({ collection: 'projects', draft: true, depth: 1, limit: 100, sort: '_order', pagination: false })
  const draftProjects = projects.docs.filter((p: any) => p._status === 'draft').length
  return { globals, projects: projects.docs as any[], draftProjects }
}

/** Saves per day for the last `days` days, split into published and draft saves. */
export async function getEditsPerDay(payload: Payload, days = 7) {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - (days - 1))
  const where = { updatedAt: { greater_than_equal: start.toISOString() } }

  const lists = await Promise.all([
    ...GLOBAL_SLUGS.map((slug) =>
      payload.findGlobalVersions({ slug: slug as any, where, limit: 1000, depth: 0, pagination: false }),
    ),
    payload.findVersions({ collection: 'projects', where, limit: 1000, depth: 0, pagination: false }),
  ])

  const buckets = Array.from({ length: days }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return { date: d.toISOString(), published: 0, draft: 0 }
  })
  for (const list of lists) {
    for (const v of list.docs as any[]) {
      const i = Math.floor((new Date(v.updatedAt).getTime() - start.getTime()) / 86400000)
      if (i < 0 || i >= days) continue
      if (v.version?._status === 'published') buckets[i].published++
      else buckets[i].draft++
    }
  }
  return buckets
}

/** "just now", "5m ago", "3h ago", "2d ago", or a short date. */
export const ago = (iso: string | null | undefined) => {
  if (!iso) return 'Never'
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 60) return 'Just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  if (s < 86400 * 14) return `${Math.floor(s / 86400)}d ago`
  return new Date(iso).toLocaleDateString('en', { month: 'short', day: 'numeric' })
}
