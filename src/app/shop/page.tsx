import { createClient } from '@/lib/supabase/server'
import ShopClient from '@/components/ShopClient'

export const revalidate = 60

export default async function Shop() {
  const supabase = await createClient()
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*, categories(name, slug), product_images(image_url, sort_order)').order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('name'),
  ])
  return <ShopClient products={products ?? []} categories={categories ?? []} />
}
