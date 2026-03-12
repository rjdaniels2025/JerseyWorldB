import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-[#1f1f1f] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-14 pb-14 border-b border-[#2e2d2d]">
          <div className="max-w-xs">
            <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="Jersey World B" width={140} height={40} className="h-9 w-auto object-contain" />
            </Link>
            <p className="text-[#5c5755] text-sm leading-relaxed">Premium jerseys for fans who live the game. Quality, style, and passion in every stitch.</p>
          </div>
          <div className="flex gap-3">
            <a href="https://instagram.com/JerseyWorldB" target="_blank" rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl border border-[#3a3838] text-[#a09890] text-sm hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all duration-200">
              Instagram
            </a>
            <a href="https://tiktok.com/@JerseyWorldB" target="_blank" rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl border border-[#3a3838] text-[#a09890] text-sm hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all duration-200">
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
