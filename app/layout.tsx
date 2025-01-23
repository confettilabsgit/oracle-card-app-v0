import './globals.css'
import type { Metadata } from 'next'
import { Inter, Noto_Sans_Arabic } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const notoSansArabic = Noto_Sans_Arabic({ subsets: ['arabic'] })

export const metadata: Metadata = {
  title: 'Persian Oracle Cards',
  description: 'Unveil what the Persian realm holds for you',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#1a1a2e" />
      </head>
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

