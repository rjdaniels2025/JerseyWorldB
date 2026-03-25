'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadProductImage } from '@/lib/uploadImage'
import { Plus, X, Upload, CheckCircle, AlertCircle, Layers } from 'lucide-react'

const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL']

interface ImageEntry {
  file: File
  preview: string
  uploading: boolean
  url: string | null
  error: boolean
}

interface ProductDraft {
  _id: number
  price: string
  sizes: string[]
  featured: boolean
  images: ImageEntry[]
  dragOver: boolean
}

let _nextId = 1
function makeBlank(): ProductDraft {
  return { _id: _nextId++, price: '', sizes: ['S', 'M', 'L', 'XL', 'XXL'], featured: false, images: [], dragOver: false }
}

function ImageThumb({
  img, isPrimary, onRemove, onMakePrimary,
}: { img: ImageEntry; isPrimary: boolean; onRemove: () => void; onMakePrimary: () => void }) {
  return (
    <div className="relative w-[72px] h-[72px] rounded-lg overflow-hidden border border-[#333] shrink-0 bg-[#222]">
      <img src={img.preview} alt="" className="w-full h-full object-cover" />
      {img.uploading && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <span className="text-[9px] font-bold text-white">Uploading…</span>
        </div>
      )}
      {img.error && (
        <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center">
          <span className="text-[9px] font-bold text-white text-center px-1">Failed</span>
        </div>
      )}
      {!img.uploading && (
        <>
          <button type="button" onClick={onRemove}
            className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5 text-white hover:bg-red-500 transition-colors">
            <X size={9} />
          </button>
          {!isPrimary && img.url && (
            <button type="button" onClick={onMakePrimary}
              className="absolute bottom-1 left-1 text-[8px] bg-black/60 text-[#c9a84c] rounded px-1 py-0.5 hover:bg-[#c9a84c] hover:text-black transition-colors font-bold">
              ★
            </button>
          )}
          {isPrimary && (
            <div className="absolute bottom-1 left-1 text-[8px] bg-[#c9a84c] text-black rounded px-1 py-0.5 font-bold">★</div>
          )}
        </>
      )}
    </div>
  )
}

function ProductCard({
  product, index, totalCount, onUpdate, onRemove,
}: {
  product: ProductDraft
  index: number
  totalCount: number
  onUpdate: (patch: Partial<ProductDraft>) => void
  onRemove: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return
    const newImgs: ImageEntry[] = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .map(f => ({ file: f, preview: URL.createObjectURL(f), uploading: false, url: null, error: false }))
    onUpdate({ images: [...product.images, ...newImgs] })
  }, [product.images, onUpdate])

  const removeImg = (i: number) => {
    const imgs = [...product.images]
    URL.revokeObjectURL(imgs[i].preview)
    imgs.splice(i, 1)
    onUpdate({ images: imgs })
  }

  const makePrimary = (i: number) => {
    const imgs = [...product.images]
    const [item] = imgs.splice(i, 1)
    imgs.unshift(item)
    onUpdate({ images: imgs })
  }

  const toggleSize = (s: string) => {
    const sizes = product.sizes.includes(s)
      ? product.sizes.filter(x => x !== s)
      : [...product.sizes, s]
    onUpdate({ sizes })
  }

  const imagesReady = product.images.length > 0 && product.images.every(i => i.url)
  const hasError = product.images.some(i => i.error)

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#c9a84c] flex items-center justify-center text-black text-xs font-black shrink-0">
            {index + 1}
          </div>
          <span className="font-bold text-white text-sm">Product {index + 1}</span>
          {imagesReady && <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle size={11} /> Ready</span>}
          {hasError && <span className="text-[11px] text-red-400 font-semibold flex items-center gap-1"><AlertCircle size={11} /> Image error</span>}
        </div>
        {totalCount > 1 && (
          <button type="button" onClick={onRemove}
            className="text-xs px-3 py-1.5 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
            Remove
          </button>
        )}
      </div>

      <div className="flex gap-5 flex-wrap">
        <div className="flex-1 min-w-[240px]">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Images</p>
          <div
            onDrop={e => { e.preventDefault(); onUpdate({ dragOver: false }); addFiles(e.dataTransfer.files) }}
            onDragOver={e => { e.preventDefault(); onUpdate({ dragOver: true }) }}
            onDragLeave={() => onUpdate({ dragOver: false })}
            onClick={() => fileRef.current?.click()}
            className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors mb-3 ${
              product.dragOver ? 'border-[#c9a84c] bg-[#c9a84c08]' : 'border-[#333] hover:border-[#c9a84c]'
            }`}
          >
            <Upload size={15} className="text-[#c9a84c] shrink-0" />
            <div>
              <p className="text-sm text-gray-400">Drop images or <span className="text-[#c9a84c] font-semibold">browse</span></p>
              <p className="text-[10px] text-gray-600 mt-0.5">Multiple images — first is primary</p>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
            onChange={e => addFiles(e.target.files)} />
          {product.images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.images.map((img, i) => (
                <ImageThumb key={i} img={img} isPrimary={i === 0}
                  onRemove={() => removeImg(i)}
                  onMakePrimary={() => makePrimary(i)} />
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-[180px] flex flex-col gap-4">
          <div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Price (CAD $)</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">$</span>
              <input type="number" min="0" step="0.01" placeholder="0.00"
                value={product.price} onChange={e => onUpdate({ price: e.target.value })}
                className="w-full pl-7 pr-4 py-2.5 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Sizes</p>
            <div className="flex flex-wrap gap-1.5">
              {ALL_SIZES.map(s => (
                <button key={s} type="button" onClick={() => toggleSize(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    product.sizes.includes(s)
                      ? 'bg-[#c9a84c] border-[#c9a84c] text-black'
                      : 'bg-[#111] border-[#333] text-gray-500 hover:border-[#555]'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input type="checkbox" checked={product.featured}
              onChange={e => onUpdate({ featured: e.target.checked })}
              className="w-4 h-4 accent-[#c9a84c]" />
            <span className="text-sm text-gray-400">Featured on homepage</span>
          </label>

          <div className="bg-[#c9a84c08] border border-[#c9a84c20] rounded-lg px-3 py-2 text-[11px] text-[#c9a84c80]">
            💡 Title & description are added individually after publishing.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BulkUploadPage() {
  const supabase = createClient()
  const [categories, setCategories] = useState<any[]>([])
  const [categoryId, setCategoryId] = useState('')
  const [products, setProducts] = useState<ProductDraft[]>([makeBlank()])
  const [publishing, setPublishing] = useState(false)
  const [progressText, setProgressText] = useState('')
  const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null)

  useEffect(() => {
    supabase.from('categories').select('*').order('name').then(({ data }) => setCategories(data ?? []))
  }, [])

  const updateProduct = (id: number, patch: Partial<ProductDraft>) =>
    setProducts(prev => prev.map(p => p._id === id ? { ...p, ...patch } : p))

  const removeProduct = (id: number) =>
    setProducts(prev => prev.filter(p => p._id !== id))

  const addProduct = () =>
    setProducts(prev => [...prev, makeBlank()])

  const categoryName = categories.find(c => c.id === categoryId)?.name ?? ''

  const canPublish =
    !!categoryId &&
    products.length > 0 &&
    products.every(p => p.price !== '' && parseFloat(p.price) > 0 && p.images.length > 0)

  const handlePublish = async () => {
    if (!canPublish || publishing) return
    setPublishing(true)
    setResult(null)

    const errors: string[] = []
    let successCount = 0

    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      setProgressText(`Uploading images for product ${i + 1} of ${products.length}…`)

      const uploadedUrls: string[] = []
      for (let j = 0; j < product.images.length; j++) {
        const img = product.images[j]
        if (img.url) { uploadedUrls.push(img.url); continue }

        setProducts(prev => prev.map(p => {
          if (p._id !== product._id) return p
          const imgs = [...p.images]
          imgs[j] = { ...imgs[j], uploading: true }
          return { ...p, images: imgs }
        }))

        try {
          const url = await uploadProductImage(img.file)
          uploadedUrls.push(url)
          setProducts(prev => prev.map(p => {
            if (p._id !== product._id) return p
            const imgs = [...p.images]
            imgs[j] = { ...imgs[j], uploading: false, url }
            return { ...p, images: imgs }
          }))
        } catch (err: any) {
          setProducts(prev => prev.map(p => {
            if (p._id !== product._id) return p
            const imgs = [...p.images]
            imgs[j] = { ...imgs[j], uploading: false, error: true }
            return { ...p, images: imgs }
          }))
          errors.push(`Product ${i + 1}, image ${j + 1}: ${err.message}`)
        }
      }

      if (uploadedUrls.length === 0) {
        errors.push(`Product ${i + 1}: no images uploaded — skipped.`)
        continue
      }

      setProgressText(`Saving product ${i + 1} of ${products.length} to database…`)

      const { data: inserted, error: prodErr } = await supabase
        .from('products')
        .insert({
          title: `New ${categoryName} Jersey`,
          description: null,
          price: parseFloat(product.price),
          category_id: categoryId,
          featured: product.featured,
          sizes: product.sizes,
        })
        .select('id')
        .single()

      if (prodErr || !inserted) {
        errors.push(`Product ${i + 1}: database error — ${prodErr?.message}`)
        continue
      }

      await supabase.from('product_images').insert(
        uploadedUrls.map((url, idx) => ({
          product_id: inserted.id,
          image_url: url,
          sort_order: idx,
        }))
      )

      successCount++
    }

    setPublishing(false)
    setProgressText('')
    setResult({ success: successCount, errors })

    if (successCount > 0 && errors.length === 0) {
      setTimeout(() => {
        setProducts([makeBlank()])
        setCategoryId('')
        setResult(null)
      }, 3000)
    }
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <Layers size={20} className="text-[#c9a84c]" />
        <h1 className="text-2xl font-black text-white">Bulk Upload</h1>
      </div>
      <p className="text-gray-500 text-sm mb-8">
        Pick a category, add products with images &amp; pricing, then publish all at once. Titles &amp; descriptions are updated individually afterwards.
      </p>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5 mb-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-6 h-6 rounded-full bg-[#c9a84c] flex items-center justify-center text-black text-xs font-black shrink-0">1</div>
          <span className="font-bold text-white text-sm">Choose Category</span>
          {categoryName && (
            <span className="ml-auto text-xs text-[#c9a84c] bg-[#c9a84c15] px-3 py-1 rounded-full font-semibold">
              ✓ {categoryName}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button key={cat.id} type="button" onClick={() => setCategoryId(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                categoryId === cat.id
                  ? 'bg-[#c9a84c] border-[#c9a84c] text-black'
                  : 'bg-[#111] border-[#2a2a2a] text-gray-400 hover:border-[#c9a84c] hover:text-white'
              }`}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {categoryId && (
        <>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-6 h-6 rounded-full bg-[#c9a84c] flex items-center justify-center text-black text-xs font-black shrink-0">2</div>
            <span className="font-bold text-white text-sm">
              Add Products — <span className="text-[#c9a84c]">{categoryName}</span>
            </span>
            <span className="ml-auto text-xs text-gray-600 bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-1 rounded-full">
              {products.length} product{products.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-4 mb-4">
            {products.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} totalCount={products.length}
                onUpdate={patch => updateProduct(p._id, patch)}
                onRemove={() => removeProduct(p._id)} />
            ))}
          </div>

          <button type="button" onClick={addProduct}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#2a2a2a] rounded-2xl text-sm text-gray-500 font-semibold hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all mb-6">
            <Plus size={15} /> Add Another Product
          </button>

          {!canPublish && (
            <div className="flex items-start gap-2.5 bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-4 py-3 mb-4">
              <AlertCircle size={14} className="text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-500/80">Each product needs at least 1 image and a price before publishing.</p>
            </div>
          )}

          {result && (
            <div className={`rounded-xl px-4 py-3 mb-4 border ${
              result.errors.length === 0
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : 'bg-red-500/5 border-red-500/20'
            }`}>
              {result.success > 0 && (
                <p className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-1">
                  <CheckCircle size={14} />
                  {result.success} product{result.success !== 1 ? 's' : ''} published successfully!
                </p>
              )}
              {result.errors.map((e, i) => (
                <p key={i} className="text-xs text-red-400">• {e}</p>
              ))}
            </div>
          )}

          <button type="button" onClick={handlePublish} disabled={!canPublish || publishing}
            className={`w-full py-3.5 rounded-xl font-black text-sm tracking-wide transition-all ${
              canPublish && !publishing
                ? 'bg-[#c9a84c] text-black hover:bg-[#e2c06a]'
                : 'bg-[#2a2a2a] text-gray-600 cursor-not-allowed'
            }`}>
            {publishing
              ? `⏳ ${progressText || 'Publishing…'}`
              : `Publish ${products.length} Product${products.length !== 1 ? 's' : ''} to ${categoryName}`}
          </button>
        </>
      )}
    </div>
  )
}
