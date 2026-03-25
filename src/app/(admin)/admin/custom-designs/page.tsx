'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadCustomDesign } from '@/lib/uploadImage'
import { Plus, Trash2, ToggleLeft, ToggleRight, Upload } from 'lucide-react'

export default function AdminCustomDesigns() {
  const [designs, setDesigns] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const load = async () => {
    const { data } = await supabase.from('custom_designs').select('*').order('created_at', { ascending: false })
    setDesigns(data ?? [])
  }

  useEffect(() => { load() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile) return
    setUploading(true)
    const imageUrl = await uploadCustomDesign(imageFile)
    await supabase.from('custom_designs').insert({ image_url: imageUrl, caption: caption || null, active: true })
    setUploading(false)
    setShowForm(false)
    setImageFile(null)
    setCaption('')
    load()
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('custom_designs').update({ active: !current }).eq('id', id)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this design?')) return
    await supabase.from('custom_designs').delete().eq('id', id)
    load()
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Custom Designs</h1>
          <p className="text-gray-500 text-sm mt-1">{designs.length} designs</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all text-sm">
          <Plus size={15} /> Add
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-6">Add Custom Design</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Photo</label>
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-[#333] rounded-lg cursor-pointer hover:border-[#c9a84c] transition-colors">
                  <Upload size={16} className="text-[#c9a84c]" />
                  <span className="text-sm text-gray-400">{imageFile ? imageFile.name : 'Click to upload'}</span>
                  <input type="file" accept="image/*" className="hidden" required onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
                </label>
                {imageFile && <img src={URL.createObjectURL(imageFile)} alt="" className="mt-2 h-32 w-full object-cover rounded-lg border border-[#333]" />}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Caption <span className="text-gray-600">(optional)</span></label>
                <input value={caption} onChange={e => setCaption(e.target.value)}
                  placeholder="e.g. Custom Argentina away kit"
                  className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={uploading || !imageFile}
                  className="flex-1 py-2.5 bg-[#c9a84c] text-black font-bold rounded-lg text-sm disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Upload Design'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-[#333] text-gray-400 rounded-lg text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {designs.length === 0 ? (
        <div className="text-center py-20 text-gray-600">No designs yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {designs.map(d => (
            <div key={d.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
              <img src={d.image_url} alt="" className="w-full aspect-square object-cover" />
              <div className="p-3">
                {d.caption && <p className="text-xs text-gray-500 italic mb-2 line-clamp-2">{d.caption}</p>}
                <div className="flex items-center justify-between">
                  <button onClick={() => toggleActive(d.id, d.active)} className="flex items-center gap-1 text-xs">
                    {d.active
                      ? <><ToggleRight size={16} className="text-[#c9a84c]" /><span className="text-[#c9a84c]">Visible</span></>
                      : <><ToggleLeft size={16} className="text-gray-600" /><span className="text-gray-600">Hidden</span></>}
                  </button>
                  <button onClick={() => handleDelete(d.id)} className="p-1 hover:bg-red-500/10 rounded text-gray-500 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
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
