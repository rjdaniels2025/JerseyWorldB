'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadBannerImage } from '@/lib/uploadImage'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Upload } from 'lucide-react'

export default function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ title: '', subtitle: '', button_text: '', button_link: '', active: true })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const load = async () => {
    const { data } = await supabase.from('banners').select('*').order('created_at', { ascending: false })
    setBanners(data ?? [])
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm({ title: '', subtitle: '', button_text: '', button_link: '', active: true })
    setImageFile(null)
    setShowForm(true)
  }
  const openEdit = (b: any) => {
    setEditing(b)
    setForm({ title: b.title ?? '', subtitle: b.subtitle ?? '', button_text: b.button_text ?? '', button_link: b.button_link ?? '', active: b.active })
    setImageFile(null)
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    let image_url = editing?.image_url ?? null

    if (imageFile) {
      image_url = await uploadBannerImage(imageFile)
    }

    const data = {
      title: form.title || null,
      subtitle: form.subtitle || null,
      button_text: form.button_text || null,
      button_link: form.button_link || null,
      active: form.active,
      image_url,
    }

    if (editing) {
      await supabase.from('banners').update(data).eq('id', editing.id)
    } else {
      await supabase.from('banners').insert(data)
    }
    setUploading(false)
    setShowForm(false)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return
    await supabase.from('banners').delete().eq('id', id)
    load()
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('banners').update({ active: !current }).eq('id', id)
    load()
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Banners</h1>
          <p className="text-gray-500 text-sm mt-1">Control the homepage hero image</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-3 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all text-sm">
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-2">{editing ? 'Edit' : 'Add'} Banner</h2>
            <p className="text-xs text-gray-500 mb-6">All fields are optional, upload just an image if you prefer.</p>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Hero Image <span className="text-gray-600">(optional)</span></label>
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-[#333] rounded-lg cursor-pointer hover:border-[#c9a84c] transition-colors">
                  <Upload size={18} className="text-[#c9a84c]" />
                  <span className="text-sm text-gray-400">{imageFile ? imageFile.name : 'Click to upload image'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
                </label>
                {editing?.image_url && !imageFile && (
                  <img src={editing.image_url} alt="" className="mt-2 h-24 w-full object-cover rounded-lg border border-[#333]" />
                )}
                {imageFile && (
                  <img src={URL.createObjectURL(imageFile)} alt="" className="mt-2 h-24 w-full object-cover rounded-lg border border-[#333]" />
                )}
              </div>
              {[
                { label: 'Title', key: 'title', placeholder: 'e.g. New Arrivals Just Dropped' },
                { label: 'Subtitle', key: 'subtitle', placeholder: 'e.g. Shop the latest collection' },
                { label: 'Button Text', key: 'button_text', placeholder: 'e.g. Shop Now' },
                { label: 'Button Link', key: 'button_link', placeholder: 'e.g. /shop' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm text-gray-400 mb-1">{label} <span className="text-gray-600">(optional)</span></label>
                  <input value={(form as any)[key]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-lg text-white text-sm placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
              ))}
              <label className="flex items-center gap-3 cursor-pointer pt-1">
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({...f, active: e.target.checked}))} className="w-4 h-4 accent-[#c9a84c]" />
                <span className="text-sm text-gray-300">Active (show on homepage)</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={uploading}
                  className="flex-1 py-2.5 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all text-sm disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Save Banner'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-[#333] text-gray-400 rounded-lg text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              {['Image', 'Title', 'Button', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {banners.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-600">No banners yet</td></tr>
            ) : banners.map(b => (
              <tr key={b.id} className="border-b border-[#222] hover:bg-[#1f1f1f] transition-colors">
                <td className="px-6 py-4">
                  {b.image_url
                    ? <img src={b.image_url} alt="" className="w-20 h-12 object-cover rounded-lg border border-[#333]" />
                    : <div className="w-20 h-12 bg-[#222] rounded-lg border border-[#333] flex items-center justify-center"><span className="text-[#444] text-xs">No img</span></div>}
                </td>
                <td className="px-6 py-4 font-medium text-white">{b.title ?? <span className="text-[#444]">—</span>}</td>
                <td className="px-6 py-4 text-gray-400">{b.button_text ?? <span className="text-[#444]">—</span>}</td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleActive(b.id, b.active)} className="flex items-center gap-2 text-sm">
                    {b.active
                      ? <><ToggleRight size={20} className="text-[#c9a84c]" /><span className="text-[#c9a84c]">Active</span></>
                      : <><ToggleLeft size={20} className="text-gray-600" /><span className="text-gray-600">Inactive</span></>}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(b)} className="p-1.5 hover:bg-[#2a2a2a] rounded-lg text-gray-400 hover:text-white"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(b.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 size={15} /></button>
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
