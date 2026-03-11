'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import { ChevronDown } from 'lucide-react'

const products = [
  { id: '1', title: 'Classic Pro Jersey', price: '$79.99' },
  { id: '2', title: 'Elite Performance', price: '$89.99' },
  { id: '3', title: 'Limited Edition', price: '$99.99' },
  { id: '4', title: 'Heritage Collection', price: '$84.99' },
  { id: '5', title: 'Modern Fusion', price: '$74.99' },
  { id: '6', title: 'Champion Series', price: '$94.99' },
  { id: '7', title: 'Street Style', price: '$69.99' },
  { id: '8', title: 'Premium Plus', price: '$109.99' },
]

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPrice, setSelectedPrice] = useState('all')
  const [sortBy, setSortBy] = useState('featured')

  return (
    <div className="pt-24 md:pt-28 pb-20">
      <div className="container-max">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Jerseys</h1>
          <p className="text-lg text-secondary">
            Browse our complete collection of premium jerseys
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full lg:w-48 flex-shrink-0"
          >
            <div className="bg-white border border-border rounded-lg p-6 sticky top-24">
              <h3 className="text-sm font-semibold uppercase tracking-wide mb-6">Filters</h3>

              {/* Category Filter */}
              <div className="mb-8">
                <label className="text-sm font-medium block mb-3">Category</label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg appearance-none bg-white cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  >
                    <option value="all">All Categories</option>
                    <option value="team">Team Jerseys</option>
                    <option value="player">Player Edition</option>
                    <option value="vintage">Vintage</option>
                    <option value="custom">Custom</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary" />
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <label className="text-sm font-medium block mb-3">Price Range</label>
                <div className="relative">
                  <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg appearance-none bg-white cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  >
                    <option value="all">All Prices</option>
                    <option value="0-50">Under $50</option>
                    <option value="50-75">$50 - $75</option>
                    <option value="75-100">$75 - $100</option>
                    <option value="100+">$100+</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary" />
                </div>
              </div>

              {/* Reset Filters Button */}
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedPrice('all')
                }}
                className="w-full px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-border transition-colors duration-200"
              >
                Reset Filters
              </button>
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-between items-center mb-8 pb-6 border-b border-border"
            >
              <p className="text-sm text-secondary">
                Showing <span className="font-semibold text-black">{products.length}</span> products
              </p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg appearance-none bg-white cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary" />
              </div>
            </motion.div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
