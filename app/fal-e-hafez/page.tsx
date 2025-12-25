'use client'

import React, { useState, useEffect } from 'react'
import OracleCard from '../components/OracleCard'
import TypewriterEffect from '../components/TypewriterEffect'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { cardMeanings } from '../lib/cardMeanings'

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

export default function FaleHafez() {
  const [selectedCards, setSelectedCards] = useState<typeof cards>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [selectedCard, setSelectedCard] = useState<typeof cards[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [reading, setReading] = useState({ english: '', persian: '' })
  const [isDesktop, setIsDesktop] = useState(true)
  const [showReadMoreEnglish, setShowReadMoreEnglish] = useState(false)
  const [showReadMorePersian, setShowReadMorePersian] = useState(false)
  const [showFullReadingEnglish, setShowFullReadingEnglish] = useState(false)
  const [showFullReadingPersian, setShowFullReadingPersian] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isBookOpen, setIsBookOpen] = useState(false)
  const [isFlippingPages, setIsFlippingPages] = useState(false)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [finalCardIndex, setFinalCardIndex] = useState<number | null>(null)

  useEffect(() => {
    // Initialize book in closed state
    setIsBookOpen(false)
    setIsFlippingPages(false)
    setCurrentPageIndex(0)
    setFinalCardIndex(null)
  }, [])

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    
    checkIsDesktop()
    window.addEventListener('resize', checkIsDesktop)
    
    return () => window.removeEventListener('resize', checkIsDesktop)
  }, [])

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => 0.5 - Math.random())
    setSelectedCards(shuffled.slice(0, 3))
    setFlippedCards([])
    setSelectedCard(null)
    setReading({ english: '', persian: '' })
    setErrorMessage('')
    setIsBookOpen(false)
    setIsFlippingPages(false)
    setCurrentPageIndex(0)
    setFinalCardIndex(null)
  }

  const openBook = () => {
    if (isBookOpen || isFlippingPages) return
    
    setIsBookOpen(true)
    setIsFlippingPages(true)
    setCurrentPageIndex(0)
    
    // Randomly select final card (0-11)
    const randomCardIndex = Math.floor(Math.random() * cards.length)
    setFinalCardIndex(randomCardIndex)
    
    // Animate through 50+ pages
    const totalPages = 55 // 50+ pages as specified
    let pageCount = 0
    const flipInterval = setInterval(() => {
      pageCount++
      setCurrentPageIndex(pageCount)
      
      if (pageCount >= totalPages) {
        clearInterval(flipInterval)
        setIsFlippingPages(false)
        // Select the card and generate reading
        const selectedCard = cards[randomCardIndex]
        setSelectedCard(selectedCard)
        setIsLoading(true)
        generateReading(selectedCard)
      }
    }, 80) // ~80ms per page for rapid flipping effect
  }

  // flipCard is no longer used - book opening replaces it

  const generateReading = async (card: typeof cards[0]) => {
    // Reset reading reveal states
    setShowReadMoreEnglish(false)
    setShowReadMorePersian(false)
    setShowFullReadingEnglish(false)
    setShowFullReadingPersian(false)
    
    try {
      // Get Hafez quote first (English)
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

      // Get Persian poem
      const persianPoemResponse = await fetch('/api/generate-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Return the original Persian text (in Persian script) for the Hafez verse that corresponds to this English translation: "${hafezData.text}". Return only the Persian text, 2-3 lines, nothing else.`,
          temperature: 0.3,
          max_tokens: 150
        }),
      });

      const persianPoemText = await persianPoemResponse.text();
      let persianPoem = '';
      if (persianPoemResponse.ok) {
        try {
          const persianPoemData = JSON.parse(persianPoemText);
          persianPoem = persianPoemData?.text || '';
        } catch (e) {
          console.error('Failed to parse Persian poem response');
        }
      }

      // Generate Hafez interpretation (no card mention)
      const englishResponse = await fetch('/api/hafez-interpretation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verse: hafezData.text,
          language: 'english'
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

      // Parse the structured response: [Layman's interpretation][READMORE_SPLIT][Deep scholarly interpretation]
      const parts = englishData.text.split('[READMORE_SPLIT]');
      const briefInsight = parts[0]?.trim() || '';
      const deeperWisdom = parts[1]?.trim() || '';

      // Generate Persian Hafez interpretation (no card mention)
      const persianResponse = await fetch('/api/hafez-interpretation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verse: persianPoem || hafezData.text,
          language: 'persian'
        }),
      });

      const persianReadingText = await persianResponse.text();
      let persianBriefInsight = 'تفسیر حافظ در حال آماده‌سازی است...'
      let persianDeeperWisdom = ''

      if (persianResponse.ok) {
        try {
          const persianReadingData = JSON.parse(persianReadingText);
          if (persianReadingData?.text) {
            // Parse structured response: [تفسیر ساده][READMORE_SPLIT][تفسیر عمیق]
            const parts = persianReadingData.text.split('[READMORE_SPLIT]');
            persianBriefInsight = parts[0]?.trim() || '';
            persianDeeperWisdom = parts[1]?.trim() || '';
          }
        } catch (e) {
          console.error('Failed to parse Persian reading response', e)
        }
      }

      setReading({
        english: `✧ Poem from Hafez ✧\n${hafezData.text}\n\n✧ Brief Insight ✧\n${
          briefInsight
        }[READMORE_SPLIT]${deeperWisdom || 'Meditate on this verse to reveal its deeper meaning...'}`,
        persian: `✧ شعر حافظ ✧\n${persianPoem || hafezData.text}\n\n✧ تفسیر ساده ✧\n${
          persianBriefInsight
        }[READMORE_SPLIT]✧ تفسیر عمیق ✧\n${persianDeeperWisdom || 'در این شعر حافظ، حکمتی عمیق نهفته است که با تأمل بیشتر آشکار می‌شود.'}`
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewReading = () => {
    // Reset all reading states
    setShowReadMoreEnglish(false)
    setShowReadMorePersian(false)
    setShowFullReadingEnglish(false)
    setShowFullReadingPersian(false)
    setReading({ english: '', persian: '' });
    setSelectedCard(null)
    
    // Close the book
    setIsBookOpen(false)
    setIsFlippingPages(false)
    setCurrentPageIndex(0)
    setFinalCardIndex(null)
    
    setTimeout(() => {
      setFlippedCards([]);
      shuffleCards()
    }, 600);
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
            Fal-e-Hafez
          </h1>
          <div className="w-16 md:w-24 h-0.5 md:h-1 bg-amber-400 mx-auto rounded-full"></div>
          
          {/* Show New Reading button only after loading is complete */}
          {selectedCard && !isLoading ? (
            <div className="flex flex-col items-center gap-6">
              <button 
                onClick={handleNewReading}
                className="bg-purple-900/30 text-[#FFFDD0] px-6 py-2 rounded-lg
                         shadow-[0_0_15px_rgba(88,28,135,0.3)]
                         border border-purple-500/30 hover:border-purple-400/40
                         hover:bg-purple-800/40 
                         transition-all"
              >
                New Reading
              </button>
              <p className="text-amber-200/80 text-sm text-center">
                Flip the page to reveal your Hafez verse and fortune
              </p>
            </div>
          ) : !isBookOpen ? (
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-base md:text-2xl text-center text-amber-200 font-light px-8 md:px-12">
                <span>Open the book to reveal your Hafez verse and fortune</span>
              </h2>
            </div>
          ) : null}
          
          {/* Error message - always visible when present */}
          {errorMessage && (
            <div className="mt-4 animate-fade-in">
              <p className="text-red-300 text-sm md:text-base px-4 text-center bg-red-900/20 border border-red-500/30 rounded-lg py-2">
                {errorMessage}
              </p>
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex flex-col items-center w-full">
          {/* Book Interface */}
          <div className="mb-16" style={{ perspective: '1200px' }}>
            {!isBookOpen ? (
              /* Closed Book Cover */
              <div
                className="cursor-pointer relative"
                style={{
                  width: '400px',
                  height: '560px',
                  transformStyle: 'preserve-3d',
                }}
                onClick={openBook}
              >
                <div
                  className="relative w-full h-full transition-transform duration-1000"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Book Cover Front */}
                  <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      backfaceVisibility: 'hidden',
                      borderRadius: '8px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 0 3px rgba(254, 243, 199, 0.2)',
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src="/cards/cardback.png"
                      alt="Book Cover"
                      fill
                      className="object-cover"
                    />
                    {/* Book Spine Effect */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-8"
                      style={{
                        background: 'linear-gradient(to right, rgba(0,0,0,0.4), transparent)',
                      }}
                    />
                    {/* Optional Title Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-amber-200/90 text-xl font-serif italic drop-shadow-lg">
                        Divan-e-Hafez
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Open Book with Page Flipping */
              <div
                className="relative"
                style={{
                  width: '400px',
                  height: '560px',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Book Pages Container */}
                <div className="relative w-full h-full">
                  {/* Show current page during flipping, or final card when done */}
                  {isFlippingPages ? (
                    /* Generic pages flipping rapidly - create page-like appearance */
                    <div
                      className="absolute inset-0 w-full h-full"
                      style={{
                        background: currentPageIndex % 2 === 0 
                          ? 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%)'
                          : 'linear-gradient(135deg, #e8d5c4 0%, #f5e6d3 100%)',
                        border: '2px solid rgba(139, 69, 19, 0.2)',
                        borderRadius: '4px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'opacity 0.08s ease-in-out',
                      }}
                    >
                      {/* Page number or text to show it's flipping */}
                      <div className="text-amber-900/15 text-xs font-serif">
                        {currentPageIndex > 0 ? currentPageIndex : ''}
                      </div>
                    </div>
                  ) : finalCardIndex !== null ? (
                    /* Final Card Page */
                    <div
                      className="absolute inset-0 w-full h-full"
                      style={{
                        borderRadius: '4px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                      }}
                    >
                      <Image
                        src={cards[finalCardIndex].image}
                        alt={cards[finalCardIndex].name}
                        fill
                        className="object-contain"
                      />
                      <div className="absolute bottom-2 left-2 right-2 text-center">
                        <h3 className="text-white text-sm font-semibold drop-shadow-lg">{cards[finalCardIndex].name}</h3>
                        <p className="text-white/80 text-xs drop-shadow-lg">{cards[finalCardIndex].persianName}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Reading section */}
          {selectedCard && (
            <div className="w-[95vw] md:max-w-3xl animate-fade-in">
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
                        <p className="text-purple-300">The ancient verses are revealing themselves...</p>
                      </div>
                    ) : reading.english ? (
                      <div className="text-amber-100 space-y-6">
                        {/* Static Hafez poem - prominent but not oversized */}
                        <div className="text-amber-200 text-base md:text-lg leading-relaxed font-serif italic text-center py-4 border-b border-amber-200/20">
                          {reading.english.split('✧ Poem from Hafez ✧')[1]?.split('✧ Brief Insight ✧')[0]?.trim() || ''}
                        </div>
                        
                        {/* Brief Insight - layman's interpretation */}
                        <div>
                          <div className="text-amber-200/80 mb-2 text-sm">✧ Brief Insight ✧</div>
                          <TypewriterEffect 
                            text={reading.english.split('[READMORE_SPLIT]')[0].split('✧ Brief Insight ✧')[1]?.replace(/\*\*/g, '').replace(/\*Brief Insight \(Layman's Interpretation\):\*/gi, '').trim() || ''} 
                            onComplete={() => setShowReadMoreEnglish(true)}
                            isTitle={false}
                            delay={10}
                          />
                        </div>
                        
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
                              ✧ Reveal deeper meaning ✧
                            </button>
                          </div>
                        )}
                        
                        {showFullReadingEnglish && (
                          <div className="animate-fade-in mt-6">
                            <div className="text-amber-200/80 mb-2 text-sm">✧ Deeper Insight ✧</div>
                            <TypewriterEffect 
                              text={reading.english.split('[READMORE_SPLIT]')[1]?.trim() || ''} 
                              isTitle={false}
                              delay={15}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-400">Your verse will appear here...</p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="persian">
                  <div className="min-h-[200px] bg-black/10 backdrop-blur-sm px-8 pt-2 pb-8 rounded-b-lg text-right" dir="rtl">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center gap-4 py-12">
                        <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
                        <p className="text-purple-300 text-lg text-center">
                          اشعار کهن در حال آشکار شدن هستند...
                        </p>
                      </div>
                    ) : reading.persian ? (
                      <div className="text-amber-100 space-y-6">
                        {/* Static Hafez poem - prominent but not oversized */}
                        <div className="text-amber-200 text-base md:text-lg leading-relaxed font-serif italic text-center py-4 border-b border-amber-200/20" dir="rtl">
                          {reading.persian.split('✧ شعر حافظ ✧')[1]?.split('✧ تفسیر ساده ✧')[0]?.trim() || ''}
                        </div>
                        
                        {/* Brief Insight - simple interpretation */}
                        <div>
                          <div className="text-amber-200/80 mb-2 text-sm">✧ تفسیر ساده ✧</div>
                          <TypewriterEffect 
                            text={reading.persian.split('[READMORE_SPLIT]')[0].split('✧ تفسیر ساده ✧')[1]?.trim() || ''} 
                            onComplete={() => setShowReadMorePersian(true)}
                            delay={10}
                            direction="rtl"
                          />
                        </div>
                        
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
                            <div className="text-amber-200/80 mb-2 text-sm">✧ تفسیر عمیق ✧</div>
                            <TypewriterEffect 
                              text={reading.persian.split('[READMORE_SPLIT]')[1]?.replace('✧ تفسیر عمیق ✧\n', '')?.trim() || ''} 
                              delay={10}
                              direction="rtl"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-400">شعر شما اینجا ظاهر خواهد شد...</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden w-full">
          <div className="relative min-h-screen pt-24 px-4 flex flex-col items-center">
            {/* Error message for mobile */}
            {errorMessage && (
              <div className="w-[90%] mb-4 animate-fade-in z-50">
                <p className="text-red-300 text-sm px-4 text-center bg-red-900/20 border border-red-500/30 rounded-lg py-2">
                  {errorMessage}
                </p>
              </div>
            )}
            {!isBookOpen ? (
              <div className="flex flex-col items-center w-full">
                <p className="text-amber-200 text-center px-4 mb-8 text-lg">
                  Open the book to reveal your Hafez verse and fortune
                </p>
                {/* Book Cover - Mobile */}
                <div
                  className="relative mx-auto cursor-pointer"
                  style={{
                    width: 'min(300px, 85vw)',
                    aspectRatio: '5/7',
                  }}
                  onClick={openBook}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src="/cards/cardback.png"
                      alt="Book Cover"
                      fill
                      className="object-contain rounded-lg"
                    />
                    {/* Book Spine Effect */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-6"
                      style={{
                        background: 'linear-gradient(to right, rgba(0,0,0,0.4), transparent)',
                      }}
                    />
                    {/* Title Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-amber-200/90 text-lg font-serif italic drop-shadow-lg">
                        Divan-e-Hafez
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                {/* Book Pages - Mobile */}
                <div
                  className="relative mx-auto"
                  style={{
                    width: 'min(300px, 85vw)',
                    aspectRatio: '5/7',
                  }}
                >
                  {isFlippingPages ? (
                    /* Generic pages flipping rapidly - create page-like appearance */
                    <div
                      className="absolute inset-0 w-full h-full"
                      style={{
                        background: currentPageIndex % 2 === 0 
                          ? 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%)'
                          : 'linear-gradient(135deg, #e8d5c4 0%, #f5e6d3 100%)',
                        border: '2px solid rgba(139, 69, 19, 0.2)',
                        borderRadius: '4px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'opacity 0.08s ease-in-out',
                      }}
                    >
                      {/* Page number or text to show it's flipping */}
                      <div className="text-amber-900/15 text-xs font-serif">
                        {currentPageIndex > 0 ? currentPageIndex : ''}
                      </div>
                    </div>
                  ) : finalCardIndex !== null ? (
                    /* Final Card Page */
                    <div
                      className="absolute inset-0 w-full h-full"
                      style={{
                        borderRadius: '4px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                      }}
                    >
                      <Image
                        src={cards[finalCardIndex].image}
                        alt={cards[finalCardIndex].name}
                        fill
                        className="object-contain"
                      />
                      <div className="absolute bottom-2 left-2 right-2 text-center">
                        <h3 className="text-white text-sm font-semibold drop-shadow-lg">{cards[finalCardIndex].name}</h3>
                        <p className="text-white/80 text-xs drop-shadow-lg">{cards[finalCardIndex].persianName}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
            
            {selectedCard && (
              <div className="absolute top-0 left-0 right-0 animate-fade-in">
                <div className="flex-1 flex flex-col">
                  {/* Selected card preview */}
                  {selectedCard && (
                    <div className="flex justify-center mb-4">
                      <div className="w-32 h-48 rounded-lg overflow-hidden border border-amber-200/20">
                        <Image 
                          src={selectedCard.image} 
                          alt={selectedCard.name}
                          width={128}
                          height={192}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
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
                              ✨ The ancient verses are revealing themselves... ✨
                            </p>
                          </div>
                        ) : (
                          <div className="max-w-[95vw] md:max-w-none mx-auto text-white">
                            {/* Poem - prominent but not oversized */}
                            <div className="text-amber-200 text-base leading-relaxed font-serif italic text-center py-4 border-b border-amber-200/20 mb-4">
                              {reading.english.split('✧ Poem from Hafez ✧')[1]?.split('✧ Brief Insight ✧')[0]?.trim() || ''}
                            </div>
                            
                            {/* Brief Insight - layman's interpretation */}
                            <div>
                              <div className="text-amber-200/80 mb-2 text-sm">✧ Brief Insight ✧</div>
                              <TypewriterEffect 
                                text={reading.english.split('[READMORE_SPLIT]')[0].split('✧ Brief Insight ✧')[1]?.trim() || ''} 
                                onComplete={() => setShowReadMoreEnglish(true)}
                                isTitle={false}
                                delay={10}
                              />
                            </div>
                            
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
                                  ✧ Reveal deeper meaning ✧
                                </button>
                              </div>
                            )}
                            
                            {showFullReadingEnglish && (
                              <div className="animate-fade-in mt-6">
                                <div className="text-amber-200/80 mb-2 text-sm">✧ Deeper Insight ✧</div>
                                <TypewriterEffect 
                                  text={reading.english.split('[READMORE_SPLIT]')[1]?.trim() || ''} 
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
                              اشعار کهن در حال آشکار شدن هستند...
                            </p>
                          </div>
                        ) : (
                          <div className="max-w-[95vw] md:max-w-none mx-auto text-white">
                            {/* Poem - prominent but not oversized */}
                            <div className="text-amber-200 text-base leading-relaxed font-serif italic text-center py-4 border-b border-amber-200/20 mb-4" dir="rtl">
                              {reading.persian.split('✧ شعر حافظ ✧')[1]?.split('✧ تفسیر ساده ✧')[0]?.trim() || ''}
                            </div>
                            
                            {/* Brief Insight - simple interpretation */}
                            <div>
                              <div className="text-amber-200/80 mb-2 text-sm">✧ تفسیر ساده ✧</div>
                              <TypewriterEffect 
                                text={reading.persian.split('[READMORE_SPLIT]')[0].split('✧ تفسیر ساده ✧')[1]?.trim() || ''} 
                                onComplete={() => setShowReadMorePersian(true)}
                                delay={10}
                                direction="rtl"
                              />
                            </div>

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
                                <div className="text-amber-200/80 mb-2 text-sm">✧ تفسیر عمیق ✧</div>
                                <TypewriterEffect 
                                  text={reading.persian.split('[READMORE_SPLIT]')[1]?.replace('✧ تفسیر عمیق ✧\n', '')?.trim() || ''} 
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

