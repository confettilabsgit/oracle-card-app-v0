import Image from 'next/image'

// Either use onSelect or remove it from props
interface CardDeckProps {
  // Remove onSelect if not using it
  // onSelect: (card: string) => void;
}

export const CardDeck = (/* { onSelect } */) => {
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