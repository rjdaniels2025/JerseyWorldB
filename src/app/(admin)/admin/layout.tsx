'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (pathname === '/admin/login') {
      setAuthorized(true)
      return
    }
    const auth = sessionStorage.getItem('jwb_admin_auth')
    if (auth === 'true') {
      setAuthorized(true)
    } else {
      router.replace('/admin/login')
    }
  }, [pathname])

  if (!authorized) return null

  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div className="min-h-screen bg-[#111111]">
      <AdminSidebar />
      <main className="md:ml-56 pt-14 pb-20 md:pb-0 md:pt-0">
        {children}
      </main>
    </div>
  )
}
