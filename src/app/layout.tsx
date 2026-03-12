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
  description: 'Premium soccer and basketball jerseys. AC Milan, Barcelona, Bayern Munich, Chelsea, NBA and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className={`${dmSans.className} bg-[#181818] text-[#f0ede8]`}>

        {/* Animated smoke orbs */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Orb 1 — gold top left */}
          <div style={{
            position: 'absolute', top: '-10%', left: '-5%',
            width: '55vw', height: '55vw', maxWidth: 700, maxHeight: 700,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #c9a84c0f 0%, #c9a84c05 40%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'smokeFloat 18s ease-in-out infinite',
          }} />
          {/* Orb 2 — cool mid right */}
          <div style={{
            position: 'absolute', top: '25%', right: '-10%',
            width: '45vw', height: '45vw', maxWidth: 600, maxHeight: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ffffff05 0%, transparent 65%)',
            filter: 'blur(80px)',
            animation: 'smokeFloat 24s ease-in-out infinite reverse',
            animationDelay: '-8s',
          }} />
          {/* Orb 3 — gold bottom center */}
          <div style={{
            position: 'absolute', bottom: '5%', left: '30%',
            width: '40vw', height: '40vw', maxWidth: 500, maxHeight: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #c9a84c08 0%, transparent 60%)',
            filter: 'blur(70px)',
            animation: 'smokeFloat 20s ease-in-out infinite',
            animationDelay: '-12s',
          }} />
          {/* Orb 4 — subtle white mid left */}
          <div style={{
            position: 'absolute', top: '55%', left: '-8%',
            width: '35vw', height: '35vw', maxWidth: 450, maxHeight: 450,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ffffff04 0%, transparent 65%)',
            filter: 'blur(90px)',
            animation: 'smokeFloat 28s ease-in-out infinite',
            animationDelay: '-4s',
          }} />
        </div>

        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
