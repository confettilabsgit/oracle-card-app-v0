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
      ${isDesktop ? 'flex flex-col' : 'absolute transition-all duration-500'}
      ${className}
    `}
    style={{
      zIndex: zIndex,
      ...(isDesktop ? {} : {
        left: '50%',
        right: 'auto',
        transform: !show ? 'translateX(100%)' : 'translateX(calc(-50% + 25px))',
        opacity: !show ? 0 : 1,
      }),
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
      {isFlipped && show && (
        <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-full text-center">
          <h3 className={`font-semibold text-white ${isDesktop ? 'text-base' : 'text-sm'}`}>{name}</h3>
          <p className={`font-semibold text-white/80 ${isDesktop ? 'text-base' : 'text-sm'}`}>{persianName}</p>
        </div>
      )}
    </div>
  )
}

