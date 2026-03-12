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
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
