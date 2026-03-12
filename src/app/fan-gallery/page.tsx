'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'

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
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] mb-3">Community</p>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Fan Gallery</h1>
          <p className="text-[#c9a84c] text-lg max-w-2xl mx-auto">
            From match days to everyday style, our community shows how jerseys go beyond the pitch.
            Check out how members of the Jersey World B community rock their favorite kits.
          </p>
        </div>

        {loading ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="break-inside-avoid rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] animate-pulse" style={{ height: i % 2 === 0 ? 280 : 200 }} />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20">
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
                transition={{ delay: index * 0.04 }}
                className="break-inside-avoid bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#c9a84c]/40 transition-all group"
              >
                <div className="overflow-hidden">
                  <img
                    src={photo.image_url}
                    alt="Fan photo"
                    loading="lazy"
                    decoding="async"
                    className="w-full block object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {photo.caption && (
                  <div className="p-3">
                    <p className="text-base font-semibold text-[#c9a84c] leading-relaxed">{photo.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

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
