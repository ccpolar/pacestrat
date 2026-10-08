import type { Content } from './assemble'
import { esc, renderPage, themeVars, url } from './render.js'


const abs = (origin: string, u: string) => (!u || /^https?:/i.test(u) ? u : origin.replace(/\/$/, '') + u)

/**
 * The full public HTML document. Everything a crawler or link-preview bot
 * needs (title, description, share tags) is in the static markup, and the hero
 * image preload always follows hero.image.src.
 */
export function renderDocument(C: Content, origin: string) {
  const seo = C.seo || {}
  const hero = C.hero?.image?.src
  /* Preload the same candidate list the <img> offers, so the browser fetches
     the variant it will actually use instead of the full-size original. */
  const heroSources = (C.hero?.image?.sources || []) as { url: string; width: number }[]
  /* A browser that ignores imagesrcset falls back to href, so point that at the
     largest variant rather than the original — otherwise the preload is the one
     thing still pulling the heavy source. */
  const heroHref = heroSources.length ? heroSources[heroSources.length - 1].url : hero
  const heroSrcset = heroSources.length
    ? esc(
        heroSources
          .map((s) => `${s.url} ${s.width}w`)
          .concat(C.hero?.image?.useOriginalInSrcset === false ? [] : [`${hero} ${C.hero.image.width}w`])
          .join(', '),
      )
    : ''
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
  <link rel="preload" as="font" type="font/woff2" href="/fonts/inter-tight-latin.woff2" crossorigin>
  ${hero ? `<link rel="preload" as="image" href="${url(heroHref)}"${heroSrcset ? ` imagesrcset="${heroSrcset}" imagesizes="100vw"` : ''} fetchpriority="high">` : ''}
  <link rel="stylesheet" href="/styles.css">
  <script src="/site.js" defer></script>
  ${
    C.loading?.enabled && (C.loading?.images || []).length
      ? `<script>/* Decides before first paint, so the overlay is never seen half-applied
     and a visit that skips it never pays for it. Once per visit, and never
     when the visitor has asked for reduced motion. */
(function(){try{
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (sessionStorage.getItem('intro') === 'seen') return;
  sessionStorage.setItem('intro','seen');
  document.documentElement.setAttribute('data-intro','run');
}catch(e){}})()</script>`
      : ''
  }
</head>
<body>
${renderPage(C)}
</body>
</html>`
}
