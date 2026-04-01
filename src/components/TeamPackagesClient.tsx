'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Package = {
  id: string
  name: string
  description: string | null
  price_per_unit: number | null
}

type Props = { packages: Package[] }

const emptyForm = {
  customer_name: '',
  email: '',
  phone: '',
  city: '',
  quantity: 1,
  notes: '',
}

export default function TeamPackagesClient({ packages }: Props) {
  const [selected, setSelected] = useState<Package | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleSelect(pkg: Package) {
    setSelected(pkg)
    setForm(emptyForm)
    setSubmitted(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const supabase = createClient()
    const { error } = await supabase.from('package_leads').insert([
      { ...form, package_id: selected!.id },
    ])
    setSubmitting(false)
    if (!error) setSubmitted(true)
    else alert('Something went wrong. Please try again.')
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-2">Team Packages</h1>
        <p className="text-center text-[#a09890] mb-12">Outfit your whole team. Select a package below to get started.</p>

        {selected && (
          <div className="bg-[#161515] border border-[#2e2d2d] rounded-2xl p-6 sm:p-8 mb-12">
            {submitted ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-white mb-2">Request Sent!</h2>
                <p className="text-[#a09890] mb-6">
                  We&apos;ll be in touch about your <span className="text-[#c9a84c] font-semibold">{selected.name}</span> order.
                </p>
                <button
                  onClick={() => setSelected(null)}
                  className="px-6 py-2.5 bg-[#c9a84c] text-black font-semibold rounded-xl hover:bg-[#b8943d] transition"
                >
                  Browse More Packages
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                    {selected.price_per_unit && (
                      <p className="text-[#a09890] text-sm mt-1">${Number(selected.price_per_unit).toFixed(2)} per unit</p>
                    )}
                  </div>
                  <button onClick={() => setSelected(null)} className="text-sm text-[#a09890] hover:text-white underline transition">
                    ← Back
                  </button>
                </div>

                {selected.description && (
                  <p className="text-[#a09890] mb-6 border-l-4 border-[#c9a84c40] pl-4 italic text-sm leading-relaxed">
                    {selected.description}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#f0ede8] mb-1">How many jerseys do you need? *</label>
                    <input
                      type="number" min="1" required
                      value={form.quantity}
                      onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                      className="w-full bg-[#1e1e1e] border border-[#2e2d2d] text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#c9a84c] transition"
                    />
                    {selected.price_per_unit && form.quantity > 0 && (
                      <p className="text-xs text-[#a09890] mt-1">
                        Estimated total: <span className="text-[#c9a84c] font-semibold">${(form.quantity * Number(selected.price_per_unit)).toFixed(2)}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#f0ede8] mb-1">Full Name *</label>
                      <input type="text" required value={form.customer_name}
                        onChange={e => setForm({ ...form, customer_name: e.target.value })}
                        className="w-full bg-[#1e1e1e] border border-[#2e2d2d] text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#c9a84c] transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f0ede8] mb-1">Email *</label>
                      <input type="email" required value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-[#1e1e1e] border border-[#2e2d2d] text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#c9a84c] transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f0ede8] mb-1">Phone</label>
                      <input type="tel" value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-[#1e1e1e] border border-[#2e2d2d] text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#c9a84c] transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f0ede8] mb-1">City</label>
                      <input type="text" value={form.city}
                        onChange={e => setForm({ ...form, city: e.target.value })}
                        className="w-full bg-[#1e1e1e] border border-[#2e2d2d] text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#c9a84c] transition" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#f0ede8] mb-1">Order Notes / Comments</label>
                    <textarea rows={4} value={form.notes}
                      onChange={e => setForm({ ...form, notes: e.target.value })}
                      placeholder="Any special requests, team details, colours, etc."
                      className="w-full bg-[#1e1e1e] border border-[#2e2d2d] text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#c9a84c] transition resize-none placeholder:text-[#555]" />
                  </div>

                  <button type="submit" disabled={submitting}
                    className="w-full bg-[#c9a84c] text-black font-bold py-3 rounded-xl hover:bg-[#b8943d] transition disabled:opacity-50">
                    {submitting ? 'Sending...' : 'Submit Package Request'}
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {packages.length === 0 ? (
          <div className="text-center text-[#a09890] py-20">
            <p className="text-lg">No packages available right now. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map(pkg => (
              <div key={pkg.id} className="bg-[#161515] border border-[#2e2d2d] rounded-2xl p-6 flex flex-col justify-between hover:border-[#c9a84c40] transition-all duration-300">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{pkg.name}</h3>
                  {pkg.description && (
                    <p className="text-[#a09890] text-sm mb-4 leading-relaxed">{pkg.description}</p>
                  )}
                  {pkg.price_per_unit && (
                    <p className="text-sm text-[#a09890] mb-4">
                      From <span className="text-[#c9a84c] font-bold text-base">${Number(pkg.price_per_unit).toFixed(2)}</span> / unit
                    </p>
                  )}
                </div>
                <button onClick={() => handleSelect(pkg)}
                  className="mt-4 w-full bg-[#c9a84c] text-black font-semibold py-2.5 rounded-xl hover:bg-[#b8943d] transition">
                  Order This Package
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}