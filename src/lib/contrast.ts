/* WCAG contrast helpers, used by the Theme screen's contrast check. */

type RGB = [number, number, number]

export const hexToRgb = (hex: string): RGB | null => {
  const m = String(hex || '').trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!m) return null
  const h = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1]
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB
}

/** Same as CSS color-mix(in srgb, a p%, b). */
export const mix = (a: RGB, b: RGB, p: number): RGB => a.map((v, i) => Math.round(v * p + b[i] * (1 - p))) as RGB

const channel = (v: number) => {
  const c = v / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}
const luminance = ([r, g, b]: RGB) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)

export const contrast = (a: RGB, b: RGB) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
