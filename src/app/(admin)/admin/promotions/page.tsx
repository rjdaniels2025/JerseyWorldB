'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadPromotionImage } from '@/lib/uploadImage'
import { Trash2, ToggleLeft, ToggleRight, Upload } from 'lucide-react'

export default function AdminPricing() {
  const [items, setItems] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const load = async () => {
    const { data } = await supabase.from('promotions').select('*').order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    for (const file of files) {
      const image_url = await uploadPromotionImage(file)
      if (image_url) {
        await supabase.from('promotions').insert({ image_url, active: true })
      }
    }
    setUploading(false)
    e.target.value = ''
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
          <p className="text-gray-500 text-sm mt-1">Upload pricing images — shown 2 per row on the homepage. Select multiple to upload at once.</p>
        </div>
        <label className={`flex items-center gap-2 px-5 py-3 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all text-sm cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload size={16} />
          {uploading ? 'Uploading...' : 'Add Images'}
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-600">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-600">No pricing images yet. Upload images above.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
              <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
                {item.image_url
                  ? <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center bg-[#222]"><p className="text-[10px] text-[#444]">No image</p></div>}
              </div>
              <div className="p-3 flex items-center justify-between">
                <button onClick={() => toggleActive(item.id, item.active)} className="flex items-center gap-1 text-xs">
                  {item.active
                    ? <><ToggleRight size={16} className="text-[#c9a84c]" /><span className="text-[#c9a84c]">Active</span></>
                    : <><ToggleLeft size={16} className="text-gray-600" /><span className="text-gray-600">Inactive</span></>}
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
