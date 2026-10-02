import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Preview', robots: { index: false, follow: false } }

const FONTS = 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&display=swap'

/** Same head as the public page (src/lib/document.ts), for the admin's live-preview pane. */
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
        <link id="font-css" rel="stylesheet" href={FONTS} />
        <link rel="stylesheet" href="/styles.css" />
        <script src="/site.js" defer />
      </head>
      <body>{children}</body>
    </html>
  )
}
