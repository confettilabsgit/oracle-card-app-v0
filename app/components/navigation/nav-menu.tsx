'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function NavMenu() {
  const [showAbout, setShowAbout] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const goldColor = 'rgb(254 243 199)'  // Matches your title's color

  const buttonStyle = {
    color: goldColor,
    marginLeft: '1rem',
    fontSize: '1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    padding: '0.5rem',
    transition: 'opacity 0.2s',
  }

  const dialogStyle: React.CSSProperties = {
    position: 'fixed' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#1a1a2e',  // Dark navy matching your theme
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 100,
    maxWidth: '600px',
    width: '90%',
  }

  const overlayStyle: React.CSSProperties = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 99,
  }

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) return
    
    setIsSubmitting(true)
    setError('')
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback: feedbackText })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to submit feedback')
      }
      
      setIsSuccess(true)
      setFeedbackText('')
      setTimeout(() => {
        setShowFeedback(false)
        setIsSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Feedback submission error:', error)
      setError('The ancient spirits are restless. Please try again in a moment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <nav className="fixed top-4 right-4 z-50 hidden md:flex gap-2">
        <Link 
          href="/"
          style={buttonStyle}
          onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
          Persian Oracle
        </Link>
        <Link 
          href="/fal-e-hafez"
          style={buttonStyle}
          onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
          Fal-e-Hafez
        </Link>
        <button 
          onClick={() => setShowAbout(true)}
          style={buttonStyle}
          onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
          About
        </button>
        <button 
          onClick={() => setShowFeedback(true)}
          style={buttonStyle}
          onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
          Feedback
        </button>
      </nav>

      {showAbout && (
        <>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 99,
          }} onClick={() => setShowAbout(false)} />
          <div style={dialogStyle}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              marginBottom: '1rem'
            }}>
              <button 
                onClick={() => setShowAbout(false)}
                style={{ 
                  ...buttonStyle, 
                  marginLeft: 0,
                  padding: '0.5rem',
                }}
                aria-label="Close dialog"
              >
                Close
              </button>
            </div>
            <h2 style={{ color: goldColor, marginBottom: '1.5rem', fontSize: '1.5rem' }}>
              The Oracle of Hafez
            </h2>
            <div style={{ color: 'white', marginBottom: '1.5rem', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '1rem' }}>
                This digital oracle bridges the timeless wisdom of Persian mythology with today&apos;s seekers. Inspired by Fal-e-Hafez, the ancient Persian tradition of seeking guidance through poetry, it offers a modern path to cosmic reflection and insight.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                Each card unveils a powerful force rooted in Persian lore, from Anahita, the goddess of waters and wisdom, to the Simurgh, the majestic guardian of ancient knowledge. To bring these mythical elements to life, we curated each card using generative AI, leveraging Stable Diffusion and OpenAI APIs to craft stunning visual artwork and poetic language that honor their origins.
              </p>
              <p style={{ marginBottom: '2rem' }}>
                Together, these cards weave a tapestry of divination that honors the past while illuminating the present. Share your readings, and the oracle&apos;s wisdom will grow stronger with each seeker.
              </p>
              <p style={{ 
                borderTop: `1px solid ${goldColor}`,
                paddingTop: '1rem',
                marginTop: 'auto',
                fontSize: '0.8rem', 
                color: goldColor,
                opacity: 0.8 
              }}>
                Mystical Persian Oracle™ 2024. All rights reserved.
              </p>
            </div>
          </div>
        </>
      )}

      {showFeedback && (
        <>
          <div style={overlayStyle} onClick={() => setShowFeedback(false)} />
          <div style={dialogStyle}>
            {isSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <h2 style={{ color: goldColor, marginBottom: '1rem', fontSize: '1.5rem' }}>
                  Success!
                </h2>
                <p style={{ color: goldColor, fontSize: '1.2rem', marginBottom: '1rem' }}>
                  ✨ I knew you were a person of great wisdom! ✨
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ color: goldColor, marginBottom: '1rem', fontSize: '1.2rem' }}>
                  Share Your Modern Insights
                </h3>
                <p style={{ marginBottom: '1rem', color: 'white' }}>
                  Your perspective helps shape this oracle&apos;s evolution.
                </p>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us your secrets..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    marginBottom: '10px',
                    padding: '8px',
                    backgroundColor: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    fontFamily: 'inherit',
                    fontSize: '14px'
                  }}
                />
                {error && (
                  <p style={{ 
                    color: '#ef4444',
                    marginBottom: '1rem',
                    fontSize: '0.875rem'
                  }}>
                    {error}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => setShowFeedback(false)}
                    style={{ ...buttonStyle, marginLeft: 0 }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmitFeedback}
                    disabled={isSubmitting || !feedbackText.trim()}
                    style={{ 
                      ...buttonStyle, 
                      marginLeft: 0,
                      opacity: isSubmitting || !feedbackText.trim() ? 0.5 : 1,
                      cursor: isSubmitting || !feedbackText.trim() ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  )
} 