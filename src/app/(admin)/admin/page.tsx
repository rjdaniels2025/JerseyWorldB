import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const revalidate = 0

export default async function AdminDashboard() {
  const supabase = await createClient()
  const [
    { count: productCount },
    { count: leadCount },
    { count: newLeadCount },
    { data: recentLeads },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('leads').select('*, products(title)').order('created_at', { ascending: false }).limit(8),
  ])

  const stats = [
    { label: 'Products', value: productCount ?? 0, href: '/admin/products', color: 'text-[#c9a84c]' },
    { label: 'Total Leads', value: leadCount ?? 0, href: '/admin/orders', color: 'text-blue-400' },
    { label: 'New Leads', value: newLeadCount ?? 0, href: '/admin/orders', color: 'text-green-400' },
  ]

  const statusColor = (s: string) => {
    if (s === 'new') return 'bg-blue-500/15 text-blue-400'
    if (s === 'contacted') return 'bg-yellow-500/15 text-yellow-400'
    if (s === 'completed') return 'bg-green-500/15 text-green-400'
    return 'bg-gray-500/15 text-gray-400'
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-8">
        {stats.map(s => (
          <Link key={s.label} href={s.href}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 sm:p-6 hover:border-[#3a3a3a] transition-all">
            <p className={`text-2xl sm:text-3xl font-black mb-1 ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent leads as cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-[#c9a84c] hover:underline">View all</Link>
        </div>

        {!recentLeads || recentLeads.length === 0 ? (
          <div className="text-center py-16 text-gray-600 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl">
            No leads yet
          </div>
        ) : (
          <div className="space-y-3">
            {recentLeads.map((lead: any) => (
              <div key={lead.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white truncate">{lead.customer_name}</p>
                    <p className="text-sm text-gray-500 truncate">{lead.email}</p>
                    {lead.products?.title && (
                      <p className="text-xs text-[#c9a84c] mt-1 truncate">{lead.products.title}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                    <p className="text-[10px] text-gray-700">
                      {new Date(lead.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
