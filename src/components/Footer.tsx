import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-1 mb-4">
              <span className="font-black text-xl tracking-tight">JERSEY</span>
              <span className="font-black text-xl tracking-tight text-gray-400">WORLD</span>
              <span className="font-black text-xl tracking-tight">B</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium jerseys for fans who live the game. Quality, style, and passion in every stitch.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Shop</h4>
            <div className="flex flex-col gap-3">
              <Link href="/shop" className="text-gray-400 text-sm hover:text-white transition-colors">All Jerseys</Link>
              <Link href="/shop?category=soccer" className="text-gray-400 text-sm hover:text-white transition-colors">Soccer</Link>
              <Link href="/shop?category=basketball" className="text-gray-400 text-sm hover:text-white transition-colors">Basketball</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Contact</h4>
            <div className="flex flex-col gap-3 text-gray-400 text-sm">
              <Link href="/contact" className="hover:text-white transition-colors">Get In Touch</Link>
              <span>Free shipping on orders over $100</span>
              <span>30-day returns</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Jersey World B. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
