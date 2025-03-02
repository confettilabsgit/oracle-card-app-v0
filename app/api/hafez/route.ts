import { generateHafezWisdom } from '@/lib/generateHafezWisdom'
import { NextResponse } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: Request) {
  try {
    const wisdom = await generateHafezWisdom()
    return NextResponse.json({ text: wisdom })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to generate wisdom' }, { status: 500 })
  }
} 