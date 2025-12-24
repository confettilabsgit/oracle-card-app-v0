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

  useEffect(() => {
    shuffleCards()
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
  }

  const flipCard = (id: number) => {
    // Show error if trying to flip another card after one is selected
    if (selectedCard) {
      setErrorMessage('Only one page needs to be turned for your Fal-e-Hafez reading.')
      setTimeout(() => setErrorMessage(''), 3000)
      return
    }
    
    if (!flippedCards.includes(id)) {
      setErrorMessage('') // Clear any previous error
      const newFlippedCards = [...flippedCards, id]
      setFlippedCards(newFlippedCards)
      
      // Find the selected card
      const card = selectedCards.find(c => c.id === id)
      if (card) {
        setSelectedCard(card)
        setIsLoading(true)
        generateReading(card)
      }
    }
  }

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

      // Generate reading focused on single card + poem interpretation
      const englishResponse = await fetch('/api/generate-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `For the card "${card.name}" (${card.persianName}), provide a brief interpretation (2-3 sentences) that connects this card to the Hafez verse below, followed by [READMORE_SPLIT] and then a deeper spiritual interpretation.

          Card meaning: ${card.name} represents a significant force in Persian mythology. 

          In the deeper interpretation:
          1. Start by examining this Hafez verse: "${hafezData.text}"
          2. Interpret this specific verse in relation to the ${card.name} card
          3. Show how the card illuminates and expands upon the verse's meaning
          4. Offer personal guidance while staying grounded in Persian mystical traditions
          5. Keep a hopeful tone while acknowledging challenges

          Keep the deeper interpretation around 400-500 characters.
          IMPORTANT: Focus on the poetic meaning and personal guidance. The card is secondary to the poem's wisdom.`,
          temperature: 0.7,
          max_tokens: 700
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

      // Get card meaning for Persian reading
      const cardData = cardMeanings[card.name as keyof typeof cardMeanings]
      const cardMeaning = cardData?.persianMeaning || 'هدایت عرفانی'
      const cardDescription = cardData?.persianDescription || 'این کارت نماد نیرویی معنوی در اساطیر ایران است.'

      // Generate Persian reading
      const persianResponse = await fetch('/api/generate-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `For the card "${card.name}" (${card.persianName}) with meaning "${cardMeaning}", provide a brief interpretation in Persian (Farsi) that connects this card to the Hafez verse below. Write in natural, flowing Persian that makes sense for Persian readers. Follow with [READMORE_SPLIT] and then a deeper spiritual interpretation in Persian.

          Card meaning: ${cardDescription}

          Hafez verse (English): "${hafezData.text}"

          In the deeper interpretation:
          1. Examine this Hafez verse in relation to the ${card.persianName} card
          2. Show how the card illuminates the verse's meaning
          3. Offer personal guidance in Persian mystical traditions
          5. Keep a hopeful tone while acknowledging challenges

          Keep the deeper interpretation around 300-400 characters in Persian.
          IMPORTANT: Write naturally in Persian, using appropriate Persian mystical terminology.`,
          temperature: 0.7,
          max_tokens: 600
        }),
      });

      const persianReadingText = await persianResponse.text();
      let persianBriefInsight = `${card.persianName} به شما نشان می‌دهد که این شعر حافظ چه پیامی برای شما دارد.`
      let persianDeeperWisdom = `این کارت نشان دهنده‌ی مرحله‌ای مهم در سفر معنوی شماست. ${card.persianName} با این شعر حافظ در هم می‌آمیزد تا راهنمای شما باشد. با پذیرش این حکمت و اعتماد به مسیر درونی، روشنایی در انتظار شماست.`

      if (persianResponse.ok) {
        try {
          const persianReadingData = JSON.parse(persianReadingText);
          if (persianReadingData?.text) {
            const [brief, deeper] = persianReadingData.text
              .split('[READMORE_SPLIT]')
              .map((text: string) => text.trim())
            if (brief) persianBriefInsight = brief
            if (deeper) persianDeeperWisdom = deeper
          }
        } catch (e) {
          console.error('Failed to parse Persian reading response')
        }
      }

      setReading({
        english: `✧ Poem from Hafez ✧\n${hafezData.text}\n\n✧ What This Page Reveals ✧\n${
          briefInsight
        }[READMORE_SPLIT]${deeperWisdom || 'Meditate on this verse to reveal its deeper meaning...'}`,
        persian: `✧ شعر حافظ ✧\n${persianPoem || hafezData.text}\n\n✧ آنچه این صفحه آشکار می‌کند ✧\n${
          persianBriefInsight
        }[READMORE_SPLIT]✧ تفسیر عمیق‌تر ✧\n${persianDeeperWisdom}`
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
            <div className="flex flex-col items-center gap-2">
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
              <p className="text-amber-200/70 text-sm text-center">
                Turn one page to discover your verse from Hafez
              </p>
            </div>
          ) : !selectedCard ? (
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-base md:text-2xl text-center text-amber-200 font-light px-8 md:px-12">
                <span>Turn one page to discover your verse from Hafez</span>
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
          {/* Book pages - styled as portrait pages */}
          <div className="flex gap-2 mb-16" style={{ perspective: '1000px' }}>
            {selectedCards.map((card, index) => (
              <div
                key={card.id}
                className="relative"
                style={{
                  width: '280px',
                  height: '420px',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-700 ${flippedCards.includes(card.id) ? '' : 'cursor-pointer'}`}
                  style={{
                    transform: flippedCards.includes(card.id) 
                      ? 'rotateY(-180deg)' 
                      : 'rotateY(0deg)',
                    transformStyle: 'preserve-3d',
                    pointerEvents: flippedCards.includes(card.id) ? 'none' : 'auto',
                  }}
                  onClick={() => flipCard(card.id)}
                >
                  {/* Page back (card back) - show card image darkened */}
                  <div 
                    className="absolute inset-0 w-full h-full"
                    style={{
                      backfaceVisibility: 'hidden',
                      background: 'linear-gradient(135deg, #2a1a4a 0%, #1a0f2e 100%)',
                      border: '2px solid rgba(254, 243, 199, 0.3)',
                      borderRadius: '4px',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.4), inset 0 0 20px rgba(0,0,0,0.2)',
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src={card.image}
                      alt={card.name}
                      width={280}
                      height={420}
                      className="rounded-sm opacity-30"
                      style={{
                        objectFit: 'contain',
                        width: '100%',
                        height: '100%',
                        filter: 'brightness(0.3)',
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-amber-200/40 text-sm text-center px-4">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                  
                  {/* Page front (card image) */}
                  <div 
                    className="absolute inset-0 w-full h-full"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <Image
                      src={card.image}
                      alt={card.name}
                      width={280}
                      height={420}
                      className="rounded-sm"
                      style={{
                        objectFit: 'contain',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                    <div className="absolute bottom-2 left-2 right-2 text-center">
                      <h3 className="text-white text-sm font-semibold drop-shadow-lg">{card.name}</h3>
                      <p className="text-white/80 text-xs drop-shadow-lg">{card.persianName}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                          {reading.english.split('[READMORE_SPLIT]')[0].split('✧ What This Page Reveals ✧')[0].replace('✧ Poem from Hafez ✧\n', '')}
                        </div>
                        
                        {/* What This Page Reveals - smaller, secondary */}
                        <div>
                          <div className="text-amber-200/80 mb-2 text-sm">✧ What This Page Reveals ✧</div>
                          <TypewriterEffect 
                            text={reading.english.split('[READMORE_SPLIT]')[0].split('✧ What This Page Reveals ✧')[1] || ''} 
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
                            <TypewriterEffect 
                              text={reading.english.split('[READMORE_SPLIT]')[1] || ''} 
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
                          {reading.persian.split('[READMORE_SPLIT]')[0].split('✧ آنچه این صفحه آشکار می‌کند ✧')[0].replace('✧ شعر حافظ ✧\n', '')}
                        </div>
                        
                        <div>
                          <div className="text-amber-200/80 mb-2 text-sm">✧ آنچه این صفحه آشکار می‌کند ✧</div>
                          <TypewriterEffect 
                            text={reading.persian.split('[READMORE_SPLIT]')[0].split('✧ آنچه این صفحه آشکار می‌کند ✧')[1] || ''} 
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
                            <TypewriterEffect 
                              text={reading.persian.split('[READMORE_SPLIT]')[1]} 
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
            {!selectedCard ? (
              <div className="flex flex-col items-center w-full">
                <p className="text-amber-200 text-center px-4 mb-8 text-lg">
                  Turn the page to discover your Hafez verse.
                </p>
                {/* Single card back */}
                <div
                  className="relative"
                  style={{
                    width: '280px',
                    height: '420px',
                    maxWidth: '90vw',
                    maxHeight: '60vh',
                  }}
                >
                  <div
                    className="relative w-full h-full transition-transform duration-700 cursor-pointer"
                    style={{
                      transform: flippedCards.length > 0 
                        ? 'rotateY(-180deg)' 
                        : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d',
                    }}
                    onClick={() => {
                      // Flip the first card from selectedCards
                      if (selectedCards.length > 0 && flippedCards.length === 0) {
                        flipCard(selectedCards[0].id)
                      }
                    }}
                  >
                    {/* Card back - using cardback.png */}
                    <div 
                      className="absolute inset-0 w-full h-full"
                      style={{
                        backfaceVisibility: 'hidden',
                        borderRadius: '4px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                        overflow: 'hidden',
                      }}
                    >
                      <Image
                        src="/cards/cardback.png"
                        alt="Card back"
                        width={280}
                        height={420}
                        className="rounded-sm"
                        style={{
                          objectFit: 'contain',
                          width: '100%',
                          height: '100%',
                        }}
                      />
                    </div>
                    
                    {/* Card front - show the selected card */}
                    <div 
                      className="absolute inset-0 w-full h-full"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      {selectedCards.length > 0 && (
                        <>
                          <Image
                            src={selectedCards[0].image}
                            alt={selectedCards[0].name}
                            width={280}
                            height={420}
                            className="rounded-sm"
                            style={{
                              objectFit: 'contain',
                              width: '100%',
                              height: '100%',
                            }}
                          />
                          <div className="absolute bottom-2 left-2 right-2 text-center">
                            <h3 className="text-white text-sm font-semibold drop-shadow-lg">{selectedCards[0].name}</h3>
                            <p className="text-white/80 text-xs drop-shadow-lg">{selectedCards[0].persianName}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
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
                              {reading.english.split('[READMORE_SPLIT]')[0].split('✧ What This Page Reveals ✧')[0].replace('✧ Poem from Hafez ✧\n', '')}
                            </div>
                            
                            <div className="text-amber-200/80 mb-2 text-sm">✧ What This Page Reveals ✧</div>
                            <TypewriterEffect 
                              text={reading.english.split('[READMORE_SPLIT]')[0].split('✧ What This Page Reveals ✧')[1] || ''} 
                              onComplete={() => setShowReadMoreEnglish(true)}
                              isTitle={false}
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
                                  ✧ Reveal deeper meaning ✧
                                </button>
                              </div>
                            )}
                            
                            {showFullReadingEnglish && (
                              <div className="animate-fade-in mt-6">
                                <TypewriterEffect 
                                  text={reading.english.split('[READMORE_SPLIT]')[1] || ''} 
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
                              {reading.persian.split('[READMORE_SPLIT]')[0].split('✧ آنچه این صفحه آشکار می‌کند ✧')[0].replace('✧ شعر حافظ ✧\n', '')}
                            </div>
                            
                            <div>
                              <div className="text-amber-200/80 mb-2 text-sm">✧ آنچه این صفحه آشکار می‌کند ✧</div>
                              <TypewriterEffect 
                                text={reading.persian.split('[READMORE_SPLIT]')[0].split('✧ آنچه این صفحه آشکار می‌کند ✧')[1] || ''} 
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

