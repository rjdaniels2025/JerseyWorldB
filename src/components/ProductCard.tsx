'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface ProductCardProps {
  id: string
  title: string
  price: string
  image?: string
  index?: number
}

export default function ProductCard({ id, title, price, image, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <Link href={`/product/${id}`}>
        <div className="overflow-hidden rounded-lg bg-border aspect-square mb-4 transition-transform duration-300 ease-out cursor-pointer">
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            {/* Placeholder image area */}
            <div className="text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-medium">Jersey Image</span>
            </div>
          </div>
        </div>
        <h3 className="font-semibold text-base mb-2 group-hover:text-secondary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-secondary mb-4">
          {price}
        </p>
        <button
          className="w-full px-4 py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-secondary transition-colors duration-200 group-hover:shadow-md"
          onClick={(e) => {
            e.preventDefault()
          }}
        >
          View Details
        </button>
      </Link>
    </motion.div>
  )
}
