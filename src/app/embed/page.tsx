import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL || 'https://furocan.vercel.app';
  
  return {
    title: '風呂キャン止めるくん',
    description: 'シャンプー習慣をブロックチェーンで記録するBase Mini App',
    other: {
      'fc:frame': JSON.stringify({
        version: "next",
        imageUrl: `${URL}/splash.svg`,
        button: {
          title: "風呂キャン止めるくんを開く",
          action: {
            type: "launch_frame",
            name: "風呂キャン止めるくん",
            url: URL,
            splashImageUrl: `${URL}/splash.svg`,
            splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#4F46E5",
          },
        },
      }),
    },
  };
}

export default function EmbedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
      <div className="text-center text-white p-8">
        <h1 className="text-4xl font-bold mb-4">風呂キャン止めるくん</h1>
        <p className="text-xl mb-8">シャンプー習慣をブロックチェーンで記録するBase Mini App</p>
        <div className="space-y-4">
          <a 
            href="https://furocan.vercel.app"
            className="block bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            アプリを開く
          </a>
          <p className="text-sm opacity-80">
            このページはFarcaster埋め込み用に最適化されています
          </p>
        </div>
      </div>
    </div>
  );
}