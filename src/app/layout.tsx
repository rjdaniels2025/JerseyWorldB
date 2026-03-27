import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Jersey World B Premium Jerseys',
  description: 'Premium soccer, basketball, football and hockey jerseys for fans who live the game. Quality, style, and passion in every stitch.',
  metadataBase: new URL('https://jerseyworldb.vercel.app'),
  openGraph: {
    title: 'Jersey World B Premium Jerseys',
    description: 'Premium soccer, basketball, football and hockey jerseys for fans who live the game.',
    url: 'https://jerseyworldb.vercel.app',
    siteName: 'Jersey World B',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jersey World B Premium Jerseys',
      },
    ],
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jersey World B Premium Jerseys',
    description: 'Premium soccer, basketball, football and hockey jerseys for fans who live the game.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className={`${dmSans.className}`}
        style={{ backgroundColor: '#161515', color: '#f0ede8', minHeight: '100vh' }}>

        <div aria-hidden="true" style={{
          position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 140% 100% at 50% 50%, #1a1818 0%, #0e0d0d 100%)' }} />
          <div style={{ position: 'absolute', top: '-25%', left: '-20%', width: '90vw', height: '90vw', maxWidth: '1100px', maxHeight: '1100px', borderRadius: '50%', background: 'radial-gradient(circle at 40% 40%, #c9a84c0d 0%, #c9a84c05 35%, transparent 70%)', filter: 'blur(90px)', animation: 'smokeDrift1 22s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: '15%', right: '-25%', width: '80vw', height: '80vw', maxWidth: '1000px', maxHeight: '1000px', borderRadius: '50%', background: 'radial-gradient(circle at 60% 50%, #ffffff0d 0%, #ffffff06 30%, transparent 62%)', filter: 'blur(100px)', animation: 'smokeDrift2 28s ease-in-out infinite', animationDelay: '-10s' }} />
          <div style={{ position: 'absolute', bottom: '-15%', right: '-15%', width: '75vw', height: '75vw', maxWidth: '900px', maxHeight: '900px', borderRadius: '50%', background: 'radial-gradient(circle at 55% 60%, #c9a84c09 0%, #c9a84c03 40%, transparent 65%)', filter: 'blur(100px)', animation: 'smokeDrift3 32s ease-in-out infinite', animationDelay: '-6s' }} />
          <div style={{ position: 'absolute', bottom: '0%', left: '-10%', width: '65vw', height: '65vw', maxWidth: '800px', maxHeight: '800px', borderRadius: '50%', background: 'radial-gradient(circle at 45% 55%, #ffffff0a 0%, #ffffff04 35%, transparent 60%)', filter: 'blur(110px)', animation: 'smokeDrift4 25s ease-in-out infinite', animationDelay: '-16s' }} />
          <div style={{ position: 'absolute', top: '35%', left: '20%', width: '60vw', height: '60vw', maxWidth: '750px', maxHeight: '750px', borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, #c9a84c07 0%, transparent 55%)', filter: 'blur(120px)', animation: 'smokeDrift2 35s ease-in-out infinite reverse', animationDelay: '-20s' }} />
          <div style={{ position: 'absolute', top: '5%', left: '35%', width: '50vw', height: '50vw', maxWidth: '650px', maxHeight: '650px', borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, #ffffff08 0%, transparent 58%)', filter: 'blur(100px)', animation: 'smokeDrift1 40s ease-in-out infinite reverse', animationDelay: '-30s' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)' opacity='0.06'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px', opacity: 0.3, mixBlendMode: 'overlay' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>

      </body>
    </html>
  )
}
