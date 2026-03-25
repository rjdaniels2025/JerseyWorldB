'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Props {
  id: string
  title: string
  price: string
  image?: string
  index?: number
}

export default function ProductCard({ id, title, price, image, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/product/${id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-[#1f1e1e] border border-[#2e2d2d] mb-4 shadow-[0_2px_20px_#00000040] group-hover:border-[#c9a84c44] group-hover:shadow-[0_8px_40px_#00000060] transition-all duration-500">
          {image ? (
            <div className="w-full" style={{ aspectRatio: '3/4' }}>
              <img
                src={image}
                alt={title}
                className="w-full h-full object-contain group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center gap-3 py-16">
              <svg className="w-12 h-12 text-[#3a3838]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#3a3838]">No Image</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <div className="px-1">
          <p className="text-[#f0ede8] font-medium text-sm leading-snug mb-1.5 group-hover:text-white transition-colors line-clamp-2">{title}</p>
          <div className="flex items-center justify-between">
            <span className="text-[#c9a84c] font-semibold text-sm">{price}</span>
            <span className="text-[10px] tracking-[0.15em] uppercase text-[#5c5755] group-hover:text-[#c9a84c] transition-colors">View →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
