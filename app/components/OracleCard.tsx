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

export default function OracleCard({ isFlipped, onClick, frontImage, name, persianName }: OracleCardProps) {
  return (
    <div className="flex flex-col items-center mb-4">
      <div
        className="w-[240px] h-[336px] cursor-pointer bg-[#1C1C1E]"
        onClick={onClick}
      >
        <div 
          className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]"
          style={{ transform: isFlipped ? 'rotateY(180deg)' : '' }}
        >
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] flex items-center justify-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cardback.png-ss1uEfrMEuuHWNF9VddK5P6D3UZoFg.webp"
              alt="Card Back"
              width={224}
              height={320}
              className="rounded-lg"
            />
          </div>
          <div 
            className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center"
          >
            <Image
              src={frontImage}
              alt={name}
              width={224}
              height={320}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
      {isFlipped && (
        <div className="text-center mt-1">
          <h3 className="text-base font-semibold text-white">{name}</h3>
          <p className="text-base font-semibold text-white/80">{persianName}</p>
        </div>
      )}
    </div>
  )
}

