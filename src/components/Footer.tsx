import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-20">
      <div className="container-max py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1 - Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-black rounded-lg" />
              <span className="font-bold text-lg">LEGENDS</span>
            </div>
            <p className="text-sm text-secondary leading-relaxed">
              Premium jerseys for fans who live the game. Quality, style, and passion in every stitch.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-secondary hover:text-black transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-sm text-secondary hover:text-black transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-secondary hover:text-black transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wide">Contact</h4>
            <ul className="space-y-3">
              <li className="text-sm text-secondary">
                <span className="font-medium">Email:</span><br />
                hello@legends.com
              </li>
              <li className="text-sm text-secondary">
                <span className="font-medium">Phone:</span><br />
                +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8">
          <p className="text-center text-sm text-secondary">
            &copy; 2024 Legends Jersey Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
