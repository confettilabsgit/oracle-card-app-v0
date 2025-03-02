import { generateHafezWisdom } from '@/lib/generateHafezWisdom'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST() {
  try {
    const wisdom = await generateHafezWisdom()
    return NextResponse.json({ text: wisdom }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to generate wisdom' }, { status: 500 })
  }
} 