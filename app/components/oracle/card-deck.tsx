import Image from 'next/image'

// Remove unused interface since we don't have props
// interface CardDeckProps {
// }

export const CardDeck = () => {
  // Update image path to match your public directory structure
  const cardImage = '/cards/angel.jpg'  // Assuming image is in public/cards/
  const cardAlt = 'Oracle Card'

  return (
    <div className="flex justify-center">
      <Image 
        src={cardImage}
        alt={cardAlt}
        width={480}
        height={720}
        priority  // Add priority for first image load
      />
    </div>
  )
} 