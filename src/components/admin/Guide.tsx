import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'

import { Icon } from './icons'

const TOPICS: { icon: string; title: string; body: string }[] = [
  {
    icon: 'pencil',
    title: 'Drafts and publishing',
    body: 'Save draft keeps your changes private. Publish changes puts them on the live site straight away. Anything with unpublished changes shows a peach dot in the sidebar and a peach card on the dashboard.',
  },
  {
    icon: 'eye',
    title: 'Live preview',
    body: 'On any section, press the eye icon at the top right to open the preview beside the form. It updates as you type and shows drafts, so you can check a change before publishing it.',
  },
  {
    icon: 'layout',
    title: 'Order and hide sections',
    body: 'Settings → Navigation & sections. Drag rows to reorder the page, untick "Show on page" to hide a section. Menu links to hidden sections disappear automatically. The footer always stays last.',
  },
  {
    icon: 'projects',
    title: 'Projects',
    body: 'Site → Projects. Drag rows in the list to change their order on the page. Untick "Show on site" to keep a project without showing it. Covers are cropped to 4:3.',
  },
  {
    icon: 'media',
    title: 'Images',
    body: 'Every image needs alt text: a short description read aloud to people who cannot see it. Hero photos should be landscape and at least 1600px wide. Without an image, the gradient placeholder is shown.',
  },
  {
    icon: 'theme',
    title: 'Colours',
    body: 'Settings → Theme. The readability check under the colours flags any pair that would be hard to read. Keep every row passing before you publish.',
  },
]

/** The page behind the sidebar's "Need help?" card. */
export function Guide({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, permissions, visibleEntities, locale } = initPageResult
  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user ?? undefined}
      visibleEntities={visibleEntities}
      viewType="guide"
    >
      <div className="studio-dash">
        <div className="studio-dash__head">
          <h1 className="studio-dash__title">Editing guide</h1>
          <p className="studio-dash__hello">Everything on the site is edited here. The essentials:</p>
        </div>
        <ul className="studio-guide">
          {TOPICS.map((t) => (
            <li key={t.title} className="studio-kpi">
              <h2>
                <span className="studio-kpi__icon studio-kpi__icon--peach">
                  <Icon name={t.icon} size={20} />
                </span>
                {t.title}
              </h2>
              <p>{t.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </DefaultTemplate>
  )
}
