import Image from 'next/image'

// Remove unused interface since we don't have props
// interface CardDeckProps {
// }

export const CardDeck = () => {
  // Add these variables
  const cardImage = '/path/to/card/image.jpg'  // Update with your image path
  const cardAlt = 'Oracle Card'                // Update with your alt text

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