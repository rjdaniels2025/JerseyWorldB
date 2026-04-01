'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Menu, X } from 'lucide-react'
import Image from 'next/image'

const links = [
  ['/', 'Home'],
  ['/shop', 'Shop'],
  ['/world-cup-2026', '🏆 World Cup'],
  ['/custom-designs', 'Custom Designs'],
  ['/team-packages', 'Team Packages'],
  ['/fan-gallery', 'Fan Gallery'],
  ['/contact', 'Contact'],
]

const TikTokIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

function NavbarInner() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  if (pathname?.startsWith('/admin')) return null

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#161515]/96 backdrop-blur-xl border-b border-[#2e2d2d] shadow-[0_4px_30px_#00000060]'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16 sm:h-[68px]">
          <Link href="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
            <Image src="/logo.png" alt="Jersey World B" width={160} height={44}
              className="h-10 sm:h-14 w-auto object-contain" priority />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(([href, label]) => {
              const active = pathname === href
              return (
                <Link key={href} href={href}
                  className={`px-3 py-2 rounded-lg text-[13px] font-medium tracking-wide transition-all duration-200 ${
                    active ? 'text-[#c9a84c] bg-[#c9a84c12]' : 'text-[#a09890] hover:text-[#f0ede8] hover:bg-[#ffffff08]'
                  }`}>
                  {label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-1">
            <Link href="/shop">
              <button className="p-2.5 rounded-xl text-[#a09890] hover:text-[#c9a84c] hover:bg-[#c9a84c12] transition-all duration-200">
                <ShoppingCart size={18} />
              </button>
            </Link>
            <button
              className="md:hidden p-2.5 rounded-xl text-[#a09890] hover:text-[#f0ede8] hover:bg-[#ffffff08] transition-all"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-40 bg-[#161515]/98 backdrop-blur-xl flex flex-col pt-20 px-5 pb-8 md:hidden">
          <nav className="flex flex-col gap-2 flex-1">
            {links.map(([href, label]) => {
              const active = pathname === href
              return (
                <Link key={href} href={href}
                  className={`px-5 py-4 rounded-2xl text-lg font-semibold transition-all ${
                    active ? 'text-[#c9a84c] bg-[#c9a84c10]' : 'text-[#f0ede8] hover:bg-[#ffffff08]'
                  }`}
                  onClick={() => setOpen(false)}>
                  {label}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-[#2e2d2d] pt-6 space-y-2">
            <a href="https://instagram.com/JerseyWorldB" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-xl text-[#a09890] text-sm hover:text-[#c9a84c] transition-colors">
              <InstagramIcon /> @JerseyWorldB
            </a>
            <a href="https://tiktok.com/@JerseyWorldB" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-xl text-[#a09890] text-sm hover:text-[#c9a84c] transition-colors">
              <TikTokIcon /> @JerseyWorldB
            </a>
          </div>
        </div>
      )}
    </>
  )
}

export default function Navbar() {
  return <Suspense fallback={null}><NavbarInner /></Suspense>
}
