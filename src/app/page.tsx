'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

const featuredJerseys = [
  { id: '1', title: 'Classic Pro Jersey', price: '$79.99' },
  { id: '2', title: 'Elite Performance', price: '$89.99' },
  { id: '3', title: 'Limited Edition', price: '$99.99' },
  { id: '4', title: 'Heritage Collection', price: '$84.99' },
]

export default function Home() {
  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white min-h-screen md:min-h-[90vh] flex items-center justify-center">
        {/* Background placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-30 pointer-events-none" />

        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            initial={{ scale: 1.05, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
          />
        </div>

        <div className="relative z-10 container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-balance">
              Where Legends
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-black to-secondary">
                Are Worn
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-secondary mb-10 max-w-2xl mx-auto text-balance"
          >
            Premium jerseys for fans who live the game. Quality, style, and passion in every stitch.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link href="/shop">
              <button className="px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-secondary transition-all duration-300 hover:shadow-lg hover:scale-105">
                Browse Jerseys
              </button>
            </Link>
            <button className="px-8 py-4 border-2 border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition-all duration-300">
              Learn More
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <svg className="w-6 h-6 text-black opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Featured Jerseys Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Collection</h2>
            <p className="text-lg text-secondary max-w-xl">
              Discover our most popular jerseys, handpicked for quality and style.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredJerseys.map((jersey, index) => (
              <ProductCard
                key={jersey.id}
                {...jersey}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="relative overflow-hidden bg-black text-white py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
            style={{ backgroundSize: '200% 200%' }}
          />
        </div>

        <div className="relative z-10 container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Summer Jersey Sale
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              Up to 30% off on select jerseys
            </p>
            <Link href="/shop">
              <button className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-lg hover:scale-105">
                Shop Sale
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-max">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-4xl md:text-5xl font-bold mb-16 text-center"
          >
            Why Choose Legends
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: 'Premium Quality',
                description: 'Crafted from the finest materials for durability and comfort.'
              },
              {
                title: 'Authentic Design',
                description: 'Official partnerships ensure authentic team colors and logos.'
              },
              {
                title: 'Fast Shipping',
                description: 'Quick delivery to get you game-ready for every season.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-black rounded-full mx-auto mb-6 flex items-center justify-center text-white font-bold text-2xl">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-secondary">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
