'use client'

import React, { useState, useEffect } from 'react'
import OracleCard from './components/OracleCard'
import TypewriterEffect from './components/TypewriterEffect'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from 'lucide-react'

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
  const [isLoading, setIsLoading] = useState(false)
  const [reading, setReading] = useState({ english: '', persian: '' })

  useEffect(() => {
    shuffleCards()
  }, [])

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => 0.5 - Math.random())
    setSelectedCards(shuffled.slice(0, 3))
    setFlippedCards([])
    setReading({ english: '', persian: '' })
    setIsLoading(false)
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
      // English reading with ritual
      const englishResponse = await fetch('/api/generate-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate an oracle reading for these three cards: ${selectedCards.map(card => card.name).join(', ')}. 
          First, provide a mystical interpretation (2-3 paragraphs).

          Then, provide a very brief ritual suggestion (maximum 2 sentences) that focuses on simple actions like meditation, visualization, or symbolic gestures. No fire or candles.

          Format exactly as:

          [mystical interpretation]

          ✧ Manifesting Ritual ✧
          [one or two sentences for ritual]`
        }),
      });

      const englishData = await englishResponse.json();
      
      setReading({
        english: englishData.text,
        persian: "در تولید قرائت شما خطایی رخ داد" // We can add Persian back later
      });
    } catch (error) {
      console.error('Error:', error);
      setReading({
        english: "There was an error generating your reading. Please try again.",
        persian: "در تولید قرائت شما خطایی رخ داد"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center justify-start p-8">
      <h1 className="text-3xl md:text-4xl text-center mb-2 font-serif font-light text-amber-100 tracking-wide">
        Mystical Persian Oracle
      </h1>
      <div className="w-24 h-1 bg-amber-400 mx-auto mb-8 rounded-full"></div>
      <h2 className="text-lg md:text-xl text-center mb-12 text-amber-200 font-light">
        ✨ Turn the cards and unveil what the cosmos holds for you ✨
      </h2>
      
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {selectedCards.map((card) => (
          <OracleCard
            key={card.id}
            isFlipped={flippedCards.includes(card.id)}
            onClick={() => flipCard(card.id)}
            frontImage={card.image}
            name={card.name}
            persianName={card.persianName}
          />
        ))}
      </div>

      <div className="sr-only" aria-live="polite">
        Selected cards: {flippedCards.length} out of 3
      </div>

      {flippedCards.length === 3 ? (
        <button
          onClick={shuffleCards}
          className="mb-8 text-center text-base px-5 py-2 rounded-lg transition-all duration-300 bg-purple-900/30 hover:bg-purple-800/40 text-amber-100 cursor-pointer border border-purple-500/30 hover:border-purple-400/40 shadow-md hover:shadow-purple-500/20"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              shuffleCards()
            }
          }}
        >
          ✨ New Reading ✨
        </button>
      ) : (
        <div className="mb-12 text-center text-lg text-amber-200">
          ✨ Turn all 3 cards for a reading ✨
        </div>
      )}

      <div className="w-full max-w-2xl pt-4">
        <Tabs defaultValue="english" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-purple-900/30 rounded-t-lg border border-purple-500/30">
            <TabsTrigger 
              value="english" 
              className="text-lg data-[state=active]:bg-purple-800/40 data-[state=active]:text-amber-100 text-gray-400 hover:text-amber-200"
            >
              English Reading
            </TabsTrigger>
            <TabsTrigger 
              value="persian" 
              className="text-lg font-arabic data-[state=active]:bg-purple-800/40 data-[state=active]:text-amber-100 text-gray-400 hover:text-amber-200"
            >
              قرائت فارسی
            </TabsTrigger>
          </TabsList>
          <TabsContent value="english">
            <div className="min-h-[200px] bg-black/10 backdrop-blur-sm p-8 rounded-b-lg">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                  <p className="text-purple-300">The mystical forces are gathering...</p>
                </div>
              ) : reading.english ? (
                <TypewriterEffect text={reading.english} />
              ) : (
                <p className="text-gray-400">Your reading will appear here...</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="persian">
            <div className="min-h-[200px] bg-black/10 backdrop-blur-sm p-8 rounded-b-lg">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                  <p className="text-purple-300 font-arabic">نیروهای عرفانی در حال جمع شدن هستند...</p>
                </div>
              ) : reading.persian ? (
                <TypewriterEffect text={reading.persian} />
              ) : (
                <p className="text-gray-400 font-arabic">قرائت شما اینجا ظاهر خواهد شد...</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

