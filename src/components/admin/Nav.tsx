import type { Payload } from 'payload'

import { getStatus } from '@/lib/admin-data'

import { NavClient, type NavGroup } from './NavClient'

type Props = { payload: Payload; user?: Record<string, any> | null }

const label = (l: unknown, fallback: string) => (typeof l === 'string' ? l : fallback)

/** Sidebar in the style of the reference: logo, user card, grouped links, help card. */
export async function Nav({ payload, user }: Props) {
  const [brand, status] = await Promise.all([
    payload.findGlobal({ slug: 'brand', depth: 1 }).catch(() => null) as Promise<any>,
    getStatus(payload),
  ])

  const drafts = new Set(status.globals.filter((g) => g.hasDraft).map((g) => g.slug))
  const totalDrafts = drafts.size + status.draftProjects
  const g = (slug: string) => {
    const conf = payload.config.globals.find((x) => x.slug === slug)
    return { href: `/admin/globals/${slug}`, label: label(conf?.label, slug), icon: slug, dot: drafts.has(slug) }
  }
  const c = (slug: string, count?: number) => {
    const conf = payload.config.collections.find((x) => x.slug === slug)
    return { href: `/admin/collections/${slug}`, label: label(conf?.labels?.plural, slug), icon: slug, count }
  }

  const groups: NavGroup[] = [
    { items: [{ href: '/admin', label: 'Dashboard', icon: 'dashboard', count: totalDrafts || undefined, exact: true }] },
    {
      title: 'Site',
      items: [
        g('hero'),
        g('pricing'),
        g('proof'),
        g('work'),
        c('projects', status.draftProjects || undefined),
        g('services'),
        g('story'),
        g('process'),
        g('why'),
        g('faq'),
        g('cta'),
        g('footer'),
      ],
    },
    { title: 'Settings', items: [g('brand'), g('theme'), g('layout'), c('media'), c('users')] },
  ]

  let avatar: string | null = null
  if (user?.avatar) {
    const m = typeof user.avatar === 'object' ? user.avatar : await payload.findByID({ collection: 'media', id: user.avatar, depth: 0 }).catch(() => null)
    avatar = (m as any)?.url ?? null
  }

  return (
    <NavClient
      brand={{
        name: brand?.brand?.name || 'Studio',
        mark: brand?.brand?.mark || '',
        logo: typeof brand?.brand?.logo === 'object' ? (brand.brand.logo?.url ?? null) : null,
      }}
      user={{ name: user?.name || user?.email || 'Admin', role: user?.role || 'Admin account', avatar }}
      groups={groups}
    />
  )
}
