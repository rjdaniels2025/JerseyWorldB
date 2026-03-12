import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AdminSidebar />
      {/* Desktop: offset for sidebar. Mobile: offset for top bar + bottom tab bar */}
      <main className="md:ml-56 pt-14 pb-20 md:pb-0 md:pt-0 min-h-screen bg-[#111111]">
        {children}
      </main>
    </div>
  )
}
