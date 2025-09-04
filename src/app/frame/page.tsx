import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '風呂キャン止めるくん',
  description: 'シャンプー習慣をブロックチェーンで記録するBase Mini App',
  other: {
    // Farcaster Frame metadata
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://furocan.vercel.app/splash.svg',
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': 'アプリを開く',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://furocan.vercel.app',
    'fc:frame:post_url': 'https://furocan.vercel.app/api/frame',
    // Open Frame metadata
    'of:version': 'vNext',
    'of:accepts:farcaster': 'vNext',
    'of:image': 'https://furocan.vercel.app/splash.svg',
    'of:image:alt': '風呂キャン止めるくん - シャンプー習慣トラッカー',
    'of:button:1': 'アプリを開く',
    'of:button:1:action': 'link',
    'of:button:1:target': 'https://furocan.vercel.app',
  },
};

export default function FramePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
      <div className="text-center text-white p-8">
        <h1 className="text-4xl font-bold mb-4">風呂キャン止めるくん</h1>
        <p className="text-xl mb-8">シャンプー習慣をブロックチェーンで記録</p>
        <a 
          href="https://furocan.vercel.app"
          className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
        >
          アプリを開く
        </a>
      </div>
    </div>
  );
}