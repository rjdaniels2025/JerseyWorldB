import { createClient } from '@/lib/supabase/server'

export const revalidate = 0

export default async function CustomDesignsPage() {
  const supabase = await createClient()
  const { data: designs } = await supabase
    .from('custom_designs')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#c9a84c] mb-3">Made For You</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#f0ede8] tracking-tight mb-4">
            Custom Designs
          </h1>
          <p className="text-[#5c5755] text-base max-w-xl mx-auto leading-relaxed">
            Every jersey tells a story. Browse our custom work and reach out to start yours.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mb-14">
          
            href="https://instagram.com/JerseyWorldB"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#c9a84c] text-[#111] font-bold rounded-xl hover:bg-[#dfc06e] transition-all duration-300 text-sm uppercase tracking-[0.1em]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
            Message Us for Custom Design Inquiries
          </a>
        </div>

        {/* Gallery grid */}
        {!designs || designs.length === 0 ? (
          <div className="text-center py-24 text-[#3a3838]">
            <p className="text-5xl mb-4">✏️</p>
            <p className="text-sm tracking-[0.2em] uppercase">Custom designs coming soon</p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
            {designs.map((design: any) => (
              <div key={design.id} className="break-inside-avoid group relative overflow-hidden rounded-2xl border border-[#2e2d2d] hover:border-[#c9a84c44] transition-all duration-300">
                <img
                  src={design.image_url}
                  alt={design.caption ?? 'Custom design'}
                  className="w-full block object-cover"
                />
                {design.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111dd] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm font-medium">{design.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
