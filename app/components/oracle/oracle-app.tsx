// Add props interface for CardDeck
interface CardDeckProps {
  onSelect: (cards: Card[]) => void;
}

// Update CardDeck component
const CardDeck: React.FC<CardDeckProps> = ({ onSelect }) => {
  // ... rest of component
}

export default function OracleApp() {
  const handleSelect = (cards: Card[]) => {
    // Handle selected cards
    console.log(cards);
  };

  return (
    <div>
      <CardDeck onSelect={handleSelect} />
    </div>
  );
} 