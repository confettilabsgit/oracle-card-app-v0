import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

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
          content: 'You are a wise Persian oracle reader. Generate unique readings each time, never repeating the same text.'
        },
        {
          role: 'user',
          // Using the prompt from the request here
          content: prompt || 'Create a unique oracle reading. Include a welcome message, interpretations of the cards for this specific reading, and a suggested ritual.'
        }
      ],
      max_tokens: 500,
      temperature: 0.9,
      stream: false,
    });

    return new Response(
      JSON.stringify({ 
        text: `<span style="color: #${Math.floor(Math.random()*16777215).toString(16)}">${response.choices[0].message.content}</span>`
      }),
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