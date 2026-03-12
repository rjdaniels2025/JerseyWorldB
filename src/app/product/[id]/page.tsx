'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { X, ZoomIn } from 'lucide-react'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', size: '', custom_name: '', custom_number: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('products')
        .select('*, categories(name), product_images(image_url, sort_order)')
        .eq('id', id)
        .single()
      setProduct(data)
      if (data?.product_images?.[0]) setSelectedImage(data.product_images[0].image_url)
    }
    load()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await supabase.from('leads').insert({
      product_id: id,
      customer_name: form.name,
      email: form.email,
      phone: form.phone || null,
      city: form.city || null,
      size: form.size || null,
      custom_name: form.custom_name || null,
      custom_number: form.custom_number || null,
      message: form.message || null,
      status: 'new',
    })
    setSubmitting(false)
    setSubmitted(true)
  }

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const images = product.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) ?? []

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 p-2 text-white hover:text-[#c9a84c] transition-colors">
            <X size={28} />
          </button>
          <img
            src={lightbox}
            alt="Full size"
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">

          {/* Images */}
          <div>
            <div
              className="relative aspect-square rounded-2xl overflow-hidden border border-[#2e2d2d] bg-[#1a1a1a] cursor-zoom-in group mb-3"
              onClick={() => selectedImage && setLightbox(selectedImage)}>
              {selectedImage ? (
                <img src={selectedImage} alt={product.title} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#333]">No image</div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full p-3">
                  <ZoomIn size={22} className="text-white" />
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-[#444] mb-3">Tap image to enlarge</p>
            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((img: any) => (
                  <button key={img.image_url} onClick={() => setSelectedImage(img.image_url)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img.image_url ? 'border-[#c9a84c]' : 'border-[#2e2d2d] hover:border-[#444]'
                    }`}>
                    <img src={img.image_url} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details + Form */}
          <div>
            <p className="text-xs text-[#c9a84c] font-semibold tracking-[0.2em] uppercase mb-2">
              {product.categories?.name ?? 'Jersey'}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-[#f0ede8] mb-3 tracking-tight">{product.title}</h1>
            <p className="text-3xl font-black text-[#c9a84c] mb-5">${product.price}</p>
            {product.description && (
              <p className="text-[#5c5755] text-sm leading-relaxed mb-6">{product.description}</p>
            )}

            {submitted ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
                <p className="text-2xl mb-2">✅</p>
                <p className="text-green-400 font-bold">Request sent!</p>
                <p className="text-[#5c5755] text-sm mt-1">We will reach out to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-sm font-semibold text-[#f0ede8] mb-4">Request This Jersey</p>
                {[
                  { label: 'Your Name', key: 'name', required: true },
                  { label: 'Email', key: 'email', type: 'email', required: true },
                  { label: 'Phone (optional)', key: 'phone' },
                  { label: 'City (optional)', key: 'city' },
                ].map(({ label, key, type, required }) => (
                  <div key={key}>
                    <input
                      type={type ?? 'text'}
                      placeholder={label}
                      required={required}
                      value={(form as any)[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2e2d2d] rounded-xl text-[#f0ede8] text-sm placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                  </div>
                ))}
                {product.sizes?.length > 0 && (
                  <select value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2e2d2d] rounded-xl text-[#f0ede8] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                    <option value="">Select size</option>
                    {product.sizes.map((s: string) => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Custom name (optional)" value={form.custom_name}
                    onChange={e => setForm(f => ({ ...f, custom_name: e.target.value }))}
                    className="px-4 py-3 bg-[#1a1a1a] border border-[#2e2d2d] rounded-xl text-[#f0ede8] text-sm placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                  <input placeholder="Number (optional)" value={form.custom_number}
                    onChange={e => setForm(f => ({ ...f, custom_number: e.target.value }))}
                    className="px-4 py-3 bg-[#1a1a1a] border border-[#2e2d2d] rounded-xl text-[#f0ede8] text-sm placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
                <textarea placeholder="Message (optional)" value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={3}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2e2d2d] rounded-xl text-[#f0ede8] text-sm placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
                <button type="submit" disabled={submitting}
                  className="w-full py-4 bg-[#c9a84c] text-[#111] font-bold rounded-xl hover:bg-[#dfc06e] transition-all duration-300 uppercase tracking-[0.1em] text-sm disabled:opacity-50">
                  {submitting ? 'Sending...' : 'Send Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
