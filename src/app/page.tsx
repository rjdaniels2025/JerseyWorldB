'use client'
import { featuredProducts } from '@/lib/products'


import Link from 'next/link'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'



export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-gray-400 mb-6">
              Premium Jersey Store
            </p>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 leading-none">
              JERSEY<br />
              <span className="text-gray-300">WORLD</span> B
            </h1>
            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-xl mx-auto">
              Premium jerseys for fans who live the game. Soccer, basketball, and more.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/shop">
                <button className="px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  Shop Now
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-8 py-4 border-2 border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition-all duration-300">
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
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Featured */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">Featured Jerseys</h2>
            <p className="text-gray-500 text-lg">Our most popular picks right now.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} {...product} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/shop">
              <button className="px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 hover:shadow-lg">
                View All Jerseys
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-5xl font-black mb-4">Free Shipping</h3>
            <p className="text-xl text-gray-400 mb-8">On all orders over $100</p>
            <Link href="/shop">
              <button className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105">
                Shop Now
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Us */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-16 text-center"
          >
            Why Jersey World B
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Premium Quality', desc: 'Every jersey is crafted from high-quality materials built to last.' },
              { title: 'Huge Selection', desc: 'Soccer, basketball, and more — we carry the teams you love.' },
              { title: 'Custom Options', desc: 'Add your name and number to make it truly yours.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-black rounded-full mx-auto mb-6 flex items-center justify-center text-white font-black text-2xl">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
