'use client'

import React from 'react'
import Image from 'next/image'

interface OracleCardProps {
  isFlipped: boolean
  onClick: () => void
  frontImage: string
  name: string
  persianName: string
}

const OracleCard: React.FC<OracleCardProps> = ({ isFlipped, onClick, frontImage, name, persianName }) => {
  return (
    <div
      className={`w-[220px] h-[380px] cursor-pointer transition-transform duration-300 transform hover:scale-105`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={`${name} card, ${isFlipped ? 'flipped' : 'not flipped'}`}
    >
      <div 
        className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] shadow-xl rounded-lg"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : '' }}
      >
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] flex items-center justify-center rounded-lg overflow-hidden">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cardback.png-2nVDZYNZPDSm62r2ALrTYoAeYoxJcb.webp"
            alt="Card Back"
            width={220}
            height={380}
            className="rounded-lg"
          />
        </div>
        <div 
          className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center rounded-lg overflow-hidden"
        >
          <Image
            src={frontImage}
            alt={name}
            width={220}
            height={380}
            className="rounded-lg"
          />
          <div className="absolute bottom-2 left-0 right-0 text-center bg-black bg-opacity-70 py-2">
            <p className="text-white text-lg font-semibold">{name}</p>
            <p className="text-white text-sm font-arabic">{persianName}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OracleCard

