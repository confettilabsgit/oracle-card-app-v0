import Image from 'next/image'

export const CardDeck = () => {
  const cardImage = '/angel.jpg'
  const cardAlt = 'Oracle Card'

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