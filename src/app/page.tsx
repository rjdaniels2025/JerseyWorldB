'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import { featuredProducts } from '@/lib/products'

export default function Home() {
  return (
    <div className="bg-[#111111]">
      {/* Hero — full image placeholder */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Image placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#111] to-[#0d0d0d]">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <svg className="w-96 h-96 text-[#c9a84c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          {/* Gold spotlight effect */}
          <div className="absolute inset-0 bg-radial-gradient" style={{background: 'radial-gradient(ellipse at 50% 60%, rgba(201,168,76,0.08) 0%, transparent 65%)'}} />
        </div>

        {/* Gold top border line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] mb-6">
              Premium Jersey Store
            </p>
            <h1 className="text-6xl md:text-9xl font-black tracking-tight mb-6 leading-none">
              <span className="text-white">JERSEY</span>
              <br />
              <span className="text-[#c9a84c]">WORLD</span>
              <span className="text-white"> B</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl mx-auto">
              Premium jerseys for fans who live the game. Soccer, basketball, and more.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/shop">
                <button className="px-8 py-4 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all duration-300 hover:shadow-lg hover:shadow-[#c9a84c]/30 hover:scale-105 uppercase tracking-wide text-sm">
                  Shop Now
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-8 py-4 border-2 border-[#c9a84c] text-[#c9a84c] font-bold rounded-lg hover:bg-[#c9a84c] hover:text-black transition-all duration-300 uppercase tracking-wide text-sm">
                  Contact Us
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <svg className="w-6 h-6 text-[#c9a84c] opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>

        {/* Gold bottom border line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-30" />
      </section>

      {/* Featured */}
      <section className="py-20 md:py-28 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] mb-3">Hand Picked</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Featured Jerseys</h2>
            <p className="text-gray-400 text-lg">Our most popular picks right now.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} {...product} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/shop">
              <button className="px-8 py-4 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all duration-300 hover:shadow-lg hover:shadow-[#c9a84c]/30 uppercase tracking-wide text-sm">
                View All Jerseys
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Banner */}
      <section className="bg-[#111] border-y border-[#2a2a2a] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] mb-4">Always Competitive</p>
            <h3 className="text-3xl md:text-5xl font-black text-white mb-10">Our Pricing</h3>
            <div className="max-w-lg mx-auto space-y-0 border border-[#c9a84c]/40 rounded-xl overflow-hidden shadow-lg shadow-[#c9a84c]/10">
              {[
                { label: 'Soccer Jerseys', price: '$45' },
                { label: 'Full Soccer Kits', price: '$55' },
                { label: 'Basketball Jerseys', price: '$65' },
                { label: 'Football Jerseys', price: '$65' },
                { label: 'Baseball Jerseys', price: '$65' },
                { label: 'Hockey Jerseys', price: '$75' },
              ].map((item, i) => (
                <div key={i} className={`flex justify-between items-center px-8 py-4 ${i % 2 === 0 ? 'bg-[#1a1a1a]' : 'bg-[#161616]'} border-b border-[#2a2a2a] last:border-0`}>
                  <span className="text-gray-300 font-medium">{item.label}</span>
                  <span className="text-[#c9a84c] font-black text-xl">{item.price}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-2">
              <p className="text-[#c9a84c] font-bold text-sm uppercase tracking-wide">🚚 Free Shipping on 3 or more jerseys!</p>
              <p className="text-[#c9a84c] font-bold text-sm uppercase tracking-wide">🏆 Team Discounts on 10 or more jerseys!</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Us */}
      <section className="bg-[#1a1a1a] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-16 text-center text-white"
          >
            Why Jersey World B
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Premium Quality', desc: 'Every jersey is crafted from high-quality materials built to last.' },
              { title: 'Huge Selection', desc: 'Soccer, basketball, football, baseball, hockey — we carry it all.' },
              { title: 'Custom Options', desc: 'Add your name and number to make it truly yours.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 bg-[#111] border border-[#2a2a2a] rounded-xl hover:border-[#c9a84c]/40 transition-colors"
              >
                <div className="w-16 h-16 bg-[#c9a84c] rounded-full mx-auto mb-6 flex items-center justify-center text-black font-black text-2xl">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
