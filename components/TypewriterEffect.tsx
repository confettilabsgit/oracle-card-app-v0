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

  // Split text into sections and apply styling
  const formattedText = currentText.split('✨').map((section, index) => {
    if (!section.trim()) return null;
    
    // Check if this is a header section
    if (section.includes('The Message of the Cards') || 
        section.includes('Wisdom of Hafez') || 
        section.includes('Ritual Suggestion')) {
      return (
        <React.Fragment key={index}>
          <h3 className="text-amber-200 text-lg font-medium mt-8 mb-4">
            ✨ {section.trim()} ✨
          </h3>
        </React.Fragment>
      )
    }
    
    // Special handling for Hafez quote section
    if (section.includes('Persian:')) {
      return (
        <div key={index} className="my-6 py-4 border-t border-b border-amber-200/20">
          {section.split('\n').map((line, i) => (
            <p key={i} className="mb-2">
              {line.trim()}
            </p>
          ))}
        </div>
      )
    }
    
    // Regular section content
    return (
      <p key={index} className="mb-4 leading-relaxed">
        {section.trim()}
      </p>
    )
  })

  return <div className="space-y-2">{formattedText}</div>
}

export default TypewriterEffect

