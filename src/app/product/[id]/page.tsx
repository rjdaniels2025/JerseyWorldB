'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, Heart } from 'lucide-react'

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string
  const [selectedSize, setSelectedSize] = useState('M')
  const [customName, setCustomName] = useState('')
  const [customNumber, setCustomNumber] = useState('')
  const [isWishlisted, setIsWishlisted] = useState(false)

  const product = {
    id: params.id,
    title: 'Elite Performance Jersey',
    price: '$89.99',
    description: 'Experience premium comfort and performance with our Elite Performance Jersey. Crafted from breathable moisture-wicking fabric, this jersey is designed for fans who demand the best. Perfect for both casual wear and game day.',
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const thumbnails = [1, 2, 3, 4]

  return (
    <div className="pt-24 md:pt-28 pb-20">
      <div className="container-max">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-black transition-colors">
            <ChevronLeft size={18} />
            Back to Shop
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="relative mb-6 aspect-square rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden group cursor-pointer">
              <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <svg className="w-24 h-24 opacity-50 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart
                  size={20}
                  className={`${isWishlisted ? 'fill-black text-black' : 'text-secondary'} transition-colors`}
                />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {thumbnails.map((thumb, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="aspect-square rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer hover:ring-2 hover:ring-black transition-all"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-8 h-8 opacity-30 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.title}</h1>
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-3xl font-bold">{product.price}</span>
                <span className="text-sm text-green-600 font-medium">In Stock</span>
              </div>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-black" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-secondary">(145 reviews)</span>
              </div>
            </div>

            <div className="mb-8 pb-8 border-b border-border">
              <p className="text-secondary leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selector */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <label className="block text-sm font-semibold mb-4">Size</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                      selectedSize === size
                        ? 'bg-black text-white'
                        : 'bg-border text-black hover:bg-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-xs text-secondary">Size Guide</p>
            </motion.div>

            {/* Customization */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mb-8 pb-8 border-b border-border"
            >
              <h3 className="text-sm font-semibold mb-4">Customization</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-secondary mb-2">
                    Custom Name (Optional)
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    maxLength={15}
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="number" className="block text-xs font-medium text-secondary mb-2">
                    Custom Number (Optional)
                  </label>
                  <input
                    id="number"
                    type="text"
                    placeholder="Enter number"
                    value={customNumber}
                    onChange={(e) => setCustomNumber(e.target.value.slice(0, 2))}
                    maxLength={2}
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-4 bg-black text-white text-lg font-semibold rounded-lg hover:bg-secondary transition-all duration-300 hover:shadow-lg mb-4"
            >
              Request This Jersey
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="w-full px-6 py-4 border-2 border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition-all duration-300"
            >
              Add to Cart
            </motion.button>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 pt-8 border-t border-border space-y-3"
            >
              <div className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white text-xs">✓</div>
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white text-xs">✓</div>
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white text-xs">✓</div>
                <span>Authentic licensed products</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
