/**
 * Builds the favicon and the social share image from the logo SVGs.
 *   node scripts/brand-assets.cjs
 * Re-run after replacing src/seed/assets/pace-logo.svg or pace-mark.svg.
 */
const fs = require('fs')
const sharp = require('sharp')

const read = (f) => fs.readFileSync(f, 'utf8')
const inner = (svg) => svg.replace(/^[\s\S]*?<\/title>/, '').replace(/<\/svg>\s*$/, '')
const size = (svg) => svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number).slice(2)

const mark = read('src/seed/assets/pace-mark.svg')
const logo = read('src/seed/assets/pace-logo.svg')

/* Favicon: the stacked mark, light on a dark rounded tile. */
{
  const [w, h] = size(mark)
  const box = 64, pad = 12
  const s = (box - pad * 2) / Math.max(w, h)
  const x = (box - w * s) / 2, y = (box - h * s) / 2
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0B0B0B"/><g fill="#EFEFED" transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${s.toFixed(5)})">${inner(mark)}</g></svg>\n`
  fs.writeFileSync('public/assets/favicon.svg', svg)
  console.log('public/assets/favicon.svg', svg.length, 'bytes')
}

/* Share image: 1200×630 PNG, long logo on dark with the accent glow. */
{
  const [w, h] = size(logo)
  const W = 1200, H = 630, width = 860
  const s = width / w
  const x = (W - width) / 2, y = H / 2 - (h * s) / 2 - 36
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><radialGradient id="g" cx="80%" cy="18%" r="75%"><stop offset="0" stop-color="#EF4136" stop-opacity=".7"/><stop offset="1" stop-color="#0B0B0B" stop-opacity="0"/></radialGradient></defs>
  <rect width="${W}" height="${H}" fill="#0B0B0B"/><rect width="${W}" height="${H}" fill="url(#g)"/>
  <g fill="#EFEFED" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(5)})">${inner(logo)}</g>
  <text x="${W / 2}" y="${y + h * s + 90}" text-anchor="middle" fill="#A8A8A6" font-family="Arial, Helvetica, sans-serif" font-size="30" letter-spacing="1">Marketing that sets the pace</text>
</svg>`
  sharp(Buffer.from(svg))
    .png()
    .toFile('src/seed/assets/og-image.png')
    .then((i) => console.log('src/seed/assets/og-image.png', `${i.width}x${i.height}`, i.size, 'bytes'))
}
