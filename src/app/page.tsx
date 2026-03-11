'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import { featuredProducts } from '@/lib/products'

export default function Home() {
  return (
    <div className="bg-[#111111]">

      {/* Hero — full image placeholder, no text */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1a1a1a]">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

        {/* Image placeholder */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg className="w-24 h-24 text-[#333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-[#333] text-sm mt-3 font-medium tracking-widest uppercase">Hero Image</p>
        </div>

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

      {/* Pricing — image placeholder, no text */}
      <section className="bg-[#111] border-y border-[#2a2a2a] py-0">
        <div className="relative h-[500px] flex items-center justify-center bg-[#161616]">
          <div className="flex flex-col items-center justify-center">
            <svg className="w-24 h-24 text-[#333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-[#333] text-sm mt-3 font-medium tracking-widest uppercase">Section Image</p>
          </div>
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
