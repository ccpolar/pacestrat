import config from '@payload-config'
import { getPayload } from 'payload'

import { assemble, GLOBAL_SLUGS, type Content } from './assemble'

/**
 * Raw Payload docs: every global plus the projects in their drag-and-drop order.
 * `draft: true` includes unpublished drafts (live preview only).
 */
export async function getRawContent({ draft = false } = {}) {
  const payload = await getPayload({ config })
  const [globals, projects] = await Promise.all([
    Promise.all(GLOBAL_SLUGS.map((slug) => payload.findGlobal({ slug: slug as any, draft, depth: 1 }))),
    payload.find({ collection: 'projects', draft, depth: 1, limit: 100, sort: '_order', pagination: false }),
  ])
  return { globals: Object.fromEntries(GLOBAL_SLUGS.map((s, i) => [s, globals[i]])), projects: projects.docs }
}

/** Published content in the content.json shape (SCHEMA.md). */
export async function getContent({ draft = false } = {}): Promise<Content> {
  const { globals, projects } = await getRawContent({ draft })
  return assemble(globals, projects)
}
