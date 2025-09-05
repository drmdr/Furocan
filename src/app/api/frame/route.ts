import { NextRequest, NextResponse } from 'next/server'

// Simple vNext-compatible frame response. Note: Prefer fc:frame metadata in pages.
export async function POST(request: NextRequest) {
  try {
    // Optional: inspect frame interaction payload
    // const body = await request.json()

    const html = `<!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://furocan.vercel.app/splash.svg" />
          <meta property="fc:frame:button:1" content="Launch Mini App" />
          <meta property="fc:frame:button:1:action" content="launch_frame" />
          <meta property="fc:frame:button:1:target" content="https://furocan.vercel.app" />
        </head>
        <body>
          <p>Farcaster Frame endpoint</p>
        </body>
      </html>`

    return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
  } catch (error) {
    console.error('Frame API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Farcaster Frame API Endpoint' })
}

