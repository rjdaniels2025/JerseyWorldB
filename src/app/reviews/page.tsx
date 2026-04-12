'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Star } from 'lucide-react'

const REVIEW_LINK = 'https://g.page/r/CYk4gyifupn8EBM/review'

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([])
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true })
      setReviews(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] mb-3">What Our Customers Say</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Reviews</h1>
          <p className="text-[#a09890] max-w-xl mx-auto mb-8">Real customers, real jerseys, real satisfaction.</p>
          
            href={REVIEW_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a84c] text-black font-bold rounded-xl hover:bg-[#b8943d] transition text-sm uppercase tracking-wide"
          >
            <Star size={16} fill="black" />
            Leave a Review
          </a>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#a09890]">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#a09890] mb-6">No reviews yet — be the first!</p>
            
              href={REVIEW_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a84c] text-black font-bold rounded-xl hover:bg-[#b8943d] transition text-sm"
            >
              <Star size={16} fill="black" />
              Leave a Review
            </a>
          </div>
        ) : (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="break-inside-avoid cursor-pointer rounded-2xl overflow-hidden border border-[#2e2d2d] hover:border-[#c9a84c] transition-all duration-300 hover:shadow-[0_0_30px_#c9a84c20]"
                  onClick={() => setLightbox(review.image_url)}
                >
                  <img src={review.image_url} alt="Customer review" className="w-full object-cover" />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition"
          >
            <X size={20} />
          </button>
          <img
            src={lightbox}
            alt="Review"
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
