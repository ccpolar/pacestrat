/* Turns Payload documents into the content.json shape documented in
   SCHEMA.md. Pure (no Payload imports) so the live-preview page can run the
   same mapping in the browser as form fields change. */

type Doc = Record<string, any>
export type Content = Record<string, any>

const media = (m: unknown): Doc | null => (m && typeof m === 'object' ? (m as Doc) : null)

/** The WebP variants Payload generates on upload, smallest first, as
 *  [{ url, width }] ready for a srcset. Absent for SVG and for images smaller
 *  than the smallest variant, in which case the original is used alone. */
const variants = (m: Doc | null) => {
  const byWidth = new Map<number, { url: string; width: number }>()
  for (const s of Object.values((m?.sizes ?? {}) as Record<string, Doc>)) {
    // withoutEnlargement clamps every variant wider than the source to the
    // source width, so several entries can share one width. A srcset with
    // repeated descriptors is malformed, and the duplicates are byte-identical.
    if (s?.url && s?.width && !byWidth.has(s.width as number)) {
      byWidth.set(s.width as number, { url: s.url as string, width: s.width as number })
    }
  }
  return [...byWidth.values()].sort((a, b) => a.width - b.width)
}

/** True when the original is wider than every variant, so it is worth offering
 *  as the top candidate. When a variant already covers the source width the
 *  original must be left out: it is the same pixels in a far heavier format,
 *  and a browser picking it undoes the whole point of generating variants. */
const originalIsWidest = (m: Doc | null, v: { width: number }[]) =>
  !v.length || (typeof m?.width === 'number' && m.width > v[v.length - 1].width)

/** imageSlot group → { src, alt, width, height, placeholder, sources } */
const image = (slot: Doc | undefined, w: number, h: number) => {
  const m = media(slot?.media)
  return {
    src: m?.url ?? '',
    alt: m?.alt ?? '',
    width: m?.width || w,
    height: m?.height || h,
    placeholder: slot?.placeholder ?? '',
    sources: variants(m),
    useOriginalInSrcset: originalIsWidest(m, variants(m)),
  }
}

const link = (l?: Doc) => (l && (l.label || l.href) ? { label: l.label ?? '', href: l.href ?? '' } : null)
const links = (a?: Doc[]) => (a ?? []).map(link).filter(Boolean)

/** One mapper per global slug. Each returns the content.json keys it owns. */
export const mappers: Record<string, (d: Doc) => Content> = {
  brand: (d) => ({
    brand: {
      logo: image({ media: d.brand?.logo }, 0, 0),
      logoMark: image({ media: d.brand?.logoMark }, 0, 0),
      name: d.brand?.name ?? '',
      suffix: d.brand?.suffix ?? '',
      mark: d.brand?.mark ?? '',
      tagline: d.brand?.tagline ?? '',
      email: d.brand?.email ?? '',
      location: d.brand?.location ?? '',
      timezone: d.brand?.timezone ?? '',
      availability: { active: Boolean(d.brand?.availability?.active), label: d.brand?.availability?.label ?? '' },
    },
    seo: {
      lang: d.seo?.lang || 'en',
      title: d.seo?.title ?? '',
      description: d.seo?.description ?? '',
      ogImage: media(d.seo?.ogImage)?.url ?? '',
    },
  }),
  loading: (d) => ({
    loading: {
      enabled: Boolean(d.enabled),
      frameMs: d.frameMs ?? 500,
      overlayColor: d.overlayColor ?? '#0B0B0B',
      overlayOpacity: (d.overlayOpacity ?? 55) / 100,
      images: (d.images ?? [])
        .map((row: Doc) => image({ media: row.image }, 1600, 1000))
        .filter((im: Doc) => im.src),
    },
  }),
  theme: (d) => ({
    theme: {
      accent: d.accent,
      dark: d.dark,
      light: d.light,
      card: d.card,
      grey: d.grey,
      fontDisplay: d.fontDisplay,
      fontBody: d.fontBody,
      radius: d.radius,
    },
  }),
  layout: (d) => ({
    nav: { links: links(d.links) },
    ui: d.ui ?? {},
    sections: (d.sections ?? []).map((s: Doc) => ({ id: s.section, visible: s.visible !== false })),
  }),
  hero: (d) => ({
    hero: {
      image: image(d.image, 1600, 1000),
      wordmarkStyle: d.wordmarkStyle === 'logo' ? 'logo' : 'text',
      headline1: d.headline1 ?? '',
      headline2: d.headline2 ?? '',
      descriptor: d.descriptor ?? '',
      cta: link(d.cta),
      rating: {
        show: d.rating?.show !== false,
        score: d.rating?.score ?? 0,
        source: d.rating?.source ?? '',
        label: d.rating?.label ?? '',
      },
      copyright: d.copyright ?? '',
    },
  }),
  story: (d) => ({
    story: {
      label: d.label ?? '',
      founder: {
        name: d.founder?.name ?? '',
        title: d.founder?.title ?? '',
        avatar: image(d.founder?.avatar, 96, 96),
      },
      statement: d.statement ?? '',
      statementMuted: d.statementMuted ?? '',
      button: link(d.button),
    },
  }),
  proof: (d) => ({
    proof: {
      label: d.label ?? '',
      stat: {
        label: d.stat?.label ?? '',
        prefix: d.stat?.prefix ?? '',
        value: d.stat?.value ?? 0,
        suffix: d.stat?.suffix ?? '',
        caption: d.stat?.caption ?? '',
        more: (d.stat?.more ?? []).map(({ value, label }: Doc) => ({ value, label })),
      },
      testimonial: d.testimonial ?? {},
      logosLabel: d.logosLabel ?? '',
      logos: (d.logos ?? []).map((l: Doc) => ({ name: l.name ?? '', src: media(l.logo)?.url ?? '' })),
    },
  }),
  work: (d) => ({ work: { label: d.label ?? '', heading: d.heading ?? '', intro: d.intro ?? '' } }),
  pricing: (d) => ({
    pricing: {
      label: d.label ?? '',
      heading: d.heading ?? '',
      statement: d.statement ?? '',
      statementMuted: d.statementMuted ?? '',
      note: { title: d.note?.title ?? '', body: d.note?.body ?? '' },
      button: link(d.button),
    },
  }),
  services: (d) => ({
    services: {
      label: d.label ?? '',
      heading: d.heading ?? '',
      items: (d.items ?? []).map(({ title, description, tags }: Doc) => ({ title, description, tags: tags ?? '' })),
    },
  }),
  why: (d) => ({
    why: { label: d.label ?? '', heading: d.heading ?? '', items: (d.items ?? []).map(({ title, description }: Doc) => ({ title, description })) },
  }),
  process: (d) => ({
    process: { label: d.label ?? '', heading: d.heading ?? '', steps: (d.steps ?? []).map(({ title, description }: Doc) => ({ title, description })) },
  }),
  faq: (d) => ({
    faq: { label: d.label ?? '', heading: d.heading ?? '', items: (d.items ?? []).map(({ q, a }: Doc) => ({ q, a })) },
  }),
  cta: (d) => ({ cta: { label: d.label ?? '', headline: d.headline ?? '', body: d.body ?? '', button: link(d.button) } }),
  footer: (d) => ({ footer: { links: links(d.links), socials: links(d.socials), legal: d.legal ?? '' } }),
}

export const GLOBAL_SLUGS = Object.keys(mappers)

export const mapProjects = (docs: Doc[]) =>
  docs
    .filter((p) => p.showOnSite !== false)
    .map((p) => ({
      id: p.slug || String(p.id),
      title: p.title ?? '',
      category: p.category ?? '',
      year: p.year ?? '',
      href: p.href || '#work',
      image: image(p.image, 1200, 900),
    }))

export function assemble(globals: Record<string, Doc>, projects: Doc[]): Content {
  const C: Content = {}
  let lastEdited = ''
  for (const slug of GLOBAL_SLUGS) {
    const doc = globals[slug]
    if (!doc) continue
    Object.assign(C, mappers[slug](doc))
    if (doc.updatedAt > lastEdited) lastEdited = doc.updatedAt
  }
  for (const p of projects) if (p.updatedAt > lastEdited) lastEdited = p.updatedAt
  C.work = { ...(C.work ?? {}), projects: mapProjects(projects) }
  C.meta = { version: '1.0.0', lastEdited }
  return C
}
