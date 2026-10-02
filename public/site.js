/* =============================================================
   Page behaviour: live clock, menu dialog, scroll reveals, stat
   count-up, hero parallax and the hero entrance. The markup is
   rendered on the server (src/lib/render.js); this only wires it up.
   init() can run again after the live preview re-renders the page.
   ============================================================= */
(() => {
  'use strict';

  const d = document;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = [];         // observers from the previous init, disconnected on re-init
  let clockTimer = 0;
  let bound = false;     // document/window listeners are bound once

  /* ---------- Live local time ---------- */

  function clock() {
    clearTimeout(clockTimer);
    const el = d.querySelector('.clock');
    if (!el) return;
    const lang = d.documentElement.lang || 'en';
    const opts = { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' };
    let f;
    try { f = new Intl.DateTimeFormat(lang, { ...opts, timeZone: el.dataset.tz || undefined }); }
    catch { f = new Intl.DateTimeFormat(lang, opts); }
    const tick = () => {
      const now = new Date();
      el.textContent = f.format(now);
      el.dateTime = now.toISOString();
      clockTimer = setTimeout(tick, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 50);
    };
    tick();
  }

  /* ---------- Menu (focus-trapped dialog) ---------- */

  const menuEls = () => ({ m: d.getElementById('menu'), b: d.querySelector('.burger'), app: d.getElementById('app') });

  function setMenu(open) {
    const { m, b, app } = menuEls();
    if (!m || !b) return;
    b.setAttribute('aria-expanded', open);
    app.inert = open;
    d.body.classList.toggle('no-scroll', open);
    if (open) {
      m.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add('is-open')));
      m.querySelector('.menu__close').focus();
    } else {
      m.classList.remove('is-open');
      setTimeout(() => { if (!m.classList.contains('is-open')) m.hidden = true; }, reduced ? 0 : 400);
      b.focus({ preventScroll: true });
    }
  }

  /* ---------- Scroll reveals ---------- */

  function reveals() {
    // Hero elements are revealed with the entrance sequence, not on scroll.
    const els = d.querySelectorAll('[data-reveal]:not(.hero [data-reveal])');
    if (reduced || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
    const o = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); o.unobserve(en.target); }
    }), { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });
    els.forEach((el) => o.observe(el));
    io.push(o);
  }

  /* ---------- Stat count-up ----------
     The server renders the final number (right for no-JS and search engines);
     it is reset to 0 here only when it will animate. */

  function counters() {
    if (reduced || !('IntersectionObserver' in window)) return;
    const els = d.querySelectorAll('[data-count]');
    const o = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      o.unobserve(en.target);
      const el = en.target, to = +el.dataset.count, dec = +el.dataset.dec, t0 = performance.now(), dur = 1600;
      const step = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = (to * (1 - Math.pow(1 - p, 3))).toFixed(dec);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), { threshold: 0.6 });
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top > innerHeight) el.textContent = (0).toFixed(+el.dataset.dec);
      o.observe(el);
    });
    io.push(o);
  }

  /* ---------- Light hero parallax ---------- */

  let queued = false;
  function parallax() {
    queued = false;
    const el = d.querySelector('[data-parallax]');
    if (!el) return;
    const y = window.scrollY;
    if (y < el.parentElement.offsetHeight) el.style.transform = `translate3d(0,${(y * 0.1).toFixed(1)}px,0)`;
  }

  /* ---------- Hero entrance ----------
     Waits for the webfont (capped at 800ms) so the wordmark doesn't reflow
     mid-animation when the font swaps. */

  function entrance() {
    const ready = () => requestAnimationFrame(() => {
      d.body.classList.add('is-ready');
      d.querySelectorAll('.hero [data-reveal]').forEach((el) => el.classList.add('is-in'));
    });
    const css = d.getElementById('font-css');
    const sheet = !css || css.media === 'all' ? Promise.resolve()
      : new Promise((r) => css.addEventListener('load', r, { once: true }));
    const family = getComputedStyle(d.documentElement).getPropertyValue('--font-display') || 'sans-serif';
    const font = sheet.then(() => d.fonts && d.fonts.load('500 1em ' + family));
    Promise.race([font, new Promise((r) => setTimeout(r, 800))]).then(ready, ready);
  }

  /* ---------- Global listeners (bound once) ---------- */

  function bind() {
    if (bound) return;
    bound = true;

    d.addEventListener('click', (e) => {
      const { m } = menuEls();
      if (e.target.closest('.burger')) return setMenu(true);
      if (m && !m.hidden && (e.target === m || e.target.closest('.menu__close, .menu a[href^="#"]'))) setMenu(false);
    });

    d.addEventListener('keydown', (e) => {
      const { m } = menuEls();
      if (!m || m.hidden) return;
      if (e.key === 'Escape') setMenu(false);
      if (e.key === 'Tab') {
        const f = m.querySelectorAll('a, button');
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    if (!reduced) {
      addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(parallax); } }, { passive: true });
    }
  }

  /* ---------- Boot ---------- */

  function init() {
    io.splice(0).forEach((o) => o.disconnect());
    bind(); clock(); reveals(); counters();
    if (!reduced) parallax();
    entrance();
  }

  window.PaceSite = { init };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init);
  else init();
})();
