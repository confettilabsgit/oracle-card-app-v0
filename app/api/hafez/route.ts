import { generateHafezWisdom } from '@/lib/generateHafezWisdom'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const wisdom = await generateHafezWisdom()
    return NextResponse.json({ text: wisdom }, { status: 200 })
  } catch (error) {
    console.error('Hafez generation error:', error.message)
    return NextResponse.json({ error: 'Failed to generate wisdom' }, { status: 500 })
  }
} 