'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadSizeChart } from '@/lib/uploadImage'
import { Trash2, Upload, GripVertical } from 'lucide-react'

export default function AdminSizeCharts() {
  const [charts, setCharts] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const load = async () => {
    const { data } = await supabase.from('size_charts').select('*').order('sort_order')
    setCharts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    for (let i = 0; i < files.length; i++) {
      const url = await uploadSizeChart(files[i])
      await supabase.from('size_charts').insert({ image_url: url, sort_order: charts.length + i })
    }
    setUploading(false)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this size chart?')) return
    await supabase.from('size_charts').delete().eq('id', id)
    load()
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('size_charts').update({ active: !current }).eq('id', id)
    load()
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Size Charts</h1>
          <p className="text-gray-500 text-sm mt-1">Manage size chart images shown on the Size Charts page</p>
        </div>
        <label className={`flex items-center gap-2 px-5 py-3 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all text-sm cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload size={16} />
          {uploading ? 'Uploading...' : 'Upload Charts'}
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-600">Loading...</div>
      ) : charts.length === 0 ? (
        <div className="text-center py-20 text-gray-600">No size charts yet. Upload one above.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {charts.map((chart) => (
            <div key={chart.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden group">
              <div className="relative" style={{ aspectRatio: '3/4' }}>
                <img src={chart.image_url} alt="Size chart" className="w-full h-full object-contain bg-white" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => handleDelete(chart.id)}
                    className="p-2 bg-red-500/90 text-white rounded-full hover:bg-red-500 transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">#{chart.sort_order + 1}</span>
                <button onClick={() => toggleActive(chart.id, chart.active)}
                  className={`text-xs px-2 py-1 rounded-full font-medium transition ${chart.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-500'}`}>
                  {chart.active ? 'Visible' : 'Hidden'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
