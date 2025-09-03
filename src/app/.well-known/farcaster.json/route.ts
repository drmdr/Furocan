import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const manifest = {
    accountAssociation: {
      header: process.env.FARCASTER_HEADER || '',
      payload: process.env.FARCASTER_PAYLOAD || '',
      signature: process.env.FARCASTER_SIGNATURE || '',
    },
    frame: {
      version: '1',
      name: '風呂キャン止めるくん',
      iconUrl: `${process.env.NEXT_PUBLIC_URL}/icon.svg`,
      homeUrl: process.env.NEXT_PUBLIC_URL || '',
      imageUrl: `${process.env.NEXT_PUBLIC_URL}/splash.svg`,
      buttonTitle: 'シャンプー記録を開始',
      splashImageUrl: `${process.env.NEXT_PUBLIC_URL}/splash.svg`,
      splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || '#4F46E5',
      webhookUrl: `${process.env.NEXT_PUBLIC_URL}/api/webhook`,
    },
    // テスト中はnoindexをtrueに設定
    noindex: true,
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300', // 5分間キャッシュ
    },
  });
}