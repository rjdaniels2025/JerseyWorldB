'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadPromotionImage } from '@/lib/uploadImage'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Upload } from 'lucide-react'

export default function AdminPricing() {
  const [items, setItems] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ title: '', description: '', discount_percentage: '', active: true })
  const [imageFiles, setImageFiles] = useState<File[]>([])
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
    setImageFiles([])
    setShowForm(true)
  }
  const openEdit = (p: any) => {
    setEditing(p)
    setForm({ title: p.title ?? '', description: p.description ?? '', discount_percentage: String(p.discount_percentage ?? ''), active: p.active })
    setImageFiles([])
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    if (editing) {
      // Editing existing — update metadata, optionally replace image
      let image_url = editing.image_url
      if (imageFiles.length > 0) {
        image_url = await uploadPromotionImage(imageFiles[0])
      }
      await supabase.from('promotions').update({
        title: form.title || null,
        description: form.description || null,
        discount_percentage: form.discount_percentage ? parseFloat(form.discount_percentage) : null,
        active: form.active,
        image_url,
      }).eq('id', editing.id)
    } else {
      // Adding new — insert one row per image
      const filesToUpload = imageFiles.length > 0 ? imageFiles : [null]
      for (const file of filesToUpload) {
        const image_url = file ? await uploadPromotionImage(file) : null
        await supabase.from('promotions').insert({
          title: form.title || null,
          description: form.description || null,
          discount_percentage: form.discount_percentage ? parseFloat(form.discount_percentage) : null,
          active: form.active,
          image_url,
        })
      }
    }
    setUploading(false)
    setShowForm(false)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this pricing image?')) return
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
          <p className="text-gray-500 text-sm mt-1">Controls the pricing section on the homepage, best with vertical (9:16) images</p>
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
            <p className="text-xs text-gray-500 mb-6">Best with vertical 9:16 images. All fields optional.</p>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  {editing ? 'Image' : 'Images'} <span className="text-gray-600">(optional{!editing && ', select multiple'})</span>
                </label>
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-[#333] rounded-lg cursor-pointer hover:border-[#c9a84c] transition-colors">
                  <Upload size={18} className="text-[#c9a84c]" />
                  <span className="text-sm text-gray-400">
                    {imageFiles.length > 0 ? `${imageFiles.length} file(s) selected` : 'Click to upload image(s)'}
                  </span>
                  <input type="file" accept="image/*" multiple={!editing} className="hidden" onChange={e => setImageFiles(Array.from(e.target.files ?? []))} />
                </label>
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                  {imageFiles.length > 0 ? imageFiles.map((f, i) => (
                    <div key={i} className="relative w-24 rounded-xl overflow-hidden border border-[#c9a84c40]" style={{ aspectRatio: '4/3' }}>
                      <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                    </div>
                  )) : editing?.image_url ? (
                    <div className="relative w-24 rounded-xl overflow-hidden border border-[#333]" style={{ aspectRatio: '4/3' }}>
                      <img src={editing.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : null}
                </div>
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

      {items.length === 0 ? (
        <div className="text-center py-20 text-gray-600">No pricing images yet!</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
              <div className="relative w-full" style={{ aspectRatio: '9/16' }}>
                {item.image_url
                  ? <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center bg-[#222]"><p className="text-[10px] text-[#444]">No image</p></div>}
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
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 size={13} /></button>
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
