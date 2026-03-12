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
  title: 'Jersey World B — Premium Jerseys',
  description: 'Premium soccer and basketball jerseys.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className={`${dmSans.className}`}
        style={{ backgroundColor: '#181818', color: '#f0ede8', minHeight: '100vh' }}>

        {/* ── Smoke layer — fixed behind everything ── */}
        <div aria-hidden="true" style={{
          position: 'fixed', inset: 0, zIndex: 0,
          pointerEvents: 'none', overflow: 'hidden',
        }}>

          {/* Base deep vignette */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 120% 80% at 50% 50%, #1e1c1c 0%, #111010 100%)',
          }} />

          {/* Smoke orb 1 — large gold bloom, top left */}
          <div style={{
            position: 'absolute',
            top: '-20%', left: '-15%',
            width: '75vw', height: '75vw',
            maxWidth: '900px', maxHeight: '900px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 40%, #c9a84c18 0%, #c9a84c08 30%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'smokeDrift1 22s ease-in-out infinite',
          }} />

          {/* Smoke orb 2 — cool white haze, right center */}
          <div style={{
            position: 'absolute',
            top: '20%', right: '-20%',
            width: '65vw', height: '65vw',
            maxWidth: '800px', maxHeight: '800px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 60% 50%, #ffffff0a 0%, #ffffff04 35%, transparent 65%)',
            filter: 'blur(100px)',
            animation: 'smokeDrift2 28s ease-in-out infinite',
            animationDelay: '-10s',
          }} />

          {/* Smoke orb 3 — warm amber, bottom right */}
          <div style={{
            position: 'absolute',
            bottom: '-10%', right: '-10%',
            width: '60vw', height: '60vw',
            maxWidth: '750px', maxHeight: '750px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 55% 60%, #c9a84c10 0%, #b8932a06 40%, transparent 68%)',
            filter: 'blur(90px)',
            animation: 'smokeDrift3 32s ease-in-out infinite',
            animationDelay: '-6s',
          }} />

          {/* Smoke orb 4 — subtle white lift, bottom left */}
          <div style={{
            position: 'absolute',
            bottom: '5%', left: '-5%',
            width: '50vw', height: '50vw',
            maxWidth: '600px', maxHeight: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 45% 55%, #ffffff07 0%, transparent 60%)',
            filter: 'blur(110px)',
            animation: 'smokeDrift4 25s ease-in-out infinite',
            animationDelay: '-16s',
          }} />

          {/* Smoke orb 5 — gold center depth */}
          <div style={{
            position: 'absolute',
            top: '40%', left: '25%',
            width: '50vw', height: '50vw',
            maxWidth: '650px', maxHeight: '650px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 50% 50%, #c9a84c06 0%, transparent 55%)',
            filter: 'blur(120px)',
            animation: 'smokeDrift2 35s ease-in-out infinite reverse',
            animationDelay: '-20s',
          }} />

          {/* Grain noise overlay — pure CSS, no grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)' opacity='0.06'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
            opacity: 0.4,
            mixBlendMode: 'overlay',
          }} />
        </div>

        {/* Page content sits above smoke */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>

      </body>
    </html>
  )
}
