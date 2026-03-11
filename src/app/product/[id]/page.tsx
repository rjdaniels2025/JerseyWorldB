'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [selectedSize, setSelectedSize] = useState('M')
  const [customName, setCustomName] = useState('')
  const [customNumber, setCustomNumber] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '' })
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('products')
        .select('*, categories(name), product_images(image_url, sort_order)')
        .eq('id', id)
        .single()
      if (data) {
        setProduct(data)
        data.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order)
      }
    }
    load()
  }, [id])

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await supabase.from('leads').insert({
      customer_name: form.name,
      email: form.email,
      phone: form.phone,
      city: form.city,
      product_id: product.id,
      size: selectedSize,
      custom_name: customName,
      custom_number: customNumber,
    })
    setSubmitted(true)
    setSubmitting(false)
  }

  if (!product) return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center">
      <p className="text-gray-600">Loading...</p>
    </div>
  )

  const images = product.product_images ?? []
  const sizes = product.sizes ?? ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  return (
    <div className="bg-[#111111] pt-24 md:pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#c9a84c] transition-colors">
            <ChevronLeft size={18} /> Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative mb-4 aspect-square rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden group">
              {images.length > 0 ? (
                <img src={images[selectedImage]?.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-24 h-24 text-[#333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <button onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center hover:bg-black transition-colors">
                <Heart size={18} className={isWishlisted ? 'fill-[#c9a84c] text-[#c9a84c]' : 'text-gray-400'} />
              </button>
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img: any, i: number) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-[#c9a84c]' : 'border-[#2a2a2a] hover:border-[#444]'}`}>
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="mb-6">
              {product.categories?.name && (
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#c9a84c] mb-2">{product.categories.name}</p>
              )}
              <h1 className="text-4xl font-black text-white mb-3">{product.title}</h1>
              <p className="text-3xl font-black text-[#c9a84c] mb-4">${product.price}</p>
              {product.description && <p className="text-gray-400 leading-relaxed">{product.description}</p>}
            </div>

            {/* Size */}
            <div className="mb-6 pb-6 border-b border-[#2a2a2a]">
              <label className="block text-sm font-bold text-white mb-3">Size</label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size: string) => (
                  <button key={size} onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedSize === size ? 'bg-[#c9a84c] text-black' : 'bg-[#1a1a1a] border border-[#333] text-gray-300 hover:border-[#c9a84c]'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Customization */}
            <div className="mb-6 pb-6 border-b border-[#2a2a2a]">
              <h3 className="text-sm font-bold text-white mb-3">Customization (Optional)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Name</label>
                  <input value={customName} onChange={e => setCustomName(e.target.value)} maxLength={15} placeholder="Your name"
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Number</label>
                  <input value={customNumber} onChange={e => setCustomNumber(e.target.value.slice(0,2))} maxLength={2} placeholder="##"
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
              </div>
            </div>

            {/* Request Form */}
            {submitted ? (
              <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
                <p className="text-green-400 font-bold text-lg mb-1">Request Submitted! ✓</p>
                <p className="text-gray-400 text-sm">We'll be in touch with you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleRequest} className="space-y-3">
                <h3 className="text-sm font-bold text-white mb-3">Your Info</h3>
                {[
                  { key: 'name', label: 'Full Name', type: 'text', required: true },
                  { key: 'email', label: 'Email', type: 'email', required: true },
                  { key: 'phone', label: 'Phone', type: 'tel', required: false },
                  { key: 'city', label: 'City', type: 'text', required: false },
                ].map(({ key, label, type, required }) => (
                  <input key={key} type={type} placeholder={label} required={required}
                    value={form[key as keyof typeof form]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                ))}
                <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-[#c9a84c] text-black font-black rounded-lg hover:bg-[#e2c06a] transition-all uppercase tracking-wide disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Request This Jersey'}
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
