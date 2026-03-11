import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] border-t border-[#2a2a2a] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-1 mb-4">
              <span className="font-black text-xl text-white">JERSEY</span>
              <span className="font-black text-xl text-[#c9a84c] mx-1">WORLD</span>
              <span className="font-black text-xl text-white">B</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Premium jerseys for fans who live the game. Quality, style, and passion in every stitch.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-[#c9a84c]">Shop</h4>
            <div className="flex flex-col gap-3">
              <Link href="/shop" className="text-gray-500 text-sm hover:text-[#c9a84c] transition-colors">All Jerseys</Link>
              <Link href="/shop?category=soccer" className="text-gray-500 text-sm hover:text-[#c9a84c] transition-colors">Soccer</Link>
              <Link href="/shop?category=basketball" className="text-gray-500 text-sm hover:text-[#c9a84c] transition-colors">Basketball</Link>
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-[#c9a84c]">Info</h4>
            <div className="flex flex-col gap-3 text-gray-500 text-sm">
              <Link href="/contact" className="hover:text-[#c9a84c] transition-colors">Contact Us</Link>
              <span>Free shipping on 3+ jerseys</span>
              <span>Team discounts on 10+ jerseys</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#222] pt-8 flex items-center justify-between">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Jersey World B. All rights reserved.
          </p>
          <Link
            href="/admin"
            className="text-[#333] text-xs hover:text-[#555] transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
