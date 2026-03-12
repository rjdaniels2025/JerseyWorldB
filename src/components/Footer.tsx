import Link from 'next/link'
import Image from 'next/image'

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z"/>
  </svg>
)

export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-[#1f1f1f] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-14 pb-14 border-b border-[#2e2d2d]">
          <div className="max-w-xs">
            <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="Jersey World B" width={140} height={40} className="h-12 w-auto object-contain" />
            </Link>
            <p className="text-[#5c5755] text-sm leading-relaxed">Premium jerseys for fans who live the game. Quality, style, and passion in every stitch.</p>
          </div>
          <div className="flex gap-3">
            <a href="https://instagram.com/JerseyWorldB" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-[#3a3838] text-[#a09890] text-sm hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all duration-200">
              <InstagramIcon />
              Instagram
            </a>
            <a href="https://tiktok.com/@JerseyWorldB" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-[#3a3838] text-[#a09890] text-sm hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all duration-200">
              <TikTokIcon />
              TikTok
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {[
            { heading: 'Shop', items: [['All Jerseys','/shop'],['2026 World Cup','/world-cup-2026'],['Fan Gallery','/fan-gallery']] },
            { heading: 'Policies', items: [['Return & Exchange','/returns'],['Shipping Policy','/shipping'],['Product Disclaimer','/disclaimer']] },
            { heading: 'Contact', items: [['Jerseyworldb@gmail.com','mailto:Jerseyworldb@gmail.com'],['647-990-8100','tel:6479908100']] },
            { heading: 'Perks', items: [['Free shipping on 3+ jerseys','/shop'],['Team discounts on 10+','/contact']] },
          ].map(({ heading, items }) => (
            <div key={heading}>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#5c5755] mb-5">{heading}</p>
              <div className="space-y-3">
                {items.map(([label, href]) => (
                  <Link key={label} href={href}
                    className="block text-sm text-[#a09890] hover:text-[#c9a84c] transition-colors duration-200">{label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-[#2e2d2d]">
          <p className="text-[11px] text-[#3a3838]">© 2026 Jersey World B. All rights reserved.</p>
          <Link href="/admin" className="text-[11px] text-[#252424] hover:text-[#3a3838] transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
