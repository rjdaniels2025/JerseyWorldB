'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import { ChevronDown } from 'lucide-react'

export default function ShopClient({ products, categories }: { products: any[], categories: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')

  const filtered = products
    .filter(p => selectedCategory === 'all' || p.categories?.slug === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      return 0
    })

  return (
    <div className="bg-[#111111] min-h-screen pt-24 md:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] mb-3">Collection</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">All Jerseys</h1>
          <p className="text-lg text-gray-400">Soccer, basketball, and more.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-48 flex-shrink-0">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 sticky top-24">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9a84c] mb-6">Filter</h3>
              <div className="mb-6">
                <label className="text-sm font-medium block mb-3 text-gray-300">Category</label>
                <div className="relative">
                  <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-[#333] rounded-lg appearance-none bg-[#111] text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                    <option value="all">All</option>
                    {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#c9a84c]" />
                </div>
              </div>
              <button onClick={() => setSelectedCategory('all')}
                className="w-full px-3 py-2 text-sm border border-[#333] text-gray-400 rounded-lg hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors">
                Reset
              </button>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#2a2a2a]">
              <p className="text-sm text-gray-500"><span className="font-bold text-white">{filtered.length}</span> products</p>
              <div className="relative">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-[#333] rounded-lg appearance-none bg-[#1a1a1a] text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#c9a84c]" />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-600">No products found</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product, index) => (
                  <ProductCard key={product.id} id={product.id} title={product.title}
                    price={`$${product.price}`} image={product.product_images?.[0]?.image_url} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
