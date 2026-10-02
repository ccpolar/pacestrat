import type { Field } from 'payload'

import { linkList, validHex } from '../fields'
import { siteGlobal } from '../lib/payload-shared'

const TIMEZONES = Intl.supportedValuesOf('timeZone').map((tz) => ({ label: tz.replace(/_/g, ' '), value: tz }))

export const SECTION_IDS = ['hero', 'pricing', 'proof', 'work', 'services', 'story', 'process', 'why', 'faq', 'cta', 'footer'] as const

const SECTION_LABELS: Record<string, string> = { cta: 'Call to action', why: 'Why us', story: 'Our story' }

export const Brand = siteGlobal({
  slug: 'brand',
  label: 'Brand & SEO',
  group: 'Settings',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'brand',
          label: 'Brand',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true, admin: { width: '40%' } },
                { name: 'suffix', type: 'text', admin: { width: '40%', description: 'e.g. Studio' } },
                { name: 'mark', type: 'text', defaultValue: '®', admin: { width: '20%', description: 'Accent mark' } },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'logo',
                  label: 'Logo (long form)',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    width: '50%',
                    description: 'Top bar, hero and footer. SVG or transparent PNG; it is recoloured to fit each section.',
                  },
                },
                {
                  name: 'logoMark',
                  label: 'Logo (short form / icon)',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%', description: 'Compact mark, used in the admin and anywhere space is tight.' },
                },
              ],
            },
            { name: 'tagline', type: 'textarea', admin: { description: 'Shown in the footer.' } },
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
                { name: 'location', type: 'text', admin: { width: '50%', description: 'Leave empty to hide.' } },
              ],
            },
            {
              name: 'timezone',
              type: 'select',
              options: TIMEZONES,
              admin: { description: 'For the live clock in the top bar. Leave empty to hide the clock.' },
            },
            {
              name: 'availability',
              type: 'group',
              admin: { hideGutter: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'active',
                      label: 'Show availability',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: { width: '30%', style: { alignSelf: 'center' } },
                    },
                    { name: 'label', type: 'text', admin: { width: '70%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'seo',
          label: 'SEO & sharing',
          fields: [
            { name: 'title', label: 'Page title', type: 'text', required: true, maxLength: 70 },
            {
              name: 'description',
              type: 'textarea',
              maxLength: 170,
              admin: { description: 'Shown under the title in search results. Aim for 120–160 characters.' },
            },
            {
              name: 'ogImage',
              label: 'Social share image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: '1200×630 JPG or PNG. Shown when the link is shared.' },
            },
            {
              name: 'lang',
              label: 'Language code',
              type: 'text',
              defaultValue: 'en',
              admin: { description: 'e.g. en, en-GB, fr.' },
            },
          ],
        },
      ],
    },
  ],
})

const color = (name: string, label: string, description: string): Field => ({
  name,
  label,
  type: 'text',
  required: true,
  validate: validHex,
  admin: { description, components: { Field: '@/components/admin/ColorField#ColorField' } },
})

export const Theme = siteGlobal({
  slug: 'theme',
  label: 'Theme',
  group: 'Settings',
  description: 'Colours, fonts and corner radius for the whole site.',
  fields: [
    {
      type: 'row',
      fields: [
        color('accent', 'Accent', 'Buttons, ® mark, highlights.'),
        color('dark', 'Dark', 'Hero, CTA band, text.'),
        color('light', 'Light', 'Page background.'),
      ],
    },
    {
      type: 'row',
      fields: [
        color('card', 'Card', 'Card backgrounds.'),
        color('grey', 'Grey', 'Lines and secondary text (darkened automatically for contrast).'),
      ],
    },
    { type: 'ui', name: 'contrast', admin: { components: { Field: '@/components/admin/ContrastCheck#ContrastCheck' } } },
    { name: 'fontDisplay', label: 'Display font stack', type: 'text', required: true },
    { name: 'fontBody', label: 'Body font stack', type: 'text', required: true },
    {
      name: 'radius',
      label: 'Corner radius (px)',
      type: 'number',
      min: 0,
      max: 40,
      required: true,
      admin: { description: 'The device frame. Cards use 60% of this.' },
    },
  ],
})

const ui = (name: string, label: string, defaultValue: string, description?: string): Field => ({
  name,
  label,
  type: 'text',
  required: true,
  defaultValue,
  admin: { description },
})

export const Layout = siteGlobal({
  slug: 'layout',
  label: 'Navigation & sections',
  group: 'Settings',
  fields: [
    {
      name: 'sections',
      type: 'array',
      admin: {
        description: 'Drag to change the order of sections on the page. Open a row and untick to hide it. The footer always stays last.',
        initCollapsed: true,
        components: { RowLabel: '@/components/admin/RowLabel#RowLabel' },
      },
      validate: (rows: unknown) => {
        const ids = ((rows as { section?: string }[]) || []).map((r) => r.section)
        return new Set(ids).size === ids.length ? true : 'Each section can only be listed once.'
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'section',
              type: 'select',
              required: true,
              options: SECTION_IDS.map((id) => ({ label: SECTION_LABELS[id] ?? id[0].toUpperCase() + id.slice(1), value: id })),
              admin: { width: '60%' },
            },
            {
              name: 'visible',
              label: 'Show on page',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '40%', style: { alignSelf: 'center' } },
            },
          ],
        },
      ],
    },
    linkList('links', 'Menu links', 'Links to hidden sections are removed from the menu automatically.'),
    {
      type: 'collapsible',
      label: 'Interface text',
      admin: { initCollapsed: true, description: 'Small labels and screen-reader text. Rarely needs changing.' },
      fields: [
        {
          name: 'ui',
          type: 'group',
          admin: { hideGutter: true },
          fields: [
            {
              type: 'row',
              fields: [
                ui('menuTitle', 'Menu title', 'Menu'),
                ui('menuOpen', 'Open-menu label', 'Open menu'),
                ui('menuClose', 'Close-menu label', 'Close menu'),
              ],
            },
            {
              type: 'row',
              fields: [
                ui('footerLinksTitle', 'Footer: links heading', 'Sitemap'),
                ui('footerSocialsTitle', 'Footer: socials heading', 'Follow'),
                ui('footerContactTitle', 'Footer: contact heading', 'Say hello'),
              ],
            },
            {
              type: 'row',
              fields: [
                ui('counter', 'Section counter', '(+ {n})', '{n} becomes 01, 02…'),
                ui('motif', 'Label motif', '/////'),
                ui('backToTop', 'Back-to-top link', 'Back to top'),
              ],
            },
            {
              type: 'row',
              fields: [
                ui('skipToContent', 'Skip link', 'Skip to content'),
                ui('localTime', 'Clock prefix (screen readers)', 'Local time in'),
                ui('viewProject', 'Project link suffix (screen readers)', 'View project'),
              ],
            },
            ui('ratingOutOf', 'Rating (screen readers)', '{score} out of 5 stars', '{score} becomes the rating.'),
          ],
        },
      ],
    },
  ],
})
