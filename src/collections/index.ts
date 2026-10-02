import type { CollectionConfig } from 'payload'

import { imageSlot, validHref } from '../fields'
import { adminOrigin, breakpoints, revalidateDelete, revalidateDoc } from '../lib/payload-shared'

const loggedIn = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Project', plural: 'Projects' },
  // Drag-and-drop ordering in the list view; the site shows projects in this order.
  orderable: true,
  admin: {
    group: 'Site',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'year', 'showOnSite'],
    description: 'The project grid in the Work section. Drag rows to change the order.',
    livePreview: {
      url: ({ req, data }) => `${adminOrigin(req)}/preview?collection=projects&id=${data?.id ?? ''}#work`,
      breakpoints,
    },
  },
  access: { read: loggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  versions: { drafts: true, maxPerDoc: 25 },
  hooks: {
    afterChange: [revalidateDoc],
    afterDelete: [revalidateDelete],
    beforeValidate: [
      // Slug from the title when left empty; it becomes the card's #project-<slug> anchor.
      ({ data }) => {
        if (data && !data.slug && data.title) {
          data.slug = String(data.title).toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-')
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'category', type: 'text', admin: { width: '60%', placeholder: 'Brand identity · Website' } },
        { name: 'year', type: 'text', admin: { width: '40%', placeholder: '2026' } },
      ],
    },
    imageSlot('image', 'Cover image', 'Cropped to 4:3.'),
    {
      name: 'href',
      label: 'Link',
      type: 'text',
      validate: validHref,
      defaultValue: '#work',
      admin: { description: 'Case study URL, or #work to stay on the page.' },
    },
    {
      name: 'showOnSite',
      label: 'Show on site',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', components: { Cell: '@/components/admin/VisibilityCell#VisibilityCell' } },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Filled from the title if left empty.' },
    },
  ],
}

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Image', plural: 'Media' },
  admin: { group: 'Settings', description: 'Every image used on the site.' },
  // Files are public (they're on the page); editing is not.
  access: { read: () => true, create: loggedIn, update: loggedIn, delete: loggedIn },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
  },
  hooks: { afterChange: [revalidateDoc], afterDelete: [revalidateDelete] },
  fields: [
    {
      name: 'alt',
      label: 'Alt text',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe the image as you would to someone who cannot see it. Read aloud by screen readers.',
      },
    },
  ],
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { group: 'Settings', useAsTitle: 'name', defaultColumns: ['name', 'email', 'role'] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', defaultValue: 'Admin account', admin: { description: 'Shown under your name in the sidebar.' } },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
  ],
}
