'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trash2, ChevronDown } from 'lucide-react'

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  New:       { label: 'New',       color: 'text-blue-400',   bg: 'bg-blue-400/10',   dot: 'bg-blue-400' },
  Contacted: { label: 'Contacted', color: 'text-yellow-400', bg: 'bg-yellow-400/10', dot: 'bg-yellow-400' },
  Closed:    { label: 'Completed', color: 'text-green-400',  bg: 'bg-green-400/10',  dot: 'bg-green-400' },
}

const columns = ['New', 'Contacted', 'Closed']

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const supabase = createClient()

  const load = async () => {
    const { data } = await supabase
      .from('leads')
      .select('*, products(title, product_images(image_url, sort_order))')
      .order('created_at', { ascending: false })
    setOrders(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('leads').update({ status }).eq('id', id)
    setExpanded(null)
    load()
  }

  const deleteOrder = async (id: string) => {
    if (!confirm('Delete this order?')) return
    await supabase.from('leads').delete().eq('id', id)
    load()
  }

  const getCol = (status: string) => orders.filter(o => o.status?.toLowerCase() === status.toLowerCase())

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">
          {getCol('New').length} new · {getCol('Contacted').length} contacted · {getCol('Closed').length} completed
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-600">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-600">No orders yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(col => {
            const cfg = statusConfig[col]
            const colOrders = getCol(col)
            return (
              <div key={col} className="bg-[#161616] border border-[#222] rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#222] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <span className={`text-sm font-bold ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <span className="text-xs text-gray-600 bg-[#222] px-2 py-0.5 rounded-full">{colOrders.length}</span>
                </div>
                <div className="p-3 space-y-3 min-h-[100px]">
                  {colOrders.length === 0 ? (
                    <p className="text-center text-gray-700 text-xs py-8">No orders</p>
                  ) : colOrders.map(order => (
                    <div key={order.id} className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl overflow-hidden">
                      <div className="p-3 cursor-pointer" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 min-w-0 flex-1">
                            {order.products?.product_images?.length > 0 && (
                              <img
                                src={order.products.product_images.sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0].image_url}
                                alt={order.products.title}
                                className="w-12 h-12 rounded-lg object-cover border border-[#2e2d2d] shrink-0"
                              />
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-white text-sm truncate">{order.customer_name}</p>
                              {order.products?.title && (
                                <p className="text-xs text-[#c9a84c] truncate mt-0.5">{order.products.title}</p>
                              )}
                              <p className="text-xs text-gray-600 mt-0.5">{fmt(order.created_at)}</p>
                            </div>
                          </div>
                          <ChevronDown size={14} className={`text-gray-600 shrink-0 mt-1 transition-transform ${expanded === order.id ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                      {expanded === order.id && (
                        <div className="px-3 pb-3 border-t border-[#2a2a2a] pt-3 space-y-3">
                          <div className="text-xs text-gray-400 space-y-1">
                            <p><span className="text-gray-600">Email:</span> {order.email}</p>
                            {order.phone && <p><span className="text-gray-600">Phone:</span> {order.phone}</p>}
                            {order.city && <p><span className="text-gray-600">City:</span> {order.city}</p>}
                            {order.size && <p><span className="text-gray-600">Size:</span> {order.size}</p>}
                            {order.custom_name && <p><span className="text-gray-600">Custom Name:</span> {order.custom_name}</p>}
                            {order.custom_number && <p><span className="text-gray-600">Number:</span> #{order.custom_number}</p>}
                            {order.message && <p><span className="text-gray-600">Note:</span> {order.message}</p>}
                          </div>
                          <div className="space-y-1.5">
                            {columns.filter(c => c !== col).map(target => (
                              <button key={target} onClick={() => updateStatus(order.id, target)}
                                className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-all ${statusConfig[target].bg} ${statusConfig[target].color} hover:opacity-80`}>
                                Move to {statusConfig[target].label}
                              </button>
                            ))}
                            <button onClick={() => deleteOrder(order.id)}
                              className="w-full py-1.5 rounded-lg text-xs font-semibold text-red-400 bg-red-400/10 hover:opacity-80 flex items-center justify-center gap-1">
                              <Trash2 size={11} /> Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
