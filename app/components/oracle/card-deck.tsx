import Image from 'next/image'

export const CardDeck = ({ onSelect }) => {
  return (
    <div>
      <Image 
        src={cardImage}
        alt={cardAlt}
        width={400}
        height={600}
      />
    </div>
  )
} 