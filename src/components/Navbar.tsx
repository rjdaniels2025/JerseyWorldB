'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, User, ShoppingCart } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border'
          : 'bg-white'
      }`}
    >
      <div className="container-max flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-black rounded-lg" />
          <span className="hidden sm:inline">LEGENDS</span>
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-12">
          <Link href="/" className="text-sm font-medium hover:text-secondary transition-colors">
            Home
          </Link>
          <Link href="/shop" className="text-sm font-medium hover:text-secondary transition-colors">
            Shop
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-secondary transition-colors">
            Contact
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="p-2 hover:bg-border rounded-lg transition-colors" aria-label="Search">
            <Search size={20} className="text-black" />
          </button>
          <button className="p-2 hover:bg-border rounded-lg transition-colors" aria-label="Account">
            <User size={20} className="text-black" />
          </button>
          <button className="p-2 hover:bg-border rounded-lg transition-colors relative" aria-label="Cart">
            <ShoppingCart size={20} className="text-black" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full" />
          </button>
        </div>
      </div>

      {/* Mobile menu - simple version */}
      <div className="md:hidden border-t border-border px-4 py-4 bg-white">
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-sm font-medium">
            Home
          </Link>
          <Link href="/shop" className="text-sm font-medium">
            Shop
          </Link>
          <Link href="/contact" className="text-sm font-medium">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  )
}
