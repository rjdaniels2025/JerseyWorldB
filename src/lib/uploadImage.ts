const SUPABASE_FUNCTION_URL =
  'https://gvhtrsmnrfffhfjehsif.supabase.co/functions/v1/upload-image'

const FOLDER_DIMENSIONS: Record<string, { width: number; height: number; quality: number }> = {
  products:         { width: 800,  height: 1000, quality: 0.82 },
  banners:          { width: 1920, height: 640,  quality: 0.85 },
  promotions:       { width: 800,  height: 800,  quality: 0.80 },
  'fan-gallery':    { width: 900,  height: 900,  quality: 0.75 },
  'custom-designs': { width: 800,  height: 800,  quality: 0.80 },
}

function resizeClientSide(
  file: File,
  targetWidth: number,
  targetHeight: number,
  quality: number
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(new Error('Failed to read image file'))

    reader.onload = (readerEvent) => {
      const dataUrl = readerEvent.target?.result as string
      if (!dataUrl) { reject(new Error('Empty file read')); return }

      const img = new Image()

      img.onerror = () => reject(new Error('Failed to decode image'))

      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = targetWidth
        canvas.height = targetHeight

        const ctx = canvas.getContext('2d')
        if (!ctx) { reject(new Error('Canvas not supported')); return }

        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, targetWidth, targetHeight)

        const scale = Math.min(targetWidth / img.naturalWidth, targetHeight / img.naturalHeight)
        const drawWidth  = Math.round(img.naturalWidth  * scale)
        const drawHeight = Math.round(img.naturalHeight * scale)
        const offsetX    = Math.round((targetWidth  - drawWidth)  / 2)
        const offsetY    = Math.round((targetHeight - drawHeight) / 2)

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

        canvas.toBlob(
          (blob) => {
            if (!blob) { reject(new Error('Canvas export failed')); return }
            const outName = file.name.replace(/\.[^.]+$/, '') + '.jpg'
            resolve(new File([blob], outName, { type: 'image/jpeg' }))
          },
          'image/jpeg',
          quality
        )
      }

      img.src = dataUrl
    }

    reader.readAsDataURL(file)
  })
}

export async function uploadImageToR2(
  file: File,
  folder: string = 'products'
): Promise<string> {
  const dims = FOLDER_DIMENSIONS[folder] ?? FOLDER_DIMENSIONS['products']
  const resized = await resizeClientSide(file, dims.width, dims.height, dims.quality)

  const formData = new FormData()
  formData.append('file', resized)
  formData.append('folder', folder)

  const res = await fetch(SUPABASE_FUNCTION_URL, {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Upload failed')
  return data.url as string
}

export const uploadProductImage    = (f: File) => uploadImageToR2(f, 'products')
export const uploadBannerImage     = (f: File) => uploadImageToR2(f, 'banners')
export const uploadPromotionImage  = (f: File) => uploadImageToR2(f, 'promotions')
export const uploadFanGalleryImage = (f: File) => uploadImageToR2(f, 'fan-gallery')
export const uploadCustomDesign    = (f: File) => uploadImageToR2(f, 'custom-designs')
