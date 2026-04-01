'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadPackageImage } from '@/lib/uploadImage'

type Package = {
  id: string
  name: string
  description: string | null
  price_per_unit: number | null
  active: boolean
  sort_order: number
  image_url: string | null
}

type PackageLead = {
  id: string
  customer_name: string
  email: string
  phone: string | null
  city: string | null
  quantity: number
  notes: string | null
  status: string
  created_at: string
  team_packages: { name: string } | null
}

const emptyForm = { name: '', description: '', price_per_unit: '', active: true, sort_order: 0 }

export default function AdminTeamPackages() {
  const [packages, setPackages] = useState<Package[]>([])
  const [leads, setLeads] = useState<PackageLead[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'packages' | 'leads'>('packages')
  const [editing, setEditing] = useState<Package | 'new' | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const supabase = createClient()
    const [{ data: pkgs }, { data: ls }] = await Promise.all([
      supabase.from('team_packages').select('*').order('sort_order'),
      supabase.from('package_leads').select('*, team_packages(name)').order('created_at', { ascending: false }),
    ])
    setPackages(pkgs ?? [])
    setLeads(ls ?? [])
    setLoading(false)
  }

  function startEdit(pkg: Package) {
    setEditing(pkg)
    setForm({ name: pkg.name, description: pkg.description ?? '', price_per_unit: pkg.price_per_unit?.toString() ?? '', active: pkg.active, sort_order: pkg.sort_order })
    setImageFile(null)
    setImagePreview(pkg.image_url ?? null)
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSave() {
    if (!form.name.trim()) return alert('Package name is required.')
    setSaving(true)
    const supabase = createClient()
    let image_url = editing !== 'new' ? (editing as Package).image_url : null
    if (imageFile) {
      image_url = await uploadPackageImage(imageFile)
    }
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price_per_unit: form.price_per_unit !== '' ? parseFloat(form.price_per_unit) : null,
      active: form.active,
      sort_order: parseInt(form.sort_order.toString()) || 0,
      image_url,
    }
    if (editing === 'new') await supabase.from('team_packages').insert([payload])
    else await supabase.from('team_packages').update(payload).eq('id', (editing as Package).id)
    setSaving(false)
    setEditing(null)
    setImageFile(null)
    setImagePreview(null)
    fetchAll()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this package?')) return
    const supabase = createClient()
    await supabase.from('team_packages').delete().eq('id', id)
    fetchAll()
  }

  async function updateStatus(id: string, status: string) {
    const supabase = createClient()
    await supabase.from('package_leads').update({ status }).eq('id', id)
    fetchAll()
  }

  if (loading) return <p className="text-gray-400 p-8">Loading...</p>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white">Team Packages</h2>

      <div className="flex gap-4 mb-6 border-b border-[#2e2d2d]">
        {(['packages', 'leads'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`pb-2 px-1 capitalize font-medium text-sm border-b-2 transition ${
              tab === t ? 'border-[#c9a84c] text-[#c9a84c]' : 'border-transparent text-gray-500 hover:text-white'
            }`}>
            {t === 'leads' ? 'Package Inquiries' : 'Manage Packages'}
          </button>
        ))}
      </div>

      {tab === 'packages' && (
        <>
          {editing && (
            <div className="bg-[#161515] border border-[#2e2d2d] rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4 text-white">
                {editing === 'new' ? 'New Package' : `Editing: ${(editing as Package).name}`}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#f0ede8] mb-1">Package Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#1e1e1e] border border-[#2e2d2d] text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#c9a84c] transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#f0ede8] mb-1">Description</label>
                  <textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe what's included in this package..."
                    className="w-full bg-[#1e1e1e] border border-[#2e2d2d] text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#c9a84c] transition resize-none placeholder:text-[#555]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#f0ede8] mb-1">Price Per Unit ($)</label>
                    <input type="number" min="0" step="0.01" value={form.price_per_unit}
                      onChange={e => setForm({ ...form, price_per_unit: e.target.value })}
                      className="w-full bg-[#1e1e1e] border border-[#2e2d2d] text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#c9a84c] transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#f0ede8] mb-1">Sort Order</label>
                    <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#1e1e1e] border border-[#2e2d2d] text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#c9a84c] transition" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#f0ede8] mb-2">Package Image</label>
                  {imagePreview && (
                    <div className="relative w-40 h-40 mb-3 rounded-xl overflow-hidden border border-[#2e2d2d]">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => { setImageFile(null); setImagePreview(null) }}
                        className="absolute top-1.5 right-1.5 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black transition">
                        ✕
                      </button>
                    </div>
                  )}
                  <label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2 bg-[#1e1e1e] border border-[#2e2d2d] text-gray-400 rounded-xl hover:border-[#c9a84c] hover:text-white transition text-sm">
                    <span>📁</span> {imagePreview ? 'Change Image' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" id="active" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })}
                    className="w-4 h-4 accent-[#c9a84c]" />
                  <label htmlFor="active" className="text-sm text-[#f0ede8]">Active (visible on site)</label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} disabled={saving}
                    className="px-6 py-2 bg-[#c9a84c] text-black font-semibold rounded-xl hover:bg-[#b8943d] transition disabled:opacity-50">
                    {saving ? 'Uploading & Saving...' : 'Save Package'}
                  </button>
                  <button onClick={() => { setEditing(null); setImageFile(null); setImagePreview(null) }}
                    className="px-6 py-2 border border-[#2e2d2d] text-gray-400 rounded-xl hover:bg-[#1a1a1a] transition">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">{packages.length} package(s)</p>
            <button onClick={() => { setEditing('new'); setForm(emptyForm); setImageFile(null); setImagePreview(null) }}
              className="px-5 py-2 bg-[#c9a84c] text-black text-sm font-semibold rounded-xl hover:bg-[#b8943d] transition">
              + New Package
            </button>
          </div>

          <div className="space-y-3">
            {packages.map(pkg => (
              <div key={pkg.id} className="bg-[#161515] border border-[#2e2d2d] rounded-xl p-5 flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1">
                  {pkg.image_url && (
                    <img src={pkg.image_url} alt={pkg.name} className="w-16 h-16 rounded-xl object-cover border border-[#2e2d2d] shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white">{pkg.name}</h4>
                      {!pkg.active && <span className="text-xs bg-[#2e2d2d] text-gray-500 px-2 py-0.5 rounded-full">Hidden</span>}
                    </div>
                    {pkg.description && <p className="text-sm text-gray-500 mb-1 line-clamp-2">{pkg.description}</p>}
                    {pkg.price_per_unit && <p className="text-sm text-[#c9a84c] font-medium">${Number(pkg.price_per_unit).toFixed(2)} / unit</p>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(pkg)}
                    className="px-4 py-1.5 text-sm border border-[#2e2d2d] text-gray-400 rounded-lg hover:bg-[#1a1a1a] transition">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(pkg.id)}
                    className="px-4 py-1.5 text-sm border border-red-900 text-red-500 rounded-lg hover:bg-red-950 transition">
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {packages.length === 0 && (
              <div className="text-center text-gray-500 py-12">No packages yet. Click &quot;+ New Package&quot; to add one.</div>
            )}
          </div>
        </>
      )}

      {tab === 'leads' && (
        <div className="space-y-4">
          {leads.length === 0 && <div className="text-center text-gray-500 py-12">No package inquiries yet.</div>}
          {leads.map(lead => (
            <div key={lead.id} className="bg-[#161515] border border-[#2e2d2d] rounded-xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-white">{lead.customer_name}</p>
                  <p className="text-sm text-gray-500">
                    {lead.team_packages?.name ?? 'Unknown package'} — Qty: <span className="font-medium text-white">{lead.quantity}</span>
                  </p>
                </div>
                <select value={lead.status} onChange={e => updateStatus(lead.id, e.target.value)}
                  className="text-sm bg-[#1e1e1e] border border-[#2e2d2d] text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#c9a84c]">
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Closed</option>
                </select>
              </div>
              <div className="text-sm text-gray-400 grid grid-cols-2 gap-x-4 gap-y-1">
                <p><span className="text-gray-500">Email:</span> {lead.email}</p>
                {lead.phone && <p><span className="text-gray-500">Phone:</span> {lead.phone}</p>}
                {lead.city && <p><span className="text-gray-500">City:</span> {lead.city}</p>}
                <p className="text-xs text-gray-600">{new Date(lead.created_at).toLocaleDateString()}</p>
              </div>
              {lead.notes && (
                <p className="mt-3 text-sm text-gray-300 bg-[#1e1e1e] rounded-lg p-3 border border-[#2e2d2d]">
                  <span className="text-gray-500">Notes:</span> {lead.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
