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
  { id: 12, name: 'Zahhak', persianName: 'ضحاک', image: '/cards/zahhak.png' },
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
        setIsLoading(true)
        generateReading()
      }
    }
  }

  const generateReading = async () => {
    try {
      // Get Hafez quote first
      const hafezResponse = await fetch('/api/hafez', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const hafezText = await hafezResponse.text();
      if (!hafezResponse.ok) {
        console.error('Hafez Response:', hafezText);
        throw new Error('Failed to fetch Hafez quote');
      }

      const hafezData = JSON.parse(hafezText);
      if (!hafezData?.text) {
        throw new Error('Invalid Hafez response format');
      }

      // Then generate reading with the Hafez quote
      const englishResponse = await fetch('/api/generate-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `For these cards: ${selectedCards.map(card => card.name).join(', ')}, provide a brief insight (2-3 sentences) followed by [READMORE_SPLIT] and then a deeper spiritual interpretation.

          Special card meanings to incorporate:
          - Zahhak: Represents facing one's shadows, transformation through adversity, the eternal struggle between light and dark. When this card appears, it often signals a time of confronting inner demons and emerging stronger.
          - Other cards retain their existing meanings.

          In the deeper interpretation:
          1. Start by examining this Hafez verse: "${hafezData.text}"
          2. Interpret this specific verse in relation to the cards drawn
          3. Show how the cards illuminate and expand upon the verse's meaning
          4. Offer practical guidance while staying grounded in Persian mystical traditions
          5. Keep a hopeful tone while acknowledging challenges

          Keep the deeper interpretation around 500-600 characters.
          IMPORTANT: Do not generate or quote any other Hafez verses - only interpret the one provided above.`,
          temperature: 0.7,
          max_tokens: 800
        }),
      });

      const englishText = await englishResponse.text();
      if (!englishResponse.ok) {
        console.error('English Response:', englishText);
        throw new Error('Failed to fetch English reading');
      }

      const englishData = JSON.parse(englishText);
      if (!englishData?.text) {
        throw new Error('Invalid English response format');
      }

      const [briefInsight, deeperWisdom] = englishData.text
        .split('[READMORE_SPLIT]')
        .map((text: string) => text.trim())

      setReading({
        english: `✧ Wisdom of Hafez ✧\n${hafezData.text}\n\n✧ Brief Insight ✧\n${
          briefInsight
        }[READMORE_SPLIT]✧ Deeper Wisdom ✧\n${
          deeperWisdom || 'Meditate on these cards to reveal their deeper meaning...'
        }`,
        persian: `✧ حکمت حافظ ✧\nدر عشق خانقاه و خرابات فرق نیست
        هر جا که هست پرتو روی حبیب هست\n
        ✧ تفسیر کوتاه ✧\n${
          selectedCards.map(card => card.persianName).join('، ')} به شما نشان می‌دهند که مسیر شما با نور و عشق روشن خواهد شد.
        [READMORE_SPLIT]✧ تفسیر عمیق ✧\n
        این کارت‌ها نشان دهنده‌ی مرحله‌ای مهم در سفر معنوی شما هستند. سیمرغ، پری و درویش با هم نشان می‌دهند که شما در آستانه‌ی تحولی عمیق قرار دارید. با پذیرش این تغییر و اعتماد به حکمت درونی، مسیر شما به سوی روشنایی و عشق هدایت خواهد شد. این زمان، فرصتی برای رها کردن محدودیت‌های گذشته و پذیرش هدیه‌های معنوی است که در انتظار شماست.`
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  console.log('Testing deployment - ' + new Date().toISOString())

  function getCardMeaning(name: string) {
    const meanings: Record<string, string> = {
      'Simurgh': 'The majestic phoenix of wisdom',
      'Peri': 'The fairy of divine beauty',
      'Div': 'The shadow self',
      // ... add other cards
    };
    return meanings[name] || '';
  }

  const handleNewReading = () => {
    setTimeout(() => {
      // Reset the flip state without removing cards
      setFlippedCards([]);
      setReading({ english: '', persian: '' });
    }, 600); // Match this duration with your CSS transition
  };

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
        <div className="flex flex-col items-center space-y-4 mb-8">
          <h1 className="text-2xl md:text-4xl text-center font-serif font-light text-amber-100 tracking-wide pt-10">
            The Oracle of Hafez
          </h1>
          <div className="w-16 md:w-24 h-0.5 md:h-1 bg-amber-400 mx-auto rounded-full"></div>
          
          {/* Show New Reading button only after loading is complete */}
          {flippedCards.length === 3 && !isLoading ? (
            <button 
              onClick={handleNewReading}
              className="bg-purple-900/30 text-[#FFFDD0] px-6 py-2 rounded-lg
                       shadow-[0_0_15px_rgba(88,28,135,0.3)]
                       border border-purple-500/30 hover:border-purple-400/40
                       hover:bg-purple-800/40 
                       transition-all"
            >
              ✨ New Reading ✨
            </button>
          ) : (
            <h2 className="text-base md:text-2xl text-center text-amber-200 font-light px-8 md:px-12">
              <span>✨ Turn three cards mindfully and invite the cosmos to share its secrets ✨</span>
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
                        delay={10}
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
                            delay={15}
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
                        delay={10}
                        direction="rtl"
                      />
                      
                      {showReadMorePersian && !showFullReadingPersian && (
                        <div className="flex justify-center">
                          <button 
                            onClick={() => setShowFullReadingPersian(true)}
                            className="px-6 py-2 text-amber-200 hover:text-amber-100 
                                     border border-amber-200/20 hover:border-amber-100/30 rounded-lg 
                                     transition-all duration-300 animate-fade-in
                                     bg-[#1a1033]/80 hover:bg-[#1a1033]
                                     shadow-[0_0_15px_rgba(88,28,135,0.2)]
                                     hover:shadow-[0_0_20px_rgba(88,28,135,0.3)]"
                          >
                            ✧ مکاشفه عمیق‌تر ✧
                          </button>
                        </div>
                      )}
                      
                      {showFullReadingPersian && (
                        <div className="animate-fade-in">
                          <TypewriterEffect 
                            text={reading.persian.split('[READMORE_SPLIT]')[1]} 
                            delay={10}
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
        <div className="md:hidden w-full">
          {/* Main Card Selection Area */}
          <div className="relative min-h-screen pt-24 px-4">
            {flippedCards.length < 3 ? (
              <div className="flex flex-col items-center">
                {/* Only show instruction if current card is not flipped */}
                {!flippedCards.includes(selectedCards[currentCardIndex]?.id) && (
                  <p className="absolute top-4 left-1/2 -translate-x-1/2 text-amber-200">
                    ✨ Tap the card to continue ✨
                  </p>
                )}
                {selectedCards.map((card, index) => (
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
                    className="w-[80%] mx-auto"
                  />
                ))}
                
                {/* Navigation button */}
                {flippedCards.includes(selectedCards[currentCardIndex]?.id) && currentCardIndex < 2 && (
                  <>
                    <button
                      onClick={() => setCurrentCardIndex(prev => prev + 1)}
                      className="absolute top-4 left-1/2 -translate-x-1/2  
                                text-amber-200 hover:text-amber-100 
                                bg-purple-900/30 px-6 py-2 rounded-lg
                                min-w-[220px] text-center
                                leading-tight
                                shadow-[0_0_15px_rgba(88,28,135,0.3)]
                                border border-purple-500/30 hover:border-purple-400/40
                                hover:bg-purple-800/40"
                    >
                      {currentCardIndex === 1 ? (
                        <div className="flex flex-col items-center gap-1">
                          <div>Mashallah!</div>
                          <div className="flex items-center gap-2">
                            See the last card
                            <span className="text-xl">→</span>
                          </div>
                        </div>
                      ) : (
                        "Yallah! Next Card →"
                      )}
                    </button>
                    {/* Add card info below button */}
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center">
                      <p className="text-amber-200">{selectedCards[currentCardIndex].name}</p>
                      <p className="text-amber-100/80 text-sm mt-1">
                        {getCardMeaning(selectedCards[currentCardIndex].name)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Reading view - absolutely positioned
              <div className="absolute top-0 left-0 right-0 animate-fade-in">
                {/* Rest of reading content */}
                <div className="flex-1 flex flex-col">
                  {/* Mini cards at top */}
                  <div className="flex justify-center gap-2 mb-4">
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
                  
                  {/* Reading content */}
                  <div className="flex-1">
                    <Tabs defaultValue="english" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-purple-900/30 
                        rounded-t-lg border border-purple-500/30 mb-1"
                      >
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
                              delay={10}
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
                                  delay={15}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="persian" dir="rtl">
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
                              delay={10}
                              direction="rtl"
                            />

                            
                            
                            {showReadMorePersian && !showFullReadingPersian && (
                              <div className="flex justify-center">
                                <button 
                                  onClick={() => setShowFullReadingPersian(true)}
                                  className="px-6 py-2 text-amber-200 hover:text-amber-100 
                                           border border-amber-200/20 hover:border-amber-100/30 rounded-lg 
                                           transition-all duration-300 animate-fade-in
                                           bg-[#1a1033]/80 hover:bg-[#1a1033]
                                           shadow-[0_0_15px_rgba(88,28,135,0.2)]
                                           hover:shadow-[0_0_20px_rgba(88,28,135,0.3)]"
                                >
                                  ✧ مکاشفه عمیق‌تر ✧
                                </button>
                              </div>
                            )}
                            
                            {showFullReadingPersian && (
                              <div className="animate-fade-in">
                                <TypewriterEffect 
                                  text={reading.persian.split('[READMORE_SPLIT]')[1]} 
                                  delay={10}
                                  direction="rtl"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}