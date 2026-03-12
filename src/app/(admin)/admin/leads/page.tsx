'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const statuses = ['all', 'new', 'contacted', 'completed']

export default function AdminLeads() {
  const [leads, setLeads] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const supabase = createClient()

  const load = async () => {
    let q = supabase.from('leads').select('*, products(title)').order('created_at', { ascending: false })
    if (filter !== 'all') q = q.eq('status', filter)
    const { data } = await q
    setLeads(data ?? [])
  }

  useEffect(() => { load() }, [filter])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('leads').update({ status }).eq('id', id)
    load()
  }

  const deleteLead = async (id: string) => {
    if (!confirm('Delete this lead?')) return
    await supabase.from('leads').delete().eq('id', id)
    load()
  }

  const statusColor = (s: string) => {
    if (s === 'new') return 'bg-blue-500/15 text-blue-400'
    if (s === 'contacted') return 'bg-yellow-500/15 text-yellow-400'
    if (s === 'completed') return 'bg-green-500/15 text-green-400'
    return 'bg-gray-500/15 text-gray-400'
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Leads</h1>
          <p className="text-gray-500 text-sm mt-1">{leads.length} {filter === 'all' ? 'total' : filter}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all ${
              filter === s ? 'bg-[#c9a84c] text-black' : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#2a2a2a]'
            }`}>
            {s}
          </button>
        ))}
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-20 text-gray-600">No leads yet</div>
      ) : (
        <div className="space-y-3">
          {leads.map(lead => (
            <div key={lead.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">{lead.customer_name}</p>
                  <p className="text-sm text-gray-500 truncate">{lead.email}</p>
                  {lead.phone && <p className="text-sm text-gray-500">{lead.phone}</p>}
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${statusColor(lead.status)}`}>
                  {lead.status}
                </span>
              </div>

              {lead.products?.title && (
                <p className="text-sm text-[#c9a84c] mb-2 truncate">📦 {lead.products.title}</p>
              )}

              <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                {lead.size && <span className="bg-[#222] px-2 py-1 rounded">Size: {lead.size}</span>}
                {lead.custom_name && <span className="bg-[#222] px-2 py-1 rounded">Name: {lead.custom_name}</span>}
                {lead.custom_number && <span className="bg-[#222] px-2 py-1 rounded">#{lead.custom_number}</span>}
                {lead.city && <span className="bg-[#222] px-2 py-1 rounded">{lead.city}</span>}
              </div>

              {lead.message && (
                <p className="text-sm text-gray-400 mb-3 bg-[#141414] rounded-lg p-3 italic">"{lead.message}"</p>
              )}

              <div className="flex items-center justify-between gap-3">
                <select
                  value={lead.status}
                  onChange={e => updateStatus(lead.id, e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="completed">Completed</option>
                </select>
                <button onClick={() => deleteLead(lead.id)}
                  className="px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-[#2a2a2a]">
                  Delete
                </button>
              </div>

              <p className="text-[10px] text-gray-700 mt-2">
                {new Date(lead.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
