import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/ProductCard'

export const revalidate = 60

export default async function Home() {
  const supabase = await createClient()
  const [{ data: banners }, { data: products }, { data: promo }] = await Promise.all([
    supabase.from('banners').select('*').eq('active', true).order('created_at', { ascending: false }).limit(1),
    supabase.from('products').select('*, product_images(image_url, sort_order)').eq('featured', true).limit(4),
    supabase.from('promotions').select('*').eq('active', true).order('created_at', { ascending: false }).limit(1),
  ])
  const hero = banners?.[0] ?? null
  const promoItem = promo?.[0] ?? null

  return (
    <div>

      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden">
        {hero?.image_url ? (
          <>
            {/* Image drives the height, no fixed height, no gaps */}
            <div className="w-full h-[60vh] sm:h-[75vh] md:h-screen overflow-hidden">
            <img
              src={hero.image_url}
              alt={hero.title ?? 'Hero'}
              className="w-full h-full object-cover block"
            />
          </div>
            {/* Subtle gradient at bottom for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#161515] via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full flex flex-col items-center justify-center gap-4 bg-[#1a1919]"
            style={{ minHeight: '100svh' }}>
            <svg className="w-16 h-16 text-[#2e2d2d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#2e2d2d]">Add a banner in Admin</p>
          </div>
        )}

        {/* Optional text overlay, only shown if banner has title/button */}
        {hero && (hero.title || hero.button_text) && (
          <div className="absolute bottom-0 left-0 right-0 z-10 text-center px-5 pb-10 pt-20 bg-gradient-to-t from-[#161515] to-transparent">
            {hero.title && (
              <h1 className="text-3xl sm:text-6xl md:text-8xl font-black text-[#f0ede8] mb-3 tracking-tight leading-none">
                {hero.title}
              </h1>
            )}
            {hero.subtitle && (
              <p className="text-base text-[#a09890] mb-6 font-light">{hero.subtitle}</p>
            )}
            {hero.button_text && hero.button_link && (
              <Link href={hero.button_link}>
                <button className="px-7 py-3.5 bg-[#c9a84c] text-[#111] font-bold rounded-xl hover:bg-[#dfc06e] transition-all duration-300 uppercase tracking-[0.1em] text-sm">
                  {hero.button_text}
                </button>
              </Link>
            )}
          </div>
        )}
      </section>

      {/* ── Featured ── */}
      <section className="py-16 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-end justify-between mb-10 md:mb-14">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#c9a84c] mb-2">Hand Picked</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#f0ede8] tracking-tight">Featured Jerseys</h2>
            </div>
            <Link href="/shop" className="hidden md:block text-sm text-[#a09890] hover:text-[#c9a84c] transition-colors">View all →</Link>
          </div>
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {products.map((p: any, i: number) => (
                <ProductCard key={p.id} id={p.id} title={p.title} price={`$${p.price}`} image={p.product_images?.[0]?.image_url} index={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {[0,1,2,3].map(i => (
                <div key={i} className="aspect-square rounded-2xl bg-[#1f1e1e] border border-[#2e2d2d] flex items-center justify-center">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#2e2d2d]">Coming Soon</p>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-10 md:hidden">
            <Link href="/shop">
              <button className="w-full max-w-xs px-8 py-4 bg-[#c9a84c] text-[#111] font-bold rounded-xl text-sm uppercase tracking-[0.1em]">
                View All Jerseys
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-16 md:py-32 border-y border-[#2e2d2d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-10 md:mb-14">
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#c9a84c] mb-2">What We Offer</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#f0ede8] tracking-tight">Pricing</h2>
          </div>
          {promoItem?.image_url ? (
            <div className="flex justify-center">
              <div className="relative rounded-2xl overflow-hidden border border-[#2e2d2d] shadow-[0_8px_60px_#00000060] w-full" style={{ maxWidth: '420px', aspectRatio: '9/16' }}>
                <img src={promoItem.image_url} alt={promoItem.title ?? 'Pricing'} className="w-full h-full object-cover block" />
                {(promoItem.title || promoItem.discount_percentage) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111cc] via-transparent to-transparent flex items-end p-6">
                    <div>
                      {promoItem.title && <h3 className="text-xl font-black text-white mb-1">{promoItem.title}</h3>}
                      {promoItem.discount_percentage && <p className="text-[#c9a84c] font-bold">{promoItem.discount_percentage}% OFF</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="rounded-2xl bg-[#1f1e1e] border border-[#2e2d2d] flex flex-col items-center justify-center gap-4 w-full" style={{ maxWidth: '420px', aspectRatio: '9/16' }}>
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#2e2d2d]">Add Pricing Image in Admin</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="py-16 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-10 md:mb-14">
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#c9a84c] mb-2">The Difference</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#f0ede8] tracking-tight">Why Jersey World B</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { n: '01', title: 'Premium Quality', desc: 'Every jersey crafted from high-quality materials built to last the season.' },
              { n: '02', title: 'Massive Selection', desc: 'Soccer, basketball, football, baseball, hockey, we carry it all.' },
              { n: '03', title: 'Custom Options', desc: 'Add your name and number to make it uniquely yours.' },
            ].map((item) => (
              <div key={item.n} className="p-6 sm:p-8 bg-[#1f1e1e] border border-[#2e2d2d] rounded-2xl hover:border-[#c9a84c44] transition-all duration-300">
                <p className="text-4xl font-black text-[#c9a84c] mb-4">{item.n}</p>
                <h3 className="text-base font-bold text-[#f0ede8] mb-2">{item.title}</h3>
                <p className="text-sm text-[#5c5755] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
