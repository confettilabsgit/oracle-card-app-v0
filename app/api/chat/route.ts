import { OpenAI } from 'openai';

// Create an OpenAI API client
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
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
      stream: false,
    });

    // Return regular JSON response instead of stream
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