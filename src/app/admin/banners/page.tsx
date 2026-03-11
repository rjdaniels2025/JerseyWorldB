'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import type { Banner } from '@/lib/supabase/types'

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Banner | null>(null)
  const [form, setForm] = useState({ title: '', subtitle: '', button_text: '', button_link: '', active: false })
  const supabase = createClient()

  const load = async () => {
    const { data } = await supabase.from('banners').select('*').order('created_at', { ascending: false })
    setBanners(data ?? [])
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm({ title: '', subtitle: '', button_text: '', button_link: '', active: false }); setShowForm(true) }
  const openEdit = (b: Banner) => { setEditing(b); setForm({ title: b.title, subtitle: b.subtitle ?? '', button_text: b.button_text ?? '', button_link: b.button_link ?? '', active: b.active }); setShowForm(true) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      await supabase.from('banners').update(form).eq('id', editing.id)
    } else {
      await supabase.from('banners').insert(form)
    }
    setShowForm(false)
    load()
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('banners').update({ active: !current }).eq('id', id)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return
    await supabase.from('banners').delete().eq('id', id)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Banners</h1>
          <p className="text-gray-500 text-sm mt-1">Manage homepage hero banners</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all text-sm">
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-6">{editing ? 'Edit' : 'Add'} Banner</h2>
            <form onSubmit={handleSave} className="space-y-4">
              {[
                { label: 'Title', key: 'title', required: true },
                { label: 'Subtitle', key: 'subtitle' },
                { label: 'Button Text', key: 'button_text' },
                { label: 'Button Link', key: 'button_link' },
              ].map(({ label, key, required }) => (
                <div key={key}>
                  <label className="block text-sm text-gray-400 mb-1">{label}</label>
                  <input value={(form as any)[key]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))} required={required}
                    className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                </div>
              ))}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({...f, active: e.target.checked}))} className="w-4 h-4 accent-[#c9a84c]" />
                <span className="text-sm text-gray-300">Active (show on site)</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all text-sm">Save</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-[#333] text-gray-400 rounded-lg hover:border-[#555] transition-all text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              {['Title', 'Subtitle', 'Button', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {banners.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-600">No banners yet</td></tr>
            ) : banners.map(b => (
              <tr key={b.id} className="border-b border-[#222] hover:bg-[#1f1f1f] transition-colors">
                <td className="px-6 py-4 font-medium text-white">{b.title}</td>
                <td className="px-6 py-4 text-gray-400">{b.subtitle ?? '—'}</td>
                <td className="px-6 py-4 text-gray-400">{b.button_text ?? '—'}</td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleActive(b.id, b.active)} className="flex items-center gap-2 text-sm">
                    {b.active
                      ? <><ToggleRight size={20} className="text-[#c9a84c]" /><span className="text-[#c9a84c]">Active</span></>
                      : <><ToggleLeft size={20} className="text-gray-600" /><span className="text-gray-600">Inactive</span></>}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(b)} className="p-1.5 hover:bg-[#2a2a2a] rounded-lg transition-colors text-gray-400 hover:text-white"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(b.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-gray-400 hover:text-red-400"><Trash2 size={15} /></button>
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
