import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '風呂キャン止めるくん',
  description: 'シャンプー習慣をブロックチェーンで記録するBase Mini App',
  other: {
    // Farcaster Frame metadata (JSON format as per official docs)
    'fc:frame': JSON.stringify({
      version: "next",
      imageUrl: "https://furocan.vercel.app/splash.svg",
      button: {
        title: "アプリを開く",
        action: {
          type: "launch_frame",
          name: "風呂キャン止めるくん",
          url: "https://furocan.vercel.app",
          splashImageUrl: "https://furocan.vercel.app/splash.svg",
          splashBackgroundColor: "#4F46E5"
        }
      }
    }),
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