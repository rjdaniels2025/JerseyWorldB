'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

const SIZE_CHARTS = [
  'https://gvhtrsmnrfffhfjehsif.supabase.co/storage/v1/object/public/Sizing%20Charts/PHOTO-2026-03-31-16-24-02%2010.jpg',
  'https://gvhtrsmnrfffhfjehsif.supabase.co/storage/v1/object/public/Sizing%20Charts/PHOTO-2026-03-31-16-24-02%206.jpg',
  'https://gvhtrsmnrfffhfjehsif.supabase.co/storage/v1/object/public/Sizing%20Charts/PHOTO-2026-03-31-16-24-02%207.jpg',
  'https://gvhtrsmnrfffhfjehsif.supabase.co/storage/v1/object/public/Sizing%20Charts/PHOTO-2026-03-31-16-24-02%208.jpg',
  'https://gvhtrsmnrfffhfjehsif.supabase.co/storage/v1/object/public/Sizing%20Charts/PHOTO-2026-03-31-16-24-02%209.jpg',
]

export default function SizeCharts() {
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] mb-3">Jersey World B</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Size Charts</h1>
          <p className="text-[#a09890] max-w-xl mx-auto">Find your perfect fit. Click any chart to view it in full size.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SIZE_CHARTS.map((url, i) => (
            <button key={i} onClick={() => setLightbox(url)}
              className="group bg-[#111111] rounded-2xl overflow-hidden border border-[#2e2d2d] hover:border-[#c9a84c] transition-all duration-300 hover:shadow-[0_0_30px_#c9a84c20] focus:outline-none">
              <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
                <img src={url} alt={'Size chart ' + (i + 1)} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">Click to expand</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition">
            <X size={20} />
          </button>
          <img src={lightbox} alt="Size chart" className="max-w-full max-h-[90vh] object-contain rounded-xl" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}
