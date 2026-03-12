'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Tag, Image, Megaphone, Users, MessageSquare, Store } from 'lucide-react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/promotions', label: 'Pricing', icon: Megaphone },
  { href: '/admin/gallery', label: 'Gallery', icon: Users },
  { href: '/admin/leads', label: 'Leads', icon: MessageSquare },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-56 bg-[#111] border-r border-[#222] fixed top-0 left-0 h-full z-40">
        <div className="px-5 py-5 border-b border-[#222]">
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#c9a84c]">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active ? 'bg-[#c9a84c15] text-[#c9a84c]' : 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]'
                }`}>
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="px-3 py-4 border-t border-[#222] space-y-1">
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-[#1a1a1a] transition-all">
            <Store size={16} />
            View Store
          </Link>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#111]/95 backdrop-blur border-b border-[#222] flex items-center justify-between px-4 h-14">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c9a84c]">Admin</p>
        <Link href="/" target="_blank" className="text-xs text-gray-500 flex items-center gap-1.5">
          <Store size={13} /> View Store
        </Link>
      </div>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111]/97 backdrop-blur border-t border-[#222] flex items-center justify-around px-1 h-16 safe-area-pb">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-0 ${
                active ? 'text-[#c9a84c]' : 'text-gray-600'
              }`}>
              <Icon size={18} />
              <span className="text-[9px] font-medium truncate">{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
