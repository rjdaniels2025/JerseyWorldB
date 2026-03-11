'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Upload } from 'lucide-react'

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ title: '', description: '', discount_percentage: '', active: false })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const load = async () => {
    const { data } = await supabase.from('promotions').select('*').order('created_at', { ascending: false })
    setPromotions(data ?? [])
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm({ title: '', description: '', discount_percentage: '', active: false }); setImageFile(null); setShowForm(true) }
  const openEdit = (p: any) => { setEditing(p); setForm({ title: p.title, description: p.description ?? '', discount_percentage: String(p.discount_percentage ?? ''), active: p.active }); setImageFile(null); setShowForm(true) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    let image_url = editing?.image_url ?? null

    if (imageFile) {
      const path = `promo-${Date.now()}.${imageFile.name.split('.').pop()}`
      await supabase.storage.from('promotions').upload(path, imageFile, { upsert: true })
      const { data: { publicUrl } } = supabase.storage.from('promotions').getPublicUrl(path)
      image_url = publicUrl
    }

    const data = { title: form.title, description: form.description, discount_percentage: form.discount_percentage ? parseFloat(form.discount_percentage) : null, active: form.active, image_url }
    if (editing) {
      await supabase.from('promotions').update(data).eq('id', editing.id)
    } else {
      await supabase.from('promotions').insert(data)
    }
    setUploading(false)
    setShowForm(false)
    load()
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('promotions').update({ active: !current }).eq('id', id)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return
    await supabase.from('promotions').delete().eq('id', id)
    load()
  }

  return (
    <div className="p-8 pt-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Promotions</h1>
          <p className="text-gray-500 text-sm mt-1">Controls the pricing section image on homepage</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all text-sm">
          <Plus size={16} /> Add Promotion
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-6">{editing ? 'Edit' : 'Add'} Promotion</h2>
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
              <div>
                <label className="block text-sm text-gray-400 mb-1">Discount %</label>
                <input type="number" step="0.01" value={form.discount_percentage} onChange={e => setForm(f => ({...f, discount_percentage: e.target.value}))}
                  className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Section Image</label>
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-[#333] rounded-lg cursor-pointer hover:border-[#c9a84c] transition-colors">
                  <Upload size={18} className="text-[#c9a84c]" />
                  <span className="text-sm text-gray-400">{imageFile ? imageFile.name : 'Click to upload image'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
                </label>
                {(editing?.image_url && !imageFile) && (
                  <img src={editing.image_url} alt="" className="mt-2 h-20 w-full object-cover rounded-lg border border-[#333]" />
                )}
                {imageFile && (
                  <img src={URL.createObjectURL(imageFile)} alt="" className="mt-2 h-20 w-full object-cover rounded-lg border border-[#333]" />
                )}
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
                  className="flex-1 py-2.5 border border-[#333] text-gray-400 rounded-lg transition-all text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              {['Image', 'Title', 'Discount', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {promotions.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-600">No promotions yet</td></tr>
            ) : promotions.map(p => (
              <tr key={p.id} className="border-b border-[#222] hover:bg-[#1f1f1f] transition-colors">
                <td className="px-6 py-4">
                  {p.image_url
                    ? <img src={p.image_url} alt="" className="w-20 h-12 object-cover rounded-lg border border-[#333]" />
                    : <div className="w-20 h-12 bg-[#222] rounded-lg border border-[#333]" />}
                </td>
                <td className="px-6 py-4 font-medium text-white">{p.title}</td>
                <td className="px-6 py-4 text-[#c9a84c] font-bold">{p.discount_percentage ? `${p.discount_percentage}%` : '—'}</td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleActive(p.id, p.active)} className="flex items-center gap-2 text-sm">
                    {p.active
                      ? <><ToggleRight size={20} className="text-[#c9a84c]" /><span className="text-[#c9a84c]">Active</span></>
                      : <><ToggleLeft size={20} className="text-gray-600" /><span className="text-gray-600">Inactive</span></>}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-[#2a2a2a] rounded-lg text-gray-400 hover:text-white"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 size={15} /></button>
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
