import { displayHeading, imageSlot, link, linkList, sectionLabel } from '../fields'
import { siteGlobal } from '../lib/payload-shared'

/* One global per section of the page, in page order. Field names match
   content.json (see SCHEMA.md), so src/lib/assemble.ts maps them 1:1. */

export const Hero = siteGlobal({
  slug: 'hero',
  label: 'Hero',
  group: 'Site',
  anchor: 'hero',
  description: 'The dark full-screen opening: photo, wordmark, intro line, button and rating.',
  fields: [
    imageSlot('image', 'Hero image', 'Full-bleed photo. Also used, blurred, as the page background. Landscape, at least 1600px wide.'),
    {
      name: 'wordmarkStyle',
      label: 'Big wordmark',
      type: 'radio',
      defaultValue: 'text',
      options: [
        { label: 'Logo (from Brand)', value: 'logo' },
        { label: 'Two lines of text', value: 'text' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      type: 'row',
      admin: { condition: (data) => data?.wordmarkStyle !== 'logo' },
      fields: [
        { name: 'headline1', label: 'Wordmark, line 1', type: 'text', admin: { width: '50%' } },
        {
          name: 'headline2',
          label: 'Wordmark, line 2 (indented)',
          type: 'text',
          admin: { width: '50%', description: 'The mark from Brand (e.g. ®) is added after this line.' },
        },
      ],
    },
    { name: 'descriptor', label: 'Intro line', type: 'textarea', required: true },
    link('cta', 'Button'),
    {
      name: 'rating',
      label: 'Review rating',
      type: 'group',
      admin: { hideGutter: true },
      fields: [
        {
          name: 'show',
          label: 'Show the Google rating pill',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Only switch this on with a real rating from your Google Business profile.' },
        },
        {
          type: 'row',
          admin: { condition: (_, sibling) => sibling?.show !== false },
          fields: [
            { name: 'score', type: 'number', min: 0, max: 5, admin: { step: 0.1, width: '25%' } },
            { name: 'source', type: 'text', admin: { width: '25%', description: 'For your reference, not shown.' } },
            { name: 'label', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
    { name: 'copyright', type: 'text', admin: { description: 'Bottom-left of the hero, e.g. ©2026.' } },
  ],
})

export const Story = siteGlobal({
  slug: 'story',
  label: 'Our story',
  group: 'Site',
  anchor: 'story',
  fields: [
    sectionLabel('Our story'),
    {
      name: 'founder',
      type: 'group',
      admin: { hideGutter: true, description: 'The small person chip. Leave the name empty to hide it.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', admin: { width: '50%' } },
            { name: 'title', type: 'text', admin: { width: '50%' } },
          ],
        },
        imageSlot('avatar', 'Photo', 'Square, at least 96×96. Shown as a small circle.'),
      ],
    },
    { name: 'statement', type: 'textarea', required: true },
    {
      name: 'statementMuted',
      label: 'Statement ending (greyed)',
      type: 'text',
      admin: { description: 'Shown in grey straight after the statement.' },
    },
    link('button', 'Button'),
  ],
})

export const Proof = siteGlobal({
  slug: 'proof',
  label: 'Proof',
  group: 'Site',
  anchor: 'proof',
  description: 'The row of three cards: a stat, a testimonial and client logos.',
  fields: [
    sectionLabel('Proof'),
    {
      name: 'stat',
      label: 'Stat card',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '34%' } },
            { name: 'prefix', type: 'text', admin: { width: '16%', description: 'e.g. $' } },
            {
              name: 'value',
              type: 'number',
              required: true,
              admin: { width: '25%', description: 'Counts up from 0 on scroll.' },
            },
            { name: 'suffix', type: 'text', admin: { width: '25%', description: 'e.g. % or M+ (accent).' } },
          ],
        },
        { name: 'caption', type: 'text' },
        {
          name: 'more',
          label: 'Supporting stats',
          type: 'array',
          maxRows: 4,
          admin: {
            description: 'Smaller figures listed under the big number.',
            initCollapsed: true,
            components: { RowLabel: '@/components/admin/RowLabel#RowLabel' },
          },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'value', type: 'text', required: true, admin: { width: '30%', placeholder: '34%' } },
                { name: 'label', type: 'text', required: true, admin: { width: '70%' } },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'testimonial',
      label: 'Testimonial card',
      type: 'group',
      fields: [
        { name: 'quote', type: 'textarea', required: true, admin: { description: 'Without quote marks.' } },
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'company', label: 'Role / company', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
    { name: 'logosLabel', label: 'Logo card label', type: 'text', defaultValue: 'Trusted by' },
    {
      name: 'logos',
      type: 'array',
      maxRows: 8,
      admin: {
        description: 'Designed for 6. Without an image, the name shows as a text wordmark.',
        initCollapsed: true,
        components: { RowLabel: '@/components/admin/RowLabel#RowLabel' },
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'logo', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
          ],
        },
      ],
    },
  ],
})

export const Work = siteGlobal({
  slug: 'work',
  label: 'Work',
  group: 'Site',
  anchor: 'work',
  description: 'Heading for the project grid. The projects themselves are under Projects.',
  fields: [
    sectionLabel('Selected work'),
    displayHeading('Recent projects'),
    { name: 'intro', type: 'textarea', admin: { description: 'Optional short paragraph under the heading.' } },
  ],
})

export const Services = siteGlobal({
  slug: 'services',
  label: 'Services',
  group: 'Site',
  anchor: 'services',
  fields: [
    sectionLabel('Services'),
    displayHeading('What we do'),
    {
      name: 'items',
      label: 'Services',
      type: 'array',
      admin: {
        description: 'Numbered automatically in this order. Drag to reorder.',
        components: { RowLabel: '@/components/admin/RowLabel#RowLabel' },
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'tags', type: 'text', admin: { description: 'Optional small line under the description, e.g. Meta · TikTok · Google.' } },
      ],
    },
  ],
})

export const Process = siteGlobal({
  slug: 'process',
  label: 'Process',
  group: 'Site',
  anchor: 'process',
  fields: [
    sectionLabel('Process'),
    displayHeading('How we work'),
    {
      name: 'steps',
      type: 'array',
      admin: {
        description: 'Designed for 4 steps (4 → 2 → 1 columns).',
        components: { RowLabel: '@/components/admin/RowLabel#RowLabel' },
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
})

export const Faq = siteGlobal({
  slug: 'faq',
  label: 'FAQ',
  group: 'Site',
  anchor: 'faq',
  fields: [
    sectionLabel('FAQ'),
    displayHeading('Questions, answered'),
    {
      name: 'items',
      label: 'Questions',
      type: 'array',
      admin: {
        description: 'The first question starts open.',
        components: { RowLabel: '@/components/admin/RowLabel#RowLabel' },
      },
      fields: [
        { name: 'q', label: 'Question', type: 'text', required: true },
        { name: 'a', label: 'Answer', type: 'textarea', required: true },
      ],
    },
  ],
})

export const Cta = siteGlobal({
  slug: 'cta',
  label: 'Call to action',
  group: 'Site',
  anchor: 'cta',
  description: 'The dark band before the footer. Your email from Brand is shown next to the button.',
  fields: [
    sectionLabel('Contact'),
    { name: 'headline', type: 'textarea', required: true, admin: { description: 'Around 45 characters reads best.' } },
    { name: 'body', type: 'textarea', admin: { description: 'Optional line under the headline.' } },
    link('button', 'Button'),
  ],
})

export const Footer = siteGlobal({
  slug: 'footer',
  label: 'Footer',
  group: 'Site',
  anchor: 'footer',
  fields: [
    linkList('links', 'Sitemap links'),
    linkList('socials', 'Social links', 'Also listed in the menu.'),
    { name: 'legal', label: 'Legal line', type: 'text' },
  ],
})

export const Pricing = siteGlobal({
  slug: 'pricing',
  label: 'Pricing',
  group: 'Site',
  anchor: 'pricing',
  description: 'How you charge: a heading, a statement and a supporting note card.',
  fields: [
    sectionLabel('Pricing'),
    displayHeading('Performance-based pricing'),
    { name: 'statement', type: 'textarea', required: true },
    {
      name: 'statementMuted',
      label: 'Statement ending (greyed)',
      type: 'text',
      admin: { description: 'Shown in grey straight after the statement.' },
    },
    {
      name: 'note',
      label: 'Note card',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'body', type: 'textarea' },
      ],
    },
    link('button', 'Button'),
  ],
})

export const Why = siteGlobal({
  slug: 'why',
  label: 'Why us',
  group: 'Site',
  anchor: 'why',
  description: 'A grid of reasons to choose you. Designed for 4.',
  fields: [
    sectionLabel('Why us'),
    displayHeading('Built different, on purpose'),
    {
      name: 'items',
      label: 'Reasons',
      type: 'array',
      admin: { components: { RowLabel: '@/components/admin/RowLabel#RowLabel' } },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
})
