import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-[#141414]">
        {children}
      </main>
    </div>
  )
}
