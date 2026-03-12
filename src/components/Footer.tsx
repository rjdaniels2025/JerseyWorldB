import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-[#1f1f1f] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-1 mb-4">
              <span className="font-black text-lg text-white">JERSEY</span>
              <span className="font-black text-lg text-[#c9a84c] mx-1">WORLD</span>
              <span className="font-black text-lg text-white">B</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">Premium jerseys for fans who live the game. Quality, style, and passion in every stitch.</p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Shop</h4>
            <div className="space-y-3">
              {[['All Jerseys', '/shop'], ['Soccer', '/shop'], ['Basketball', '/shop'], ['2026 World Cup', '/world-cup-2026']].map(([label, href]) => (
                <Link key={label} href={href} className="block text-sm text-gray-400 hover:text-[#c9a84c] transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Policies</h4>
            <div className="space-y-3">
              {[['Return & Exchange', '/returns'], ['Shipping Policy', '/shipping'], ['Product Disclaimer', '/disclaimer'], ['Fan Gallery', '/fan-gallery']].map(([label, href]) => (
                <Link key={label} href={href} className="block text-sm text-gray-400 hover:text-[#c9a84c] transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Contact</h4>
            <div className="space-y-3">
              <a href="mailto:Jerseyworldb@gmail.com" className="block text-sm text-gray-400 hover:text-[#c9a84c] transition-colors">Jerseyworldb@gmail.com</a>
              <a href="tel:6479908100" className="block text-sm text-gray-400 hover:text-[#c9a84c] transition-colors">647-990-8100</a>
              <a href="https://instagram.com/JerseyWorldB" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-400 hover:text-[#c9a84c] transition-colors">@JerseyWorldB</a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#1f1f1f] pt-8 flex items-center justify-between">
          <p className="text-xs text-gray-600">© 2026 Jersey World B. All rights reserved.</p>
          <Link href="/admin" className="text-xs text-[#222] hover:text-[#444] transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
