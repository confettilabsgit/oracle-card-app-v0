// Create a new file for our card meanings database
export const cardMeanings = {
  'Simurgh': {
    meaning: 'The majestic phoenix of wisdom and divine guidance',
    persianMeaning: 'سیمرغ، نماد خرد و راهنمایی الهی',
    description: 'As the most revered mythical bird in Persian mythology, the Simurgh represents the union of earth and sky. It symbolizes the achievement of enlightenment and the divine wisdom that comes through spiritual transformation.',
    persianDescription: 'سیمرغ به عنوان مقدس‌ترین پرنده در اساطیر ایران، نماد اتحاد زمین و آسمان است. این نماد نشان‌دهنده رسیدن به روشن‌بینی و خرد الهی است که از طریق تحول معنوی حاصل می‌شود.',
    keywords: ['wisdom', 'transformation', 'divine guidance', 'spiritual journey'],
    persianKeywords: ['خرد', 'دگرگونی', 'هدایت الهی', 'سفر معنوی']
  },
  'Peri': {
    meaning: 'The fairy of divine beauty and grace',
    persianMeaning: 'پری، نماد زیبایی و لطافت الهی',
    description: 'The Peri represents divine inspiration and ethereal beauty. These benevolent spirits guide seekers toward spiritual purification and the recognition of inner beauty.',
    persianDescription: 'پری نماد الهام الهی و زیبایی آسمانی است. این ارواح خیرخواه، جویندگان را به سوی تزکیه روح و شناخت زیبایی درونی هدایت می‌کنند.',
    keywords: ['beauty', 'inspiration', 'purification', 'grace'],
    persianKeywords: ['زیبایی', 'الهام', 'پاکی', 'لطافت']
  },
  'Div': {
    meaning: 'The shadow self and inner challenges',
    persianMeaning: 'دیو، نماد سایه درون و چالش‌های نفس',
    description: 'The Div represents our inner demons and challenges. It reminds us that facing our shadows is essential for growth and that our greatest obstacles often contain our deepest lessons.',
    persianDescription: 'دیو نماد شیاطین درونی و چالش‌های ماست. به ما یادآوری می‌کند که رویارویی با سایه‌های درون برای رشد ضروری است و بزرگترین موانع ما اغلب حاوی عمیق‌ترین درس‌ها هستند.',
    keywords: ['challenge', 'shadow work', 'transformation', 'inner struggle'],
    persianKeywords: ['چالش', 'کار با سایه', 'دگرگونی', 'مبارزه درونی']
  },
  // ... Add all other cards with similar detailed meanings
};

export function generateFallbackReading(selectedCards: any[]) {
  // Create meaningful combinations based on the cards drawn
  const cardDescriptions = selectedCards.map(card => cardMeanings[card.name]);
  
  // Generate brief insight combining card meanings
  const briefInsight = `Your reading reveals a powerful combination: ${selectedCards.map(card => 
    `${card.name}, ${cardMeanings[card.name].meaning}`
  ).join('; ')}. ${generateCombinationInsight(selectedCards)}`;

  const persianBriefInsight = `فال شما ترکیبی قدرتمند را نشان می‌دهد: ${selectedCards.map(card =>
    `${card.persianName}، ${cardMeanings[card.name].persianMeaning}`
  ).join('؛ ')}. ${generatePersianCombinationInsight(selectedCards)}`;

  // Generate deeper wisdom based on card combinations
  const deeperWisdom = generateDeeperWisdom(selectedCards);
  const persianDeeperWisdom = generatePersianDeeperWisdom(selectedCards);

  return {
    briefInsight,
    deeperWisdom,
    persianBriefInsight,
    persianDeeperWisdom
  };
}

function generateCombinationInsight(cards: any[]) {
  // Add special insights for specific card combinations
  if (cards.some(c => c.name === 'Simurgh') && cards.some(c => c.name === 'Div')) {
    return "The presence of both Simurgh and Div suggests a powerful transformation through facing your shadows with divine wisdom.";
  }
  // Add more combination insights...
  return "Consider how these symbols work together to illuminate your path.";
}

function generatePersianCombinationInsight(cards: any[]) {
  if (cards.some(c => c.name === 'Simurgh') && cards.some(c => c.name === 'Div')) {
    return "حضور همزمان سیمرغ و دیو نشان‌دهنده تحولی قدرتمند از طریق رویارویی با سایه‌ها به کمک خرد الهی است.";
  }
  // Add more Persian combination insights...
  return "به چگونگی همکاری این نمادها در روشن کردن مسیر خود بیندیشید.";
}

function generateDeeperWisdom(cards: any[]) {
  let wisdom = "In this reading, ";
  cards.forEach((card, index) => {
    wisdom += `${cardMeanings[card.name].description} `;
    if (index < cards.length - 1) {
      wisdom += "Furthermore, ";
    }
  });
  wisdom += generateCombinationInsight(cards);
  return wisdom;
}

function generatePersianDeeperWisdom(cards: any[]) {
  let wisdom = "در این فال، ";
  cards.forEach((card, index) => {
    wisdom += `${cardMeanings[card.name].persianDescription} `;
    if (index < cards.length - 1) {
      wisdom += "همچنین، ";
    }
  });
  wisdom += generatePersianCombinationInsight(cards);
  return wisdom;
} 