'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Upload } from 'lucide-react'

export default function AdminPricing() {
  const [items, setItems] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ title: '', description: '', discount_percentage: '', active: true })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const load = async () => {
    const { data } = await supabase.from('promotions').select('*').order('created_at', { ascending: false })
    setItems(data ?? [])
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm({ title: '', description: '', discount_percentage: '', active: true })
    setImageFile(null)
    setShowForm(true)
  }
  const openEdit = (p: any) => {
    setEditing(p)
    setForm({ title: p.title ?? '', description: p.description ?? '', discount_percentage: String(p.discount_percentage ?? ''), active: p.active })
    setImageFile(null)
    setShowForm(true)
  }

  const deleteStorageFile = async (url: string) => {
    try {
      const path = url.split('/object/public/promotions/')[1]
      if (path) await supabase.storage.from('promotions').remove([decodeURIComponent(path)])
    } catch (e) { console.error(e) }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    let image_url = editing?.image_url ?? null

    if (imageFile) {
      if (editing?.image_url) await deleteStorageFile(editing.image_url)
      const path = `pricing-${Date.now()}.${imageFile.name.split('.').pop()}`
      await supabase.storage.from('promotions').upload(path, imageFile, { upsert: true })
      const { data: { publicUrl } } = supabase.storage.from('promotions').getPublicUrl(path)
      image_url = publicUrl
    }

    const data = {
      title: form.title || null,
      description: form.description || null,
      discount_percentage: form.discount_percentage ? parseFloat(form.discount_percentage) : null,
      active: form.active,
      image_url,
    }

    if (editing) {
      await supabase.from('promotions').update(data).eq('id', editing.id)
    } else {
      await supabase.from('promotions').insert(data)
    }
    setUploading(false)
    setShowForm(false)
    load()
  }

  const handleDelete = async (id: string, imageUrl: string | null) => {
    if (!confirm('Delete this pricing image?')) return
    if (imageUrl) await deleteStorageFile(imageUrl)
    await supabase.from('promotions').delete().eq('id', id)
    load()
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('promotions').update({ active: !current }).eq('id', id)
    load()
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Pricing</h1>
          <p className="text-gray-500 text-sm mt-1">Controls the pricing section on the homepage — best with vertical (9:16) images</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-3 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all text-sm">
          <Plus size={16} /> Add Pricing Image
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-lg my-8">
            <h2 className="text-xl font-bold text-white mb-2">{editing ? 'Edit' : 'Add'} Pricing Image</h2>
            <p className="text-xs text-gray-500 mb-6">Best with vertical 9:16 images (e.g. 1080×1920). All fields optional.</p>
            <form onSubmit={handleSave} className="space-y-4">

              {/* Image upload with vertical preview */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Image <span className="text-gray-600">(optional — vertical 9:16 recommended)</span>
                </label>
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-[#333] rounded-lg cursor-pointer hover:border-[#c9a84c] transition-colors">
                  <Upload size={18} className="text-[#c9a84c]" />
                  <span className="text-sm text-gray-400">{imageFile ? imageFile.name : 'Click to upload image'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
                </label>
                {/* Vertical preview */}
                {(imageFile || editing?.image_url) && (
                  <div className="mt-3 flex justify-center">
                    <div className="relative w-32 rounded-xl overflow-hidden border border-[#333]" style={{ aspectRatio: '9/16' }}>
                      <img
                        src={imageFile ? URL.createObjectURL(imageFile) : editing.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[10px] text-gray-600 mt-2 text-center">Preview</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Title <span className="text-gray-600">(optional)</span></label>
                <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
                  placeholder="e.g. Summer Pricing"
                  className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-lg text-white text-sm placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description <span className="text-gray-600">(optional)</span></label>
                <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={2}
                  className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Discount % <span className="text-gray-600">(optional)</span></label>
                <input type="number" step="0.01" value={form.discount_percentage}
                  onChange={e => setForm(f => ({...f, discount_percentage: e.target.value}))}
                  className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({...f, active: e.target.checked}))} className="w-4 h-4 accent-[#c9a84c]" />
                <span className="text-sm text-gray-300">Active (show on homepage)</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={uploading}
                  className="flex-1 py-2.5 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all text-sm disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Save'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-[#333] text-gray-400 rounded-lg text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid of vertical image previews */}
      {items.length === 0 ? (
        <div className="text-center py-20 text-gray-600">No pricing images yet — add your first one!</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden overflow-x-auto">
              {/* Vertical image preview */}
              <div className="relative w-full" style={{ aspectRatio: '9/16' }}>
                {item.image_url ? (
                  <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#222]">
                    <p className="text-[10px] text-[#444] tracking-widest uppercase">No image</p>
                  </div>
                )}
              </div>
              <div className="p-3 space-y-2">
                {item.title && <p className="text-sm font-semibold text-white truncate">{item.title}</p>}
                {item.discount_percentage && <p className="text-xs text-[#c9a84c] font-bold">{item.discount_percentage}% OFF</p>}
                <div className="flex items-center justify-between pt-1">
                  <button onClick={() => toggleActive(item.id, item.active)} className="flex items-center gap-1 text-xs">
                    {item.active
                      ? <><ToggleRight size={16} className="text-[#c9a84c]" /><span className="text-[#c9a84c]">Active</span></>
                      : <><ToggleLeft size={16} className="text-gray-600" /><span className="text-gray-600">Inactive</span></>}
                  </button>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-[#2a2a2a] rounded-lg text-gray-400 hover:text-white"><Pencil size={13} /></button>
                    <button onClick={() => handleDelete(item.id, item.image_url)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
