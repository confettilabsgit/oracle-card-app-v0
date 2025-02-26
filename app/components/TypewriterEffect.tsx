'use client'

import React, { useState, useEffect } from 'react'

interface TypewriterEffectProps {
  text: string
  delay?: number
  onComplete?: () => void
  isTitle?: boolean
}

const TypewriterEffect = ({ 
  text, 
  delay = 50,
  onComplete,
  isTitle = false 
}: TypewriterEffectProps) => {
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex])
        setCurrentIndex(prevIndex => prevIndex + 1)
      }, delay)
      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, delay, text, onComplete])

  // Add extra line breaks before section titles
  const formattedText = currentText.replace(
    /(✧ Wisdom of Hafez ✧|✧ Brief Insight ✧|✧ The Message of the Cards ✧|✧ Ritual Suggestion ✧)/g, 
    '\n\n$1\n'
  ).replace(
    /" - Hafez/g,
    '" - Hafez\n'
  )

  return (
    <div className={`whitespace-pre-line text-left leading-normal pt-0 ${isTitle ? '' : 'mt-0'}`}>
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