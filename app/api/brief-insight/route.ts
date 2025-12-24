import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { cards } = await request.json();
    
    const prompt = `As a mystical oracle, provide a brief, clear insight for each of these cards drawn: ${cards.join(', ')}. 
    Format each as "Card: Brief meaning (2-3 words)". Keep it concise and mystical.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a mystical oracle providing brief, clear insights about Persian mythological cards."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    return NextResponse.json({ insight: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error generating brief insight:', error);
    return NextResponse.json({ error: 'Failed to generate insight' }, { status: 500 });
  }
} 