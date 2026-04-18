import { createClient } from '@/lib/supabase/server'
import TeamPackagesClient from '@/components/TeamPackagesClient'

export const revalidate = 60

export default async function TeamPackages() {
  const supabase = await createClient()
  const [{ data: packages }, { data: teamPhotos }] = await Promise.all([
    supabase
      .from('team_packages')
      .select('*, team_package_images(id, image_url, sort_order)')
      .eq('active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('team_photos')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true }),
  ])

  return <TeamPackagesClient packages={packages ?? []} teamPhotos={teamPhotos ?? []} />
}
