'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { useMiniKit, useComposeCast, useOpenUrl } from '@coinbase/onchainkit/minikit'
import { Name } from '@coinbase/onchainkit/identity'
import { ConnectWallet } from '@coinbase/onchainkit/wallet'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import Calendar from '../components/Calendar'
import { SHAMPOO_TRACKER_ABI, CONTRACT_ADDRESSES } from '../lib/contract'
import { saveNoShampooRecord, addToShampooLogs, getShampooLogs, type ShampooLog } from '../lib/localStorage'

export default function Page() {
  // MiniKit hooks
  const { setFrameReady, isFrameReady } = useMiniKit()
  const { composeCast } = useComposeCast()
  const openUrl = useOpenUrl()

  // Wagmi hooks
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { writeContract, isPending: isWritePending, error: writeError } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt()

  // State
  const [activeTab, setActiveTab] = useState<'home' | 'calendar'>('home')
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showNoShampooPopup, setShowNoShampooPopup] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showError, setShowError] = useState(false)
  const [logs, setLogs] = useState<ShampooLog[]>([])
  // Top image path that persists until page closes
  const [topImage, setTopImage] = useState('/shampoo-top.png')

  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  // Initialize MiniKit
  useEffect(() => {
    if (!isFrameReady) setFrameReady()
  }, [setFrameReady, isFrameReady])

  // Load logs on mount
  useEffect(() => {
    setLogs(getShampooLogs())
  }, [])

  // Handle write errors
  useEffect(() => {
    if (writeError) setShowError(true)
  }, [writeError])

  // Share to Farcaster
  const handleShareToFarcaster = () => {
    composeCast({
      text: '今日もシャンプーできてえらい！ #風呂キャン止めるくん',
      embeds: ['https://furocan.vercel.app'],
    })
  }

  // Main action handler
  const handleShampooAction = async (shampooed: boolean) => {
    if (shampooed) {
      if (!isConnected || !contractAddress) {
        alert('ウォレット接続または対応ネットワークを確認してください。')
        return
      }
      try {
        await writeContract({
          address: contractAddress as `0x${string}`,
          abi: SHAMPOO_TRACKER_ABI,
          functionName: 'recordShampoo',
        })

        addToShampooLogs(true)
        setLogs(getShampooLogs())
        // Replace top image with done image until app closes
        setTopImage('/shampoo-done.png')

        const messages = [
          '今日もシャンプーできてえらい！',
          '継続は力なり、えらい！',
          'ピカピカ！すばらしい！',
        ]
        const randomMessage = messages[Math.floor(Math.random() * messages.length)]
        setSuccessMessage(randomMessage)
        setShowSuccessPopup(true)
      } catch (error) {
        console.error('Transaction failed:', error)
      }
    } else {
      saveNoShampooRecord()
      setLogs(getShampooLogs())
      // Replace top image with skip image until app closes
      setTopImage('/shampoo-skip.png')
      // Show encouraging message for skipping today
      setShowNoShampooPopup(true)
    }
  }

  return (
    <div className="flex flex-col min-h-screen font-sans text-foreground bg-background">
      <div className="w-full max-w-md mx-auto">
        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50">
            <div className="bg-primary text-primary-foreground p-6 rounded-2xl shadow-xl max-w-sm w-full text-center relative">
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="absolute top-2 right-2 text-primary-foreground hover:text-primary-foreground/80 text-xl font-bold"
              >
                ×
              </button>
              <div className="text-4xl mb-2">🧴</div>
              <p className="font-bold text-lg">{successMessage}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleShareToFarcaster}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  Farcasterでシェア
                </button>
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="flex-1 px-4 py-2 bg-primary-foreground text-primary rounded-lg hover:bg-primary-foreground/90 transition-colors text-sm font-medium"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No Shampoo Popup */}
        {showNoShampooPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50">
            <div className="bg-secondary text-secondary-foreground p-6 rounded-2xl shadow-xl max-w-sm w-full text-center relative">
              <button
                onClick={() => setShowNoShampooPopup(false)}
                className="absolute top-2 right-2 text-secondary-foreground hover:text-secondary-foreground/80 text-xl font-bold"
              >
                ×
              </button>
              <div className="text-4xl mb-2">💜</div>
              <p className="font-bold text-lg">今日はパス！生きててえらい！</p>
              <button
                onClick={() => setShowNoShampooPopup(false)}
                className="mt-4 px-4 py-2 bg-secondary-foreground text-secondary rounded-lg hover:bg-secondary-foreground/90 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="flex justify-between items-center p-4 h-16">
          <div className="flex items-center space-x-2">
            <img src="/icon.svg" alt="Shampoo" className="w-6 h-6" />
          </div>
          <ConnectWallet className="px-3 py-2 border-2 border-gray-400 text-gray-600 rounded-lg hover:border-gray-500 hover:text-gray-700 transition-colors">
            <Name className="text-inherit text-sm" />
          </ConnectWallet>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4">
          {activeTab === 'home' && (
            <div className="flex flex-col items-center space-y-6 pb-20">
              {/* Title */}
              <div className="text-center space-y-2 mt-4">
                <h1 className="text-2xl font-bold text-primary">風呂キャン止めるくん</h1>
              </div>

              {/* Top Image */}
              <div className="w-full flex items-center justify-center">
                <img src={topImage} alt="top" className="w-full max-w-sm object-contain" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full max-w-sm">
                <Button
                  onClick={() => handleShampooAction(true)}
                  disabled={isWritePending || isConfirming}
                  className="flex-1 h-12 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                >
                  {isWritePending && '送信中...'}
                  {isConfirming && '確認中...'}
                  {!isWritePending && !isConfirming && 'シャンプーした！'}
                </Button>
                <Button
                  onClick={() => handleShampooAction(false)}
                  variant="outline"
                  className="flex-1 h-12 text-sm font-semibold bg-transparent border-2 border-primary text-primary hover:bg-primary/10 rounded-xl"
                >
                  今日はパス
                </Button>
              </div>

              {/* Network error */}
              {isConnected && !contractAddress && (
                <Card className="w-full max-w-sm p-3 bg-destructive/10 border-destructive/20">
                  <p className="text-destructive text-xs text-center">
                    Base に接続してください（Base Sepolia では動作しません）。
                  </p>
                </Card>
              )}

              {/* Write error */}
              {showError && writeError && (
                <Card className="w-full max-w-sm p-3 bg-destructive/10 border-destructive/20 relative">
                  <button
                    onClick={() => setShowError(false)}
                    className="absolute top-1 right-1 text-destructive hover:text-destructive/80 text-lg"
                  >
                    ×
                  </button>
                  <p className="text-destructive text-xs text-center pr-6">
                    エラー: {writeError.message}
                  </p>
                </Card>
              )}

              {/* Recent Activity */}
              {logs.length > 0 && (
                <div className="w-full max-w-sm space-y-3">
                  <h3 className="text-sm font-semibold text-foreground text-center">最近の記録</h3>
                  <div className="space-y-2">
                    {logs.slice(0, 3).map((log) => (
                      <Card key={log.id} className="p-3 bg-card/50 border-primary/10">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-xs text-card-foreground">
                              {new Date(log.date).toLocaleDateString('ja-JP')}
                            </span>
                            <span className="text-xs text-muted-foreground">{log.time}</span>
                          </div>
                          <span className="text-xs">{log.shampooed ? '🧴 シャンプー' : '💜 パス'}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="flex flex-col items-center space-y-4 pb-20">
              <div className="text-center space-y-2 mt-4">
                <h2 className="text-xl font-bold text-primary">カレンダー</h2>
                <p className="text-sm text-muted-foreground">シャンプーの記録を確認できます</p>
              </div>
              <Calendar isWalletConnected={isConnected} />
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm border-t border-border">
          <div className="w-full max-w-md mx-auto px-4 py-2">
            <div className="flex justify-center space-x-8">
              <button
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-colors ${
                  activeTab === 'home'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="text-lg">🏠</div>
                <span className="text-xs font-medium">ホーム</span>
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                disabled={!isConnected}
                className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-colors ${
                  activeTab === 'calendar'
                    ? 'bg-primary text-primary-foreground'
                    : isConnected
                    ? 'text-muted-foreground hover:text-foreground'
                    : 'text-muted-foreground/30 cursor-not-allowed'
                }`}
              >
                <div className="text-lg">📅</div>
                <span className="text-xs font-medium">カレンダー</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="pb-24 pt-8 flex justify-center">
          <div className="text-muted-foreground text-xs">
            Built on Base with MiniKit by{' '}
            <button
              onClick={() => openUrl('https://drive.google.com/file/d/1kDDqzAfebtTaRHpgU6YrQSdtBuyUZzZK/view?usp=sharing')}
              className="text-primary hover:text-primary/80 underline"
            >
              UdonSunagimo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
