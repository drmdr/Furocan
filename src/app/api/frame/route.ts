import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Frame interaction処理
    console.log('Frame interaction:', body);
    
    // ユーザーをメインアプリにリダイレクト
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://furocan.vercel.app/splash.svg" />
          <meta property="fc:frame:button:1" content="アプリを開く" />
          <meta property="fc:frame:button:1:action" content="link" />
          <meta property="fc:frame:button:1:target" content="https://furocan.vercel.app" />
        </head>
        <body>
          <p>風呂キャン止めるくんへようこそ！</p>
        </body>
      </html>
    `;
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Frame API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Farcaster Frame API Endpoint',
    app: '風呂キャン止めるくん'
  });
}