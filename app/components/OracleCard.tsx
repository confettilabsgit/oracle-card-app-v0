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
  className = ''
}: OracleCardProps) {
  return (
    <div className={`
      flex flex-col items-center
      ${isDesktop ? 'mb-4' : 'absolute transition-all duration-500'}
      ${!isDesktop && !show ? 'translate-x-[100%] opacity-0' : 'translate-x-[-50%] opacity-100'}
      ${className}
    `}
    style={{
      zIndex: zIndex,
      left: isDesktop ? 'auto' : '50%',
    }}>
      <div
        className={`
          cursor-pointer relative
          ${isDesktop ? 'w-[300px] h-[420px]' : 'w-[380px] h-[532px]'}
          transform-style-preserve-3d perspective-1000
        `}
        onClick={onClick}
      >
        <div 
          className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]"
          style={{ transform: isFlipped ? 'rotateY(180deg)' : '' }}
        >
          {/* Back of card (cover) */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] flex items-center justify-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cardback.png-ss1uEfrMEuuHWNF9VddK5P6D3UZoFg.webp"
              alt="Card Back"
              width={isDesktop ? 224 : 320}
              height={isDesktop ? 320 : 448}
              className="rounded-lg"
            />
          </div>
          {/* Front of card */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center">
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
      {isFlipped && show && (
        <div className="absolute bottom-[-40px] w-full text-center">
          <h3 className={`font-semibold text-white ${isDesktop ? 'text-base' : 'text-sm'}`}>{name}</h3>
          <p className={`font-semibold text-white/80 ${isDesktop ? 'text-base' : 'text-sm'}`}>{persianName}</p>
        </div>
      )}
    </div>
  )
}

