'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface OracleCardProps {
  isFlipped: boolean
  card: {
    id: number
    name: string
    persianName: string
    image: string
  }
  onClick: () => void
  isDesktop?: boolean
  show?: boolean
  zIndex?: number
  className?: string
}

const OracleCard = ({ 
  isFlipped, 
  card, 
  onClick,
  isDesktop = true,
  show = true,
  zIndex = 0,
  className = ''
}: OracleCardProps) => {
  const slideAnimation = isDesktop ? {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { 
      x: '100%', 
      opacity: 0,
      transition: { duration: 0.5, ease: "easeIn" }
    }
  } : {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate={show ? "visible" : "hidden"}
      exit="exit"
      variants={slideAnimation}
      className={`relative ${className}`}
      style={{ zIndex }}
    >
      <div 
        className={`
          relative w-full aspect-[2/3] rounded-lg overflow-hidden cursor-pointer
          transform transition-transform duration-700 preserve-3d
          ${isFlipped ? 'rotate-y-180' : ''}
        `}
        onClick={onClick}
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
            src={card.image}
            alt={card.name}
            width={isDesktop ? 224 : 320}
            height={isDesktop ? 320 : 448}
            className="rounded-lg"
          />
        </div>
      </div>
      {isFlipped && (
        <div className="absolute bottom-[-40px] w-full text-center">
          <h3 className={`font-semibold text-white ${isDesktop ? 'text-base' : 'text-sm'}`}>{card.name}</h3>
          <p className={`font-semibold text-white/80 ${isDesktop ? 'text-base' : 'text-sm'}`}>{card.persianName}</p>
        </div>
      )}
    </motion.div>
  );
}

export default OracleCard

