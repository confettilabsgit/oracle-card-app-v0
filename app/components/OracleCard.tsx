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
    <div
      className={`w-[300px] h-[420px] cursor-pointer bg-[#1C1C1E]`}
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
            width={280}
            height={400}
            className="rounded-lg"
          />
        </div>
        <div 
          className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center"
        >
          <Image
            src={frontImage}
            alt={name}
            width={280}
            height={400}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}

