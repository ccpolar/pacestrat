'use client'

import { useFormFields } from '@payloadcms/ui'

import { contrast, hexToRgb, mix } from '@/lib/contrast'

/**
 * Live WCAG check of the colour pairs the site actually uses, so a theme
 * change that makes text unreadable is caught before publishing.
 */
export const ContrastCheck = () => {
  const colors = useFormFields(([fields]) => ({
    accent: fields.accent?.value as string,
    dark: fields.dark?.value as string,
    light: fields.light?.value as string,
    card: fields.card?.value as string,
    grey: fields.grey?.value as string,
  }))
  const c = Object.fromEntries(Object.entries(colors).map(([k, v]) => [k, hexToRgb(v)]))
  if (Object.values(c).some((v) => !v)) return null
  const { accent, dark, light, card, grey } = c as Record<string, [number, number, number]>

  // Mirrors --muted / --muted-lg in styles.css.
  const muted = mix(grey, dark, 0.65)
  const mutedLg = mix(grey, dark, 0.85)

  const checks = [
    { label: 'Body text on page', ratio: contrast(dark, light), min: 4.5 },
    { label: 'Grey text on page', ratio: contrast(muted, light), min: 4.5 },
    { label: 'Greyed statement (large)', ratio: contrast(mutedLg, light), min: 3 },
    { label: 'Text on cards', ratio: contrast(dark, card), min: 4.5 },
    { label: 'Button text on accent', ratio: contrast(dark, accent), min: 4.5 },
    { label: 'Light text on dark', ratio: contrast(light, dark), min: 4.5 },
    { label: 'Accent on dark (large)', ratio: contrast(accent, dark), min: 3 },
  ]
  const failing = checks.filter((x) => x.ratio < x.min).length

  return (
    <section className="contrast-check" aria-label="Contrast check">
      <header className="contrast-check__head">
        <h4>Readability check</h4>
        <span className={`chip ${failing ? 'chip--fail' : 'chip--pass'}`}>
          {failing ? `${failing} below WCAG AA` : 'All pairs pass WCAG AA'}
        </span>
      </header>
      <ul className="contrast-check__list">
        {checks.map((x) => (
          <li key={x.label} className={x.ratio < x.min ? 'is-fail' : 'is-pass'}>
            <span>{x.label}</span>
            <strong>{x.ratio.toFixed(2)}:1</strong>
            <span className="contrast-check__min">needs {x.min}:1</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
