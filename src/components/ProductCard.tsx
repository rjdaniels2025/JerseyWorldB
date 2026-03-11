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
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <Link href={`/product/${id}`}>
        <div className="overflow-hidden rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] group-hover:border-[#c9a84c]/50 transition-all duration-300 mb-4 aspect-square group-hover:shadow-lg group-hover:shadow-[#c9a84c]/10">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-[#444]">
                <svg className="w-16 h-16 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-medium text-[#555]">Jersey Image</span>
              </div>
            </div>
          )}
        </div>
        <h3 className="font-bold text-base mb-1 text-white group-hover:text-[#c9a84c] transition-colors">{title}</h3>
        <p className="text-sm text-[#c9a84c] font-bold mb-4">{price}</p>
        <button className="w-full px-4 py-3 bg-[#c9a84c] text-black text-sm font-bold rounded-lg hover:bg-[#e2c06a] transition-all uppercase tracking-wide"
          onClick={e => e.preventDefault()}>
          View Details
        </button>
      </Link>
    </motion.div>
  )
}
