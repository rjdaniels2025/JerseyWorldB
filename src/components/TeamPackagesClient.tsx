'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadImageToR2 } from '@/lib/uploadImage'
import { Upload, X } from 'lucide-react'

type PackageImage = {
  id: string
  image_url: string
  sort_order: number | null
}

type Package = {
  id: string
  name: string
  description: string | null
  price_per_unit: number | null
  image_url: string | null
  team_package_images?: PackageImage[]
}

type Props = { packages: Package[] }

const QUANTITY_OPTIONS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,25,30,35,40,50,60,75,100]

const emptyForm = {
  customer_name: '',
  email: '',
  phone: '',
  city: '',
  quantity: '' as number | '',
  notes: '',
}

export default function TeamPackagesClient({ packages }: Props) {
  const [selected, setSelected] = useState<Package | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [expanded, setExpanded] = useState<string | null>(null)

  function handleSelect(pkg: Package) {
    setSelected(pkg)
    setForm(emptyForm)
    setLogoFile(null)
    setLogoPreview(null)
    setSubmitted(false)
    setActiveImageIndex(0)
    setExpanded(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  function removeLogo() {
    setLogoFile(null)
    setLogoPreview(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const supabase = createClient()

    let logo_url: string | null = null
    if (logoFile) {
      try {
        logo_url = await uploadImageToR2(logoFile, 'package-logos')
      } catch {
        // Logo upload failed — continue without it
      }
    }

    const { error } = await supabase.from('package_leads').insert([{
      package_id: selected!.id,
      customer_name: form.customer_name,
      email: form.email,
      phone: form.phone || null,
      city: form.city || null,
      quantity: form.quantity || 1,
      notes: form.notes || null,
      logo_url,
      status: 'New',
    }])
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
                  className="px-6 py-2.5 bg-[#c9a84c] text-black font-semibold rounded-xl hover:bg-[#b8943d] transition">
                  Browse More Packages
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex gap-4 items-start">
                    {selected.image_url && (
                      <img src={selected.image_url} alt={selected.name}
                        className="w-20 h-20 rounded-xl object-cover border border-[#2e2d2d] shrink-0" />
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                      {selected.price_per_unit && (
                        <p className="text-[#a09890] text-sm mt-1">${Number(selected.price_per_unit).toFixed(2)} per unit</p>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-sm text-[#a09890] hover:text-white underline transition">
                    ← Back
                  </button>
                </div>



                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#f0ede8] mb-1">
                      How many packages do you need? <span className="text-[#a09890] font-normal">(optional)</span>
                    </label>
                    <select
                      value={form.quantity}
                      onChange={e => setForm({ ...form, quantity: e.target.value === '' ? '' : parseInt(e.target.value) })}
                      className="w-full bg-[#1e1e1e] border border-[#2e2d2d] text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#c9a84c] transition appearance-none"
                    >
                      <option value="">Select quantity...</option>
                      {QUANTITY_OPTIONS.map(n => (
                        <option key={n} value={n}>{n}{n === 100 ? '+' : ''}</option>
                      ))}
                    </select>
                    {selected.price_per_unit && form.quantity !== '' && form.quantity > 0 && (
                      <p className="text-xs text-[#a09890] mt-1">
                        Estimated total: <span className="text-[#c9a84c] font-semibold">${(form.quantity * Number(selected.price_per_unit)).toFixed(2)}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#f0ede8] mb-1">
                      Team Logo <span className="text-[#a09890] font-normal">(optional)</span>
                    </label>
                    {logoPreview ? (
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#2e2d2d] bg-[#1e1e1e]">
                          <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-1" />
                          <button type="button" onClick={removeLogo}
                            className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5 text-white hover:bg-black transition">
                            <X size={10} />
                          </button>
                        </div>
                        <p className="text-sm text-[#a09890]">{logoFile?.name}</p>
                      </div>
                    ) : (
                      <label className="flex items-center gap-3 cursor-pointer px-4 py-3 bg-[#1e1e1e] border border-dashed border-[#2e2d2d] rounded-xl hover:border-[#c9a84c] hover:text-white text-[#a09890] transition text-sm w-full">
                        <Upload size={16} className="text-[#c9a84c] shrink-0" />
                        <span>Upload your team logo (PNG, JPG, SVG)</span>
                        <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                      </label>
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
                      <label className="block text-sm font-medium text-[#f0ede8] mb-1">Phone *</label>
                      <input type="tel" required value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="+1 (416) 000-0000"
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
            {packages.map(pkg => {
              const images = [
                ...(pkg.team_package_images ?? []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map(i => i.image_url),
                ...(pkg.image_url && !(pkg.team_package_images?.length) ? [pkg.image_url] : [])
              ]
              const imgIndex = activeImageIndex
              const isExpanded = expanded === pkg.id
              return (
                <div key={pkg.id} className="bg-[#161515] border border-[#2e2d2d] rounded-2xl overflow-hidden flex flex-col hover:border-[#c9a84c40] transition-all duration-300">
                  {images.length > 0 && (
                    <div className="relative w-full overflow-hidden bg-[#111]" style={{ aspectRatio: "3/4" }}>
                      <img src={images[imgIndex % images.length]} alt={pkg.name} className="w-full h-full object-cover" />
                      {images.length > 1 && (
                        <>
                          <button onClick={() => setActiveImageIndex(i => i === 0 ? images.length - 1 : i - 1)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs transition">‹</button>
                          <button onClick={() => setActiveImageIndex(i => (i + 1) % images.length)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs transition">›</button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {images.map((_, i) => (
                              <button key={i} onClick={() => setActiveImageIndex(i)}
                                className={`w-1.5 h-1.5 rounded-full transition ${i === imgIndex % images.length ? "bg-[#c9a84c]" : "bg-white/40"}`} />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{pkg.name}</h3>
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
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
