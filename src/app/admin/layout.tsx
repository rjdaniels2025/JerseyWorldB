import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-[#141414]">
        {children}
      </main>
    </div>
  )
}
