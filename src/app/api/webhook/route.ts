import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Farcaster webhook処理のロジックをここに実装
    console.log('Farcaster webhook received:', body);
    
    // 基本的な応答
    return NextResponse.json({ 
      success: true,
      message: 'Webhook received successfully'
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Farcaster Mini App Webhook Endpoint',
    app: '風呂キャン止めるくん'
  });
}