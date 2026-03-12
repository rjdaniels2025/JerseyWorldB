'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'

const captions = [
  'More than a jersey, it\'s a statement.',
  'Represent your club. Represent the game.',
  'Built for fans of every beautiful game.',
  'Every jersey tells a story.',
  'From the pitch to the streets.',
  'Sports culture, everywhere.',
  'Your team. Your colors. Your style.',
  'Game day ready.',
  'Where legends are worn.',
]

export default function FanGallery() {
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('fan_gallery').select('*').eq('active', true).order('created_at', { ascending: false })
      setPhotos(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="bg-[#111111] min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] mb-3">Community</p>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Fan Gallery</h1>
          <p className="text-[#c9a84c] text-lg max-w-2xl mx-auto">
            From match days to everyday style, our community shows how jerseys go beyond the pitch.
            Check out how members of the Jersey World B community rock their favorite kits.
          </p>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-600">Loading...</div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-[#333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">No photos yet, check back soon!</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="break-inside-avoid bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#c9a84c]/40 transition-all group"
              >
                <div className="overflow-hidden">
                  <img src={photo.image_url} alt="Fan photo"
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3">
                  <p className="text-base font-semibold text-[#c9a84c] leading-relaxed">
                    {photo.caption || captions[index % captions.length]}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Want to be featured */}
        <div className="mt-20 text-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-12">
          <div className="w-16 h-16 bg-[#c9a84c]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Instagram size={28} className="text-[#c9a84c]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4">Want to be featured?</h2>
          <p className="text-gray-400 text-lg mb-6">
            Tag <span className="text-[#c9a84c] font-bold">@JerseyWorldB</span> on Instagram or TikTok for a chance to appear on our page.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="https://instagram.com/JerseyWorldB" target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all text-sm uppercase tracking-wide">
              Follow on Instagram
            </a>
            <a href="https://tiktok.com/@JerseyWorldB" target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 border border-[#333] text-gray-300 font-bold rounded-lg hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all text-sm uppercase tracking-wide">
              Follow on TikTok
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
