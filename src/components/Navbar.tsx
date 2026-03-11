'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  // Hide navbar on all admin pages
  if (pathname?.startsWith('/admin')) return null

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-[#111111]/95 backdrop-blur-md shadow-lg border-b border-[#333]'
        : 'bg-[#111111]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
          <span className="font-black text-xl tracking-tight text-white">JERSEY</span>
          <span className="font-black text-xl tracking-tight text-[#c9a84c] mx-1">WORLD</span>
          <span className="font-black text-xl tracking-tight text-white">B</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {[['/', 'Home'], ['/shop', 'Shop'], ['/contact', 'Contact']].map(([href, label]) => (
            <Link key={href} href={href} className="text-sm font-medium text-gray-300 hover:text-[#c9a84c] transition-colors">{label}</Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/shop">
            <button className="p-2 hover:bg-[#222] rounded-lg transition-colors text-gray-300 hover:text-[#c9a84c]">
              <ShoppingCart size={20} />
            </button>
          </Link>
          <button className="md:hidden p-2 hover:bg-[#222] rounded-lg transition-colors text-gray-300" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[#333] px-4 py-4 bg-[#111]">
          <div className="flex flex-col gap-4">
            {[['/', 'Home'], ['/shop', 'Shop'], ['/contact', 'Contact']].map(([href, label]) => (
              <Link key={href} href={href} className="text-sm font-medium text-gray-300 hover:text-[#c9a84c] transition-colors" onClick={() => setMenuOpen(false)}>{label}</Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
