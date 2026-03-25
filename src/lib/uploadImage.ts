const SUPABASE_FUNCTION_URL =
  'https://gvhtrsmnrfffhfjehsif.supabase.co/functions/v1/upload-image'

// Fixed output dimensions per folder — images are resized client-side
// before upload so every stored image is exactly these dimensions.
const FOLDER_DIMENSIONS: Record<string, { width: number; height: number; quality: number }> = {
  products:          { width: 800,  height: 1000, quality: 0.82 },
  banners:           { width: 1920, height: 640,  quality: 0.85 },
  promotions:        { width: 800,  height: 800,  quality: 0.80 },
  'fan-gallery':     { width: 900,  height: 900,  quality: 0.75 },
  'custom-designs':  { width: 800,  height: 800,  quality: 0.80 },
}

/**
 * Resize a File to exact target dimensions using an HTML canvas.
 * The image is scaled to fit (contain) inside the target, centered,
 * and padded with white. Returns a new File (JPEG) at the target size.
 */
async function resizeClientSide(
  file: File,
  targetWidth: number,
  targetHeight: number,
  quality: number
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      const canvas = document.createElement('canvas')
      canvas.width = targetWidth
      canvas.height = targetHeight

      const ctx = canvas.getContext('2d')!

      // White background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, targetWidth, targetHeight)

      // Scale to fit inside target preserving aspect ratio (contain)
      const scale = Math.min(targetWidth / img.width, targetHeight / img.height)
      const drawWidth  = Math.round(img.width  * scale)
      const drawHeight = Math.round(img.height * scale)
      const offsetX = Math.round((targetWidth  - drawWidth)  / 2)
      const offsetY = Math.round((targetHeight - drawHeight) / 2)

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error('Canvas resize failed')); return }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load image for resizing'))
    }

    img.src = objectUrl
  })
}

export async function uploadImageToR2(
  file: File,
  folder: string = 'products'
): Promise<string> {
  // Resize client-side to exact fixed dimensions before uploading
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
