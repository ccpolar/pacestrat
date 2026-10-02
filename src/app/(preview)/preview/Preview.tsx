'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { assemble, type Content } from '@/lib/assemble'
import { renderPage, themeVars } from '@/lib/render.js'

type Doc = Record<string, any>
type Raw = { globals: Record<string, Doc>; projects: Doc[] }

declare global {
  interface Window {
    PaceSite?: { init: () => void }
  }
}

/**
 * Renders the page from content and re-wires behaviour after every change.
 * Client-only: site.js edits the DOM (clock, counters, reveal classes), so
 * server HTML would never match on hydration.
 */
function Page({ content }: { content: Content }) {
  const [mounted, setMounted] = useState(false)
  const scrolled = useRef(false)
  const html = useMemo(() => renderPage(content), [content])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    root.lang = content.seo?.lang || 'en'
    root.setAttribute('style', themeVars(content))
    document.title = content.seo?.title || 'Preview'
    window.PaceSite?.init()
    // Everything visible at once while editing; scroll reveals would hide
    // the change you just made until you scroll to it.
    document.body.classList.add('is-ready')
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'))
    // Open on the section being edited (#hero, #faq…), once.
    if (!scrolled.current && location.hash) {
      scrolled.current = true
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' })
    }
  }, [mounted, html, content])

  return mounted ? <div className="preview-root" dangerouslySetInnerHTML={{ __html: html }} /> : null
}

/** Editing a global: swap its live form data into the assembled content. */
function GlobalPreview({ raw, origin, slug }: { raw: Raw; origin: string; slug: string }) {
  const { data } = useLivePreview<Doc>({ initialData: raw.globals[slug], serverURL: origin, depth: 1 })
  const content = useMemo(() => assemble({ ...raw.globals, [slug]: data }, raw.projects), [raw, slug, data])
  return <Page content={content} />
}

/** Editing a project: swap it (or add it, if new) into the project list. */
function ProjectPreview({ raw, origin, id }: { raw: Raw; origin: string; id: string }) {
  const initial = raw.projects.find((p) => String(p.id) === id) ?? { id }
  const { data } = useLivePreview<Doc>({ initialData: initial, serverURL: origin, depth: 1 })
  const content = useMemo(() => {
    const projects = raw.projects.some((p) => String(p.id) === id)
      ? raw.projects.map((p) => (String(p.id) === id ? data : p))
      : [...raw.projects, data]
    return assemble(raw.globals, projects)
  }, [raw, id, data])
  return <Page content={content} />
}

export function Preview({ raw, origin, global, projectId }: { raw: Raw; origin: string; global?: string; projectId?: string }) {
  if (global && raw.globals[global]) return <GlobalPreview raw={raw} origin={origin} slug={global} />
  if (projectId) return <ProjectPreview raw={raw} origin={origin} id={projectId} />
  return <Page content={assemble(raw.globals, raw.projects)} />
}
