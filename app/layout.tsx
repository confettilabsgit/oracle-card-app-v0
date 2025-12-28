import './globals.css'
import type { Metadata } from 'next'
import { Inter, Noto_Sans_Arabic } from 'next/font/google'
import NavMenu from './components/navigation/nav-menu'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({ subsets: ['latin'] })
const notoSansArabic = Noto_Sans_Arabic({ subsets: ['arabic'] })

export const metadata: Metadata = {
  title: 'The Persian Oracle',
  description: 'Unveil what the Persian realm holds for you',
  verification: {
    google: 'yFy1QIvrwLjrDRwspe7z0bEtQfWP7Gmxr3I5ulwtsWI',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <body 
        className={`${inter.className} ${notoSansArabic.className} min-h-screen`}
        style={{ 
          background: 'linear-gradient(to bottom right, #0a0a0b, #1a1a1c)'
        }}
      >
        <NavMenu />
        {children}
        <Analytics />
      </body>
    </html>
  )
}

