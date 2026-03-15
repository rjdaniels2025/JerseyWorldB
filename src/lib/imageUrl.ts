/**
 * Returns an optimized Supabase image URL using built-in transform API.
 * Resizes and compresses images on the fly from Supabase Storage.
 */
export function optimizeImage(url: string, width = 800, quality = 75): string {
  if (!url || !url.includes('supabase.co')) return url
  try {
    const base = url.split('?')[0]
    return `${base}?width=${width}&quality=${quality}&format=webp`
  } catch {
    return url
  }
}
