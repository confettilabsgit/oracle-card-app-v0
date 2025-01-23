import React, { useEffect, useState } from 'react';

const Reading: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  
  useEffect(() => {
    // Your effect code
  }, []); // Remove cards.length dependency

  return (
    // Your JSX
  );
};

export default Reading; 