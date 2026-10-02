# content.json schema

`content.json` is the single source of truth for the landing page: all copy, images, theme tokens, and the order and visibility of sections. `script.js` fetches it on load and renders the whole page from it. If the fetch fails (for example when the page is opened over `file://`), it uses the copy embedded in `index.html` inside `<script type="application/json" id="content-fallback">`.

> **Keep the two copies identical.** Whatever writes `content.json` (a person or the CMS) must also write the fallback block in `index.html`.

---

## Conventions

| Rule | Detail |
|---|---|
| Strings | Plain text only. All strings are HTML-escaped before rendering, so markup in content shows up as literal text. |
| URLs (`href`, `src`) | Relative paths, `#anchors`, `http(s):`, `mailto:` and `tel:` are allowed. Any other scheme (e.g. `javascript:`) is replaced with `#`. `http(s)` links open in a new tab with `rel="noopener"`. |
| Section anchors | Each section renders with `id` equal to its `sections[].id`, so `"#work"`, `"#faq"` and so on are valid in-page links. |
| Colors | Any CSS color string; hex is recommended. |
| Optional fields | Marked *optional* below. If one is missing or empty, its element is not rendered. |

### Shared types

**`Link`**
```json
{ "label": "Start a project", "href": "mailto:hello@namestudio.co" }
```

**`Image`**
```json
{
  "src": "assets/hero.svg",
  "alt": "Motion-blurred portrait lit in warm red light",
  "width": 1600,
  "height": 1000,
  "placeholder": "radial-gradient(80% 90% at 60% 40%, #3a1208 0%, #0B0B0B 70%)"
}
```
| Field | Type | Notes |
|---|---|---|
| `src` | string | Image path or URL. If empty, `placeholder` is rendered instead. |
| `alt` | string | Required for meaningful images. An empty string marks the image as decorative. |
| `width`, `height` | number | Intrinsic pixel size, used for the `width`/`height` attributes and aspect ratio (prevents layout shift). |
| `placeholder` | string | *Optional.* A CSS `linear-`, `radial-` or `conic-gradient(...)`, shown when `src` is empty. Any other value falls back to `theme.grey`. |

Images are lazy-loaded, except `hero.image`, which loads eagerly with `fetchpriority="high"`.

---

## Top-level keys

### `meta`
| Field | Type | Notes |
|---|---|---|
| `version` | string | Semver of the content document, e.g. `"1.0.0"`. |
| `lastEdited` | string | ISO 8601 timestamp. |

### `theme`
Applied at runtime as CSS custom properties on `:root`.

| Field | Type | CSS var | Default |
|---|---|---|---|
| `accent` | color | `--accent` | `#FF3B0F` |
| `dark` | color | `--dark` (also sets `<meta name="theme-color">`) | `#0B0B0B` |
| `light` | color | `--light` | `#EDEDEB` |
| `card` | color | `--card` | `#FFFFFF` |
| `grey` | color | `--grey` | `#8C8C8C` |
| `fontDisplay` | CSS font stack | `--font-display` | Neue Haas Grotesk Display → Inter Tight → Helvetica Neue → Arial |
| `fontBody` | CSS font stack | `--font-body` | Neue Haas Grotesk Text → Inter Tight → Helvetica Neue → Arial |
| `radius` | number (px) | `--radius` | `24` |

Derived tokens: card radius is `radius × 0.6`. Text greys are mixed from `grey` toward `dark` so they keep AA contrast on `light`. If you change colors, re-check contrast: text on `accent` buttons uses `dark`.

### `seo`
| Field | Type | Notes |
|---|---|---|
| `lang` | string | BCP 47 language tag; sets `<html lang>` and the clock's locale. |
| `title` | string | `<title>` and `og:title`. |
| `description` | string | Meta description and `og:description`. |
| `ogImage` | string | `og:image`. Social platforms need a 1200×630 PNG or JPG. The bundled SVG is only a placeholder. |

### `brand`
| Field | Type | Notes |
|---|---|---|
| `name` | string | Logo, footer wordmark, fallback `<h1>`. |
| `suffix` | string | Appended after `name` in the footer logo and screen-reader text, e.g. `"Studio"`. |
| `mark` | string | Accent-colored superscript after wordmarks, e.g. `"®"`. |
| `tagline` | string | Footer blurb. |
| `email` | string | Top bar, CTA band, menu, footer (rendered as `mailto:`). |
| `location` | string | Top bar and footer. |
| `timezone` | string | IANA zone for the live clock, e.g. `"America/New_York"`. An invalid zone falls back to the visitor's local time. |
| `availability.active` | boolean | Shows the pulsing dot and label when `true`. |
| `availability.label` | string | e.g. `"Available for new project"`. |

### `nav`
| Field | Type | Notes |
|---|---|---|
| `links` | `Link[]` | Items in the hamburger menu. Links to `#id` are hidden automatically when that section is hidden. |

### `hero`
| Field | Type | Notes |
|---|---|---|
| `image` | `Image` | Full-bleed hero image. Also used, blurred and darkened, as the page backdrop behind the device frame. **Also update the `<link rel="preload" as="image">` href in `index.html`.** |
| `headline1` | string | First wordmark line. |
| `headline2` | string | Second, indented wordmark line; `brand.mark` is appended to it. |
| `descriptor` | string | Paragraph above the CTA. |
| `cta` | `Link` | Accent pill button. |
| `rating.score` | number | 0–5; one decimal is shown and stars are rounded. |
| `rating.source` | string | Review source name (reference only; not rendered). |
| `rating.label` | string | e.g. `"Based on Google Reviews"`. |
| `copyright` | string | Bottom-left, e.g. `"©2026"`. |

### `story`
| Field | Type | Notes |
|---|---|---|
| `label` | string | Section label (the section's `<h2>`). |
| `founder.name` | string | |
| `founder.title` | string | |
| `founder.avatar` | `Image` | Rendered as a 48px circle; supply at least 96×96. |
| `statement` | string | Large statement headline. |
| `statementMuted` | string | Final phrase, rendered in grey right after `statement`. |
| `button` | `Link` | Outline pill, e.g. "About us". |

### `proof`
| Field | Type | Notes |
|---|---|---|
| `label` | string | Section label. |
| `stat.label` | string | Card eyebrow, e.g. `"Client retention"`. |
| `stat.value` | number | Target of the count-up animation; decimals are preserved (`4.8` counts to `4.8`). |
| `stat.suffix` | string | Accent-colored unit, e.g. `"%"`. |
| `stat.caption` | string | *Optional* line under the number. |
| `testimonial.quote` | string | Without quote marks; the accent glyph is added. |
| `testimonial.name` | string | |
| `testimonial.company` | string | Role and/or company line. |
| `logosLabel` | string | Logo card eyebrow, e.g. `"Trusted by"`. |
| `logos` | `{ name, src }[]` | Designed for 6. With an empty `src`, `name` renders as a text wordmark; otherwise `src` renders as an image with `name` as its alt text. |

### `work`
| Field | Type | Notes |
|---|---|---|
| `label` | string | Section label. |
| `heading` | string | *Optional* display heading. |
| `projects` | `Project[]` | Two-column grid (one column under 768px). An even count looks best. |

**`Project`**
| Field | Type | Notes |
|---|---|---|
| `id` | string | Unique slug; renders as `id="project-{id}"`. |
| `title` | string | |
| `category` | string | e.g. `"Brand identity · Website"`. |
| `year` | string | String, to allow values like `"2025–26"`. |
| `image` | `Image` | 4:3 crop. |
| `href` | string | Case study URL or anchor. |

### `services`
| Field | Type | Notes |
|---|---|---|
| `label` | string | Section label. |
| `heading` | string | *Optional* sticky display heading (left column). |
| `items` | `{ title, description }[]` | Numbered rows; numbers are generated automatically. |

### `process`
| Field | Type | Notes |
|---|---|---|
| `label` | string | Section label. |
| `heading` | string | *Optional* display heading. |
| `steps` | `{ title, description }[]` | Designed for 4 (4 → 2 → 1 columns). |

### `faq`
| Field | Type | Notes |
|---|---|---|
| `label` | string | Section label. |
| `heading` | string | *Optional* sticky display heading. |
| `items` | `{ q, a }[]` | Native `<details>` accordion. The first item starts open, and only one is open at a time. |

### `cta`
| Field | Type | Notes |
|---|---|---|
| `label` | string | Section label inside the dark band. |
| `headline` | string | Large headline; around 45 characters is ideal. |
| `button` | `Link` | Accent pill. `brand.email` is shown next to it. |

### `footer`
| Field | Type | Notes |
|---|---|---|
| `links` | `Link[]` | Sitemap column. |
| `socials` | `Link[]` | Social column; also listed in the menu. |
| `legal` | string | Bottom-left legal line. |

### `ui`
Interface micro-copy and accessibility labels, kept here so that every visible or announced string comes from content.

| Field | Example | Used for |
|---|---|---|
| `skipToContent` | `"Skip to content"` | Skip link. |
| `menuOpen` / `menuClose` | `"Open menu"` / `"Close menu"` | Hamburger and close-button labels. |
| `menuTitle` | `"Menu"` | Menu dialog heading. |
| `localTime` | `"Local time in"` | Screen-reader prefix for the clock. |
| `ratingOutOf` | `"{score} out of 5 stars"` | Star rating label. `{score}` is replaced. |
| `counter` | `"(+ {n})"` | Section counters. `{n}` is the 2-digit position among visible sections. |
| `motif` | `"/////"` | Decorative slash motif (hidden from screen readers). |
| `viewProject` | `"View project"` | Screen-reader suffix on project links. |
| `backToTop` | `"Back to top"` | Footer link. |
| `footerLinksTitle` / `footerSocialsTitle` / `footerContactTitle` | `"Sitemap"` / `"Follow"` / `"Say hello"` | Footer column headings. |

### `sections`
Controls **order** and **visibility**.

```json
[
  { "id": "hero", "visible": true },
  { "id": "story", "visible": true },
  { "id": "proof", "visible": true },
  { "id": "work", "visible": true },
  { "id": "services", "visible": true },
  { "id": "process", "visible": true },
  { "id": "faq", "visible": true },
  { "id": "cta", "visible": true },
  { "id": "footer", "visible": true }
]
```

| Field | Type | Notes |
|---|---|---|
| `id` | enum | `hero` · `story` · `proof` · `work` · `services` · `process` · `faq` · `cta` · `footer`. Unknown IDs are ignored. |
| `visible` | boolean | `false` removes the section and its menu links. |

Rendering rules:
- Sections render in array order. A section renders only if it is `visible` **and** its content key exists.
- `footer` is always rendered last, outside `<main>`, wherever it appears in the array.
- `(+ 01)` counters are assigned in render order, so hiding or reordering renumbers them.
- The top bar overlays the hero when `hero` is first. Otherwise it renders as a static light bar, and a visually hidden `<h1>` is added from `brand.name` + `brand.suffix`.

---

## Notes for the CMS build

1. **Write both copies.** Publishing must update `content.json` and the fallback block in `index.html`. The easiest way is to regenerate the block from the saved JSON.
2. **Keep the hero preload in sync.** `index.html` preloads `assets/hero.svg`. Rewrite that `href` when `hero.image.src` changes.
3. **SEO and social previews.** Titles and OG tags are set client-side. Google renders JS, but most social scrapers don't. For reliable link previews, have the publish step write `seo.*` into the static `<head>`.
4. **Validation worth enforcing:** `alt` on every non-decorative image; `width`/`height` > 0; unique `project.id`; `sections[].id` unique and from the enum; `rating.score` between 0 and 5; `placeholder` restricted to CSS gradients.

---

## Additions in v1.1 (Pace content)

These fields and sections were added to the admin and to the `/content.json` shape. Everything above still applies.

| Where | Field | Type | Notes |
|---|---|---|---|
| `brand` | `logo` | `Image` | Long-form logo. Replaces the text logo in the top bar and footer, and the hero wordmark when `hero.wordmarkStyle` is `logo`. Rendered as a CSS mask in the current text colour, so one SVG or transparent PNG works on light and dark sections. |
| `brand` | `logoMark` | `Image` | Short-form mark (admin, tight spaces). |
| `brand` | `location`, `timezone` | string | Now optional. An empty location hides it; an empty timezone hides the live clock. |
| `hero` | `wordmarkStyle` | `"logo"` \| `"text"` | `logo` draws `brand.logo` as the big wordmark; `text` uses `headline1`/`headline2`. |
| `hero.rating` | `show` | boolean | `false` hides the Google rating pill. Only show a real rating. |
| `story.founder` | `name` | string | Now optional; empty hides the founder chip. |
| `proof.stat` | `prefix` | string | Before the number, e.g. `$`. |
| `proof.stat` | `more` | `{ value, label }[]` | Up to 4 supporting figures listed under the big number. |
| `work` | `intro` | string | Optional paragraph under the heading. |
| `services.items[]` | `tags` | string | Optional small line under the description. |
| `cta` | `body` | string | Optional line under the headline. |
| `footer` | `links`, `socials` | `Link[]` | An empty list hides that footer column. |

### New sections

**`pricing`**: `{ label, heading, statement, statementMuted, note: { title, body }, button: Link }`. Split layout: the heading on the left, and the statement, note card and button on the right.

**`why`**: `{ label, heading, items: { title, description }[] }`. A 2×2 card grid (1 column on phones), designed for 4 items.

`sections[].id` now also accepts `pricing` and `why`.
