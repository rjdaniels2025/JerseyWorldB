'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="font-black text-xl tracking-tight">JERSEY</span>
          <span className="font-black text-xl tracking-tight text-gray-400">WORLD</span>
          <span className="font-black text-xl tracking-tight">B</span>
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-sm font-medium hover:text-gray-500 transition-colors">Home</Link>
          <Link href="/shop" className="text-sm font-medium hover:text-gray-500 transition-colors">Shop</Link>
          <Link href="/contact" className="text-sm font-medium hover:text-gray-500 transition-colors">Contact</Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <Link href="/shop">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Cart">
              <ShoppingCart size={20} />
            </button>
          </Link>
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 py-4 bg-white">
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-sm font-medium" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/shop" className="text-sm font-medium" onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link href="/contact" className="text-sm font-medium" onClick={() => setMenuOpen(false)}>Contact</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
