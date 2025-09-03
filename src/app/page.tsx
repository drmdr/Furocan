'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { 
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from '@coinbase/onchainkit/minikit'
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from '@coinbase/onchainkit/identity'
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { SHAMPOO_TRACKER_ABI, CONTRACT_ADDRESSES } from '../lib/contract'
import { saveNoShampooRecord, addToShampooLogs, getShampooLogs, type ShampooLog } from '../lib/localStorage'

export default function Page() {
  const { setFrameReady, isFrameReady, context } = useMiniKit()
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  
  const [frameAdded, setFrameAdded] = useState(false)
  const [activeTab, setActiveTab] = useState<"home" | "calendar">("home")
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showNoShampooPopup, setShowNoShampooPopup] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showError, setShowError] = useState(false)
  const [logs, setLogs] = useState<ShampooLog[]>([])

  const addFrame = useAddFrame()
  const openUrl = useOpenUrl()
  const { writeContract, isPending: isWritePending, error: writeError } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt()

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady()
    }
  }, [setFrameReady, isFrameReady])

  useEffect(() => {
    setLogs(getShampooLogs())
  }, [])

  useEffect(() => {
    if (writeError) {
      setShowError(true)
    }
  }, [writeError])

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame()
    setFrameAdded(Boolean(frameAdded))
  }, [addFrame])

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-primary p-2"
        >
          + Save Frame
        </Button>
      )
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-primary animate-fade-out">
          <span>✓ Saved</span>
        </div>
      )
    }

    return null
  }, [context, frameAdded, handleAddFrame])

  const handleShampooAction = async (shampooed: boolean) => {
    if (shampooed) {
      if (!isConnected || !contractAddress) {
        alert('ウォレットを接続してください')
        return
      }

      try {
        await writeContract({
          address: contractAddress as `0x${string}`,
          abi: SHAMPOO_TRACKER_ABI,
          functionName: 'recordShampoo',
        })

        // ローカルログにも追加
        addToShampooLogs(true)
        setLogs(getShampooLogs())

        // ランダムな成功メッセージ
        const messages = [
          '今日もお疲れさま！',
          'きれいになったね！',
          'さっぱりした？',
          'いい香り〜',
          'お風呂えらい！'
        ]
        const randomMessage = messages[Math.floor(Math.random() * messages.length)]
        setSuccessMessage(randomMessage)
        setShowSuccessPopup(true)
      } catch (error) {
        console.error('Transaction failed:', error)
      }
    } else {
      // 非シャンプー記録（ローカルストレージ）
      saveNoShampooRecord()
      setLogs(getShampooLogs())
      
      // 「生きててえらい」ポップアップ
      setShowNoShampooPopup(true)
    }
  }

  return (
    <div className="flex flex-col min-h-screen font-sans text-foreground mini-app-theme from-background to-muted">
      <div className="w-full max-w-md mx-auto px-4 py-3">
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
              <div className="text-4xl mb-2">🎉</div>
              <p className="font-bold text-lg">{successMessage}</p>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="mt-4 px-4 py-2 bg-primary-foreground text-primary rounded-lg hover:bg-primary-foreground/90 transition-colors"
              >
                閉じる
              </button>
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
              <p className="font-bold text-lg">生きててえらい！</p>
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
        <header className="flex justify-between items-center mb-3 h-11">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🧴</span>
            <span className="text-sm text-muted-foreground">風呂キャン止めるくん</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Wallet className="z-10">
              <ConnectWallet>
                <Name className="text-inherit" />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
            {saveFrameButton}
          </div>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center p-4 border-b border-border/10">
          <div className="flex bg-card/30 rounded-2xl p-1 space-x-1">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-colors ${
                activeTab === "home"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="text-xl">🏠</div>
              <span className="text-xs font-medium">ホーム</span>
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-colors ${
                activeTab === "calendar"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="text-xl">📅</div>
              <span className="text-xs font-medium">カレンダー</span>
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          {activeTab === "home" && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 p-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-primary font-sans">風呂キャン止めるくん</h1>
              </div>

              {/* Anime Girl Placeholder */}
              <div className="relative">
                <div className="w-48 h-48 bg-card rounded-full flex items-center justify-center border-4 border-primary/20">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-6xl">🧴</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full max-w-sm">
                <Button
                  onClick={() => handleShampooAction(true)}
                  disabled={isWritePending || isConfirming}
                  className="flex-1 h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-xl"
                >
                  {isWritePending && '署名待ち...'}
                  {isConfirming && '記録中...'}
                  {!isWritePending && !isConfirming && 'シャンプーした！'}
                </Button>
                <Button
                  onClick={() => handleShampooAction(false)}
                  variant="outline"
                  className="flex-1 h-14 text-base font-semibold bg-transparent border-2 border-primary text-primary hover:bg-primary/10 rounded-2xl shadow-xl"
                >
                  今日はパス
                </Button>
              </div>

              {/* Network Warning */}
              {isConnected && !contractAddress && (
                <Card className="w-full max-w-sm p-4 bg-destructive/10 border-destructive/20">
                  <p className="text-destructive text-sm text-center">
                    ⚠️ Base または Base Sepolia ネットワークに切り替えてください
                  </p>
                </Card>
              )}

              {/* Error Display with Close Button */}
              {showError && writeError && (
                <Card className="w-full max-w-sm p-4 bg-destructive/10 border-destructive/20 relative">
                  <button
                    onClick={() => setShowError(false)}
                    className="absolute top-2 right-2 text-destructive hover:text-destructive/80 text-xl"
                  >
                    ×
                  </button>
                  <p className="text-destructive text-sm text-center pr-6">
                    エラー: {writeError.message}
                  </p>
                </Card>
              )}

              {/* Recent Logs */}
              <div className="w-full max-w-sm space-y-3">
                <h3 className="text-lg font-semibold text-foreground text-center">最近の記録</h3>
                <div className="space-y-2">
                  {logs.slice(0, 5).map((log) => (
                    <Card key={log.id} className="p-3 bg-card/30 border-primary/10">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm text-card-foreground">
                            {new Date(log.date).toLocaleDateString('ja-JP')}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {log.time}
                          </span>
                        </div>
                        <span className="text-sm">
                          {log.shampooed ? "🧴 シャンプーした" : "パス"}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-primary font-sans mb-4">カレンダー機能</h2>
                <p className="text-muted-foreground">近日公開予定</p>
              </div>
            </div>
          )}
        </main>

        <footer className="mt-2 pt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  )
}