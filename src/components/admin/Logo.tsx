import type { Payload } from 'payload'

/** Brand logo (or wordmark) for the login screen, read from Brand & SEO. */
export async function Logo({ payload }: { payload: Payload }) {
  const brand = (await payload.findGlobal({ slug: 'brand', depth: 1 }).catch(() => null)) as any
  const b = brand?.brand ?? {}
  const logo = typeof b.logo === 'object' ? b.logo?.url : null
  return (
    <span className="studio-logo">
      {logo ? (
        <span
          className="studio-logo-mask studio-logo-mask--lg"
          role="img"
          aria-label={[b.name, b.suffix].filter(Boolean).join(' ')}
          style={{ ['--logo' as string]: `url("${logo}")` }}
        />
      ) : (
        <>
          {b.name || 'Studio'}
          {b.mark && <sup>{b.mark}</sup>}
        </>
      )}
      <small>Admin</small>
    </span>
  )
}

/** Small mark used where Payload shows its icon (breadcrumbs). */
export function Mark() {
  return <span className="studio-mark" aria-hidden="true" />
}
