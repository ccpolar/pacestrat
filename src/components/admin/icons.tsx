/* Outline icons for the admin (24px grid, 1.6 stroke), in the style of the
   reference sidebar. Decorative: always aria-hidden. */

const paths: Record<string, string> = {
  dashboard: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  hero: 'M4 5h16v14H4zM4 15l4.5-4.5 4 4L15 12l5 5',
  story: 'M4 5.5C6.5 4 9.5 4 12 5.5 14.5 4 17.5 4 20 5.5V19c-2.5-1.5-5.5-1.5-8 0-2.5-1.5-5.5-1.5-8 0zM12 5.5V19',
  proof: 'M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z',
  work: 'M4 8h16v11H4zM9 8V5.5h6V8M4 13h16',
  projects: 'M3.5 7.5V18a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-7.5L10 5.5H4.5a1 1 0 0 0-1 1z',
  services: 'M12 3.5 21 8l-9 4.5L3 8zM3 12.5l9 4.5 9-4.5M3 16.5 12 21l9-4.5',
  process: 'M5 6.5h9a3 3 0 0 1 0 6H10a3 3 0 0 0 0 6h9M5 6.5h0M19 18.5h0',
  faq: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h0',
  cta: 'M4 10v4h3l6 4V6L7 10zM17 9a4 4 0 0 1 0 6',
  footer: 'M4 4h16v16H4zM4 15h16',
  brand: 'M20.5 13.5 13.5 20.5a1.5 1.5 0 0 1-2.1 0L3.5 12.6V3.5h9.1l7.9 7.9a1.5 1.5 0 0 1 0 2.1zM8 8h0',
  theme: 'M12 21a9 9 0 1 1 9-9c0 2-1.5 3-3.5 3H16a2 2 0 0 0-1.5 3.3c.4.5.1 1.2-.5 1.4-.7.2-1.3.3-2 .3zM7.5 11.5h0M10 7.5h0M14.5 7.5h0',
  layout: 'M4 6h16M4 12h16M4 18h10',
  media: 'M7 7V5h13v11h-2M4 8h13v11H4zM4 15.5l3.5-3.5 3 3 2-2 4.5 4.5',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M16 4.3a3.5 3.5 0 0 1 0 6.4M21 20c0-2.5-1.5-4.4-3.8-5.2',
  external: 'M7 17 17 7M9 7h8v8',
  chevronLeft: 'M14.5 6 8.5 12l6 6',
  more: 'M12 6h0M12 12h0M12 18h0',
  moreH: 'M6 12h0M12 12h0M18 12h0',
  help: 'M4 19.5V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H8zM8.5 10.5h0M12 10.5h0M15.5 10.5h0',
  eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  eyeOff: 'M3 3l18 18M10.6 5.6c.5-.1.9-.1 1.4-.1 6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.8 3.6M6.6 6.6C4 8.3 2.5 12 2.5 12S6 18.5 12 18.5c1.8 0 3.3-.6 4.6-1.4',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  pencil: 'M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16zM13.5 6.5l4 4',
  flame: 'M12 21c-3.6 0-6-2.4-6-5.6 0-3.4 3-5 3-8.4 2 1 3.2 2.7 3.5 4.5.9-.6 1.5-1.7 1.6-3C16.8 10.4 18 13 18 15.4 18 18.6 15.6 21 12 21z',
  pin: 'M14.5 3.5l6 6-3 1-3.5 3.5.5 4-2 2-4-4-4.5 4.5M8.5 12.5l-4-4 2-2 4 .5L14 3.5z',
  chart: 'M4 4h16v16H4zM8.5 16v-4M12 16V8M15.5 16v-6',
  plus: 'M12 5v14M5 12h14',
  logout: 'M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4',
  account: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20c.8-3.5 3.8-5.5 7.5-5.5s6.7 2 7.5 5.5',
  bag: 'M5 8h14l-1 12H6zM9 8V6.5a3 3 0 0 1 6 0V8',
  pricing: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM14.8 9.2c-.5-.8-1.5-1.3-2.8-1.3-1.7 0-2.8.9-2.8 2.1 0 2.9 5.7 1.6 5.7 4.3 0 1.2-1.2 2.1-2.9 2.1-1.4 0-2.5-.6-3-1.5M12 6.2v1.7M12 16.4v1.6',
  loading: 'M12 3.5a8.5 8.5 0 1 0 8.5 8.5M12 3.5V8M12 3.5a8.5 8.5 0 0 1 6 2.5',
  why: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 12.5l2.8 2.8L16.5 9.5',
}

export function Icon({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  const d = paths[name] ?? paths.dashboard
  const round = /^(more|moreH)$/.test(name)
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={round ? 2.6 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  )
}

/** Which icon each admin entity uses. */
export const entityIcon: Record<string, string> = {
  hero: 'hero',
  story: 'story',
  proof: 'proof',
  work: 'work',
  projects: 'projects',
  services: 'services',
  process: 'process',
  faq: 'faq',
  cta: 'cta',
  footer: 'footer',
  brand: 'brand',
  theme: 'theme',
  layout: 'layout',
  media: 'media',
  users: 'users',
}
