// Add props interface for CardDeck
interface CardDeckProps {
  onSelect: (cards: Card[]) => void;
}

// Update CardDeck component
const CardDeck: React.FC<CardDeckProps> = ({ onSelect }) => {
  // ... rest of component
} 