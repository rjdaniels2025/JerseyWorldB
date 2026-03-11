'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Eye } from 'lucide-react'
import type { Lead } from '@/lib/supabase/types'

const statusColors: Record<string, string> = {
  New: 'bg-green-500/20 text-green-400 border-green-500/30',
  Contacted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [selected, setSelected] = useState<Lead | null>(null)
  const [filter, setFilter] = useState('all')
  const supabase = createClient()

  const load = async () => {
    const { data } = await supabase.from('leads').select('*, products(title)').order('created_at', { ascending: false })
    setLeads((data as any) ?? [])
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('leads').update({ status }).eq('id', id)
    load()
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: status as any } : null)
  }

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Leads</h1>
          <p className="text-gray-500 text-sm mt-1">{leads.length} total requests</p>
        </div>
        <div className="flex gap-2">
          {['all', 'New', 'Contacted', 'Closed'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === s ? 'bg-[#c9a84c] text-black' : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#2a2a2a]'}`}>
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-6">Lead Details</h2>
            <div className="space-y-3 text-sm mb-6">
              {[
                ['Customer', selected.customer_name],
                ['Email', selected.email],
                ['Phone', selected.phone ?? '—'],
                ['City', selected.city ?? '—'],
                ['Product', (selected as any).products?.title ?? '—'],
                ['Size', selected.size ?? '—'],
                ['Custom Name', selected.custom_name ?? '—'],
                ['Custom Number', selected.custom_number ?? '—'],
                ['Message', selected.message ?? '—'],
                ['Submitted', new Date(selected.created_at).toLocaleString()],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-4">
                  <span className="text-gray-500 w-32 flex-shrink-0">{label}</span>
                  <span className="text-white">{value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mb-4">
              {['New', 'Contacted', 'Closed'].map(s => (
                <button key={s} onClick={() => updateStatus(selected.id, s)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${selected.status === s ? 'bg-[#c9a84c] text-black' : 'border border-[#333] text-gray-400 hover:border-[#c9a84c] hover:text-[#c9a84c]'}`}>
                  {s}
                </button>
              ))}
            </div>
            <button onClick={() => setSelected(null)} className="w-full py-2.5 border border-[#333] text-gray-400 rounded-lg hover:border-[#555] transition-all text-sm">Close</button>
          </div>
        </div>
      )}

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              {['Customer', 'Product', 'Phone', 'City', 'Status', 'Date', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-600">No leads yet</td></tr>
            ) : filtered.map((lead: any) => (
              <tr key={lead.id} className="border-b border-[#222] hover:bg-[#1f1f1f] transition-colors">
                <td className="px-6 py-4 font-medium text-white">{lead.customer_name}</td>
                <td className="px-6 py-4 text-gray-400">{lead.products?.title ?? '—'}</td>
                <td className="px-6 py-4 text-gray-400">{lead.phone ?? '—'}</td>
                <td className="px-6 py-4 text-gray-400">{lead.city ?? '—'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium border ${statusColors[lead.status]}`}>{lead.status}</span>
                </td>
                <td className="px-6 py-4 text-gray-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button onClick={() => setSelected(lead)} className="p-1.5 hover:bg-[#2a2a2a] rounded-lg transition-colors text-gray-400 hover:text-white">
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
