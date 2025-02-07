import { NextResponse } from 'next/server'
// import { headers } from 'next/headers' // Remove if unused

export async function POST(request: Request) {
  // Debug all environment variables (don't worry, this won't show in production)
  console.log('All env vars:', Object.keys(process.env))
  
  const token = process.env.GITHUB_TOKEN
  console.log('Direct token check:', {
    exists: !!token,
    length: token?.length,
    startsWith: token?.startsWith('ghp_')
  })

  if (!token?.startsWith('ghp_')) {
    return NextResponse.json({ 
      error: 'Invalid token format',
      debug: {
        exists: !!token,
        length: token?.length,
        startsWith: token?.startsWith('ghp_')
      }
    }, { status: 500 })
  }

  try {
    const { feedback } = await request.json()
    
    const response = await fetch(
      'https://api.github.com/repos/confettilabsgit/oracle-card-app/issues',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `User Feedback: ${new Date().toLocaleDateString()}`,
          body: feedback,
          labels: ['feedback']
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
    console.error('Error details:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 