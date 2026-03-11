import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/ProductCard'

export const revalidate = 60

export default async function Home() {
  const supabase = await createClient()

  const [
    { data: banners },
    { data: products },
    { data: promoSection },
  ] = await Promise.all([
    supabase.from('banners').select('*').eq('active', true).order('created_at', { ascending: false }).limit(1),
    supabase.from('products').select('*, product_images(image_url, sort_order)').eq('featured', true).order('created_at', { ascending: false }).limit(4),
    supabase.from('promotions').select('*').eq('active', true).order('created_at', { ascending: false }).limit(1),
  ])

  const hero = banners?.[0] ?? null
  const promo = promoSection?.[0] ?? null

  return (
    <div className="bg-[#111111]">

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

        {hero?.image_url ? (
          <img src={hero.image_url} alt={hero.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[#1a1a1a] flex flex-col items-center justify-center">
            <svg className="w-24 h-24 text-[#333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-[#333] text-sm mt-3 font-medium tracking-widest uppercase">Hero Image</p>
          </div>
        )}

        {/* Overlay for readability if image exists */}
        {hero?.image_url && <div className="absolute inset-0 bg-black/40" />}

        {/* Text overlay if banner has content */}
        {hero && (hero.title || hero.button_text) && (
          <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
            {hero.title && <h1 className="text-5xl md:text-7xl font-black text-white mb-4">{hero.title}</h1>}
            {hero.subtitle && <p className="text-xl text-gray-300 mb-8">{hero.subtitle}</p>}
            {hero.button_text && hero.button_link && (
              <Link href={hero.button_link}>
                <button className="px-8 py-4 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all uppercase tracking-wide">
                  {hero.button_text}
                </button>
              </Link>
            )}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-30" />
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-28 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] mb-3">Hand Picked</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Featured Jerseys</h2>
            <p className="text-gray-400 text-lg">Our most popular picks right now.</p>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product: any, index: number) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={`$${product.price}`}
                  image={product.product_images?.[0]?.image_url}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[0,1,2,3].map(i => (
                <div key={i} className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl aspect-square flex items-center justify-center">
                  <p className="text-[#333] text-xs tracking-widest uppercase">No products yet</p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/shop">
              <button className="px-8 py-4 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all uppercase tracking-wide text-sm">
                View All Jerseys
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Promo / Pricing Section */}
      <section className="bg-[#111] border-y border-[#2a2a2a]">
        {promo?.image_url ? (
          <div className="relative h-[500px]">
            <img src={promo.image_url} alt={promo.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-4xl font-black text-white mb-2">{promo.title}</h3>
                {promo.discount_percentage && (
                  <p className="text-[#c9a84c] font-bold text-xl">{promo.discount_percentage}% OFF</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[500px] bg-[#161616] flex flex-col items-center justify-center">
            <svg className="w-24 h-24 text-[#333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-[#333] text-sm mt-3 font-medium tracking-widest uppercase">Section Image</p>
          </div>
        )}
      </section>

      {/* Why Us */}
      <section className="bg-[#1a1a1a] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center text-white">Why Jersey World B</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Premium Quality', desc: 'Every jersey is crafted from high-quality materials built to last.' },
              { title: 'Huge Selection', desc: 'Soccer, basketball, football, baseball, hockey — we carry it all.' },
              { title: 'Custom Options', desc: 'Add your name and number to make it truly yours.' },
            ].map((item, index) => (
              <div key={index} className="text-center p-8 bg-[#111] border border-[#2a2a2a] rounded-xl hover:border-[#c9a84c]/40 transition-colors">
                <div className="w-16 h-16 bg-[#c9a84c] rounded-full mx-auto mb-6 flex items-center justify-center text-black font-black text-2xl">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
