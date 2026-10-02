'use client'

import { Link } from '@payloadcms/ui'
import { useState } from 'react'

import { Icon } from './icons'

export type SectionCard = {
  slug: string
  label: string
  href: string
  visible: boolean
  hasDraft: boolean
  edited: string
}

/** Tab switcher + horizontally scrolling section cards (white = live, peach = unpublished changes). */
export function DashboardSections({ cards, drafts }: { cards: SectionCard[]; drafts: number }) {
  const [tab, setTab] = useState<'all' | 'drafts'>('all')
  const shown = tab === 'all' ? cards : cards.filter((c) => c.hasDraft)

  return (
    <>
      <div className="studio-tabs" role="tablist" aria-label="Filter sections">
        <button type="button" role="tab" aria-selected={tab === 'all'} className={tab === 'all' ? 'is-active' : ''} onClick={() => setTab('all')}>
          <Icon name="flame" /> All sections
        </button>
        <button type="button" role="tab" aria-selected={tab === 'drafts'} className={tab === 'drafts' ? 'is-active' : ''} onClick={() => setTab('drafts')}>
          <Icon name="pencil" /> Unpublished{drafts ? ` (${drafts})` : ''}
        </button>
      </div>

      <section className="studio-block studio-block--flush" aria-labelledby="dash-sections">
        <div className="studio-block__head">
          <h2 id="dash-sections">
            <Icon name="bag" size={22} /> Sections
          </h2>
          <Link className="studio-pill" href="/admin/globals/layout">
            Reorder
          </Link>
        </div>

        {shown.length ? (
          <ul className="studio-cards" role="tabpanel">
            {shown.map((c) => (
              <li key={c.slug} className={`studio-card${c.hasDraft ? ' studio-card--draft' : ''}`}>
                <Link href={c.href} className="studio-card__link">
                  <span className="studio-card__head">
                    <span className="studio-card__dot" aria-hidden="true" />
                    <strong>{c.label}</strong>
                    <Icon name="moreH" size={20} className="studio-card__more" />
                  </span>
                  <span className="studio-card__stats">
                    <span>
                      <small>Status</small>
                      <span className="studio-card__val">
                        <Icon name={c.visible ? 'eye' : 'eyeOff'} size={18} />
                        {c.hasDraft ? 'Draft' : c.visible ? 'Live' : 'Hidden'}
                      </span>
                    </span>
                    <span>
                      <small>Edited</small>
                      <span className="studio-card__val">
                        <Icon name="clock" size={18} />
                        {c.edited}
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="studio-empty">Everything is published. Changes you save as drafts will show up here.</p>
        )}
      </section>
    </>
  )
}
