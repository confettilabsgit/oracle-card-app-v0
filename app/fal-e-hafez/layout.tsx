import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fal-e Hafez Online | Open the Divan of Hafez',
  description: 'Try Fal-e Hafez online. Open the Divan of Hafez, receive a verse, and explore a clear interpretation in English or فارسی.',
}

export default function FalEHafezLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

