import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function POST() {
  try {
    // Read the cardback.png file from public/cards
    const filePath = join(process.cwd(), 'public', 'cards', 'cardback.png')
    const fileBuffer = await readFile(filePath)
    
    // Upload to Vercel Blob Storage
    const blob = await put('cardback.png', fileBuffer, {
      access: 'public',
      contentType: 'image/png',
    })
    
    return NextResponse.json({ 
      url: blob.url,
      success: true 
    })
  } catch (error) {
    console.error('Upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    )
  }
}


