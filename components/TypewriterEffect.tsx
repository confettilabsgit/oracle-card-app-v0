'use client'

import React, { useState, useEffect } from 'react'

interface TypewriterEffectProps {
  text: string
  delay?: number
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({ text, delay = 50 }) => {
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex])
        setCurrentIndex(prevIndex => prevIndex + 1)
      }, delay)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, delay, text])

  // Format text to color only the stars
  const formattedText = currentText.split('✨').map((section, index, array) => {
    if (index === array.length - 1) {
      return <span key={index}>{section}</span>
    }
    return (
      <React.Fragment key={index}>
        <span>{section}</span>
        <span className="text-amber-100">✨</span>
      </React.Fragment>
    )
  })

  return (
    <div className="text-white whitespace-pre-line leading-relaxed">
      {formattedText}
    </div>
  )
}

export default TypewriterEffect

