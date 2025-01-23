const CardDeck: React.FC<CardDeckProps> = ({ onSelect }) => {
  useEffect(() => {
    generateReading();
  }, []);

  // Rest of component code
}; 