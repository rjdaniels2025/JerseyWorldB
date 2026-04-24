'use client'
// @ts-ignore
import Cropper from 'react-easy-crop'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadPackageImage, uploadImageToR2 } from '@/lib/uploadImage'

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
  active: boolean
  sort_order: number
  image_url: string | null
  team_package_images?: PackageImage[]
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
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'packages' | 'leads' | 'photos'>('packages')
  const [editing, setEditing] = useState<Package | 'new' | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<PackageImage[]>([])
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null)
  const [cropFile, setCropFile] = useState<File | null>(null)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [search, setSearch] = useState('')
  const editRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const supabase = createClient()
    const [{ data: pkgs }, { data: ls }, { data: ph }] = await Promise.all([
      supabase.from('team_packages').select('*, team_package_images(id, image_url, sort_order)').order('sort_order'),
      supabase.from('package_leads').select('*, team_packages(name)').order('created_at', { ascending: false }),
      supabase.from('team_photos').select('*').order('sort_order'),
    ])
    setPackages(pkgs ?? [])
    setLeads(ls ?? [])
    setPhotos(ph ?? [])
    setLoading(false)
  }

  async function handleCropExisting(photo: any) {
    // Load existing image URL into crop modal for re-cropping
    setEditingPhotoId(photo.id)
    setCropSrc(photo.image_url)
    setCropFile(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setPendingFiles(files)
    const url = URL.createObjectURL(files[0])
    setCropSrc(url)
    setCropFile(files[0])
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    e.target.value = ''
  }

  async function getCroppedBlob(imageSrc: string, pixelCrop: any): Promise<Blob> {
    const image = await new Promise<HTMLImageElement>((res, rej) => {
      const img = new window.Image()
      img.onload = () => res(img)
      img.onerror = rej
      img.src = imageSrc
    })
    const canvas = document.createElement('canvas')
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height)
    return new Promise(res => canvas.toBlob(b => res(b!), 'image/jpeg', 0.92))
  }

  async function handleCropSave() {
    if (!cropSrc || !croppedAreaPixels) return
    setUploadingPhoto(true)
    const supabase = createClient()
    try {
      const blob = await getCroppedBlob(cropSrc, croppedAreaPixels)
      const filename = cropFile?.name ?? 'team-photo.jpg'
      const croppedFile = new File([blob], filename, { type: 'image/jpeg' })
      const url = await uploadImageToR2(croppedFile, 'team-photos')
      if (!url) throw new Error('Upload returned no URL')

      if (editingPhotoId) {
        // Replacing existing photo
        const { error } = await supabase.from('team_photos').update({ image_url: url }).eq('id', editingPhotoId)
        if (error) throw new Error(error.message)
        setEditingPhotoId(null)
        setCropSrc(null)
        setUploadingPhoto(false)
        fetchAll()
      } else {
        // New upload — check for more pending files
        const { error } = await supabase.from('team_photos').insert({ image_url: url, sort_order: photos.length, active: true })
        if (error) throw new Error(error.message)
        const remaining = pendingFiles.slice(1)
        setPendingFiles(remaining)
        if (remaining.length > 0) {
          const nextUrl = URL.createObjectURL(remaining[0])
          setCropSrc(nextUrl)
          setCropFile(remaining[0])
          setCrop({ x: 0, y: 0 })
          setZoom(1)
          setUploadingPhoto(false)
        } else {
          setCropSrc(null)
          setUploadingPhoto(false)
          fetchAll()
        }
      }
    } catch (err: any) {
      alert('Upload failed: ' + (err?.message ?? 'Unknown error'))
      setUploadingPhoto(false)
    }
  }

  function startEdit(pkg: Package) {
    setEditing(pkg)
    setForm({ name: pkg.name, description: pkg.description ?? '', price_per_unit: pkg.price_per_unit?.toString() ?? '', active: pkg.active, sort_order: pkg.sort_order })
    setImageFiles([])
    const sorted = [...(pkg.team_package_images ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    setExistingImages(sorted)
    setTimeout(() => {
      editRefs.current[pkg.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setImageFiles(prev => [...prev, ...files])
  }

  async function handleSave() {
    if (!form.name.trim()) return alert('Package name is required.')
    setSaving(true)
    const supabase = createClient()
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price_per_unit: form.price_per_unit !== '' ? parseFloat(form.price_per_unit) : null,
      active: form.active,
      sort_order: parseInt(form.sort_order.toString()) || 0,
    }
    let pkgId: string
    if (editing === 'new') {
      const { data } = await supabase.from('team_packages').insert([payload]).select().single()
      pkgId = data.id
    } else {
      pkgId = (editing as Package).id
      await supabase.from('team_packages').update(payload).eq('id', pkgId)
    }
    for (let i = 0; i < imageFiles.length; i++) {
      const url = await uploadPackageImage(imageFiles[i])
      if (url) {
        await supabase.from('team_package_images').insert([{
          package_id: pkgId,
          image_url: url,
          sort_order: existingImages.length + i,
        }])
      }
    }
    setSaving(false)
    setEditing(null)
    setImageFiles([])
    setExistingImages([])
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

  async function handlePhotoDelete(id: string) {
    if (!confirm('Delete this photo?')) return
    const supabase = createClient()
    await supabase.from('team_photos').delete().eq('id', id)
    fetchAll()
  }

  async function handlePhotoToggle(id: string, active: boolean) {
    const supabase = createClient()
    await supabase.from('team_photos').update({ active: !active }).eq('id', id)
    fetchAll()
  }

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(search.toLowerCase()) ||
    (pkg.description ?? '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <p className="text-gray-400 p-8">Loading...</p>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white">Team Packages</h2>

      <div className="flex gap-4 mb-6 border-b border-[#2e2d2d]">
        {(['packages', 'leads', 'photos'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`pb-2 px-1 capitalize font-medium text-sm border-b-2 transition ${
              tab === t ? 'border-[#c9a84c] text-[#c9a84c]' : 'border-transparent text-gray-500 hover:text-white'
            }`}>
            {t === 'leads' ? 'Package Inquiries' : t === 'photos' ? 'Team Photos' : 'Manage Packages'}
          </button>
        ))}
      </div>

      {tab === 'packages' && (
        <>
          <div className="flex items-center justify-between gap-4 mb-4">
            <input
              type="text"
              placeholder="Search packages..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-[#1e1e1e] border border-[#2e2d2d] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c9a84c] placeholder:text-[#555] transition"
            />
            <button onClick={() => { setEditing('new'); setForm(emptyForm); setImageFiles([]); setExistingImages([]) }}
              className="px-5 py-2.5 bg-[#c9a84c] text-black text-sm font-semibold rounded-xl hover:bg-[#b8943d] transition shrink-0">
              + New Package
            </button>
          </div>

          {editing === 'new' && (
            <div className="bg-[#161515] border border-[#c9a84c40] rounded-2xl p-6 mb-4">
              <h3 className="text-lg font-semibold mb-4 text-white">New Package</h3>
              <EditForm
                form={form} setForm={setForm}
                imageFiles={imageFiles} existingImages={existingImages}
                setImageFiles={setImageFiles} setExistingImages={setExistingImages}
                saving={saving} onSave={handleSave}
                onCancel={() => { setEditing(null); setImageFiles([]); setExistingImages([]) }}
                handleImageChange={handleImageChange}
              />
            </div>
          )}

          <p className="text-xs text-gray-600 mb-3">{filteredPackages.length} of {packages.length} package(s)</p>

          <div className="space-y-2">
            {filteredPackages.map(pkg => {
              const isEditing = editing !== 'new' && (editing as Package)?.id === pkg.id
              return (
                <div key={pkg.id} ref={el => { editRefs.current[pkg.id] = el }}>
                  {isEditing ? (
                    <div className="bg-[#161515] border border-[#c9a84c] rounded-2xl p-6">
                      <h3 className="text-lg font-semibold mb-4 text-white">Editing: {pkg.name}</h3>
                      <EditForm
                        form={form} setForm={setForm}
                        imageFiles={imageFiles} existingImages={existingImages}
                        setImageFiles={setImageFiles} setExistingImages={setExistingImages}
                        saving={saving} onSave={handleSave}
                        onCancel={() => { setEditing(null); setImageFiles([]); setExistingImages([]) }}
                        handleImageChange={handleImageChange}
                      />
                    </div>
                  ) : (
                    <div className="bg-[#161515] border border-[#2e2d2d] rounded-xl p-5 flex items-start justify-between gap-4">
                      <div className="flex gap-4 flex-1">
                        {(pkg.team_package_images && pkg.team_package_images.length > 0) ? (
                          <div className="relative shrink-0">
                            <img src={pkg.team_package_images[0].image_url} alt={pkg.name} className="w-16 h-16 rounded-xl object-cover border border-[#2e2d2d]" />
                            {pkg.team_package_images.length > 1 && (
                              <span className="absolute -bottom-1 -right-1 bg-[#c9a84c] text-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {pkg.team_package_images.length}
                              </span>
                            )}
                          </div>
                        ) : pkg.image_url ? (
                          <img src={pkg.image_url} alt={pkg.name} className="w-16 h-16 rounded-xl object-cover border border-[#2e2d2d] shrink-0" />
                        ) : null}
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
                  )}
                </div>
              )
            })}
            {filteredPackages.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                {search ? `No packages matching "${search}"` : 'No packages yet. Click "+ New Package" to add one.'}
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'photos' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">{photos.length} photo(s) — these appear in the carousel at the top of the Team Packages page</p>
            <label className={`flex items-center gap-2 px-5 py-2 bg-[#c9a84c] text-black text-sm font-semibold rounded-xl hover:bg-[#b8943d] transition cursor-pointer ${uploadingPhoto ? 'opacity-50 pointer-events-none' : ''}`}>
              + {uploadingPhoto ? 'Uploading...' : 'Add Photos'}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoSelect} />
            </label>
          </div>
          {photos.length === 0 ? (
            <div className="text-center text-gray-500 py-12">No team photos yet. Upload wide/landscape photos for best results.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {photos.map(photo => (
                <div key={photo.id} className="relative rounded-xl overflow-hidden border border-[#2e2d2d] group" style={{ aspectRatio: '16/6' }}>
                  <img src={photo.image_url} alt="Team photo" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                    <button onClick={() => handleCropExisting(photo)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#c9a84c]/90 text-black">
                      ✂ Crop
                    </button>
                    <button onClick={() => handlePhotoToggle(photo.id, photo.active)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${photo.active ? 'bg-yellow-500/80 text-black' : 'bg-green-500/80 text-black'}`}>
                      {photo.active ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => handlePhotoDelete(photo.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/80 text-white">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
      {/* Crop Modal */}
      {cropSrc && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2e2d2d]">
            <div>
              <h3 className="text-white font-bold">{editingPhotoId ? "Re-crop Photo" : "Crop Team Photo"}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Drag to reposition · Scroll to zoom · 16:6 ratio (carousel format)
                {pendingFiles.length > 1 && <span className="ml-2 text-[#c9a84c]">{pendingFiles.length} photos remaining</span>}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setCropSrc(null); setPendingFiles([]); setEditingPhotoId(null) }}
                className="px-4 py-2 border border-[#2e2d2d] text-gray-400 rounded-xl text-sm hover:bg-[#1a1a1a] transition">
                Cancel
              </button>
              <button onClick={handleCropSave} disabled={uploadingPhoto}
                className="px-6 py-2 bg-[#c9a84c] text-black font-bold rounded-xl text-sm hover:bg-[#b8943d] transition disabled:opacity-50">
                {uploadingPhoto ? 'Saving...' : 'Save & Upload'}
              </button>
            </div>
          </div>
          <div className="relative flex-1">
            <Cropper
              image={cropSrc}
              crop={crop}
              zoom={zoom}
              aspect={16 / 6}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_: any, pixels: any) => setCroppedAreaPixels(pixels)}
              style={{ containerStyle: { background: '#0e0e0e' } }}
            />
          </div>
          <div className="px-6 py-4 border-t border-[#2e2d2d] flex items-center gap-4">
            <span className="text-xs text-gray-500 shrink-0">Zoom</span>
            <input type="range" min={1} max={3} step={0.01} value={zoom}
              onChange={e => setZoom(parseFloat(e.target.value))}
              className="w-full max-w-xs accent-[#c9a84c]" />
            <span className="text-xs text-gray-500">{zoom.toFixed(1)}x</span>
          </div>
        </div>
      )}
    </div>
  )
}

type EditFormProps = {
  form: any
  setForm: (f: any) => void
  imageFiles: File[]
  existingImages: PackageImage[]
  setImageFiles: (fn: (prev: File[]) => File[]) => void
  setExistingImages: (fn: (prev: PackageImage[]) => PackageImage[]) => void
  saving: boolean
  onSave: () => void
  onCancel: () => void
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function EditForm({ form, setForm, imageFiles, existingImages, setImageFiles, setExistingImages, saving, onSave, onCancel, handleImageChange }: EditFormProps) {
  return (
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
        <label className="block text-sm font-medium text-[#f0ede8] mb-1">Package Images (Carousel)</label>
        <p className="text-xs text-gray-500 mb-3">Upload multiple images — users can swipe through them on the package card.</p>
        <div className="flex flex-wrap gap-3 mb-3">
          {existingImages.map(img => (
            <div key={img.id} className="relative w-28 h-28 rounded-xl overflow-hidden border border-[#2e2d2d]">
              <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={async () => {
                  const supabase = createClient()
                  await supabase.from('team_package_images').delete().eq('id', img.id)
                  setExistingImages(prev => prev.filter(i => i.id !== img.id))
                }}
                className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black transition">
                ✕
              </button>
            </div>
          ))}
          {imageFiles.map((file, i) => (
            <div key={i} className="relative w-28 h-28 rounded-xl overflow-hidden border border-[#c9a84c40]">
              <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => setImageFiles(prev => prev.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black transition">
                ✕
              </button>
            </div>
          ))}
        </div>
        <label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2 bg-[#1e1e1e] border border-[#2e2d2d] text-gray-400 rounded-xl hover:border-[#c9a84c] hover:text-white transition text-sm">
          <span>📁</span> Add Images
          <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
        </label>
      </div>
      <div className="flex items-center gap-3">
        <input type="checkbox" id="active-check" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })}
          className="w-4 h-4 accent-[#c9a84c]" />
        <label htmlFor="active-check" className="text-sm text-[#f0ede8]">Active (visible on site)</label>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onSave} disabled={saving}
          className="px-6 py-2 bg-[#c9a84c] text-black font-semibold rounded-xl hover:bg-[#b8943d] transition disabled:opacity-50">
          {saving ? 'Uploading & Saving...' : 'Save Package'}
        </button>
        <button onClick={onCancel}
          className="px-6 py-2 border border-[#2e2d2d] text-gray-400 rounded-xl hover:bg-[#1a1a1a] transition">
          Cancel
        </button>
      </div>
    </div>
  )
}
