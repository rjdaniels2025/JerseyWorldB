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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {hero?.image_url ? (
          <>
            <img src={hero.image_url} alt={hero.title ?? 'Hero'}
              className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#18181840] to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <svg className="w-16 h-16 text-[#2e2d2d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#2e2d2d]">Hero Image</p>
          </div>
        )}

        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c60] to-transparent" />

        {hero && (hero.title || hero.button_text) && (
          <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
            {hero.title && (
              <h1 className="text-6xl md:text-8xl font-black text-[#f0ede8] mb-4 tracking-tight leading-none">
                {hero.title}
              </h1>
            )}
            {hero.subtitle && <p className="text-lg text-[#a09890] mb-10 font-light">{hero.subtitle}</p>}
            {hero.button_text && hero.button_link && (
              <Link href={hero.button_link}>
                <button className="px-8 py-4 bg-[#c9a84c] text-[#111] font-bold rounded-xl hover:bg-[#dfc06e] transition-all duration-300 uppercase tracking-[0.1em] text-sm">
                  {hero.button_text}
                </button>
              </Link>
            )}
          </div>
        )}

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 bg-gradient-to-b from-[#c9a84c60] to-transparent" />
        </div>
      </section>

      {/* ── Featured ── */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#c9a84c] mb-3">Hand Picked</p>
              <h2 className="text-4xl md:text-5xl font-black text-[#f0ede8] tracking-tight">Featured Jerseys</h2>
            </div>
            <Link href="/shop" className="hidden md:block text-sm text-[#a09890] hover:text-[#c9a84c] transition-colors">
              View all →
            </Link>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((p: any, i: number) => (
                <ProductCard key={p.id} id={p.id} title={p.title}
                  price={`$${p.price}`} image={p.product_images?.[0]?.image_url} index={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[0,1,2,3].map(i => (
                <div key={i} className="aspect-square rounded-2xl bg-[#1f1e1e] border border-[#2e2d2d] flex items-center justify-center">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#2e2d2d]">Coming Soon</p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12 md:hidden">
            <Link href="/shop">
              <button className="px-8 py-3.5 bg-[#c9a84c] text-[#111] font-bold rounded-xl text-sm uppercase tracking-[0.1em]">
                View All Jerseys
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Promo Section ── */}
      <section className="border-y border-[#2e2d2d]">
        {promoItem?.image_url ? (
          <div className="relative h-[520px] overflow-hidden">
            <img src={promoItem.image_url} alt={promoItem.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
              <h3 className="text-4xl font-black text-[#f0ede8]">{promoItem.title}</h3>
              {promoItem.discount_percentage && (
                <p className="text-[#c9a84c] font-bold text-xl mt-2">{promoItem.discount_percentage}% OFF</p>
              )}
            </div>
          </div>
        ) : (
          <div className="h-[520px] flex flex-col items-center justify-center gap-4">
            <svg className="w-14 h-14 text-[#2e2d2d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#2e2d2d]">Section Image</p>
          </div>
        )}
      </section>

      {/* ── Why Us ── */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#c9a84c] mb-3">The Difference</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#f0ede8] tracking-tight">Why Jersey World B</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { n: '01', title: 'Premium Quality', desc: 'Every jersey crafted from high-quality materials built to last the season.' },
              { n: '02', title: 'Massive Selection', desc: 'Soccer, basketball, football, baseball, hockey — we carry it all.' },
              { n: '03', title: 'Custom Options', desc: 'Add your name and number to make it uniquely yours.' },
            ].map((item) => (
              <div key={item.n}
                className="group relative p-8 bg-[#1f1e1e] border border-[#2e2d2d] rounded-2xl hover:border-[#c9a84c44] transition-all duration-300">
                <p className="text-5xl font-black text-[#2e2d2d] mb-6">{item.n}</p>
                <h3 className="text-lg font-bold text-[#f0ede8] mb-3">{item.title}</h3>
                <p className="text-sm text-[#5c5755] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
