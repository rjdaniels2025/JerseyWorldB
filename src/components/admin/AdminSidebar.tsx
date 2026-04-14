'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, Tag, Image, Megaphone, Users, ShoppingBag, Store, Paintbrush, Settings, LogOut, ChevronDown, Layers, Ruler, Star } from 'lucide-react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/bulk-upload', label: 'Bulk Upload', icon: Layers },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/promotions', label: 'Pricing', icon: Megaphone },
  { href: '/admin/gallery', label: 'Fan Gallery', icon: Users },
  { href: '/admin/custom-designs', label: 'Custom Designs', icon: Paintbrush },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/team-packages', label: 'Team Packages', icon: Store },
  { href: '/admin/size-charts', label: 'Size Charts', icon: Ruler },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('jwb_admin_auth')
    router.push('/admin/login')
  }

  const currentPage = links.find(l => l.href === pathname)?.label ?? 'Admin'

  return (
    <>
      {/* Desktop sidebar */}
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
          <Link href="/admin/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              pathname === '/admin/settings' ? 'bg-[#c9a84c15] text-[#c9a84c]' : 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]'
            }`}>
            <Settings size={16} /> Settings
          </Link>
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-[#1a1a1a] transition-all">
            <Store size={16} /> View Store
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-[#1a1a1a] transition-all">
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#111]/95 backdrop-blur border-b border-[#222] flex items-center justify-between px-4 h-14">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c9a84c]">{currentPage}</p>

        <div className="flex items-center gap-2">
          <Link href="/" target="_blank" className="text-xs text-gray-500 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#1a1a1a] transition-all">
            <Store size={13} />
          </Link>

          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-xs font-medium">
              Menu <ChevronDown size={13} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden z-50">
                {links.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href
                  return (
                    <Link key={href} href={href}
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-all ${
                        active ? 'text-[#c9a84c] bg-[#c9a84c10]' : 'text-gray-400 hover:text-white hover:bg-[#222]'
                      }`}>
                      <Icon size={15} />
                      {label}
                    </Link>
                  )
                })}
                <div className="border-t border-[#2a2a2a]">
                  <Link href="/admin/settings"
                    onClick={() => setDropdownOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-all ${
                      pathname === '/admin/settings' ? 'text-[#c9a84c] bg-[#c9a84c10]' : 'text-gray-400 hover:text-white hover:bg-[#222]'
                    }`}>
                    <Settings size={15} /> Settings
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-red-400 hover:bg-[#222] transition-all">
                    <LogOut size={15} /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
