const SUPABASE_FUNCTION_URL =
  'https://gvhtrsmnrfffhfjehsif.supabase.co/functions/v1/upload-image'

export async function uploadImageToR2(
  file: File,
  folder: string = 'products'
): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
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
export const uploadPackageImage    = (f: File) => uploadImageToR2(f, 'team-packages')
