/**
 * Loads the site content (src/seed/pace.json + src/seed/assets) into the database.
 * Safe to re-run: it clears projects and media first and overwrites the globals.
 * Existing users are left alone.
 *
 *   npm run seed
 */
import fs from 'fs'
import path from 'path'

import config from '@payload-config'
import { getPayload } from 'payload'

const dir = path.join(process.cwd(), 'src/seed')
const C = JSON.parse(fs.readFileSync(path.join(dir, 'pace.json'), 'utf8'))
const payload = await getPayload({ config })
const log = (m: string) => payload.logger.info(`[seed] ${m}`)
const fullName = [C.brand.name, C.brand.suffix].filter(Boolean).join(' ')

/* ---------- Clear ---------- */
await payload.delete({ collection: 'projects', where: { id: { exists: true } } })
await payload.delete({ collection: 'media', where: { id: { exists: true } } })
log('Cleared projects and media')

/* ---------- Media ---------- */
const upload = async (file: string, alt: string) => {
  if (!file) return null
  const doc = await payload.create({ collection: 'media', data: { alt }, filePath: path.join(dir, file) })
  return doc.id
}
const heroId = await upload(C.hero.image.src, C.hero.image.alt)
const avatarId = await upload(C.story.founder.avatar.src, C.story.founder.avatar.alt)
const ogId = await upload(C.seo.ogImage, `${fullName} social share image`)
const logoId = await upload(C.brand.logo, `${fullName} logo`)
const markId = await upload(C.brand.logoMark, `${fullName} logo mark`)
log('Uploaded images')

/* ---------- Globals (published) ---------- */
const publish = (slug: string, data: Record<string, unknown>) =>
  payload.updateGlobal({ slug: slug as any, data: { ...data, _status: 'published' } as any })

await publish('brand', { brand: { ...C.brand, logo: logoId, logoMark: markId, timezone: C.brand.timezone || null }, seo: { ...C.seo, ogImage: ogId } })
await publish('theme', C.theme)
await publish('layout', {
  sections: C.sections.map((s: { id: string; visible: boolean }) => ({ section: s.id, visible: s.visible })),
  links: C.nav.links,
  ui: C.ui,
})
await publish('hero', { ...C.hero, image: { media: heroId, placeholder: C.hero.image.placeholder } })
await publish('story', {
  ...C.story,
  founder: { ...C.story.founder, avatar: { media: avatarId, placeholder: C.story.founder.avatar.placeholder } },
})
await publish('proof', { ...C.proof, logos: C.proof.logos.map((l: { name: string }) => ({ name: l.name })) })
await publish('work', { label: C.work.label, heading: C.work.heading, intro: C.work.intro })
for (const slug of ['pricing', 'services', 'process', 'why', 'faq', 'cta', 'footer']) await publish(slug, C[slug])
log('Published globals')

/* ---------- Projects ---------- */
for (const p of C.work.projects) {
  await payload.create({
    collection: 'projects',
    data: {
      title: p.title,
      category: p.category,
      year: p.year,
      href: p.href,
      slug: p.id,
      showOnSite: true,
      image: { placeholder: p.image.placeholder },
      _status: 'published',
    } as any,
  })
}
log(`Created ${C.work.projects.length} projects`)

/* ---------- Admin user ---------- */
const email = 'cam@polarcreativegroup.com'
const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
if (!existing.docs.length) {
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!password) throw new Error('Set SEED_ADMIN_PASSWORD in .env before seeding.')
  await payload.create({ collection: 'users', data: { email, password, name: 'Cam', role: 'Admin account' } })
  log(`Created admin user ${email} (password is SEED_ADMIN_PASSWORD in .env)`)
} else {
  log(`Admin user ${email} already exists; left unchanged`)
}

process.exit(0)
