import { OpenAI } from 'openai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT: Set the runtime to edge
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
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.9,
      stream: false,
    });

    return new Response(
      JSON.stringify({ 
        text: response.choices[0].message.content
      }),
      { 
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );  

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate reading' }),
      { status: 500 }
    );
  }
}

export async function GET() {
  return new Response(JSON.stringify({ message: 'API is working. Use POST to generate text.' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}