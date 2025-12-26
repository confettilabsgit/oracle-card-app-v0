'use client'

import React, { useState, useEffect, useRef } from 'react'

interface TypewriterEffectProps {
  text: string
  delay?: number
  onComplete?: () => void
  onStart?: () => void
  isTitle?: boolean
  direction?: 'ltr' | 'rtl'
}

const TypewriterEffect = ({ 
  text, 
  delay = 10,
  onComplete,
  onStart,
  isTitle = false,
  direction = 'ltr'
}: TypewriterEffectProps) => {
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const hasStartedRef = useRef(false)

  // Reset hasStartedRef when text changes
  useEffect(() => {
    hasStartedRef.current = false
    setCurrentIndex(0)
    setCurrentText('')
  }, [text])

  useEffect(() => {
    // Guard against undefined text
    if (!text) return;
    
    // Trigger onStart when typing begins (first character)
    if (currentIndex === 0 && text.length > 0 && !hasStartedRef.current && onStart) {
      hasStartedRef.current = true
      onStart()
    }
    
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex])
        setCurrentIndex(prevIndex => prevIndex + 1)
      }, delay)
      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, delay, text, onComplete, onStart])

  // Add extra line breaks before section titles
  const formattedText = currentText.replace(
    /(✧ Wisdom of Hafez ✧|✧ Brief Insight ✧|✧ The Message of the Cards ✧|✧ Ritual Suggestion ✧)/g, 
    '\n\n$1\n'
  ).replace(
    /" - Hafez/g,
    '" - Hafez\n'
  )

  return (
    <div 
      className={`whitespace-pre-line leading-normal ${direction === 'rtl' ? 'text-right' : 'text-left'} ${isTitle ? '' : 'mt-0'}`}
      style={{ direction: direction }}
    >
      {formattedText.split('\n').map((line, i) => (
        <div 
          key={i} 
          className={`${
            line.includes('✧') ? 'text-amber-200' : 'text-white'
          } ${line.includes('✧') ? 'mt-6' : ''}`}
        >
          {line}
        </div>
      ))}
    </div>
  )
}

export default TypewriterEffect