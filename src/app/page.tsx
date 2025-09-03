"use client"

import { useState, useEffect } from "react"
import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SHAMPOO_TRACKER_ABI, CONTRACT_ADDRESSES } from '../lib/contract'
import { saveNoShampooRecord, getTodayDateString } from '../lib/localStorage'
import WalletButton from '../components/WalletButton'

interface ShampooLog {
  id: number
  date: string
  time: string
  shampooed: boolean
}

export default function ShampooTracker() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const chainId = useChainId()
  
  const [logs, setLogs] = useState<ShampooLog[]>([
    { id: 1, date: "2024-01-15", time: "19:30", shampooed: true },
    { id: 2, date: "2024-01-14", time: "20:15", shampooed: false },
    { id: 3, date: "2024-01-13", time: "18:45", shampooed: true },
  ])
  const [activeTab, setActiveTab] = useState("home")
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showNoShampooPopup, setShowNoShampooPopup] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showError, setShowError] = useState(false)

  const { 
    writeContract, 
    data: hash, 
    isPending: isWritePending,
    error: writeError 
  } = useWriteContract()
  
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({
    hash,
  })

  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  // エラー表示の管理
  useEffect(() => {
    if (writeError) {
      setShowError(true)
    }
  }, [writeError])

  const handleConnect = () => {
    const coinbaseConnector = connectors.find(connector => 
      connector.name.toLowerCase().includes('coinbase')
    )
    if (coinbaseConnector) {
      connect({ connector: coinbaseConnector })
    }
  }

  const handleShampooAction = async (shampooed: boolean) => {
    const today = getTodayDateString()
    const now = new Date()
    const timeString = now.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    
    if (shampooed) {
      // ブロックチェーンに記録
      if (!isConnected) {
        handleConnect()
        return
      }

      if (!address || !contractAddress) return

      try {
        writeContract({
          address: contractAddress as `0x${string}`,
          abi: SHAMPOO_TRACKER_ABI,
          functionName: 'recordShampoo',
        })
      } catch (error) {
        console.error('Error recording shampoo:', error)
      }
    } else {
      // ローカルに記録
      saveNoShampooRecord({
        date: today,
        reason: '今日はシャンプーしなかった'
      })
      
      // 「生きててえらい」ポップアップ
      setShowNoShampooPopup(true)
    }

    const newLog = {
      id: logs.length + 1,
      date: today,
      time: timeString,
      shampooed,
    }
    setLogs([newLog, ...logs.slice(0, 2)]) // Keep only last 3 logs
  }

  // Show success message when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      const messages = [
        "ブロックチェーンに記録されました！",
        "永続的に保存されたよ！",
        "Web3でシャンプー記録完了！",
        "清潔な髪、清潔な気持ち！",
        "シャンプーしてえらい！",
        "髪がいい匂いになったね！",
        "ピカピカで可愛い！"
      ]
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      setSuccessMessage(randomMessage)
      setShowSuccessPopup(true)
    }
  }, [isConfirmed])

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
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

      {/* Header with Wallet Button */}
      <header className="flex justify-end items-center p-4">
        <WalletButton />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
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
            {logs.map((log) => (
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

      {/* Bottom Navigation */}
      <div className="bg-card/80 backdrop-blur-sm border-t border-border p-4">
        <div className="flex justify-center space-x-8">
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
            className="flex flex-col items-center space-y-1 px-4 py-2 rounded-xl text-muted-foreground opacity-50 cursor-not-allowed"
          >
            <div className="text-xl">📅</div>
            <span className="text-xs font-medium">カレンダー</span>
          </button>
        </div>
      </div>
    </div>
  )
}
