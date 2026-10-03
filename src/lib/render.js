/* =============================================================
   Page renderer: content (SCHEMA.md shape) → HTML strings.
   Shared by the public route (server) and the live-preview pane
   (browser), so both produce the same markup. Behaviour (clock,
   menu, reveals, counters, parallax) lives in public/site.js.
   ============================================================= */

/* ---------- Helpers ---------- */

// Escape any CMS string before it goes into markup.
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

// Allow relative URLs, anchors and http(s)/mailto/tel; block every other scheme.
export const url = (u) => {
  u = String(u ?? '').trim()
  const scheme = u.match(/^([a-z][a-z0-9+.-]*):/i)
  return scheme && !/^(https?|mailto|tel)$/i.test(scheme[1]) ? '#' : esc(u)
}

// Only accept plain CSS gradients as image placeholders.
const grad = (v) =>
  /^(repeating-)?(linear|radial|conic)-gradient\([\w\s#%.,()+-]*\)$/i.test(v || '') ? v : 'var(--grey)'

// "{score} out of 5" → "4.9 out of 5"
const fill = (s, o) => String(s ?? '').replace(/\{(\w+)\}/g, (_, k) => o[k] ?? '')
const pad = (i) => String(i).padStart(2, '0')
const ext = (u) => (/^https?:/i.test(u || '') ? ' target="_blank" rel="noopener"' : '')
const link = (l, cls = '', inner = esc(l && l.label)) =>
  l ? `<a class="${cls}" href="${url(l.href)}"${ext(l.href)}>${inner}</a>` : ''

// Image object → <img> (lazy, explicit size) or gradient placeholder.
const media = (im = {}, cls, eager, sizesAttr) => {
  const w = +im.width || 4, h = +im.height || 3
  const a11y = im.alt ? `role="img" aria-label="${esc(im.alt)}"` : 'aria-hidden="true"'
  if (im.src) {
    // srcset from the WebP variants Payload generated, with the original as
    // the last candidate so a browser without WebP still has something to use.
    const set = (im.sources || [])
      .map((s) => `${url(s.url)} ${+s.width}w`)
      .concat(`${url(im.src)} ${w}w`)
      .join(', ')
    const srcset = (im.sources || []).length ? ` srcset="${set}" sizes="${esc(sizesAttr || '100vw')}"` : ''
    return `<img class="${cls}" src="${url(im.src)}" alt="${esc(im.alt)}" width="${w}" height="${h}"${srcset} ` +
      (eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"') + '>'
  }
  return `<div class="${cls} ph" ${a11y} style="aspect-ratio:${w}/${h};background:${grad(im.placeholder)}"></div>`
}

// Uploaded logo → a mask filled with currentColor, so one SVG/PNG works on
// both the dark hero and the light footer. Returns '' when there's no logo.
const logoImg = (im, cls, label) => {
  if (!im || !im.src || !/^[\w\-./%:]+$/.test(im.src)) return ''
  const ratio = +im.width && +im.height ? `${+im.width}/${+im.height}` : '5/1'
  const a11y = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'
  return `<span class="logo-img ${cls}" ${a11y} style="--logo:url('${im.src}');aspect-ratio:${ratio}"></span>`
}

/* ---------- Icons (decorative, inline SVG) ---------- */

const svg = (d) =>
  `<svg class="i" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const I = {
  diag: svg('M7 17 17 7M8.5 7H17v8.5'),
  right: svg('M4 12h15M13 6l6 6-6 6'),
  up: svg('M12 20V5M6 11l6-6 6 6'),
  close: svg('M6 6l12 12M18 6 6 18'),
  star: (on) => `<svg class="star${on ? ' on' : ''}" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z" fill="currentColor"/></svg>`,
  google: '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A11.9 11.9 0 0 1 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>'
}

/* ---------- Page renderer ---------- */

export function renderPage(C) {
  const ui = C.ui || {}
  const brand = C.brand || {}
  const fullName = [brand.name, brand.suffix].filter(Boolean).join(' ')
  const hasLogo = Boolean(brand.logo && brand.logo.src)
  let n = 0

  // Section label row: "///// Label ........ (+ 01)". The label is the section's h2.
  const head = (id, label) => `
    <div class="sec-head" data-reveal>
      <h2 class="label" id="${id}-h"><span class="motif" aria-hidden="true">${esc(ui.motif)}</span>${esc(label)}</h2>
      <span class="counter" aria-hidden="true">${esc(fill(ui.counter, { n: pad(++n) }))}</span>
    </div>`

  const btn = (l, variant, icon) => l ? `
    <a class="btn btn--${variant}" href="${url(l.href)}"${ext(l.href)}>
      <span>${esc(l.label)}</span><span class="btn__icon">${icon}</span>
    </a>` : ''

  /* Top bar */
  const topbar = (over) => {
    const av = brand.availability || {}
    return `
    <header class="topbar${over ? ' topbar--over on-dark' : ''}">
      <a class="logo" href="#top">${hasLogo
        ? logoImg(brand.logo, 'logo__img', fullName)
        : `${esc(brand.name)}<sup>${esc(brand.mark)}</sup><span class="sr"> ${esc(brand.suffix)}</span>`}</a>
      <div class="status">
        ${av.active ? `<span class="dot" aria-hidden="true"></span><span>${esc(av.label)}</span>` : ''}
        <a class="status__email" href="mailto:${esc(brand.email)}">${esc(brand.email)}</a>
      </div>
      <div class="where">
        ${brand.location ? `<span class="where__place">${esc(brand.location)}</span>` : ''}
        ${brand.timezone ? `<span class="sr">${esc(ui.localTime)} ${esc(brand.location || brand.timezone)}:</span>
        <time class="clock" data-tz="${esc(brand.timezone)}"></time>` : ''}
        <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="${esc(ui.menuOpen)}">
          <span></span><span></span>
        </button>
      </div>
    </header>`
  }

  /* Section renderers, keyed by sections[].id */
  const R = {
    hero() {
      const h = C.hero, r = h.rating || {}, score = +r.score || 0
      const stars = Array.from({ length: 5 }, (_, i) => I.star(i < Math.round(score))).join('')
      const logoWordmark = h.wordmarkStyle === 'logo' && hasLogo
      return `
      <section class="hero on-dark" id="hero" aria-labelledby="hero-h">
        <div class="hero__media" data-parallax>${media(h.image, 'hero__img', true, '100vw')}</div>
        <div class="hero__shade" aria-hidden="true"></div>
        <div class="hero__inner">
          <div class="hero__aside">
            <p class="hero__desc" data-reveal style="--d:.35s">${esc(h.descriptor)}</p>
            <hr class="rule" data-reveal style="--d:.45s">
            <div data-reveal style="--d:.55s">${btn(h.cta, 'accent', I.diag)}</div>
          </div>
          <h1 class="wordmark${logoWordmark ? ' wordmark--logo' : ''}" id="hero-h">${logoWordmark
            ? `<span class="line" style="--i:0">${logoImg(brand.logo, 'wordmark__logo', fullName)}</span>`
            : `
            <span class="line" style="--i:0">${esc(h.headline1)}</span>
            <span class="line line--indent" style="--i:1">${esc(h.headline2)}<sup class="mark">${esc(brand.mark)}</sup></span>`}
          </h1>
          <div class="hero__foot" data-reveal style="--d:.7s">
            <p class="copy">${esc(h.copyright)}<span class="motif" aria-hidden="true">${esc(ui.motif)}</span></p>
            ${r.show !== false ? `
            <div class="rating">
              <span class="rating__g">${I.google}</span>
              <strong class="rating__score" aria-hidden="true">${score.toFixed(1)}</strong>
              <span class="stars" role="img" aria-label="${esc(fill(ui.ratingOutOf, { score }))}">${stars}</span>
              <span class="rating__label">${esc(r.label)}</span>
            </div>` : ''}
          </div>
        </div>
      </section>`
    },

    story() {
      const s = C.story, f = s.founder || {}
      return `
      <section class="sec story" id="story" aria-labelledby="story-h">
        ${head('story', s.label)}
        <div class="story__grid">
          ${f.name ? `
          <div class="founder" data-reveal>
            ${media(f.avatar, 'founder__img', false, '48px')}
            <div><p class="founder__name">${esc(f.name)}</p><p class="founder__title">${esc(f.title)}</p></div>
          </div>` : '<span></span>'}
          <div class="story__body">
            <p class="statement" data-reveal>${esc(s.statement)} <span class="muted">${esc(s.statementMuted)}</span></p>
            <div data-reveal style="--d:.1s">${btn(s.button, 'outline', I.right)}</div>
          </div>
        </div>
      </section>`
    },

    proof() {
      const p = C.proof, st = p.stat || {}, t = p.testimonial || {}
      const val = +st.value || 0, dec = (String(st.value ?? '').split('.')[1] || '').length
      return `
      <section class="sec proof" id="proof" aria-labelledby="proof-h">
        ${head('proof', p.label)}
        <div class="proof__grid">
          <article class="card stat" data-reveal>
            <h3 class="card__label">${esc(st.label)}</h3>
            <p class="stat__num">
              <span class="sr">${esc(st.prefix)}${esc(st.value)}${esc(st.suffix)}</span>
              <span aria-hidden="true">${esc(st.prefix)}<span data-count="${val}" data-dec="${dec}">${val.toFixed(dec)}</span><span class="accent">${esc(st.suffix)}</span></span>
            </p>
            ${st.caption ? `<p class="card__text">${esc(st.caption)}</p>` : ''}
            ${st.more && st.more.length ? `
            <ul class="stat__more">
              ${st.more.map((m) => `<li><strong>${esc(m.value)}</strong><span>${esc(m.label)}</span></li>`).join('')}
            </ul>` : ''}
          </article>
          <figure class="card quote" data-reveal style="--d:.1s">
            <span class="quote__glyph" aria-hidden="true">&ldquo;</span>
            <blockquote><p>${esc(t.quote)}</p></blockquote>
            <figcaption><strong>${esc(t.name)}</strong><span>${esc(t.company)}</span></figcaption>
          </figure>
          <article class="card logos" data-reveal style="--d:.2s">
            <h3 class="card__label">${esc(p.logosLabel)}</h3>
            <ul class="logos__grid">
              ${(p.logos || []).map((l) => `<li>${l.src
                ? `<img src="${url(l.src)}" alt="${esc(l.name)}" width="120" height="40" loading="lazy" decoding="async">`
                : `<span>${esc(l.name)}</span>`}</li>`).join('')}
            </ul>
          </article>
        </div>
      </section>`
    },

    work() {
      const w = C.work
      return `
      <section class="sec work" id="work" aria-labelledby="work-h">
        ${head('work', w.label)}
        ${w.heading ? `<p class="display${w.intro ? ' display--tight' : ''}" data-reveal>${esc(w.heading)}</p>` : ''}
        ${w.intro ? `<p class="work__intro" data-reveal>${esc(w.intro)}</p>` : ''}
        <ul class="work__grid">
          ${(w.projects || []).map((p, i) => `
          <li class="project" id="project-${esc(p.id)}" data-reveal style="--d:${(i % 2) * 0.1}s">
            <a class="project__link" href="${url(p.href)}"${ext(p.href)}>
              <div class="project__media">
                ${media(p.image, 'project__img', false, '(max-width: 768px) 92vw, 46vw')}
                <span class="project__arrow" aria-hidden="true">${I.diag}</span>
              </div>
              <div class="project__meta">
                <div><h3 class="project__title">${esc(p.title)}</h3><p class="project__cat">${esc(p.category)}</p></div>
                <p class="project__year">${esc(p.year)}</p>
              </div>
              <span class="sr">${esc(ui.viewProject)}</span>
            </a>
          </li>`).join('')}
        </ul>
      </section>`
    },

    pricing() {
      const p = C.pricing, note = p.note || {}
      return `
      <section class="sec pricing" id="pricing" aria-labelledby="pricing-h">
        ${head('pricing', p.label)}
        <div class="split">
          ${p.heading ? `<p class="display" data-reveal>${esc(p.heading)}</p>` : '<span></span>'}
          <div class="pricing__body">
            <p class="statement" data-reveal>${esc(p.statement)} <span class="muted">${esc(p.statementMuted)}</span></p>
            ${note.title || note.body ? `
            <div class="card pricing__note" data-reveal style="--d:.1s">
              ${note.title ? `<h3 class="card__label">${esc(note.title)}</h3>` : ''}
              ${note.body ? `<p>${esc(note.body)}</p>` : ''}
            </div>` : ''}
            <div data-reveal style="--d:.15s">${btn(p.button, 'outline', I.right)}</div>
          </div>
        </div>
      </section>`
    },

    why() {
      const w = C.why
      return `
      <section class="sec why" id="why" aria-labelledby="why-h">
        ${head('why', w.label)}
        ${w.heading ? `<p class="display" data-reveal>${esc(w.heading)}</p>` : ''}
        <ul class="why__grid">
          ${(w.items || []).map((it, i) => `
          <li class="card why__item" data-reveal style="--d:${(i % 2) * 0.08}s">
            <h3 class="why__title">${esc(it.title)}</h3>
            <p>${esc(it.description)}</p>
          </li>`).join('')}
        </ul>
      </section>`
    },

    services() {
      const s = C.services
      return `
      <section class="sec services" id="services" aria-labelledby="services-h">
        ${head('services', s.label)}
        <div class="split">
          ${s.heading ? `<p class="display" data-reveal>${esc(s.heading)}</p>` : '<span></span>'}
          <ul class="services__list">
            ${(s.items || []).map((it, i) => `
            <li class="service" data-reveal style="--d:${i * 0.06}s">
              <span class="service__n" aria-hidden="true">${pad(i + 1)}</span>
              <h3 class="service__title">${esc(it.title)}</h3>
              <p class="service__desc">${esc(it.description)}</p>
              ${it.tags ? `<p class="service__tags">${esc(it.tags)}</p>` : ''}
            </li>`).join('')}
          </ul>
        </div>
      </section>`
    },

    process() {
      const p = C.process
      return `
      <section class="sec process" id="process" aria-labelledby="process-h">
        ${head('process', p.label)}
        ${p.heading ? `<p class="display" data-reveal>${esc(p.heading)}</p>` : ''}
        <ol class="steps">
          ${(p.steps || []).map((s, i) => `
          <li class="card step" data-reveal style="--d:${i * 0.08}s">
            <span class="step__n" aria-hidden="true">(${pad(i + 1)})</span>
            <h3 class="step__title">${esc(s.title)}</h3>
            <p>${esc(s.description)}</p>
          </li>`).join('')}
        </ol>
      </section>`
    },

    faq() {
      const f = C.faq
      return `
      <section class="sec faq" id="faq" aria-labelledby="faq-h">
        ${head('faq', f.label)}
        <div class="split">
          ${f.heading ? `<p class="display" data-reveal>${esc(f.heading)}</p>` : '<span></span>'}
          <div class="faq__list">
            ${(f.items || []).map((it, i) => `
            <details class="qa" name="faq" data-reveal style="--d:${i * 0.05}s"${i === 0 ? ' open' : ''}>
              <summary><span>${esc(it.q)}</span><span class="qa__icon" aria-hidden="true"></span></summary>
              <div class="qa__a"><p>${esc(it.a)}</p></div>
            </details>`).join('')}
          </div>
        </div>
      </section>`
    },

    cta() {
      const c = C.cta, e = brand.email
      return `
      <section class="sec cta" id="cta" aria-labelledby="cta-h">
        <div class="cta__band on-dark" data-reveal>
          ${head('cta', c.label)}
          <p class="cta__headline">${esc(c.headline)}</p>
          ${c.body ? `<p class="cta__body">${esc(c.body)}</p>` : ''}
          <div class="cta__row">
            ${btn(c.button, 'accent', I.diag)}
            <a class="cta__mail" href="mailto:${esc(e)}">${esc(e)}</a>
          </div>
        </div>
      </section>`
    },

    footer() {
      const f = C.footer
      const list = (a) => (a || []).map((l) => `<li>${link(l)}</li>`).join('')
      return `
      <footer class="footer" id="footer">
        <div class="footer__top">
          <div class="footer__brand">
            <p class="footer__logo">${hasLogo
              ? logoImg(brand.logo, 'footer__logo-img', fullName)
              : `${esc(brand.name)}<sup>${esc(brand.mark)}</sup> ${esc(brand.suffix)}`}</p>
            <p class="footer__tag">${esc(brand.tagline)}</p>
          </div>
          ${f.links && f.links.length ? `<nav aria-labelledby="f-links"><h2 class="footer__h" id="f-links">${esc(ui.footerLinksTitle)}</h2><ul>${list(f.links)}</ul></nav>` : ''}
          ${f.socials && f.socials.length ? `<div><h2 class="footer__h">${esc(ui.footerSocialsTitle)}</h2><ul>${list(f.socials)}</ul></div>` : ''}
          <div>
            <h2 class="footer__h">${esc(ui.footerContactTitle)}</h2>
            <ul><li><a href="mailto:${esc(brand.email)}">${esc(brand.email)}</a></li>${brand.location ? `<li>${esc(brand.location)}</li>` : ''}</ul>
          </div>
        </div>
        <p class="footer__giant" aria-hidden="true">${hasLogo
          ? logoImg(brand.logo, 'footer__giant-logo', '')
          : `${esc(brand.name)}<sup>${esc(brand.mark)}</sup>`}</p>
        <div class="footer__bottom">
          <p>${esc(f.legal)}</p>
          <a class="footer__top-link" href="#top">${esc(ui.backToTop)} ${I.up}</a>
        </div>
      </footer>`
    }
  }

  /* Menu overlay */
  const menu = (visible) => {
    const links = ((C.nav && C.nav.links) || []).filter((l) => !/^#/.test(l.href) || visible.has(l.href.slice(1)))
    return `
    <div class="menu" id="menu" role="dialog" aria-modal="true" aria-labelledby="menu-h" hidden>
      <div class="menu__panel">
        <div class="menu__top">
          <p class="label" id="menu-h"><span class="motif" aria-hidden="true">${esc(ui.motif)}</span>${esc(ui.menuTitle)}</p>
          <button class="menu__close" type="button" aria-label="${esc(ui.menuClose)}">${I.close}</button>
        </div>
        <nav><ol class="menu__links">
          ${links.map((l, i) => `<li>${link(l, '', `<span class="menu__n" aria-hidden="true">${pad(i + 1)}</span>${esc(l.label)}`)}</li>`).join('')}
        </ol></nav>
        <div class="menu__foot">
          <a class="menu__email" href="mailto:${esc(brand.email)}">${esc(brand.email)}</a>
          <ul class="menu__social">${((C.footer && C.footer.socials) || []).map((l) => `<li>${link(l)}</li>`).join('')}</ul>
        </div>
      </div>
    </div>`
  }

  // Order + visibility from content.sections; the footer is always pinned last.
  const list = (C.sections || []).filter((x) => x && x.visible && R[x.id] && C[x.id])
  const visible = new Set(list.map((x) => x.id))
  const body = list.filter((x) => x.id !== 'footer')

  /* Loading screen. The markup ships with the page so it can cover the first
     paint, but the frames carry no src: site.js only promotes data-src once it
     has decided the intro actually runs, so a visit that skips it (a repeat
     visit, reduced motion, no images) downloads none of these. */
  const intro = () => {
    const L = C.loading || {}
    const imgs = L.images || []
    if (!L.enabled || !imgs.length) return ''
    const frames = imgs.map((im, i) => {
      const set = (im.sources || []).map((s) => `${url(s.url)} ${+s.width}w`).concat(`${url(im.src)} ${+im.width}w`).join(', ')
      return `<img data-src="${url(im.src)}" data-srcset="${esc(set)}" sizes="100vw" alt="" style="--i:${i}">`
    }).join('')
    return `
    <div class="intro" id="intro" data-frame="${+L.frameMs || 500}" aria-hidden="true">
      <div class="intro__frames">${frames}</div>
      <div class="intro__shade" style="background:${/^#[0-9a-f]{3,6}$/i.test(L.overlayColor) ? L.overlayColor : '#0B0B0B'};opacity:${Math.min(Math.max(+L.overlayOpacity || 0, 0), 0.9)}"></div>
      <div class="intro__mark">${hasLogo
        ? logoImg(brand.logo, 'intro__logo', '')
        : `<span class="intro__name">${esc(fullName)}</span>`}</div>
      <button type="button" class="intro__skip" data-intro-skip>Skip</button>
    </div>`
  }

  return (
    intro() +
    `<div class="backdrop" aria-hidden="true"></div>` +
    `<a class="skip" href="#main">${esc(ui.skipToContent)}</a>` +
    `<div class="frame" id="app" data-site-content>` +
      topbar(body[0] && body[0].id === 'hero') +
      `<main id="main" tabindex="-1">${visible.has('hero') ? '' : `<h1 class="sr">${esc(fullName)}</h1>`}` +
      body.map((x) => R[x.id]()).join('') +
      '</main>' +
      (visible.has('footer') ? R.footer() : '') +
    '</div>' +
    menu(visible)
  )
}

/* ---------- Theme → CSS custom properties ---------- */

const safeCss = (v) => String(v ?? '').replace(/[;{}<>]/g, '')

export function themeVars(C) {
  const t = C.theme || {}
  const map = { accent: 'accent', dark: 'dark', light: 'light', card: 'card', grey: 'grey', fontDisplay: 'font-display', fontBody: 'font-body' }
  const vars = Object.entries(map).filter(([k]) => t[k]).map(([k, v]) => `--${v}:${safeCss(t[k])}`)
  if (t.radius != null && t.radius !== '') vars.push(`--radius:${parseFloat(t.radius) || 0}px`)
  const hero = C.hero && C.hero.image && C.hero.image.src
  if (hero && /^[\w\-./%:]+$/.test(hero)) vars.push(`--hero-img:url("${hero}")`)
  return vars.join(';')
}
