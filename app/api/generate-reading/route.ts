import { OpenAI } from 'openai';

export const runtime = 'edge';

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }), 
      { status: 500 }
    );
  }

  try {
    // Initialize OpenAI inside the function
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { prompt } = await req.json();

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a mystical oracle providing insights based on Persian-themed tarot cards.
            Be very concise. First insight should be 1-2 sentences, deeper wisdom 3-4 sentences.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4-turbo-preview",
      max_tokens: 200,
      temperature: 0.5,
      presence_penalty: 0.0,
      frequency_penalty: 0.0,
      response_format: { type: "text" }
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
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500 }
    );
  }
}