'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Tag, Image, Megaphone, Users, LogOut, ExternalLink, Camera } from 'lucide-react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/promotions', label: 'Pricing', icon: Megaphone },
  { href: '/admin/gallery', label: 'Fan Gallery', icon: Camera },
  { href: '/admin/leads', label: 'Leads', icon: Users },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 flex-shrink-0 bg-[#0f0f0f] border-r border-[#1f1f1f] flex flex-col h-full">
      <div className="p-6 border-b border-[#1f1f1f]">
        <Link href="/" className="flex items-center gap-1">
          <span className="font-black text-sm text-white">JERSEY</span>
          <span className="font-black text-sm text-[#c9a84c] mx-0.5">WORLD</span>
          <span className="font-black text-sm text-white">B</span>
        </Link>
        <p className="text-xs text-gray-600 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active ? 'bg-[#c9a84c] text-black' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
              }`}>
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#1f1f1f] space-y-1">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-white hover:bg-[#1a1a1a] transition-all">
          <ExternalLink size={16} /> View Store
        </Link>
        <Link href="/admin/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-white hover:bg-[#1a1a1a] transition-all">
          <LogOut size={16} /> Sign Out
        </Link>
      </div>
    </aside>
  )
}
