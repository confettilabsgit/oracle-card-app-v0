import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const token = process.env.GITHUB_TOKEN

  if (!token?.startsWith('ghp_')) {
    return NextResponse.json({ 
      error: 'Invalid token format'
    }, { status: 500 })
  }

  try {
    const { intention } = await request.json()
    
    // Only log non-empty intentions
    if (!intention || !intention.trim()) {
      return NextResponse.json({ success: true, skipped: true })
    }
    
    const response = await fetch(
      'https://api.github.com/repos/confettilabsgit/oracle-card-app-v0/issues',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `User Intention: ${intention.trim().substring(0, 100)}${intention.trim().length > 100 ? '...' : ''}`,
          body: `**User Intention/Question:**\n\n${intention.trim()}\n\n---\n*Logged on ${new Date().toLocaleString()}*`,
          labels: ['intention']
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('GitHub API error:', {
        status: response.status,
        body: errorText
      })
      throw new Error(`GitHub API error: ${errorText}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging intention:', error)
    // Don't fail the reading if logging fails - just log the error
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

