'use client'

import { useState, useEffect } from 'react'
import { OracleCard } from '../OracleCard'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { TypewriterEffect } from '../ui/typewriter-effect'
import { cards } from './card-deck'

export function OracleApp() {
  const [selectedCards, setSelectedCards] = useState<any[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [reading, setReading] = useState({ english: '', persian: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const shuffled = [...cards].sort(() => 0.5 - Math.random())
    setSelectedCards(shuffled.slice(0, 3))
    setIsDesktop(window.innerWidth >= 768)
  }, [])

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => 0.5 - Math.random())
    setSelectedCards(shuffled.slice(0, 3))
    setFlippedCards([])
    setReading({ english: '', persian: '' })
    setIsLoading(false)
    setCurrentCardIndex(0)
  }

  const flipCard = async (id: number) => {
    if (flippedCards.includes(id)) return

    setFlippedCards(prev => [...prev, id])

    if (flippedCards.length === 2) {
      setIsLoading(true)
      try {
        const response = await fetch('/api/generate-reading', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `Create a unique oracle reading based on these three cards: ${selectedCards.map(card => card.name).join(', ')}.`
          })
        })
        const data = await response.json()
        setReading({ english: data.text, persian: 'Persian translation placeholder' })
      } catch (error) {
        console.error('Error generating reading:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-8">
        <h1 className="text-xl md:text-4xl text-center font-serif font-light text-amber-100 tracking-wide">
          Mystical Persian Oracle
        </h1>
        <div className="w-16 md:w-24 h-0.5 md:h-1 bg-amber-400 mx-auto rounded-full"></div>
        
        {flippedCards.length === 3 ? (
          <button
            onClick={shuffleCards}
            className="text-center text-base px-5 py-2 rounded-lg transition-all duration-300 
              bg-purple-900/30 hover:bg-purple-800/40 text-amber-100 cursor-pointer 
              border border-purple-500/30 hover:border-purple-400/40 
              shadow-md hover:shadow-purple-500/20"
          >
            ✨ New Reading ✨
          </button>
        ) : (
          <h2 className="text-base md:text-2xl text-center text-amber-200 font-light px-8 md:px-12">
            <span className="md:hidden">✨ Turn three cards to unveil mystical secrets ✨</span>
            <span className="hidden md:inline">✨ Turn the cards and unveil what the cosmos holds for you ✨</span>
          </h2>
        )}

        {/* Desktop Layout */}
        <div className="hidden md:flex -space-x-4" style={{ width: '900px', transform: 'translateX(160px)' }}>
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

        {/* Mobile Layout */}
        <div className="md:hidden w-screen px-4 -mt-8">
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

          <div className="relative h-[420px] overflow-hidden">
            {flippedCards.length < 3 ? (
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
              <div className="w-screen -mx-4 animate-fade-in mt-8">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                    <p className="text-purple-300">✨ The ancient wisdom is manifesting... ✨</p>
                  </div>
                ) : (
                  <Tabs defaultValue="english" className="w-full">
                    <TabsList className="w-screen -mx-4 grid grid-cols-2 bg-purple-900/30 rounded-t-lg border border-purple-500/30">
                      <TabsTrigger value="english">English Reading</TabsTrigger>
                      <TabsTrigger value="persian" className="font-arabic">قرائت فارسی</TabsTrigger>
                    </TabsList>
                    <TabsContent value="english">
                      <div className="min-h-[200px] bg-black/10 backdrop-blur-sm p-4 rounded-b-lg text-white">
                        <TypewriterEffect text={reading.english} />
                      </div>
                    </TabsContent>
                    <TabsContent value="persian">
                      <div className="min-h-[200px] bg-black/10 backdrop-blur-sm p-4 rounded-b-lg text-right text-white" dir="rtl">
                        <TypewriterEffect text={reading.persian} />
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Desktop-only reading section */}
        <div className="hidden md:block w-[92vw] md:max-w-2xl mt-28">
          <Tabs defaultValue="english" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-purple-900/30 rounded-t-lg border border-purple-500/30">
              <TabsTrigger value="english">English Reading</TabsTrigger>
              <TabsTrigger value="persian" className="font-arabic">قرائت فارسی</TabsTrigger>
            </TabsList>
            <TabsContent value="english">
              <div className="min-h-[200px] bg-black/10 backdrop-blur-sm p-4 rounded-b-lg text-white">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                    <p className="text-purple-300">✨ The ancient wisdom is manifesting... ✨</p>
                  </div>
                ) : (
                  <TypewriterEffect text={reading.english} />
                )}
              </div>
            </TabsContent>
            <TabsContent value="persian">
              <div className="min-h-[200px] bg-black/10 backdrop-blur-sm p-4 rounded-b-lg text-right text-white" dir="rtl">
                <TypewriterEffect text={reading.persian} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 