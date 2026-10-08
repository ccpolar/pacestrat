import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Preview', robots: { index: false, follow: false } }


/** Same head as the public page (src/lib/document.ts), for the admin's live-preview pane. */
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/inter-tight-latin.woff2" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/styles.css" />
        <script src="/site.js" defer />
      </head>
      {/* site.js drives this DOM directly (theme vars, is-ready, reveal
          classes) and now that the font is preloaded it can fire before React
          finishes hydrating, so these attributes legitimately differ. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
