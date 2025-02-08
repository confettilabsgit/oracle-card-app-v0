'use client'

import React, { useState, useEffect } from 'react'

interface TypewriterEffectProps {
  text?: string
  delay?: number
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({ 
  text = '', 
  delay = 50 
}) => {
  const [currentText, setCurrentText] = useState('')

  useEffect(() => {
    if (!text) return
    
    let index = 0
    setCurrentText('')

    const timer = setInterval(() => {
      if (index < text.length) {
        setCurrentText((prev) => prev + text[index])
        index++
      } else {
        clearInterval(timer)
      }
    }, delay)

    return () => clearInterval(timer)
  }, [text, delay])

  return (
    <div className="text-white whitespace-pre-line leading-relaxed">
      {currentText}
    </div>
  )
}

export default TypewriterEffect

