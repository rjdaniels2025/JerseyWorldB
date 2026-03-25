/**
 * Returns an optimized image URL.
 * - For Supabase Storage URLs: uses built-in transform API (legacy support)
 * - For Cloudflare R2 URLs: returns as-is (already optimized at upload time)
 */
export function optimizeImage(url: string, width = 800, quality = 75): string {
  if (!url) return url
  if (url.includes('supabase.co')) {
    try {
      const base = url.split('?')[0]
      return `${base}?width=${width}&quality=${quality}&format=webp`
    } catch {
      return url
    }
  }
  // R2 or any other CDN — return as-is
  return url
}
