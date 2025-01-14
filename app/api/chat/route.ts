import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

// Create a structured prompt template
function createReadingPrompt(userQuestion: string) {
  return `Create a mystical Persian oracle card reading addressing: "${userQuestion}"

Structure the reading in the following format:

1. Opening Divination (2-3 sentences welcoming the seeker and acknowledging their question)

2. For each Persian oracle card drawn:
   - Name and visual description of the card
   - The card's mystical symbolism and ancient Persian significance
   - How this card specifically relates to the seeker's question
   - The wisdom or guidance it offers

3. Synthesis (2-3 sentences weaving together the messages of all cards)

4. Ritual or Practice (A specific action, meditation, or ritual the seeker can perform to integrate this wisdom, drawing from Persian spiritual traditions)

Style: Use mystical, poetic language that evokes Persian spiritual traditions. Reference Sufi wisdom, Persian mythology, and ancient Persian symbols where relevant. The tone should be wise, compassionate, and empowering.`;
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }), 
      { status: 500 }
    );
  }

  try {
    const { prompt } = await req.json();
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a wise Persian oracle reader deeply versed in Persian mysticism, Sufi wisdom, and ancient Persian spiritual traditions. You provide detailed, thoughtful readings that combine deep spiritual insight with practical guidance.'
        },
        {
          role: 'user',
          content: createReadingPrompt(prompt)
        }
      ],
      max_tokens: 1000, // Increased token limit for longer readings
      temperature: 0.8,  // Slightly increased for more creative variation
      stream: false,
    });

    return new Response(
      JSON.stringify({ text: response.choices[0].message.content }),
      { 
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500 }
    );
  }
}