import type { Content } from './assemble'
import { esc, renderPage, themeVars, url } from './render.js'

const FONTS = 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&display=swap'

const abs = (origin: string, u: string) => (!u || /^https?:/i.test(u) ? u : origin.replace(/\/$/, '') + u)

/**
 * The full public HTML document. Everything a crawler or link-preview bot
 * needs (title, description, share tags) is in the static markup, and the hero
 * image preload always follows hero.image.src.
 */
export function renderDocument(C: Content, origin: string) {
  const seo = C.seo || {}
  const hero = C.hero?.image?.src
  return `<!doctype html>
<html lang="${esc(seo.lang || 'en')}" style="${esc(themeVars(C))}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(seo.title)}</title>
  <meta name="description" content="${esc(seo.description)}">
  <meta name="theme-color" content="${esc(C.theme?.dark || '#0B0B0B')}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(seo.title)}">
  <meta property="og:description" content="${esc(seo.description)}">
  ${seo.ogImage ? `<meta property="og:image" content="${url(abs(origin, seo.ogImage))}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link id="font-css" rel="stylesheet" href="${FONTS}" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="${FONTS}"></noscript>
  ${hero ? `<link rel="preload" as="image" href="${url(hero)}" fetchpriority="high">` : ''}
  <link rel="stylesheet" href="/styles.css">
  <script src="/site.js" defer></script>
</head>
<body>
${renderPage(C)}
</body>
</html>`
}
