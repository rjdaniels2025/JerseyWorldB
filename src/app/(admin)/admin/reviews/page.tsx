'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadReviewImage } from '@/lib/uploadImage'
import { Plus, Trash2, ToggleLeft, ToggleRight, Upload } from 'lucide-react'

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const load = async () => {
    const { data } = await supabase.from('reviews').select('*').order('sort_order').order('created_at', { ascending: false })
    setReviews(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    for (let i = 0; i < files.length; i++) {
      const url = await uploadReviewImage(files[i])
      await supabase.from('reviews').insert({ image_url: url, sort_order: reviews.length + i, active: true })
    }
    setUploading(false)
    load()
    e.target.value = ''
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review image?')) return
    await supabase.from('reviews').delete().eq('id', id)
    load()
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('reviews').update({ active: !current }).eq('id', id)
    load()
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Reviews</h1>
          <p className="text-gray-500 text-sm mt-1">Upload screenshots or photos of customer reviews</p>
        </div>
        <label className={`flex items-center gap-2 px-5 py-3 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all text-sm cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload size={16} />
          {uploading ? 'Uploading...' : 'Add Reviews'}
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-600">Loading...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 text-gray-600">No review images yet. Upload screenshots of customer reviews above.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden group">
              <div className="relative">
                <img src={review.image_url} alt="Review" className="w-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => handleDelete(review.id)}
                    className="p-2 bg-red-500/90 text-white rounded-full hover:bg-red-500 transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="px-3 py-2 flex items-center justify-between border-t border-[#2a2a2a]">
                <span className="text-xs text-gray-600">{new Date(review.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</span>
                <button onClick={() => toggleActive(review.id, review.active)}
                  className={`text-xs px-2 py-1 rounded-full font-medium transition ${review.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-500'}`}>
                  {review.active ? 'Visible' : 'Hidden'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
