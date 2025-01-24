'use client'

import { useEffect, useState } from 'react'

export function TypewriterEffect({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!text) return
    
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 20)
      
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text])

  useEffect(() => {
    setDisplayText('')
    setCurrentIndex(0)
  }, [text])

  return <div>{displayText}</div>
} 