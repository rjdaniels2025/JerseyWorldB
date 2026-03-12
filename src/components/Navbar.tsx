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
  ['/fan-gallery', 'Fan Gallery'],
  ['/contact', 'Contact'],
]

function NavbarInner() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close menu on route change
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
            <Image
              src="/logo.png"
              alt="Jersey World B"
              width={160}
              height={44}
              className="h-10 sm:h-14 w-auto object-contain"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(([href, label]) => {
              const active = pathname === href
              return (
                <Link key={href} href={href}
                  className={`px-4 py-2 rounded-lg text-[13px] font-medium tracking-wide transition-all duration-200 ${
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

      {/* Mobile menu, full screen overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-[#161515]/98 backdrop-blur-xl flex flex-col pt-20 px-5 pb-8 md:hidden">
          <nav className="flex flex-col gap-2 flex-1">
            {links.map(([href, label]) => {
              const active = pathname === href
              return (
                <Link key={href} href={href}
                  className={`px-5 py-4 rounded-2xl text-lg font-semibold transition-all ${
                    active
                      ? 'text-[#c9a84c] bg-[#c9a84c10]'
                      : 'text-[#f0ede8] hover:bg-[#ffffff08]'
                  }`}
                  onClick={() => setOpen(false)}>
                  {label}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-[#2e2d2d] pt-6 space-y-3">
            <a href="https://instagram.com/JerseyWorldB" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-xl text-[#a09890] text-sm">
              Instagram @JerseyWorldB
            </a>
            <a href="tel:6479908100"
              className="flex items-center gap-3 px-5 py-3 rounded-xl text-[#a09890] text-sm">
              647-990-8100
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
