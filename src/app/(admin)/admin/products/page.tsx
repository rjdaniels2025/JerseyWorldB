'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Upload, X, Search } from 'lucide-react'

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ title: '', description: '', price: '', category_id: '', featured: false, sizes: '' })
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  const load = async () => {
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('products').select('*, categories(name), product_images(image_url, sort_order)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ])
    setProducts(p ?? [])
    setCategories(c ?? [])
  }

  useEffect(() => { load() }, [])

  const filtered = products.filter(p =>
    !search.trim() ||
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.categories?.name?.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditing(null)
    setForm({ title: '', description: '', price: '', category_id: '', featured: false, sizes: '' })
    setImageFiles([])
    setShowForm(true)
  }

  const openEdit = (p: any) => {
    setEditing(p)
    setForm({
      title: p.title, description: p.description ?? '', price: String(p.price),
      category_id: p.category_id ?? '', featured: p.featured, sizes: (p.sizes ?? []).join(', ')
    })
    setImageFiles([])
    setShowForm(true)
  }

  const deleteStorageFile = async (url: string) => {
    try {
      const path = url.split('/object/public/products/')[1]
      if (path) await supabase.storage.from('products').remove([decodeURIComponent(path)])
    } catch (e) { console.error(e) }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    const sizes = form.sizes.split(',').map(s => s.trim()).filter(Boolean)
    const productData = {
      title: form.title, description: form.description || null,
      price: parseFloat(form.price), category_id: form.category_id || null,
      featured: form.featured, sizes,
    }
    let productId = editing?.id
    if (editing) {
      await supabase.from('products').update(productData).eq('id', editing.id)
    } else {
      const { data } = await supabase.from('products').insert(productData).select().single()
      productId = data?.id
    }
    if (imageFiles.length > 0 && productId) {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]
        const path = `${productId}/${Date.now()}-${i}.${file.name.split('.').pop()}`
        await supabase.storage.from('products').upload(path, file, { upsert: true })
        const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(path)
        await supabase.from('product_images').insert({ product_id: productId, image_url: publicUrl, sort_order: i })
      }
    }
    setUploading(false)
    setShowForm(false)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    const { data: imgs } = await supabase.from('product_images').select('image_url').eq('product_id', id)
    for (const img of imgs ?? []) await deleteStorageFile(img.image_url)
    await supabase.from('product_images').delete().eq('product_id', id)
    await supabase.from('products').delete().eq('id', id)
    load()
  }

  const deleteImage = async (imgUrl: string, productId: string) => {
    await deleteStorageFile(imgUrl)
    const { data: imgs } = await supabase.from('product_images').select('*').eq('product_id', productId)
    const match = imgs?.find(i => i.image_url === imgUrl)
    if (match) await supabase.from('product_images').delete().eq('id', match.id)
    load()
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} of {products.length} total</p>
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
          />
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all text-sm">
          <Plus size={15} /> Add
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5 sm:p-8 w-full max-w-lg my-4">
            <h2 className="text-xl font-bold text-white mb-6">{editing ? 'Edit' : 'Add'} Product</h2>
            <form onSubmit={handleSave} className="space-y-4">
              {[
                { label: 'Title', key: 'title', required: true },
                { label: 'Price ($)', key: 'price', type: 'number', required: true },
              ].map(({ label, key, type, required }) => (
                <div key={key}>
                  <label className="block text-sm text-gray-400 mb-1">{label}</label>
                  <input type={type ?? 'text'} value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    required={required} step={key === 'price' ? '0.01' : undefined}
                    className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
              ))}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                  className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                  <option value="">No category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Sizes (comma separated)</label>
                <input value={form.sizes} onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))}
                  placeholder="S, M, L, XL, XXL"
                  className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-[#c9a84c]" />
                <span className="text-sm text-gray-300">Featured on homepage</span>
              </label>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Images</label>
                {editing && editing.product_images?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {editing.product_images.map((img: any) => (
                      <div key={img.image_url} className="relative">
                        <img src={img.image_url} alt="" className="w-16 h-16 object-cover rounded-lg border border-[#333]" />
                        <button type="button" onClick={() => deleteImage(img.image_url, editing.id)}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 rounded-full p-0.5 text-white">
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-[#333] rounded-lg cursor-pointer hover:border-[#c9a84c] transition-colors">
                  <Upload size={16} className="text-[#c9a84c]" />
                  <span className="text-sm text-gray-400">{imageFiles.length > 0 ? `${imageFiles.length} file(s) selected` : 'Upload images'}</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={e => setImageFiles(Array.from(e.target.files ?? []))} />
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={uploading}
                  className="flex-1 py-2.5 bg-[#c9a84c] text-black font-bold rounded-lg text-sm disabled:opacity-50">
                  {uploading ? 'Saving...' : 'Save Product'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-[#333] text-gray-400 rounded-lg text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-600">No products yet</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => (
            <div key={p.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 flex gap-4 items-start">
              {/* Image */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#333] shrink-0 bg-[#222]">
                {p.product_images?.[0]?.image_url
                  ? <img src={p.product_images[0].image_url} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><span className="text-[#444] text-[10px]">No img</span></div>}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-white truncate">{p.title}</p>
                  <p className="text-[#c9a84c] font-bold text-sm shrink-0">${p.price}</p>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{p.categories?.name ?? 'No category'}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {p.featured && <span className="text-[10px] bg-[#c9a84c20] text-[#c9a84c] px-2 py-0.5 rounded-full">Featured</span>}
                  {p.sizes?.length > 0 && <span className="text-[10px] text-gray-600">{p.sizes.join(', ')}</span>}
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#222] text-gray-300 rounded-lg hover:text-white transition-colors">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#222] text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
