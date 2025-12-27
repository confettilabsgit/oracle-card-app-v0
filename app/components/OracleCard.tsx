'use client'

import React from 'react'
import Image from 'next/image'

interface OracleCardProps {
  isFlipped: boolean
  onClick: () => void
  frontImage: string
  name: string
  persianName: string
  isDesktop: boolean
  show?: boolean
  zIndex?: number
  className?: string
  style?: React.CSSProperties
}

export default function OracleCard({ 
  isFlipped, 
  onClick, 
  frontImage, 
  name, 
  persianName,
  isDesktop,
  show = true,
  zIndex = 0,
  className = '',
  style = {}
}: OracleCardProps) {
  return (
    <div className={`
      ${isDesktop ? 'flex flex-col' : 'absolute transition-all duration-500'}
      ${className}
    `}
    style={{
      zIndex: zIndex,
      ...(isDesktop ? {} : {
        left: '50%',
        right: 'auto',
        transform: !show ? 'translateX(100%)' : 'translateX(-50%)',
        opacity: !show ? 0 : 1,
      }),
      ...style,
    }}>
      <div
        className={`
          cursor-pointer relative
          ${isDesktop ? 'w-[224px] h-[420px]' : 'w-[320px] h-[532px]'}
        `}
        onClick={onClick}
      >
        <div 
          className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]"
          style={{ transform: isFlipped ? 'rotateY(180deg)' : '' }}
        >
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] flex items-center justify-center">
            <Image
              src="/cards/cardback.png"
              alt="Card Back"
              width={isDesktop ? 224 : 320}
              height={isDesktop ? 320 : 448}
              className="rounded-lg"
            />
            {/* Animated arrows and instruction on cardback - only show when not flipped */}
            {!isFlipped && !isDesktop && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="flex items-center gap-3 text-amber-200 text-center mb-2">
                  {/* Left arrow - Persianesque (8-pointed star pattern) */}
                  <svg 
                    className="w-6 h-6 animate-slide-horizontal text-amber-300" 
                    style={{ animationDirection: 'reverse' }}
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                  >
                    <path d="M12 2 L14 8 L12 6 L10 8 Z M12 22 L14 16 L12 18 L10 16 Z M2 12 L8 10 L6 12 L8 14 Z M22 12 L16 14 L18 12 L16 10 Z" fill="currentColor" opacity="0.8" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                  </svg>
                  <span className="text-base font-light italic">tap to flip card</span>
                  {/* Right arrow - Persianesque (8-pointed star pattern) */}
                  <svg 
                    className="w-6 h-6 animate-slide-horizontal text-amber-300" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                  >
                    <path d="M12 2 L14 8 L12 6 L10 8 Z M12 22 L14 16 L12 18 L10 16 Z M2 12 L8 10 L6 12 L8 14 Z M22 12 L16 14 L18 12 L16 10 Z" fill="currentColor" opacity="0.8" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          <div 
            className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center"
          >
            <Image
              src={frontImage}
              alt={name}
              width={isDesktop ? 224 : 320}
              height={isDesktop ? 320 : 448}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

