'use client'

import React, { useState, useEffect } from 'react'
import OracleCard from '../components/OracleCard'
import TypewriterEffect from '../components/TypewriterEffect'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  const [selectedCard, setSelectedCard] = useState<typeof cards[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [reading, setReading] = useState({ english: '', persian: '' })
  const [isDesktop, setIsDesktop] = useState(true)
  const [showReadMoreEnglish, setShowReadMoreEnglish] = useState(false)
  const [showReadMorePersian, setShowReadMorePersian] = useState(false)
  const [showFullReadingEnglish, setShowFullReadingEnglish] = useState(false)
  const [showFullReadingPersian, setShowFullReadingPersian] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isCoverFlipped, setIsCoverFlipped] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [userIntention, setUserIntention] = useState('')

  useEffect(() => {
    setIsMounted(true)
    // Randomly select a card on mount (client-side only to avoid hydration mismatch)
    if (typeof window !== 'undefined') {
      const randomCard = cards[Math.floor(Math.random() * cards.length)]
      setSelectedCard(randomCard)
    }
  }, [])

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    
    checkIsDesktop()
    window.addEventListener('resize', checkIsDesktop)
    
    return () => window.removeEventListener('resize', checkIsDesktop)
  }, [])

  const flipCover = () => {
    if (isCoverFlipped || !selectedCard) return
    
    setIsCoverFlipped(true)
    setErrorMessage('')
    setIsLoading(true)
    generateReading(selectedCard, userIntention)
  }

  const handleNewReading = () => {
    // Reset all states
    setShowReadMoreEnglish(false)
    setShowReadMorePersian(false)
    setShowFullReadingEnglish(false)
    setShowFullReadingPersian(false)
    setReading({ english: '', persian: '' })
    setIsCoverFlipped(false)
    setErrorMessage('')
    setUserIntention('')
    
    // Select a new random card
    const randomCard = cards[Math.floor(Math.random() * cards.length)]
    setSelectedCard(randomCard)
  }

  const generateReading = async (card: typeof cards[0], intention?: string) => {
    // Reset reading reveal states
    setShowReadMoreEnglish(false)
    setShowReadMorePersian(false)
    setShowFullReadingEnglish(false)
    setShowFullReadingPersian(false)
    
    try {
      // Get Hafez quote first (English)
      let hafezResponse;
      try {
        hafezResponse = await fetch('/api/hafez', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (fetchError: any) {
        throw new Error(`Network error: ${fetchError.message || 'Failed to connect to server'}`);
      }

      const hafezText = await hafezResponse.text();
      if (!hafezResponse.ok) {
        console.error('Hafez Response:', hafezText);
        let errorMessage = 'Failed to fetch Hafez quote';
        try {
          const errorData = JSON.parse(hafezText);
          if (errorData?.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If parsing fails, use the raw text
          errorMessage = hafezText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let hafezData;
      try {
        hafezData = JSON.parse(hafezText);
      } catch (parseError) {
        console.error('Failed to parse Hafez response:', hafezText);
        throw new Error(`Invalid response format from server: ${hafezText.substring(0, 100)}`);
      }
      
      if (!hafezData?.text) {
        throw new Error('Invalid Hafez response format: missing text field');
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
          language: 'english',
          intention: intention?.trim() || undefined
        }),
      });

      const englishText = await englishResponse.text();
      if (!englishResponse.ok) {
        console.error('English Response:', englishText);
        let errorMessage = 'Failed to fetch English reading';
        try {
          const errorData = JSON.parse(englishText);
          if (errorData?.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          errorMessage = englishText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let englishData;
      try {
        englishData = JSON.parse(englishText);
      } catch (parseError) {
        console.error('Failed to parse English response:', englishText);
        throw new Error(`Invalid response format from server: ${englishText.substring(0, 100)}`);
      }
      
      if (!englishData?.text) {
        throw new Error('Invalid English response format: missing text field');
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
          language: 'persian',
          intention: intention?.trim() || undefined
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
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'
      setErrorMessage(errorMsg)
      setIsCoverFlipped(false) // Reset cover state on error
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
      <div className="container mx-auto px-4 flex flex-col items-center pt-[100px]">
        {/* Header section - Desktop only */}
        <div className="hidden md:flex flex-col items-center space-y-4 mb-6">
          <h1 className="text-2xl md:text-4xl text-center font-serif font-light text-amber-100 tracking-wide">
            Fal-e-Hafez
          </h1>
          <div className="w-16 md:w-24 h-0.5 md:h-1 bg-amber-400 mx-auto rounded-full"></div>
          
          {/* Show New Reading button only after loading is complete */}
          {isCoverFlipped && !isLoading ? (
            <div className="flex flex-col items-center gap-4 mb-4">
              <button 
                onClick={handleNewReading}
                className="bg-purple-900/30 text-[#FFFDD0] px-6 py-2 rounded-lg shadow-[0_0_15px_rgba(88,28,135,0.3)] border border-purple-500/30 hover:border-purple-400/40 hover:bg-purple-800/40 transition-all"
              >
                New Reading
              </button>
            </div>
          ) : !isCoverFlipped ? (
            <div className="flex flex-col items-center gap-4 w-full max-w-md">
              <div className="w-full px-4">
                <label htmlFor="intention" className="sr-only">
                  What brings you here? (Optional)
                </label>
                <h2 className="text-sm md:text-lg text-center text-amber-100 font-light px-8 md:px-12 mb-3">
                  <span>Open the book to discover your verse. What brings you here? (Optional)</span>
                </h2>
                <textarea
                  id="intention"
                  value={userIntention}
                  onChange={(e) => setUserIntention(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !isCoverFlipped && selectedCard) {
                      e.preventDefault()
                      flipCover()
                    }
                  }}
                  placeholder="Enter your question or intention..."
                  className="w-full bg-purple-900/20 border border-purple-500/30 rounded-lg px-4 py-3 text-amber-100 placeholder:text-amber-200/40 focus:outline-none focus:border-purple-400/50 focus:bg-purple-800/30 transition-all resize-none"
                  rows={3}
                  maxLength={200}
                />
                {userIntention.length > 0 && (
                  <p className="text-amber-200/60 text-xs mt-1 text-right">
                    {userIntention.length}/200
                  </p>
                )}
              </div>
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
          {/* Cover and Card Container */}
          <div className="relative mb-8" style={{ perspective: '1200px' }}>
            <div
              className="relative"
              style={{
                width: '308px',
                height: '431px',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Card underneath (revealed when cover flips) */}
              {selectedCard && (
                <div
                  className="absolute inset-0"
                  style={{
                    transform: isCoverFlipped ? 'scale(1)' : 'scale(0.95)',
                    opacity: isCoverFlipped ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out 0.4s, transform 0.3s ease-in-out 0.4s',
                    zIndex: 1,
                  }}
                >
                  <Image
                    src={selectedCard.image}
                    alt={selectedCard.name}
                    fill
                    className="object-contain rounded-lg"
                  />
                  <div className="absolute bottom-2 left-2 right-2 text-center">
                    <h3 className="text-white text-sm font-semibold drop-shadow-lg">{selectedCard.name}</h3>
                    <p className="text-white/80 text-xs drop-shadow-lg">{selectedCard.persianName}</p>
                  </div>
                </div>
              )}
              
              {/* Cover (flips to the left and disappears) */}
              <div
                className={`absolute inset-0 cursor-pointer ${isCoverFlipped ? 'pointer-events-none' : ''}`}
                style={{
                  transform: isCoverFlipped 
                    ? 'rotateY(-180deg)' 
                    : 'rotateY(0deg)',
                  transformOrigin: 'left center',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.8s ease-in-out, opacity 0.8s ease-in-out',
                  opacity: isCoverFlipped ? 0 : 1,
                  zIndex: 2,
                }}
                onClick={flipCover}
              >
                <Image
                  src="/cards/bookcover.png"
                  alt="Book Cover"
                  fill
                  className="object-cover rounded-lg"
                  style={{
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Dedication */}
          <p className="text-amber-200/60 text-sm font-light mb-8" dir="rtl">
            تقدیم به والدینم
          </p>

          {/* Reading section */}
          {isCoverFlipped && selectedCard && (
            <div className="w-[95vw] md:max-w-3xl animate-fade-in">
              {/* Loader - shown above tabs when loading */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center gap-4 mb-6">
                  {/* Persian-themed loader - ornate spinning pattern */}
                  <div className="relative w-20 h-20 text-amber-400">
                    <svg
                      className="animate-spin"
                      width="80"
                      height="80"
                      viewBox="0 0 80 80"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ animationDuration: '2s' }}
                    >
                      <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.2" />
                      <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
                      <circle cx="40" cy="40" r="24" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
                      <path
                        d="M40 8 L44 20 L40 16 L36 20 Z M40 72 L44 60 L40 64 L36 60 Z M8 40 L20 36 L16 40 L20 44 Z M72 40 L60 44 L64 40 L60 36 Z M20 20 L28 24 L24 28 L16 24 Z M60 20 L52 24 L56 28 L64 24 Z M20 60 L28 56 L24 52 L16 56 Z M60 60 L52 56 L56 52 L64 56 Z"
                        fill="currentColor"
                        opacity="0.7"
                      />
                      <circle cx="40" cy="40" r="6" fill="currentColor" opacity="0.9" />
                      <circle cx="40" cy="40" r="3" fill="currentColor" />
                    </svg>
                  </div>
                  <p className="text-purple-300 text-lg text-center font-serif italic animate-float">
                    The ancient verses are revealing themselves...
                  </p>
                </div>
              )}
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
                    {reading.english ? (
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
                    {reading.persian ? (
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
        <div className="md:hidden w-full overflow-x-hidden" style={{ touchAction: 'pan-y', maxWidth: '100vw' }}>
          <div className="relative min-h-screen px-4 flex flex-col items-center overflow-x-hidden" style={{ paddingTop: '0px', marginTop: '-5px', touchAction: 'pan-y', maxWidth: '100vw' }}>
            {/* Header section - Mobile */}
            <div className="flex flex-col items-center mb-6" style={{ marginBottom: '24px' }}>
              <h1 className="text-2xl text-center font-serif font-light text-amber-100 tracking-wide">
                Fal-e-Hafez
              </h1>
              <div className="w-16 h-0.5 bg-amber-400 mx-auto rounded-full" style={{ marginTop: '8px', marginBottom: '8px' }}></div>
              
              {/* Show New Reading button only after loading is complete */}
              {isCoverFlipped && !isLoading ? (
                <div className="flex flex-col items-center" style={{ marginTop: '16px', marginBottom: '16px' }}>
                  <button 
                    onClick={handleNewReading}
                    className="bg-purple-900/30 text-[#FFFDD0] px-6 py-2 rounded-lg shadow-[0_0_15px_rgba(88,28,135,0.3)] border border-purple-500/30 hover:border-purple-400/40 hover:bg-purple-800/40 transition-all"
                  >
                    New Reading
                  </button>
                </div>
              ) : !isCoverFlipped ? (
                <div className="flex flex-col items-center gap-3 w-full px-4" style={{ marginTop: '8px' }}>
                  <div className="w-full">
                    <label htmlFor="intention-mobile" className="sr-only">
                      What brings you here? (Optional)
                    </label>
                    <h2 className="text-sm text-center text-amber-100 font-light px-8 mb-3">
                      <span>Open the book to discover your verse. What brings you here? (Optional)</span>
                    </h2>
                    <textarea
                      id="intention-mobile"
                      value={userIntention}
                      onChange={(e) => setUserIntention(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && !isCoverFlipped && selectedCard) {
                          e.preventDefault()
                          flipCover()
                        }
                      }}
                      placeholder="Enter your question or intention..."
                      className="w-full bg-purple-900/20 border border-purple-500/30 rounded-lg px-3 py-2 text-sm text-amber-100 placeholder:text-amber-200/40 focus:outline-none focus:border-purple-400/50 focus:bg-purple-800/30 transition-all resize-none"
                      rows={3}
                      maxLength={200}
                    />
                    {userIntention.length > 0 && (
                      <p className="text-amber-200/60 text-xs mt-1 text-right">
                        {userIntention.length}/200
                      </p>
                    )}
                  </div>
                </div>
              ) : null}
              
              {/* Error message - always visible when present */}
              {errorMessage && (
                <div className="mt-4 animate-fade-in" style={{ marginTop: '16px' }}>
                  <p className="text-red-300 text-sm px-4 text-center bg-red-900/20 border border-red-500/30 rounded-lg py-2">
                    {errorMessage}
                  </p>
                </div>
              )}
            </div>
            
            {/* Cover and Card Container - Mobile */}
            {/* Show large card only when cover is not flipped */}
            {!isCoverFlipped && (
              <div className="relative mb-8" style={{ 
                perspective: '1000px', 
                marginBottom: '32px',
              }}>
                <div
                  className="relative mx-auto overflow-hidden"
                  style={{
                    width: 'min(414px, calc(90vw - 24px))',
                    height: 'min(548px, calc((min(440px, 90vw) - 24px) * 1.245))',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Cover (flips to the left and disappears) */}
                  <div
                    className="absolute cursor-pointer"
                    style={{
                      left: '12px',
                      right: '12px',
                      top: 0,
                      bottom: 0,
                      transform: 'rotateY(0deg)',
                      transformOrigin: 'left center',
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.8s ease-in-out, opacity 0.8s ease-in-out',
                      opacity: 1,
                      zIndex: 2,
                    }}
                    onClick={flipCover}
                  >
                    <Image
                      src="/cards/bookcover.png"
                      alt="Book Cover"
                      fill
                      className="object-cover rounded-lg"
                      style={{
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Dedication - Mobile */}
            {!isCoverFlipped && (
              <p className="text-amber-200/60 text-sm font-light" style={{ marginBottom: '32px' }} dir="rtl">
                تقدیم به والدینم
              </p>
            )}
            
            {/* Reading section for mobile */}
            {isCoverFlipped && selectedCard && (
              <div className="w-full animate-fade-in">
                {/* Loading state - shown above mini card */}
                {isLoading && (
                  <div className="flex flex-col items-center justify-center gap-4 mb-4" style={{ paddingTop: '16px', paddingBottom: '16px' }}>
                    {/* Persian-themed loader - ornate spinning pattern */}
                    <div className="relative w-20 h-20">
                      <svg 
                        className="animate-spin text-amber-400" 
                        width="80" 
                        height="80" 
                        viewBox="0 0 80 80" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ animationDuration: '2s' }}
                      >
                        {/* Outer decorative circles */}
                        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.2" />
                        <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
                        <circle cx="40" cy="40" r="24" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
                        
                        {/* Ornate Persian geometric pattern - 8-pointed star design */}
                        <path 
                          d="M40 8 L44 20 L40 16 L36 20 Z M40 72 L44 60 L40 64 L36 60 Z M8 40 L20 36 L16 40 L20 44 Z M72 40 L60 44 L64 40 L60 36 Z M20 20 L28 24 L24 28 L16 24 Z M60 20 L52 24 L56 28 L64 24 Z M20 60 L28 56 L24 52 L16 56 Z M60 60 L52 56 L56 52 L64 56 Z" 
                          fill="currentColor" 
                          opacity="0.7"
                        />
                        
                        {/* Central circle */}
                        <circle cx="40" cy="40" r="6" fill="currentColor" opacity="0.9" />
                        <circle cx="40" cy="40" r="3" fill="currentColor" />
                      </svg>
                    </div>
                    <p className="text-purple-300 text-lg text-center font-serif italic animate-float">
                      The ancient verses are revealing themselves...
                    </p>
                  </div>
                )}
                
                <Tabs defaultValue="english" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-purple-900/30 rounded-t-lg border border-purple-500/30" style={{ marginBottom: '32px' }}>
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
                      <div className="min-h-[100px]"></div>
                    ) : (
                      <div className="max-w-[95vw] mx-auto text-white bg-black/10 backdrop-blur-sm px-4 rounded-b-lg" style={{ paddingTop: '8px', paddingBottom: '32px' }}>
                        <div className="text-amber-200 text-base leading-relaxed font-serif italic text-center border-b border-amber-200/20" style={{ paddingTop: '16px', paddingBottom: '16px', marginBottom: '32px' }}>
                          {reading.english.split('✧ Poem from Hafez ✧')[1]?.split('✧ Brief Insight ✧')[0]?.trim() || ''}
                        </div>
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
                          <div className="flex justify-center animate-fade-in" style={{ marginTop: '32px' }}>
                            <button 
                              onClick={() => setShowFullReadingEnglish(true)}
                              className="px-6 py-2.5 bg-[#1a1033]/80 text-amber-200 hover:text-amber-100 border border-amber-200/20 hover:border-amber-100/30 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(88,28,135,0.2)] hover:shadow-[0_0_20px_rgba(88,28,135,0.3)] hover:bg-[#1a1033]"
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
                      <div className="min-h-[100px]"></div>
                    ) : (
                      <div className="max-w-[95vw] mx-auto text-white bg-black/10 backdrop-blur-sm px-4 rounded-b-lg text-right" style={{ paddingTop: '8px', paddingBottom: '32px' }}>
                        <div className="text-amber-200 text-base leading-relaxed font-serif italic text-center border-b border-amber-200/20" style={{ paddingTop: '16px', paddingBottom: '16px', marginBottom: '32px' }} dir="rtl">
                          {reading.persian.split('✧ شعر حافظ ✧')[1]?.split('✧ تفسیر ساده ✧')[0]?.trim() || ''}
                        </div>
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
                              className="px-6 py-2 text-amber-200 hover:text-amber-100 border border-amber-200/20 hover:border-amber-100/30 rounded-lg transition-all duration-300 animate-fade-in bg-[#1a1033]/80 hover:bg-[#1a1033] shadow-[0_0_15px_rgba(88,28,135,0.2)] hover:shadow-[0_0_20px_rgba(88,28,135,0.3)]"
                            >
                              ✧ مکاشفه عمیق‌تر ✧
                            </button>
                          </div>
                        )}
                        {showFullReadingPersian && (
                          <div className="animate-fade-in" style={{ marginTop: '32px' }}>
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
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

