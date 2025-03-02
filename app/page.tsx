'use client'

import React, { useState, useEffect } from 'react'
import OracleCard from './components/OracleCard'
import TypewriterEffect from './components/TypewriterEffect'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

const cards = [
  { id: 1, name: 'Simurgh', persianName: 'سیمرغ', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/simurgh-Jtc8EVywGwdSEKIK3PcGGMyz6d0Yon.png' },
  { id: 2, name: 'Peri', persianName: 'پری', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/peri-b0M4mWvY3p2J01OCq5cieVSZ1Vhmtq.png' },
  { id: 3, name: 'Div', persianName: 'دیو', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/div-x5JR9tBpFxUbJ4nZndek27dXlldayi.png' },
  { id: 4, name: 'Anahita', persianName: 'آناهیتا', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anahita-EucWYb2KyAZbe3dpCUkpo87mVQUGL2.png' },
  { id: 5, name: 'Faravahar', persianName: 'فروهر', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/farahvar-nCH4GRiSoEAv2Wjdbo7I6j4PVaCw3O.png' },
  { id: 6, name: 'Huma', persianName: 'هما', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huma-ycCNKdZ7xDysRlAbvardVOmeXQ3jPM.png' },
  { id: 7, name: 'Azhdaha', persianName: 'اژدها', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/azhdaha-eIhPk4hvsh7iOAItW8JJspjdvTHLko.png' },
  { id: 8, name: 'Cypress', persianName: 'سرو', image: '/cards/cypress.png' },
  { id: 9, name: 'Moon', persianName: 'ماه', image: '/cards/moon.png' },
  { id: 10, name: 'Dervish', persianName: 'درویش', image: '/cards/dervish.png' },
  { id: 11, name: 'Sun Lion', persianName: 'شیر و خورشید', image: '/cards/sunlion.png' },
]

export default function Home() {
  const [selectedCards, setSelectedCards] = useState<typeof cards>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [reading, setReading] = useState({ english: '', persian: '' })
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isDesktop, setIsDesktop] = useState(true)
  const [showReadMoreEnglish, setShowReadMoreEnglish] = useState(false)
  const [showReadMorePersian, setShowReadMorePersian] = useState(false)
  const [showFullReadingEnglish, setShowFullReadingEnglish] = useState(false)
  const [showFullReadingPersian, setShowFullReadingPersian] = useState(false)

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
    setIsLoading(true)
    try {
      // Get Hafez wisdom first
      const hafezResponse = await fetch('/api/hafez', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const hafezData = await hafezResponse.json()

      // Get the reading with card interpretation
      const englishResponse = await fetch('/api/generate-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `For these three cards: ${selectedCards.map(card => card.name).join(', ')}, generate a brief insight (2-3 sentences) that connects them to this Hafez wisdom: "${hafezData.text}"`
        }),
      })
      const englishData = await englishResponse.json()

      // Set readings for both languages
      setReading({
        english: `✧ Wisdom of Hafez ✧\n${hafezData.text}\n\n✧ Brief Insight ✧\n${englishData.text}`,
        persian: `✧ حکمت حافظ ✧\n
        در عشق خانقاه و خرابات فرق نیست
        هر جا که هست پرتو روی حبیب هست\n
        ✧ تفسیر کوتاه ✧\n
        ${selectedCards.map(card => card.persianName).join('، ')} به شما نشان می‌دهند که مسیر شما با نور و عشق روشن خواهد شد.`
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
        <div className="flex flex-col items-center space-y-4 mb-16 md:mb-16 mb-8">
          <h1 className="text-xl md:text-4xl text-center font-serif font-light text-amber-100 tracking-wide">
            The Oracle of Hafez
          </h1>
          <div className="w-16 md:w-24 h-0.5 md:h-1 bg-amber-400 mx-auto rounded-full"></div>
          
          {/* Single conditional instruction/button */}
          {flippedCards.length === 3 ? (
            <button 
              onClick={() => {
                // Add fade-out class to cards container
                document.querySelector('.cards-container')?.classList.add('animate-fade-out')
                // Delay reload slightly to allow animation
                setTimeout(() => window.location.reload(), 300)
              }}
              className="bg-purple-900/50 text-[#FFFDD0] mb-4 md:mb-4 mb-2 px-6 py-2 rounded-md 
                       shadow-[0_0_15px_rgba(88,28,135,0.3)] hover:bg-purple-900/60 
                       transition-all"
            >
              ✨ New Reading ✨
            </button>
          ) : (
            <h2 className="text-base md:text-2xl text-center text-amber-200 font-light px-8 md:px-12">
              <span>✨ Turn three cards mindfully and let the cosmos share its secrets ✨</span>
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
                  فال فارسی
                </TabsTrigger>
              </TabsList>
              <TabsContent value="english">
                <div className="min-h-[200px] bg-black/10 backdrop-blur-sm px-8 pt-2 pb-8 rounded-b-lg">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                      <p className="text-purple-300">The mystical forces are gathering...</p>
                    </div>
                  ) : reading.english ? (
                    <div className="text-amber-100 space-y-6">
                      <TypewriterEffect 
                        text={reading.english.split('[READMORE_SPLIT]')[0]} 
                        onComplete={() => setShowReadMoreEnglish(true)}
                        isTitle={true}
                        delay={30}
                      />
                      
                      {showReadMoreEnglish && !showFullReadingEnglish && (
                        <div className="mt-8 flex justify-center animate-fade-in">
                          <button 
                            onClick={() => setShowFullReadingEnglish(true)}
                            className="px-6 py-2.5 bg-[#1a1033]/80 text-amber-200 hover:text-amber-100 
                                     border border-amber-200/20 hover:border-amber-100/30 rounded-lg 
                                     transition-all duration-300
                                     shadow-[0_0_15px_rgba(88,28,135,0.2)]
                                     hover:shadow-[0_0_20px_rgba(88,28,135,0.3)]
                                     hover:bg-[#1a1033]"
                          >
                            ✧ Reveal the deeper wisdom ✧
                          </button>
                        </div>
                      )}
                      
                      {showFullReadingEnglish && (
                        <div className="animate-fade-in">
                          <TypewriterEffect 
                            text={reading.english.split('[READMORE_SPLIT]')[1]} 
                            isTitle={false}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400">Your reading will appear here...</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="persian">
                <div className="min-h-[200px] bg-black/10 backdrop-blur-sm px-8 pt-2 pb-8 rounded-b-lg text-right" dir="rtl">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-12">
                      <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
                      <p className="text-purple-300 text-lg text-center">
                        نیروهای عرفانی در حال جمع شدن هستند...
                      </p>
                    </div>
                  ) : reading.persian ? (
                    <div className="text-amber-100 space-y-6">
                      <TypewriterEffect 
                        text={reading.persian.split('[READMORE_SPLIT]')[0]} 
                        onComplete={() => setShowReadMorePersian(true)}
                        delay={30}
                        direction="rtl"
                      />
                      
                      {showReadMorePersian && !showFullReadingPersian && (
                        <div className="flex justify-center">
                          <button 
                            onClick={() => setShowFullReadingPersian(true)}
                            className="px-6 py-2 text-amber-200 hover:text-amber-100 
                                     border border-amber-200/20 hover:border-amber-100/30 rounded-lg 
                                     transition-all duration-300 animate-fade-in
                                     bg-black/20 hover:bg-black/30"
                          >
                            ✧ مکاشفه عمیق‌تر ✧
                          </button>
                        </div>
                      )}
                      
                      {showFullReadingPersian && (
                        <div className="animate-fade-in">
                          <TypewriterEffect 
                            text={reading.persian.split('[READMORE_SPLIT]')[1]} 
                            delay={30}
                            direction="rtl"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400">فال شما اینجا ظاهر خواهد شد...</p>
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

          {/* Main Card Selection Area */}
          <div className="relative h-[600px] overflow-hidden">
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
              <div className="w-full md:w-auto animate-fade-in mt-0 px-4">
                {/* Mini cards container - reduce bottom margin */}
                <div className="flex justify-center gap-2 -mb-5 cards-container max-w-lg mx-auto">  {/* Added negative margin */}
                  {selectedCards.map((card) => (
                    <div 
                      key={card.id}
                      className="w-24 h-40 rounded-lg overflow-hidden border border-amber-200/20"
                    >
                      <Image 
                        src={card.image} 
                        alt={card.name}
                        width={96}
                        height={160}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Reading section container */}
                <div className="
                  max-w-lg
                  mx-auto
                  bg-black/10 
                  backdrop-blur-sm 
                  rounded-none 
                  -mt-10
                ">
                  {/* Fixed tabs */}
                  <Tabs defaultValue="english" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-purple-900/30 
                      rounded-t-lg border border-purple-500/30 mb-1 sticky top-0 z-10"
                    >
                      <TabsTrigger value="english">English Reading</TabsTrigger>
                      <TabsTrigger value="persian">فال فارسی</TabsTrigger>
                    </TabsList>

                    {/* Scrollable content area */}
                    <div className="
                      h-[500px]
                      overflow-y-auto 
                      touch-pan-y 
                      overscroll-y-contain 
                      px-4 
                      md:px-6 
                      pt-2
                      pb-4
                    ">
                      <TabsContent value="english">
                        {isLoading ? (
                          <div className="flex flex-col items-center justify-center gap-4 py-12">
                            <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
                            <p className="text-purple-300 text-lg text-center">
                              ✨ The ancient wisdom is manifesting... ✨
                            </p>
                          </div>
                        ) : (
                          <div className="max-w-[95vw] md:max-w-none mx-auto text-white">
                            <TypewriterEffect 
                              text={reading.english.split('[READMORE_SPLIT]')[0]} 
                              onComplete={() => setShowReadMoreEnglish(true)}
                              isTitle={true}
                              delay={30}
                            />
                            
                            {showReadMoreEnglish && !showFullReadingEnglish && (
                              <div className="mt-8 flex justify-center animate-fade-in">
                                <button 
                                  onClick={() => setShowFullReadingEnglish(true)}
                                  className="px-6 py-2.5 bg-[#1a1033]/80 text-amber-200 hover:text-amber-100 
                                           border border-amber-200/20 hover:border-amber-100/30 rounded-lg 
                                           transition-all duration-300
                                           shadow-[0_0_15px_rgba(88,28,135,0.2)]
                                           hover:shadow-[0_0_20px_rgba(88,28,135,0.3)]
                                           hover:bg-[#1a1033]"
                                >
                                  ✧ Reveal the deeper wisdom ✧
                                </button>
                              </div>
                            )}
                            
                            {showFullReadingEnglish && (
                              <div className="animate-fade-in">
                                <TypewriterEffect 
                                  text={reading.english.split('[READMORE_SPLIT]')[1]} 
                                  isTitle={false}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </TabsContent>
                      <TabsContent value="persian">
                        {isLoading ? (
                          <div className="flex flex-col items-center justify-center gap-4 py-12">
                            <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
                            <p className="text-purple-300 text-lg text-center">
                              نیروهای عرفانی در حال جمع شدن هستند...
                            </p>
                          </div>
                        ) : (
                          <div className="max-w-[95vw] md:max-w-none mx-auto text-white">
                            <TypewriterEffect 
                              text={reading.persian.split('[READMORE_SPLIT]')[0]} 
                              onComplete={() => setShowReadMorePersian(true)}
                              delay={30}
                              direction="rtl"
                            />
                            
                            {showReadMorePersian && !showFullReadingPersian && (
                              <div className="flex justify-center">
                                <button 
                                  onClick={() => setShowFullReadingPersian(true)}
                                  className="px-6 py-2 text-amber-200 hover:text-amber-100 
                                           border border-amber-200/20 hover:border-amber-100/30 rounded-lg 
                                           transition-all duration-300 animate-fade-in
                                           bg-black/20 hover:bg-black/30"
                                >
                                  ✧ مکاشفه عمیق‌تر ✧
                                </button>
                              </div>
                            )}
                            
                            {showFullReadingPersian && (
                              <div className="animate-fade-in">
                                <TypewriterEffect 
                                  text={reading.persian.split('[READMORE_SPLIT]')[1]} 
                                  delay={30}
                                  direction="rtl"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}