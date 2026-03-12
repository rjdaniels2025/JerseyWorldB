import { createClient } from '@/lib/supabase/server'
import { Package, Users, Megaphone, TrendingUp } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: productCount },
    { count: leadCount },
    { count: promoCount },
    { data: recentLeads },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('promotions').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('leads').select('*, products(title)').order('created_at', { ascending: false }).limit(8),
  ])

  const stats = [
    { label: 'Total Products', value: productCount ?? 0, icon: Package, color: 'text-blue-400' },
    { label: 'Total Leads', value: leadCount ?? 0, icon: Users, color: 'text-green-400' },
    { label: 'Active Promotions', value: promoCount ?? 0, icon: Megaphone, color: 'text-purple-400' },
    { label: 'New Leads', value: recentLeads?.filter(l => l.status === 'New').length ?? 0, icon: TrendingUp, color: 'text-[#c9a84c]' },
  ]

  const statusColors: Record<string, string> = {
    New: 'bg-green-500/20 text-green-400 border-green-500/30',
    Contacted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back. Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">{label}</span>
              <Icon size={20} className={color} />
            </div>
            <p className="text-3xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
        <div className="px-6 py-4 border-b border-[#2a2a2a]">
          <h2 className="font-bold text-white">Recent Leads</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                {['Customer', 'Product', 'Phone', 'City', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentLeads && recentLeads.length > 0 ? recentLeads.map((lead: any) => (
                <tr key={lead.id} className="border-b border-[#222] hover:bg-[#1f1f1f] transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{lead.customer_name}</td>
                  <td className="px-6 py-4 text-gray-400">{lead.products?.title ?? '—'}</td>
                  <td className="px-6 py-4 text-gray-400">{lead.phone ?? '—'}</td>
                  <td className="px-6 py-4 text-gray-400">{lead.city ?? '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${statusColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-600">No leads yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
