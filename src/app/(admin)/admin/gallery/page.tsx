'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, ToggleLeft, ToggleRight, Upload } from 'lucide-react'

export default function AdminGallery() {
  const [photos, setPhotos] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const load = async () => {
    const { data } = await supabase.from('fan_gallery').select('*').order('created_at', { ascending: false })
    setPhotos(data ?? [])
  }

  useEffect(() => { load() }, [])

  const deleteStorageFile = async (url: string) => {
    try {
      const parts = url.split('/object/public/gallery/')
      if (parts[1]) await supabase.storage.from('gallery').remove([decodeURIComponent(parts[1])])
    } catch (e) { console.error(e) }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile) return
    setUploading(true)
    const ext = imageFile.name.split('.').pop()
    const path = 'fan-' + Date.now() + '.' + ext
    await supabase.storage.from('gallery').upload(path, imageFile, { upsert: true })
    const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(path)
    await supabase.from('fan_gallery').insert({ image_url: urlData.publicUrl, caption: caption || null, active: true })
    setUploading(false)
    setShowForm(false)
    setImageFile(null)
    setCaption('')
    load()
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('fan_gallery').update({ active: !current }).eq('id', id)
    load()
  }

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Delete this photo?')) return
    await deleteStorageFile(imageUrl)
    await supabase.from('fan_gallery').delete().eq('id', id)
    load()
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Fan Gallery</h1>
          <p className="text-gray-500 text-sm mt-1">{photos.length} photos</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all text-sm">
          <Plus size={15} /> Add Photo
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-6">Add Fan Photo</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Photo</label>
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-[#333] rounded-lg cursor-pointer hover:border-[#c9a84c] transition-colors">
                  <Upload size={16} className="text-[#c9a84c]" />
                  <span className="text-sm text-gray-400">{imageFile ? imageFile.name : 'Click to upload photo'}</span>
                  <input type="file" accept="image/*" className="hidden" required
                    onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
                </label>
                {imageFile && (
                  <img src={URL.createObjectURL(imageFile)} alt="" className="mt-2 h-32 w-full object-cover rounded-lg border border-[#333]" />
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Caption <span className="text-gray-600">(optional)</span></label>
                <input
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder="e.g. Rocking the new Inter Miami away kit!"
                  className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-lg text-white text-sm placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={uploading || !imageFile}
                  className="flex-1 py-2.5 bg-[#c9a84c] text-black font-bold rounded-lg text-sm disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-[#333] text-gray-400 rounded-lg text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {photos.length === 0 ? (
        <div className="text-center py-20 text-gray-600">No photos yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
              <img src={photo.image_url} alt="" className="w-full aspect-square object-cover" />
              <div className="p-3">
                {photo.caption && (
                  <p className="text-xs text-[#c9a84c] mb-2 line-clamp-2">{photo.caption}</p>
                )}
                <div className="flex items-center justify-between">
                  <button onClick={() => toggleActive(photo.id, photo.active)} className="flex items-center gap-1 text-xs">
                    {photo.active
                      ? <><ToggleRight size={16} className="text-[#c9a84c]" /><span className="text-[#c9a84c]">Visible</span></>
                      : <><ToggleLeft size={16} className="text-gray-600" /><span className="text-gray-600">Hidden</span></>}
                  </button>
                  <button onClick={() => handleDelete(photo.id, photo.image_url)}
                    className="p-1 hover:bg-red-500/10 rounded text-gray-500 hover:text-red-400 transition-colors">
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
