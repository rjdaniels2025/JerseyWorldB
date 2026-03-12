import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#161515]">
      <AdminSidebar />
      {/* Desktop: offset for sidebar. Mobile: offset for top bar + bottom tab bar */}
      <main className="md:ml-56 pt-14 pb-20 md:pb-0 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  )
}
