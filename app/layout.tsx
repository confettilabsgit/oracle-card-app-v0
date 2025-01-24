import './globals.css'
import type { Metadata } from 'next'
import { Inter, Noto_Sans_Arabic } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const notoSansArabic = Noto_Sans_Arabic({ subsets: ['arabic'] })

export const metadata: Metadata = {
  title: 'Mystical Persian Oracle',
  description: 'A digital oracle deck inspired by Persian mythology',
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
        {children}
      </body>
    </html>
  )
}

