export const generateBriefInsight = async (cards: string[]) => {
  const response = await fetch('/api/brief-insight', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cards }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate brief insight');
  }

  const data = await response.json();
  return data.insight;
}; 