/**
 * Regenerates the resized WebP variants for media uploaded before the
 * imageSizes config existed. Payload only builds variants at upload time, so
 * existing files keep being served at full resolution until they're re-put
 * through the pipeline.
 *
 *   npx payload run scripts/regenerate-sizes.ts          # report only
 *   npx payload run scripts/regenerate-sizes.ts --write  # actually regenerate
 *
 * Non-destructive: it re-uploads each original over its own document, so the
 * filename, alt text and every relationship pointing at it are preserved.
 * SVGs are skipped — sharp has nothing useful to do with them here.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

const write = process.argv.includes('--write')
const payload = await getPayload({ config })

const all = await payload.find({ collection: 'media', limit: 500, pagination: false, depth: 0 })
let done = 0

for (const doc of all.docs as any[]) {
  const variants = Object.values(doc.sizes ?? {}).filter((s: any) => s?.filename)
  const isSvg = (doc.mimeType || '').includes('svg')
  const label = `${doc.filename} (${doc.width ?? '?'}x${doc.height ?? '?'}, ${Math.round((doc.filesize ?? 0) / 1024)}KB)`

  if (isSvg) {
    console.log(`skip  ${label} — vector`)
    continue
  }
  if (variants.length) {
    console.log(`ok    ${label} — ${variants.length} variants already`)
    continue
  }
  if (!write) {
    console.log(`TODO  ${label} — no variants`)
    continue
  }

  // Pull the original back out of storage and hand it to Payload again; the
  // upload hooks rebuild every configured size from it.
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/media/file/${encodeURIComponent(doc.filename)}`)
  if (!res.ok) {
    console.log(`FAIL  ${label} — could not fetch original (${res.status})`)
    continue
  }
  const data = Buffer.from(await res.arrayBuffer())
  await payload.update({
    collection: 'media',
    id: doc.id,
    data: {},
    file: { data, mimetype: doc.mimeType, name: doc.filename, size: data.length },
  })
  const after = await payload.findByID({ collection: 'media', id: doc.id, depth: 0 })
  console.log(`done  ${label} → ${Object.values((after as any).sizes ?? {}).filter((s: any) => s?.filename).length} variants`)
  done++
}

console.log(write ? `\nRegenerated ${done} file(s).` : '\nReport only. Re-run with --write to regenerate.')
process.exit(0)
