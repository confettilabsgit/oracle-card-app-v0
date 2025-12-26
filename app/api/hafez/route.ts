import { generateHafezWisdom } from '@/lib/generateHafezWisdom'
import { NextResponse } from 'next/server'

export async function POST() {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    )
  }

  try {
    const wisdom = await generateHafezWisdom()
    return NextResponse.json({ text: wisdom }, { status: 200 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Hafez generation error:', errorMessage)
    
    // Check for specific OpenAI API errors
    if (errorMessage.includes('quota') || errorMessage.includes('429')) {
      return NextResponse.json(
        { error: 'API quota exceeded. Please check your OpenAI billing.' },
        { status: 503 }
      )
    }
    
    if (errorMessage.includes('401') || errorMessage.includes('Invalid API key')) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your OpenAI configuration.' },
        { status: 401 }
      )
    }
    
    // Return more specific error message
    return NextResponse.json(
      { error: `Failed to generate wisdom: ${errorMessage}` },
      { status: 500 }
    )
  }
} 