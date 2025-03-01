export const generateHafezWisdom = async (cards: string[]) => {
  const response = await fetch('/api/hafez', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cards }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate wisdom');
  }

  const data = await response.json();
  return data.wisdom;
}; 