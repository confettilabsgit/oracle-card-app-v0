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
    <main className="relative min-h-screen">
      <div 
        style={{
          background: 'linear-gradient(to bottom right, #1a1033, #0a1a2c)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1
        }}
      />
      <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-screen">
        {/* Header section */}
        <div className="flex flex-col items-center space-y-4 mb-16">
          <h1 className="text-xl md:text-4xl text-center font-serif font-light text-amber-100 tracking-wide">
            Mystical Persian Oracle
          </h1>
          <div className="w-16 md:w-24 h-0.5 md:h-1 bg-amber-400 mx-auto rounded-full"></div>
          
          {/* Single conditional instruction/button */}
          {flippedCards.length === 3 ? (
            <button 
              onClick={() => window.location.reload()}
              className="bg-purple-900/50 text-[#FFFDD0] mb-4 px-6 py-2 rounded-md shadow-[0_0_15px_rgba(88,28,135,0.3)] hover:bg-purple-900/60 transition-all"
            >
              ✨ New Reading ✨
            </button>
          ) : (
            <h2 className="text-base md:text-2xl text-center text-amber-200 font-light px-8 md:px-12">
              <span className="md:hidden">✨ Turn three cards to unveil mystical secrets ✨</span>
              <span className="hidden md:inline">✨ Turn the cards and unveil what the cosmos holds for you ✨</span>
            </h2>
          )}
        </div>

        {/* Desktop Layout - in its own container */}
        <div className="hidden md:flex flex-col items-center w-full">
          <div className="flex -space-x-4 mb-16" style={{ width: '900px', transform: 'translateX(160px)' }}>
            {selectedCards.map((card) => (
              <OracleCard
                key={card.id}
                isFlipped={flippedCards.includes(card.id)}
                onClick={() => flipCard(card.id)}
                frontImage={card.image}
                name={card.name}
                persianName={card.persianName}
                isDesktop={isDesktop}
              />
            ))}
          </div>

          {/* Desktop-only reading section */}
          <div className="w-[95vw] md:max-w-3xl">
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
                <div className="min-h-[200px] bg-black/10 backdrop-blur-sm p-8 rounded-b-lg text-white">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-12">
                      <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
                      <p className="text-purple-300 text-lg text-center">
                        ✨ The ancient wisdom is manifesting... ✨
                      </p>
                    </div>
                  ) : (
                    <TypewriterEffect text={reading.english} />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="persian">
                <div className="min-h-[200px] bg-black/10 backdrop-blur-sm p-8 rounded-b-lg text-right text-white" dir="rtl">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-12">
                      <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
                      <p className="text-purple-300 text-lg text-center">
                        نیروهای عرفانی در حال جمع شدن هستند...
                      </p>
                    </div>
                  ) : (
                    <TypewriterEffect text={reading.persian} />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden w-screen -mx-4">
          {/* Navigation - Only Next button */}
          {flippedCards.length < 3 && (
            <div className="flex justify-center w-full mb-2">
              {flippedCards.includes(selectedCards[currentCardIndex]?.id) && currentCardIndex < 2 && (
                <button
                  onClick={() => setCurrentCardIndex(prev => prev + 1)}
                  className="mx-auto px-8 py-2 rounded-lg transition-all duration-300 
                    bg-purple-900/30 hover:bg-purple-800/40 text-amber-100 
                    border border-purple-500/30 hover:border-purple-400/40 
                    shadow-md hover:shadow-purple-500/20"
                >
                  {currentCardIndex === 1 
                    ? "Nice! Turn last card ✨" 
                    : "Great! Next Card →"}
                </button>
              )}
            </div>
          )}
          
          {/* Cards or Reading */}
          <div className="relative h-[420px] overflow-hidden">
            {flippedCards.length < 3 ? (
              // Show cards when not all are flipped
              selectedCards.map((card, index) => (
                <OracleCard
                  key={card.id}
                  isFlipped={flippedCards.includes(card.id)}
                  onClick={() => flipCard(card.id)}
                  frontImage={card.image}
                  name={card.name}
                  persianName={card.persianName}
                  isDesktop={isDesktop}
                  show={index === currentCardIndex}
                  zIndex={2}
                />
              ))
            ) : (
              // Show reading when all cards are flipped
              <div className="w-screen animate-fade-in mt-8">
                <div className="min-h-[200px] bg-black/10 backdrop-blur-sm rounded-none">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-12">
                      <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
                      <p className="text-purple-300 text-lg text-center">
                        ✨ The ancient wisdom is manifesting... ✨
                      </p>
                    </div>
                  ) : (
                    <Tabs defaultValue="english" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-purple-900/30 border-x-0 border-t-0 border-b border-purple-500/30">
                        <TabsTrigger value="english" className="text-sm data-[state=active]:bg-purple-800/40 data-[state=active]:text-amber-100 text-gray-400">
                          English Reading
                        </TabsTrigger>
                        <TabsTrigger value="persian" className="text-sm font-arabic data-[state=active]:bg-purple-800/40 data-[state=active]:text-amber-100 text-gray-400">
                          قرائت فارسی
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="english">
                        <div className="min-h-[200px] bg-black/10 backdrop-blur-sm p-4 text-white">
                          <TypewriterEffect text={reading.english} />
                        </div>
                      </TabsContent>
                      <TabsContent value="persian">
                        <div className="min-h-[200px] bg-black/10 backdrop-blur-sm p-4 text-right text-white" dir="rtl">
                          <TypewriterEffect text={reading.persian} />
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}