import type { Payload } from 'payload'

import { ago, getEditsPerDay, getStatus } from '@/lib/admin-data'

import { DashboardSections, type SectionCard } from './DashboardSections'
import { Icon } from './icons'

type Props = {
  payload?: Payload
  user?: Record<string, any> | null
  initPageResult?: { req: { payload: Payload; user?: Record<string, any> | null } }
}

const SITE_SECTIONS = ['hero', 'pricing', 'proof', 'work', 'services', 'story', 'process', 'why', 'faq', 'cta', 'footer']
const day = (iso: string) => new Date(iso).toLocaleDateString('en', { month: '2-digit', day: '2-digit' }).replace('/', '.')

/** Dashboard in the style of the reference: section cards, project row, edits chart, stat cards. */
export async function Dashboard(props: Props) {
  const payload = (props.payload ?? props.initPageResult?.req.payload) as Payload
  const user = props.user ?? props.initPageResult?.req.user
  const [status, edits, layout] = await Promise.all([
    getStatus(payload),
    getEditsPerDay(payload, 7),
    payload.findGlobal({ slug: 'layout', draft: true, depth: 0 }) as Promise<any>,
  ])

  /* Section cards, in page order; sections missing from the layout go last. */
  const order: { section: string; visible: boolean }[] = layout?.sections ?? []
  const bySlug = Object.fromEntries(status.globals.map((g) => [g.slug, g]))
  const ordered = [
    ...order.map((s) => s.section).filter((s) => SITE_SECTIONS.includes(s)),
    ...SITE_SECTIONS.filter((s) => !order.some((o) => o.section === s)),
  ]
  const cards: SectionCard[] = ordered.map((slug) => {
    const row = order.find((o) => o.section === slug)
    return {
      slug,
      label: bySlug[slug]?.label ?? slug,
      href: `/admin/globals/${slug}`,
      visible: row ? row.visible !== false : false,
      hasDraft: Boolean(bySlug[slug]?.hasDraft),
      edited: ago(bySlug[slug]?.updatedAt),
    }
  })

  /* Stats */
  const drafts = status.globals.filter((g) => g.hasDraft).length + status.draftProjects
  const weekAgo = Date.now() - 7 * 86400000
  const newProjects = status.projects.filter((p) => new Date(p.createdAt).getTime() > weekAgo).length
  const lastPublished = [...status.globals]
    .filter((g) => !g.hasDraft && g.updatedAt)
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))[0]

  /* Chart: today is highlighted, like the reference's selected bar. */
  const totals = edits.map((b) => b.published + b.draft)
  const max = Math.max(4, ...totals)
  const highlight = edits.length - 1

  const first = String(user?.name || '').split(' ')[0]

  return (
    <div className="studio-dash">
      <div className="studio-dash__head">
        <h1 className="studio-dash__title">Dashboard</h1>
        {first && <p className="studio-dash__hello">Welcome back, {first}.</p>}
        <DashboardSections cards={cards} drafts={drafts} />
      </div>

      <section className="studio-block" aria-labelledby="dash-projects">
        <div className="studio-block__head">
          <h2 id="dash-projects">
            <Icon name="pin" size={22} /> Projects
          </h2>
          <a className="studio-pill" href="/admin/collections/projects">
            Manage
          </a>
        </div>
        <ul className="studio-people">
          {status.projects.map((p) => {
            const img = p.image?.media && typeof p.image.media === 'object' ? p.image.media.url : null
            return (
              <li key={p.id}>
                <a href={`/admin/collections/projects/${p.id}`} title={p.title} className={p.showOnSite === false ? 'is-hidden' : undefined}>
                  <span className="studio-people__ring">
                    {img ? (
                      <img src={img} alt="" width={96} height={96} />
                    ) : (
                      <span className="studio-people__ph" style={{ background: p.image?.placeholder || undefined }} />
                    )}
                  </span>
                  <span className="studio-people__name">{p.title}</span>
                </a>
              </li>
            )
          })}
          <li>
            <a href="/admin/collections/projects/create">
              <span className="studio-people__ring studio-people__ring--add">
                <Icon name="plus" size={28} />
              </span>
              <span className="studio-people__name">New project</span>
            </a>
          </li>
        </ul>
      </section>

      <section className="studio-block" aria-labelledby="dash-edits">
        <div className="studio-block__head">
          <h2 id="dash-edits">
            <Icon name="chart" size={22} /> Edits this week
          </h2>
        </div>
        <div className="studio-chart">
          <ol className="studio-chart__bars">
            {edits.map((b, i) => {
              const total = b.published + b.draft
              const h = (total / max) * 100
              const label = new Date(b.date).toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' })
              return (
                <li key={b.date} className={i === highlight ? 'is-current' : undefined}>
                  <span className="studio-chart__track">
                    <span
                      className="studio-chart__bar"
                      data-empty={total ? undefined : ''}
                      style={{ height: `${Math.max(h, 4)}%`, ['--pub' as any]: total ? `${(b.published / total) * 100}%` : '0%' }}
                    >
                      <span className="studio-chart__tip">
                        <small>{label}</small>
                        <strong>
                          {total} {total === 1 ? 'save' : 'saves'}
                        </strong>
                      </span>
                    </span>
                  </span>
                  <span className="studio-chart__day">{day(b.date)}</span>
                  <span className="sr-only">
                    {label}: {b.published} published, {b.draft} drafts
                  </span>
                </li>
              )
            })}
          </ol>
          <p className="studio-chart__legend">
            <span className="studio-key studio-key--pub" /> Published
            <span className="studio-key studio-key--draft" /> Drafts
          </p>
        </div>
      </section>

      <div className="studio-kpis">
        <article className="studio-kpi">
          <h3>Projects</h3>
          <p>
            <span className="studio-kpi__icon studio-kpi__icon--purple">
              <Icon name="projects" size={22} />
            </span>
            <strong>{status.projects.length}</strong>
            {newProjects > 0 && <span className="studio-chip">+{newProjects} this week</span>}
          </p>
        </article>
        <article className="studio-kpi">
          <h3>Unpublished changes</h3>
          <p>
            <span className="studio-kpi__icon studio-kpi__icon--salmon">
              <Icon name="pencil" size={22} />
            </span>
            <strong>{drafts}</strong>
            <span className="studio-chip">{drafts ? 'Ready to publish' : 'All live'}</span>
          </p>
        </article>
        <article className="studio-kpi">
          <h3>Last published</h3>
          <p>
            <span className="studio-kpi__icon studio-kpi__icon--peach">
              <Icon name="clock" size={22} />
            </span>
            <strong className="studio-kpi__text">{ago(lastPublished?.updatedAt)}</strong>
            {lastPublished && <span className="studio-chip">{lastPublished.label}</span>}
          </p>
        </article>
      </div>
    </div>
  )
}
