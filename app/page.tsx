'use client'

import React, { useState, useEffect, useCallback } from 'react'
import OracleCard from './components/OracleCard'
import TypewriterEffect from './components/TypewriterEffect'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from 'lucide-react'

const cards = [
  { id: 1, name: 'Peri', persianName: 'پری', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/peri-zfou8jGi3kUEIDBRtsId9pIFsdRQ6e.png', meaning: 'Peri: The ethereal spirit of beauty and grace' },
  { id: 2, name: 'Anahita', persianName: 'آناهیتا', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anahita-hEmT1AzKulovXd115ZrugyVPvR3TDz.png', meaning: 'Anahita: The goddess of water and fertility' },
  { id: 3, name: 'Faravahar', persianName: 'فروهر', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/farahvar-2RwODfjJgn3Fzj3FLr2SABgCoEwWou.png', meaning: 'Faravahar: The guardian spirit of divine destiny' },
  { id: 4, name: 'Simurgh', persianName: 'سیمرغ', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/simurgh-yyGPg0BQJJZzcF90VQplTyxS0rQcBx.png', meaning: 'Simurgh: The mythical bird of wisdom and healing' },
  { id: 5, name: 'Div', persianName: 'دیو', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/div-xjvocX2ti7nB2tDYinwTQTIEAyzofV.png', meaning: 'Div: The embodiment of chaos and challenge' },
  { id: 6, name: 'Huma', persianName: 'هما', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huma-g30DCxlvFWfN7J2OtIFtLRH7L7dHUN.png', meaning: 'Huma: The legendary bird of paradise and fortune' },
  { id: 7, name: 'Azhdaha', persianName: 'اژدها', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/azhdaha-tVgoPlJGFYTkBkR1GBoPbSX8S0rSPJ.png', meaning: 'Azhdaha: The dragon of power and cosmic balance' },
]

export default function Page() {
  const [selectedCards, setSelectedCards] = useState<typeof cards>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [reading, setReading] = useState('')
  const [isReadingReady, setIsReadingReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const generateReading = useCallback(async () => {
    setIsLoading(true);
    const flippedCardMeanings = selectedCards
      .filter(card => flippedCards.includes(card.id))
      .map(card => card.meaning);
    
    const prompt = `Generate a mystical oracle reading based on these card meanings: ${flippedCardMeanings.join(', ')}. The reading should have three parts: "The Cards Speak", "The Meaning Unveiled", and "The Path Forward".`;

    try {
      const response = await fetch('/api/generate-reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate reading');
      }

      const data = await response.json();
      setReading(data.text);
      setIsReadingReady(true);
    } catch (error) {
      console.error('Error generating reading:', error);
      setReading('An error occurred while generating your reading. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [flippedCards, selectedCards]);

  useEffect(() => {
    shuffleCards()
  }, [])

  useEffect(() => {
    if (flippedCards.length === 3 && !isReadingReady) {
      generateReading()
    }
  }, [flippedCards, isReadingReady, generateReading])

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => 0.5 - Math.random())
    setSelectedCards(shuffled.slice(0, 3))
    setFlippedCards([])
    setReading('')
    setIsReadingReady(false)
  }

  const flipCard = (id: number) => {
    if (flippedCards.length < 3 && !flippedCards.includes(id)) {
      setFlippedCards([...flippedCards, id])
    }
  }

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Oracle</h1>
      <h2 className="text-xl mb-12">✨ Turn the cards and unveil what the cosmos holds for you ✨</h2>
      
      <div className="flex flex-wrap justify-center gap-8 mb-12">
        {selectedCards.map(card => (
          <div key={card.id} className="flex flex-col items-center">
            <OracleCard
              isFlipped={flippedCards.includes(card.id)}
              onClick={() => flipCard(card.id)}
              frontImage={card.image}
              name={card.name}
              persianName={card.persianName}
            />
            {flippedCards.includes(card.id) && (
              <div className="mt-4 text-center">
                <div className="text-lg font-medium">{card.name}</div>
                <div className="text-sm text-blue-300">{card.persianName}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button 
        onClick={shuffleCards}
        className="bg-[#2D2D3A] hover:bg-[#3D3D4A] text-white font-medium py-3 px-6 rounded-lg mb-8"
      >
        ✨ Shuffle the Oracle ✨
      </Button>

      <div className="w-full max-w-2xl mx-auto">
        <Tabs defaultValue="english" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#2D2D3A]">
            <TabsTrigger value="english" className="text-white">English Reading</TabsTrigger>
            <TabsTrigger value="persian" className="text-white">قرائت فارسی</TabsTrigger>
          </TabsList>
          <TabsContent value="english">
            <div className="bg-[#2D2D3A]/50 p-6 rounded-lg mt-4 min-h-[300px] relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p className="text-lg">The spirits are whispering...</p>
                  </div>
                </div>
              ) : isReadingReady ? (
                <TypewriterEffect text={reading} delay={30} />
              ) : (
                <p className="text-center text-blue-300">Flip three cards to receive your reading...</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="persian">
            <div className="bg-[#2D2D3A]/50 p-6 rounded-lg mt-4 min-h-[300px] text-right">
              <p className="text-blue-300">محتوای فارسی اینجا قرار می‌گیرد...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

