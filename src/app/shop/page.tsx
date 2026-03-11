'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import { ChevronDown } from 'lucide-react'

const allProducts = [
  { id: '1',  title: 'AC Milan Home Jersey',      price: '$45.00', category: 'soccer',      team: 'AC Milan' },
  { id: '2',  title: 'Barcelona FC Jersey',        price: '$40.00', category: 'soccer',      team: 'Barcelona' },
  { id: '3',  title: 'Barcelona FC Away Jersey',   price: '$40.00', category: 'soccer',      team: 'Barcelona' },
  { id: '4',  title: 'Bayern Munich Jersey',       price: '$45.00', category: 'soccer',      team: 'Bayern Munich' },
  { id: '5',  title: 'Chelsea FC Jersey',          price: '$40.00', category: 'soccer',      team: 'Chelsea' },
  { id: '6',  title: 'England National Jersey',    price: '$40.00', category: 'soccer',      team: 'England' },
  { id: '7',  title: 'Juventus Jersey',            price: '$40.00', category: 'soccer',      team: 'Juventus' },
  { id: '8',  title: 'Chicago Bulls Jersey',       price: '$60.00', category: 'basketball',  team: 'Chicago Bulls' },
]

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')

  const filtered = allProducts
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'price-low') return parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1))
      if (sortBy === 'price-high') return parseFloat(b.price.slice(1)) - parseFloat(a.price.slice(1))
      return 0
    })

  return (
    <div className="pt-24 md:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4">All Jerseys</h1>
          <p className="text-lg text-gray-500">Soccer, basketball, and more.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-48 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
              <h3 className="text-sm font-bold uppercase tracking-wide mb-6">Filter</h3>
              <div className="mb-6">
                <label className="text-sm font-medium block mb-3">Category</label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg appearance-none bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="all">All</option>
                    <option value="soccer">Soccer</option>
                    <option value="basketball">Basketball</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </div>
              </div>
              <button
                onClick={() => setSelectedCategory('all')}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-black">{filtered.length}</span> products
              </p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg appearance-none bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product, index) => (
                <ProductCard key={product.id} {...product} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
