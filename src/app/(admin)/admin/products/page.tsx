'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Star, Upload, X } from 'lucide-react'

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ title: '', description: '', price: '', category_id: '', featured: false })
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const load = async () => {
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('products').select('*, categories(name), product_images(image_url, sort_order)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ])
    setProducts(p ?? [])
    setCategories(c ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm({ title: '', description: '', price: '', category_id: '', featured: false }); setImageFiles([]); setShowForm(true) }
  const openEdit = (p: any) => { setEditing(p); setForm({ title: p.title, description: p.description ?? '', price: String(p.price), category_id: p.category_id ?? '', featured: p.featured }); setImageFiles([]); setShowForm(true) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    const data = { title: form.title, description: form.description, price: parseFloat(form.price), category_id: form.category_id || null, featured: form.featured }

    let productId = editing?.id
    if (editing) {
      await supabase.from('products').update(data).eq('id', editing.id)
    } else {
      const { data: newProduct } = await supabase.from('products').insert(data).select().single()
      productId = newProduct?.id
    }

    // Upload images
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      const ext = file.name.split('.').pop()
      const path = `${productId}/${Date.now()}-${i}.${ext}`
      const { data: uploaded } = await supabase.storage.from('products').upload(path, file, { upsert: true })
      if (uploaded) {
        const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(path)
        await supabase.from('product_images').insert({ product_id: productId, image_url: publicUrl, sort_order: i })
      }
    }

    setUploading(false)
    setShowForm(false)
    load()
  }

  const deleteImage = async (imageId: string, imageUrl: string) => {
    await supabase.from('product_images').delete().eq('id', imageId)
    const path = imageUrl.split('/products/')[1]
    if (path) await supabase.storage.from('products').remove([path])
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} total products</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all text-sm">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-xl my-8">
            <h2 className="text-xl font-bold text-white mb-6">{editing ? 'Edit' : 'Add'} Product</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} required
                  className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3}
                  className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Price ($)</label>
                  <input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} required
                    className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <select value={form.category_id} onChange={e => setForm(f => ({...f, category_id: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                    <option value="">No Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({...f, featured: e.target.checked}))} className="w-4 h-4 accent-[#c9a84c]" />
                <span className="text-sm text-gray-300">Featured on homepage</span>
              </label>

              {/* Image Upload */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Product Images</label>
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-[#333] rounded-lg cursor-pointer hover:border-[#c9a84c] transition-colors">
                  <Upload size={18} className="text-[#c9a84c]" />
                  <span className="text-sm text-gray-400">Click to upload images</span>
                  <input type="file" accept="image/*" multiple className="hidden"
                    onChange={e => setImageFiles(Array.from(e.target.files ?? []))} />
                </label>
                {imageFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imageFiles.map((f, i) => (
                      <div key={i} className="relative">
                        <img src={URL.createObjectURL(f)} alt="" className="w-16 h-16 object-cover rounded-lg border border-[#333]" />
                        <button type="button" onClick={() => setImageFiles(prev => prev.filter((_, j) => j !== i))}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <X size={10} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Existing images when editing */}
                {editing?.product_images?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Existing images:</p>
                    <div className="flex flex-wrap gap-2">
                      {editing.product_images.map((img: any) => (
                        <div key={img.id} className="relative">
                          <img src={img.image_url} alt="" className="w-16 h-16 object-cover rounded-lg border border-[#333]" />
                          <button type="button" onClick={() => deleteImage(img.id, img.image_url)}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <X size={10} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={uploading}
                  className="flex-1 py-2.5 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all text-sm disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Save Product'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-[#333] text-gray-400 rounded-lg hover:border-[#555] transition-all text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              {['Image', 'Product', 'Category', 'Price', 'Featured', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-600">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-600">No products yet — add your first one!</td></tr>
            ) : products.map(p => (
              <tr key={p.id} className="border-b border-[#222] hover:bg-[#1f1f1f] transition-colors">
                <td className="px-6 py-4">
                  {p.product_images?.[0]?.image_url ? (
                    <img src={p.product_images[0].image_url} alt="" className="w-12 h-12 object-cover rounded-lg border border-[#333]" />
                  ) : (
                    <div className="w-12 h-12 bg-[#222] rounded-lg border border-[#333] flex items-center justify-center">
                      <span className="text-[#444] text-xs">—</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-white">{p.title}</td>
                <td className="px-6 py-4 text-gray-400">{p.categories?.name ?? '—'}</td>
                <td className="px-6 py-4 text-[#c9a84c] font-bold">${p.price}</td>
                <td className="px-6 py-4">{p.featured && <Star size={16} className="text-[#c9a84c] fill-[#c9a84c]" />}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-[#2a2a2a] rounded-lg transition-colors text-gray-400 hover:text-white"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-gray-400 hover:text-red-400"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
