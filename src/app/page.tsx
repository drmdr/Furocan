import WalletConnect from '../components/WalletConnect';
import ShampooRecorder from '../components/ShampooRecorder';
import NoShampooRecorder from '../components/NoShampooRecorder';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🧴 風呂キャン止めるくん
          </h1>
          <p className="text-lg text-gray-600">
            シャンプー習慣をブロックチェーンで記録するBase App
          </p>
        </header>

        {/* Main Content */}
        <main className="max-w-md mx-auto space-y-8">
          {/* Wallet Connection */}
          <WalletConnect />
          
          {/* Shampoo Recording */}
          <ShampooRecorder />
          
          {/* No Shampoo Recording */}
          <NoShampooRecorder />
          
          {/* Instructions */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              使い方
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>ウォレットを接続してください</li>
              <li>Baseネットワークに切り替えてください</li>
              <li>「今日シャンプーした」ボタンでブロックチェーンに記録</li>
              <li>「今日シャンプーしなかった」ボタンでローカルに記録</li>
              <li>カレンダーで履歴を確認できます（今後実装予定）</li>
            </ol>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500">
          <p>Built on Base Network 🔵</p>
        </footer>
      </div>
    </div>
  );
}
