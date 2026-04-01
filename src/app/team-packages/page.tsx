import { createClient } from '@/lib/supabase/server'
import TeamPackagesClient from '@/components/TeamPackagesClient'

export const revalidate = 60

export default async function TeamPackages() {
  const supabase = await createClient()
  const { data: packages } = await supabase
    .from('team_packages')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })

  return <TeamPackagesClient packages={packages ?? []} />
}
