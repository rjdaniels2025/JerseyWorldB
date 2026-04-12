/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hjvxhdlhpmybholczzti.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-cb7afc41228249a784b9c7c2a44390bd.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gvhtrsmnrfffhfjehsif.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 128, 256, 384, 512],
  },
}
module.exports = nextConfig
