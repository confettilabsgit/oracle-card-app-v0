import { generateHafezWisdom } from '@/lib/generateHafezWisdom'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { cards } = await req.json()
    const wisdom = await generateHafezWisdom(cards)
    return NextResponse.json({ text: wisdom })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to generate Hafez wisdom' }, { status: 500 })
  }
} 