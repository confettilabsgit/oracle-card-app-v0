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

  return <div dangerouslySetInnerHTML={{ __html: currentText }} />
}

export default TypewriterEffect

