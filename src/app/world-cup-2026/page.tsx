'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import { Search } from 'lucide-react'

export default function WorldCup2026() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', '2026-world-cup')
        .single()
      const { data } = await supabase
        .from('products')
        .select('*, product_images(image_url, sort_order)')
        .eq('category_id', category?.id ?? '')
        .order('created_at', { ascending: false })
      setProducts(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = products.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative mb-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-10 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-30" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🏆</span>
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c]">Limited Collection</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">2026 World Cup</h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Represent your nation. Shop our full collection of international and national team jerseys, perfect for the biggest tournament on Earth.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
              <span className="text-[#c9a84c] text-sm font-semibold">Temporary Collection, Available Now</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {products.length > 0 && (
          <div className="relative mb-8 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by country..."
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition placeholder:text-[#555]"
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition text-lg leading-none">
                ×
              </button>
            )}
          </div>
        )}

        {/* Products */}
        {loading ? (
          <div className="text-center py-20 text-gray-600">Loading...</div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-4">World Cup jerseys coming soon!</p>
            <p className="text-gray-700 text-sm mb-8">Add national team jerseys in the admin under the &quot;National Teams&quot; category to show them here.</p>
            <Link href="/shop">
              <button className="px-6 py-3 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all text-sm uppercase tracking-wide">
                Browse All Jerseys
              </button>
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-8">
              {search
                ? <><span className="text-white font-bold">{filtered.length}</span> result{filtered.length !== 1 ? 's' : ''} for &quot;{search}&quot;</>
                : <><span className="text-white font-bold">{products.length}</span> national team jerseys</>
              }
            </p>
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500">No jerseys found for &quot;{search}&quot;</p>
                <button onClick={() => setSearch('')} className="mt-4 text-[#c9a84c] text-sm hover:underline">Clear search</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.map((product: any, index: number) => (
                  <ProductCard key={product.id} id={product.id} title={product.title}
                    price={`$${product.price}`} image={product.product_images?.[0]?.image_url} index={index} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
