import type { Field, GroupField, TextField } from 'payload'

/* ---------- Validators ---------- */

// Mirrors the renderer's URL rule: relative paths, #anchors, http(s), mailto, tel.
export const validHref = (value: unknown): true | string => {
  const v = String(value ?? '').trim()
  if (!v) return 'Add a link.'
  const scheme = v.match(/^([a-z][a-z0-9+.-]*):/i)
  if (scheme && !/^(https?|mailto|tel)$/i.test(scheme[1])) {
    return 'Links can start with https://, mailto:, tel:, # or /.'
  }
  return true
}

// Mirrors the renderer's placeholder rule: plain CSS gradients only.
export const validGradient = (value: unknown): true | string => {
  const v = String(value ?? '').trim()
  if (!v) return true
  return /^(repeating-)?(linear|radial|conic)-gradient\([\w\s#%.,()+-]*\)$/i.test(v)
    ? true
    : 'Use a CSS gradient, e.g. linear-gradient(135deg, #FF3B0F, #0B0B0B).'
}

export const validHex = (value: unknown): true | string =>
  /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(value ?? '')) ? true : 'Use a hex colour like #FF3B0F.'

/* ---------- Reusable fields ---------- */

/** The small uppercase "///// Label" above a section. Also the section's heading for screen readers. */
export const sectionLabel = (defaultValue: string): TextField => ({
  name: 'label',
  type: 'text',
  required: true,
  defaultValue,
  admin: { description: 'Small uppercase label shown with the ///// motif at the top of the section.' },
})

export const displayHeading = (defaultValue?: string): TextField => ({
  name: 'heading',
  type: 'text',
  defaultValue,
  admin: { description: 'Large heading under the label. Leave empty to hide it.' },
})

/** { label, href } */
export const link = (name: string, label: string, description?: string): GroupField => ({
  name,
  label,
  type: 'group',
  admin: { description, hideGutter: true },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', required: true, admin: { width: '40%' } },
        {
          name: 'href',
          label: 'Link',
          type: 'text',
          required: true,
          validate: validHref,
          admin: { width: '60%', placeholder: 'https://, mailto:, #section' },
        },
      ],
    },
  ],
})

/** Array of { label, href } rows. */
export const linkList = (name: string, label: string, description?: string): Field => ({
  name,
  label,
  type: 'array',
  admin: { description, initCollapsed: true, components: { RowLabel: '@/components/admin/RowLabel#RowLabel' } },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', required: true, admin: { width: '40%' } },
        { name: 'href', label: 'Link', type: 'text', required: true, validate: validHref, admin: { width: '60%' } },
      ],
    },
  ],
})

/**
 * An image slot: an upload from the Media library, plus a CSS gradient that
 * shows when no image is chosen. Alt text lives on the media item itself.
 */
export const imageSlot = (name: string, label: string, description?: string): GroupField => ({
  name,
  label,
  type: 'group',
  admin: { description, hideGutter: true },
  fields: [
    {
      name: 'media',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Alt text is set on the image in the Media library.' },
    },
    {
      name: 'placeholder',
      type: 'text',
      validate: validGradient,
      admin: { description: 'CSS gradient shown when no image is chosen.' },
    },
  ],
})
