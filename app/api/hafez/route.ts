import { generateHafezWisdom } from '@/lib/generateHafezWisdom'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const wisdom = await generateHafezWisdom()
    return NextResponse.json({ text: wisdom }, { status: 200 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Hafez generation error:', errorMessage)
    return NextResponse.json({ error: 'Failed to generate wisdom' }, { status: 500 })
  }
} 