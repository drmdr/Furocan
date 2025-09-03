'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import WalletButton from '../components/WalletButton'
import ShampooRecorder from '../components/ShampooRecorder'
import NoShampooRecorder from '../components/NoShampooRecorder'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-black">
      {/* Header with Wallet Button */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">🧴</span>
          </div>
          <h1 className="text-white font-bold text-xl">風呂キャン止めるくん</h1>
        </div>
        <WalletButton />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <div className="inline-block p-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full border border-pink-500/30 backdrop-blur-sm">
              <span className="text-6xl">🧴</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            今日もシャンプーした？
          </h2>
          <p className="text-pink-200 text-lg max-w-md mx-auto">
            あなたのシャンプー習慣をブロックチェーンで記録して、清潔な毎日を継続しよう✨
          </p>
        </div>

        {/* Action Cards */}
        <div className="max-w-md mx-auto space-y-6">
          {/* Shampoo Recording */}
          <ShampooRecorder />
          
          {/* No Shampoo Recording */}
          <NoShampooRecorder />
          
          {/* Stats Card */}
          <div className="p-6 bg-black/40 backdrop-blur-sm border border-pink-500/30 rounded-2xl">
            <h3 className="text-pink-300 font-semibold mb-4 flex items-center">
              <span className="mr-2">📊</span>
              あなたの記録
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-pink-200 text-sm">連続記録</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-pink-200 text-sm">総記録数</div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-6 bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl">
            <h3 className="text-purple-300 font-semibold mb-4 flex items-center">
              <span className="mr-2">💡</span>
              使い方
            </h3>
            <div className="space-y-3 text-sm text-purple-200">
              <div className="flex items-start space-x-3">
                <span className="text-pink-400 font-bold">1.</span>
                <span>「シャンプーした！」でブロックチェーンに永続記録</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-pink-400 font-bold">2.</span>
                <span>「今日はパス」でローカルに記録</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-pink-400 font-bold">3.</span>
                <span>継続して清潔な習慣を身につけよう</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-pink-300/60">
        <p className="flex items-center justify-center space-x-2">
          <span>Built on</span>
          <span className="text-blue-400 font-semibold">Base Network</span>
          <span>🔵</span>
        </p>
      </footer>
    </div>
  )
}
