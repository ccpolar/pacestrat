'use client'

import { Link, useNav } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { Icon } from './icons'

export type NavItem = { href: string; label: string; icon: string; count?: number; dot?: boolean; exact?: boolean }
export type NavGroup = { title?: string; items: NavItem[] }

type Props = {
  brand: { name: string; mark: string; logo: string | null }
  user: { name: string; role: string; avatar: string | null }
  groups: NavGroup[]
}

const initials = (s: string) => s.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()

export function NavClient({ brand, user, groups }: Props) {
  const pathname = usePathname()
  const { navOpen, setNavOpen, navRef, hydrated, shouldAnimate } = useNav()
  const [menu, setMenu] = useState(false)
  const [desktop, setDesktop] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Payload treats ≤1440px as "small" and starts its sidebar closed. Above
  // 1024px this layout keeps a permanent sidebar instead (forced in admin.css),
  // with its own remembered collapse state. Below that, Payload's overlay
  // behaviour (navOpen) is used unchanged.
  useEffect(() => {
    const mq = matchMedia('(min-width: 1025px)')
    const sync = () => setDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    try {
      setCollapsed(localStorage.getItem('studio-nav') === 'collapsed')
    } catch {}
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.studioNav = collapsed ? 'collapsed' : 'open'
    try {
      localStorage.setItem('studio-nav', collapsed ? 'collapsed' : 'open')
    } catch {}
  }, [collapsed])

  const close = () => (desktop ? setCollapsed(true) : setNavOpen(false))
  const hidden = desktop ? collapsed : !navOpen

  // Close the account menu on outside click / Escape.
  useEffect(() => {
    if (!menu) return
    const onDown = (e: MouseEvent) => !menuRef.current?.contains(e.target as Node) && setMenu(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [menu])

  const isActive = (item: NavItem) => (item.exact ? pathname === item.href : pathname.startsWith(item.href))

  const cls = ['nav', 'studio-nav', navOpen && 'nav--nav-open', shouldAnimate && 'nav--nav-animate', hydrated && 'nav--nav-hydrated']
    .filter(Boolean)
    .join(' ')

  return (
    <>
    {/* Outside the (inert when collapsed) sidebar, and fixed-position so it
        doesn't take a column in Payload's grid. Shown only when collapsed. */}
    <button type="button" className="studio-round studio-reopen" onClick={() => setCollapsed(false)} aria-label="Show sidebar">
      <Icon name="layout" size={18} />
    </button>
    <aside className={cls} inert={hidden || undefined}>
      <div className="nav__scroll studio-nav__scroll" ref={navRef}>
        <div className="studio-nav__top">
          <Link href="/admin" className="studio-nav__logo" aria-label={`${brand.name} admin home`}>
            {brand.logo ? (
              <span className="studio-logo-mask" style={{ ['--logo' as string]: `url("${brand.logo}")` }} />
            ) : (
              <>
                {brand.name}
                {brand.mark && <sup>{brand.mark}</sup>}
              </>
            )}
          </Link>
          <button type="button" className="studio-round" onClick={close} aria-label="Collapse sidebar">
            <Icon name="chevronLeft" size={18} />
          </button>
        </div>

        <div className="studio-user" ref={menuRef}>
          {user.avatar ? (
            <img className="studio-user__avatar" src={user.avatar} alt="" width={40} height={40} />
          ) : (
            <span className="studio-user__avatar studio-user__avatar--initials" aria-hidden="true">{initials(user.name)}</span>
          )}
          <span className="studio-user__text">
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </span>
          <button
            type="button"
            className="studio-user__more"
            aria-label="Account menu"
            aria-expanded={menu}
            aria-haspopup="menu"
            onClick={() => setMenu((m) => !m)}
          >
            <Icon name="more" size={18} />
          </button>
          {menu && (
            <div className="studio-menu" role="menu">
              <Link role="menuitem" href="/admin/account" onClick={() => setMenu(false)}>
                <Icon name="account" size={18} /> Account
              </Link>
              <Link role="menuitem" href="/admin/logout">
                <Icon name="logout" size={18} /> Log out
              </Link>
            </div>
          )}
        </div>

        <nav className="studio-nav__links" aria-label="Admin">
          {groups.map((group, gi) => (
            <div className="studio-nav__group" key={gi}>
              {group.title && <p className="studio-nav__title">{group.title}</p>}
              <ul>
                {group.items.map((item) => {
                  const active = isActive(item)
                  return (
                    <li key={item.href}>
                      <Link href={item.href} className={`studio-link${active ? ' is-active' : ''}`} aria-current={active ? 'page' : undefined}>
                        <Icon name={item.icon} />
                        <span className="studio-link__label">{item.label}</span>
                        {item.count ? (
                          <span className="studio-badge">
                            {item.count}
                            <span className="sr-only"> unpublished {item.count === 1 ? 'change' : 'changes'}</span>
                          </span>
                        ) : item.dot ? (
                          <span className="studio-dot" title="Unpublished changes">
                            <span className="sr-only">Unpublished changes</span>
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="studio-nav__bottom">
          <a className="studio-nav__row" href="/" target="_blank" rel="noopener">
            <span>View live site</span>
            <span className="studio-round studio-round--light" aria-hidden="true">
              <Icon name="external" size={16} />
            </span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link href="/admin/guide" className="studio-help">
            <span className="studio-help__icon" aria-hidden="true">
              <Icon name="help" size={22} />
            </span>
            <strong>Need help?</strong>
            <span>Read the editing guide</span>
          </Link>
        </div>
      </div>
    </aside>
    </>
  )
}
