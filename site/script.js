/* =============================================================
   [NAME] Studio: renderer
   Loads content.json (or the inline fallback when fetch fails,
   e.g. over file://) and renders every section from it.
   ============================================================= */
(() => {
  'use strict';

  const d = document;
  const root = d.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let C, ui, lang, n;

  /* ---------- Helpers ---------- */

  // Escape any CMS string before it goes into markup.
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  // Allow relative URLs, anchors and http(s)/mailto/tel; block every other scheme.
  const url = (u) => {
    u = String(u ?? '').trim();
    const scheme = u.match(/^([a-z][a-z0-9+.-]*):/i);
    return scheme && !/^(https?|mailto|tel)$/i.test(scheme[1]) ? '#' : esc(u);
  };

  // Only accept plain CSS gradients as image placeholders.
  const grad = (v) =>
    /^(repeating-)?(linear|radial|conic)-gradient\([\w\s#%.,()+-]*\)$/i.test(v || '') ? v : 'var(--grey)';

  // "{score} out of 5" → "4.9 out of 5"
  const fill = (s, o) => String(s ?? '').replace(/\{(\w+)\}/g, (_, k) => o[k] ?? '');

  const pad = (i) => String(i).padStart(2, '0');

  const ext = (u) => /^https?:/i.test(u || '') ? ' target="_blank" rel="noopener"' : '';

  const link = (l, cls = '', inner = esc(l && l.label)) =>
    l ? `<a class="${cls}" href="${url(l.href)}"${ext(l.href)}>${inner}</a>` : '';

  // Image object → <img> (lazy, explicit size) or gradient placeholder.
  const media = (im = {}, cls, eager) => {
    const w = +im.width || 4, h = +im.height || 3;
    const a11y = im.alt ? `role="img" aria-label="${esc(im.alt)}"` : 'aria-hidden="true"';
    if (im.src) {
      return `<img class="${cls}" src="${url(im.src)}" alt="${esc(im.alt)}" width="${w}" height="${h}" ` +
        (eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"') + '>';
    }
    return `<div class="${cls} ph" ${a11y} style="aspect-ratio:${w}/${h};background:${grad(im.placeholder)}"></div>`;
  };

  /* ---------- Icons (decorative, inline SVG) ---------- */

  const svg = (d, vb = '0 0 24 24') =>
    `<svg class="i" viewBox="${vb}" aria-hidden="true" focusable="false"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const I = {
    diag: svg('M7 17 17 7M8.5 7H17v8.5'),
    right: svg('M4 12h15M13 6l6 6-6 6'),
    up: svg('M12 20V5M6 11l6-6 6 6'),
    close: svg('M6 6l12 12M18 6 6 18'),
    star: '<svg class="star" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z" fill="currentColor"/></svg>',
    google: '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A11.9 11.9 0 0 1 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>'
  };

  /* ---------- Shared partials ---------- */

  // Section label row: "///// Label ........ (+ 01)". The label is the section's h2.
  const head = (id, label) => `
    <div class="sec-head" data-reveal>
      <h2 class="label" id="${id}-h"><span class="motif" aria-hidden="true">${esc(ui.motif)}</span>${esc(label)}</h2>
      <span class="counter" aria-hidden="true">${esc(fill(ui.counter, { n: pad(++n) }))}</span>
    </div>`;

  const btn = (l, variant, icon) => l ? `
    <a class="btn btn--${variant}" href="${url(l.href)}"${ext(l.href)}>
      <span>${esc(l.label)}</span><span class="btn__icon">${icon}</span>
    </a>` : '';

  /* ---------- Top bar ---------- */

  const topbar = (over) => {
    const b = C.brand, av = b.availability || {};
    return `
    <header class="topbar${over ? ' topbar--over on-dark' : ''}">
      <a class="logo" href="#top">${esc(b.name)}<sup>${esc(b.mark)}</sup><span class="sr"> ${esc(b.suffix)}</span></a>
      <div class="status">
        ${av.active ? `<span class="dot" aria-hidden="true"></span><span>${esc(av.label)}</span>` : ''}
        <a class="status__email" href="mailto:${esc(b.email)}">${esc(b.email)}</a>
      </div>
      <div class="where">
        <span class="where__place">${esc(b.location)}</span>
        <span class="sr">${esc(ui.localTime)} ${esc(b.location)}:</span>
        <time class="clock"></time>
        <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="${esc(ui.menuOpen)}">
          <span></span><span></span>
        </button>
      </div>
    </header>`;
  };

  /* ---------- Section renderers (keyed by sections[].id) ---------- */

  const R = {

    /* 1. HERO */
    hero() {
      const h = C.hero, r = h.rating || {}, score = +r.score || 0;
      const stars = Array.from({ length: 5 }, (_, i) =>
        I.star.replace('class="star"', `class="star${i < Math.round(score) ? ' on' : ''}"`)).join('');
      return `
      <section class="hero on-dark" id="hero" aria-labelledby="hero-h">
        <div class="hero__media" data-parallax>${media(h.image, 'hero__img', true)}</div>
        <div class="hero__shade" aria-hidden="true"></div>
        <div class="hero__inner">
          <div class="hero__aside">
            <p class="hero__desc" data-reveal style="--d:.35s">${esc(h.descriptor)}</p>
            <hr class="rule" data-reveal style="--d:.45s">
            <div data-reveal style="--d:.55s">${btn(h.cta, 'accent', I.diag)}</div>
          </div>
          <h1 class="wordmark" id="hero-h">
            <span class="line" style="--i:0">${esc(h.headline1)}</span>
            <span class="line line--indent" style="--i:1">${esc(h.headline2)}<sup class="mark">${esc(C.brand.mark)}</sup></span>
          </h1>
          <div class="hero__foot" data-reveal style="--d:.7s">
            <p class="copy">${esc(h.copyright)}<span class="motif" aria-hidden="true">${esc(ui.motif)}</span></p>
            <div class="rating">
              <span class="rating__g">${I.google}</span>
              <strong class="rating__score" aria-hidden="true">${score.toFixed(1)}</strong>
              <span class="stars" role="img" aria-label="${esc(fill(ui.ratingOutOf, { score }))}">${stars}</span>
              <span class="rating__label">${esc(r.label)}</span>
            </div>
          </div>
        </div>
      </section>`;
    },

    /* 2. OUR STORY */
    story() {
      const s = C.story, f = s.founder || {};
      return `
      <section class="sec story" id="story" aria-labelledby="story-h">
        ${head('story', s.label)}
        <div class="story__grid">
          <div class="founder" data-reveal>
            ${media(f.avatar, 'founder__img')}
            <div><p class="founder__name">${esc(f.name)}</p><p class="founder__title">${esc(f.title)}</p></div>
          </div>
          <div class="story__body">
            <p class="statement" data-reveal>${esc(s.statement)} <span class="muted">${esc(s.statementMuted)}</span></p>
            <div data-reveal style="--d:.1s">${btn(s.button, 'outline', I.right)}</div>
          </div>
        </div>
      </section>`;
    },

    /* 3. PROOF ROW */
    proof() {
      const p = C.proof, st = p.stat || {}, t = p.testimonial || {};
      const val = +st.value || 0, dec = (String(st.value).split('.')[1] || '').length;
      return `
      <section class="sec proof" id="proof" aria-labelledby="proof-h">
        ${head('proof', p.label)}
        <div class="proof__grid">
          <article class="card stat" data-reveal>
            <h3 class="card__label">${esc(st.label)}</h3>
            <p class="stat__num">
              <span class="sr">${esc(st.value)}${esc(st.suffix)}</span>
              <span aria-hidden="true"><span data-count="${val}" data-dec="${dec}">${reduced ? val.toFixed(dec) : (0).toFixed(dec)}</span><span class="accent">${esc(st.suffix)}</span></span>
            </p>
            <p class="card__text">${esc(st.caption)}</p>
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
      </section>`;
    },

    /* 4. WORK SHOWCASE */
    work() {
      const w = C.work;
      return `
      <section class="sec work" id="work" aria-labelledby="work-h">
        ${head('work', w.label)}
        ${w.heading ? `<p class="display" data-reveal>${esc(w.heading)}</p>` : ''}
        <ul class="work__grid">
          ${(w.projects || []).map((p, i) => `
          <li class="project" id="project-${esc(p.id)}" data-reveal style="--d:${(i % 2) * 0.1}s">
            <a class="project__link" href="${url(p.href)}"${ext(p.href)}>
              <div class="project__media">
                ${media(p.image, 'project__img')}
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
      </section>`;
    },

    /* 5a. SERVICES */
    services() {
      const s = C.services;
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
            </li>`).join('')}
          </ul>
        </div>
      </section>`;
    },

    /* 5b. PROCESS */
    process() {
      const p = C.process;
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
      </section>`;
    },

    /* 5c. FAQ (native <details>, one open at a time via name="faq") */
    faq() {
      const f = C.faq;
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
      </section>`;
    },

    /* 5d. CTA BAND */
    cta() {
      const c = C.cta, e = C.brand.email;
      return `
      <section class="sec cta" id="cta" aria-labelledby="cta-h">
        <div class="cta__band on-dark" data-reveal>
          ${head('cta', c.label)}
          <p class="cta__headline">${esc(c.headline)}</p>
          <div class="cta__row">
            ${btn(c.button, 'accent', I.diag)}
            <a class="cta__mail" href="mailto:${esc(e)}">${esc(e)}</a>
          </div>
        </div>
      </section>`;
    },

    /* 5e. FOOTER */
    footer() {
      const f = C.footer, b = C.brand;
      const list = (a) => (a || []).map((l) => `<li>${link(l)}</li>`).join('');
      return `
      <footer class="footer" id="footer">
        <div class="footer__top">
          <div class="footer__brand">
            <p class="footer__logo">${esc(b.name)}<sup>${esc(b.mark)}</sup> ${esc(b.suffix)}</p>
            <p class="footer__tag">${esc(b.tagline)}</p>
          </div>
          <nav aria-labelledby="f-links"><h2 class="footer__h" id="f-links">${esc(ui.footerLinksTitle)}</h2><ul>${list(f.links)}</ul></nav>
          <div><h2 class="footer__h">${esc(ui.footerSocialsTitle)}</h2><ul>${list(f.socials)}</ul></div>
          <div>
            <h2 class="footer__h">${esc(ui.footerContactTitle)}</h2>
            <ul><li><a href="mailto:${esc(b.email)}">${esc(b.email)}</a></li><li>${esc(b.location)}</li></ul>
          </div>
        </div>
        <p class="footer__giant" aria-hidden="true">${esc(b.name)}<sup>${esc(b.mark)}</sup></p>
        <div class="footer__bottom">
          <p>${esc(f.legal)}</p>
          <a class="footer__top-link" href="#top">${esc(ui.backToTop)} ${I.up}</a>
        </div>
      </footer>`;
    }
  };

  /* ---------- Menu overlay ---------- */

  const menuHTML = (visible) => {
    const links = ((C.nav && C.nav.links) || []).filter((l) => !/^#/.test(l.href) || visible.has(l.href.slice(1)));
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
          <a class="menu__email" href="mailto:${esc(C.brand.email)}">${esc(C.brand.email)}</a>
          <ul class="menu__social">${((C.footer && C.footer.socials) || []).map((l) => `<li>${link(l)}</li>`).join('')}</ul>
        </div>
      </div>
    </div>`;
  };

  /* ---------- Render ---------- */

  function render(data) {
    C = data; ui = C.ui || {}; n = 0;
    lang = (C.seo && C.seo.lang) || 'en';

    // Theme → CSS custom properties
    const t = C.theme || {};
    const vars = { accent: 'accent', dark: 'dark', light: 'light', card: 'card', grey: 'grey', fontDisplay: 'font-display', fontBody: 'font-body' };
    for (const k in vars) if (t[k]) root.style.setProperty('--' + vars[k], t[k]);
    if (t.radius != null) root.style.setProperty('--radius', parseFloat(t.radius) + 'px');
    const heroSrc = C.hero && C.hero.image && C.hero.image.src;
    if (heroSrc && /^[\w\-./%]+$/.test(heroSrc)) root.style.setProperty('--hero-img', `url("${heroSrc}")`);

    // SEO / head
    const s = C.seo || {};
    root.lang = lang;
    d.title = s.title || '';
    const meta = (sel, v) => { const m = d.querySelector(sel); if (m && v) m.setAttribute('content', v); };
    meta('meta[name="description"]', s.description);
    meta('meta[property="og:title"]', s.title);
    meta('meta[property="og:description"]', s.description);
    meta('meta[property="og:image"]', s.ogImage);
    meta('meta[name="theme-color"]', t.dark);

    // Sections: order + visibility come from content.sections
    const list = (C.sections || []).filter((x) => x && x.visible && R[x.id] && C[x.id]);
    const visible = new Set(list.map((x) => x.id));
    const body = list.filter((x) => x.id !== 'footer');
    const app = d.getElementById('app');

    app.innerHTML =
      topbar(body[0] && body[0].id === 'hero') +
      `<main id="main" tabindex="-1">${visible.has('hero') ? '' : `<h1 class="sr">${esc(C.brand.name)} ${esc(C.brand.suffix)}</h1>`}` +
      body.map((x) => R[x.id]()).join('') +
      '</main>' +
      (visible.has('footer') ? R.footer() : '');

    d.body.insertAdjacentHTML('afterbegin', `<a class="skip" href="#main">${esc(ui.skipToContent)}</a>`);
    d.body.insertAdjacentHTML('beforeend', menuHTML(visible));

    clock(); menu(); reveals(); counters(); parallax();

    // Start the hero entrance once the webfont is in (capped at 800ms), so the
    // wordmark doesn't reflow mid-animation when the font swaps.
    const ready = () => requestAnimationFrame(() => {
      d.body.classList.add('is-ready');
      d.querySelectorAll('.hero [data-reveal]').forEach((el) => el.classList.add('is-in'));
    });
    const css = d.getElementById('font-css');
    const sheet = !css || css.media === 'all' ? Promise.resolve()
      : new Promise((r) => css.addEventListener('load', r, { once: true }));
    const font = sheet.then(() => d.fonts && d.fonts.load('500 1em ' + (t.fontDisplay || 'sans-serif')));
    Promise.race([font, new Promise((r) => setTimeout(r, 800))]).then(ready, ready);
  }

  /* ---------- Live local time ---------- */

  function clock() {
    const el = d.querySelector('.clock');
    if (!el) return;
    const opts = { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' };
    let f;
    try { f = new Intl.DateTimeFormat(lang, { ...opts, timeZone: C.brand.timezone }); }
    catch { f = new Intl.DateTimeFormat(lang, opts); }
    const tick = () => {
      const now = new Date();
      el.textContent = f.format(now);
      el.dateTime = now.toISOString();
      setTimeout(tick, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 50);
    };
    tick();
  }

  /* ---------- Menu behaviour (focus-trapped dialog) ---------- */

  function menu() {
    const m = d.getElementById('menu'), b = d.querySelector('.burger'), app = d.getElementById('app');
    if (!m || !b) return;
    const close = m.querySelector('.menu__close');
    const set = (open) => {
      b.setAttribute('aria-expanded', open);
      app.inert = open;
      d.body.classList.toggle('no-scroll', open);
      if (open) {
        m.hidden = false;
        requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add('is-open')));
        close.focus();
      } else {
        m.classList.remove('is-open');
        setTimeout(() => { if (!m.classList.contains('is-open')) m.hidden = true; }, reduced ? 0 : 400);
        b.focus({ preventScroll: true });
      }
    };
    b.addEventListener('click', () => set(true));
    m.addEventListener('click', (e) => {
      if (e.target === m || e.target.closest('.menu__close, a[href^="#"]')) set(false);
    });
    d.addEventListener('keydown', (e) => {
      if (m.hidden) return;
      if (e.key === 'Escape') set(false);
      if (e.key === 'Tab') {
        const f = m.querySelectorAll('a, button');
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- Scroll reveals ---------- */

  function reveals() {
    // Hero elements are revealed with the entrance sequence in render(), not on scroll.
    const els = d.querySelectorAll('[data-reveal]:not(.hero [data-reveal])');
    if (reduced || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Stat count-up ---------- */

  function counters() {
    if (reduced || !('IntersectionObserver' in window)) {
      d.querySelectorAll('[data-count]').forEach((el) => { el.textContent = (+el.dataset.count).toFixed(+el.dataset.dec); });
      return;
    }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const el = en.target, to = +el.dataset.count, dec = +el.dataset.dec, t0 = performance.now(), dur = 1600;
      const step = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = (to * (1 - Math.pow(1 - p, 3))).toFixed(dec);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), { threshold: 0.6 });
    d.querySelectorAll('[data-count]').forEach((el) => io.observe(el));
  }

  /* ---------- Light hero parallax ---------- */

  function parallax() {
    const el = d.querySelector('[data-parallax]');
    if (!el || reduced) return;
    let queued = false;
    const update = () => {
      queued = false;
      const y = window.scrollY;
      if (y < el.parentElement.offsetHeight) el.style.transform = `translate3d(0,${(y * 0.1).toFixed(1)}px,0)`;
    };
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- Boot ---------- */

  const fallback = () => JSON.parse(d.getElementById('content-fallback').textContent);

  fetch('content.json')
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .catch(fallback)
    .then(render);
})();
