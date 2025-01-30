'use client'

import React, { useState, useEffect } from 'react'
import OracleCard from './components/OracleCard'
import TypewriterEffect from './components/TypewriterEffect'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from 'lucide-react'
import { CardDeck } from './components/oracle/card-deck'

const cards = [
  { id: 1, name: 'Simurgh', persianName: 'سیمرغ', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/simurgh-Jtc8EVywGwdSEKIK3PcGGMyz6d0Yon.png' },
  { id: 2, name: 'Peri', persianName: 'پری', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/peri-b0M4mWvY3p2J01OCq5cieVSZ1Vhmtq.png' },
  { id: 3, name: 'Div', persianName: 'دیو', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/div-x5JR9tBpFxUbJ4nZndek27dXlldayi.png' },
  { id: 4, name: 'Anahita', persianName: 'آناهیتا', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anahita-EucWYb2KyAZbe3dpCUkpo87mVQUGL2.png' },
  { id: 5, name: 'Faravahar', persianName: 'فروهر', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/farahvar-nCH4GRiSoEAv2Wjdbo7I6j4PVaCw3O.png' },
  { id: 6, name: 'Huma', persianName: 'هما', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huma-ycCNKdZ7xDysRlAbvardVOmeXQ3jPM.png' },
  { id: 7, name: 'Azhdaha', persianName: 'اژدها', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/azhdaha-eIhPk4hvsh7iOAItW8JJspjdvTHLko.png' },
]

export default function Home() {
  const [selectedCards, setSelectedCards] = useState<typeof cards>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reading, setReading] = useState({ english: '', persian: '' })
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    shuffleCards()
  }, [])

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768) // 768px is Tailwind's md breakpoint
    }
    
    checkIsDesktop()
    window.addEventListener('resize', checkIsDesktop)
    
    return () => window.removeEventListener('resize', checkIsDesktop)
  }, [])

  useEffect(() => {
    // Set loading to false after cards are ready
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => 0.5 - Math.random())
    setSelectedCards(shuffled.slice(0, 3))
    setFlippedCards([])
    setReading({ english: '', persian: '' })
    setCurrentCardIndex(0)
  }

  const flipCard = (id: number) => {
    if (!flippedCards.includes(id)) {
      const newFlippedCards = [...flippedCards, id]
      setFlippedCards(newFlippedCards)
      
      if (newFlippedCards.length === 3) {
        generateReading()
      }
    }
  }

  const generateReading = async () => {
    setIsLoading(true);
    try {
      // Get English reading
      const englishResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Generate an oracle reading for these three cards: ${selectedCards.map(card => card.name).join(', ')}. Include how they interact with each other and what message they bring.`
        }),
      });

      // Get Persian reading
      const persianResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Generate a Persian oracle reading in Farsi language for these three cards: ${selectedCards.map(card => card.persianName).join(', ')}. Include how they interact with each other and what message they bring. The response should be entirely in Farsi.`
        }),
      });

      const englishData = await englishResponse.json();
      const persianData = await persianResponse.json();
      
      setReading({
        english: englishData.text,
        persian: persianData.text
      });
    } catch (error) {
      console.error('Error generating reading:', error);
      setReading({
        english: "There was an error generating your reading. Please try again.",
        persian: "در تولید قرائت شما خطایی رخ داد. لطفاً دوباره امتحان کنید."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test auto-deployment setup
  console.log('Testing deployment');  // We'll remove this later

  return (
    <main className="min-h-screen p-4 flex flex-col items-center">
      <h1 className="text-4xl mb-8 text-center">Mystical Persian Oracle</h1>
      <p className="text-xl mb-12 text-center">✨ Turn three cards to unveil mystical secrets ✨</p>
      
      {/* Add more vertical space for larger cards */}
      <div className="my-8">
        <CardDeck />
      </div>
      
      <button className="mt-8 px-8 py-3 text-xl">
        Great! Next Card →
      </button>
    </main>
  )
}