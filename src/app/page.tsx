"use client"

import { useState } from "react"
import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SHAMPOO_TRACKER_ABI, CONTRACT_ADDRESSES } from '../lib/contract'
import { saveNoShampooRecord, getTodayDateString, getNoShampooRecordForDate } from '../lib/localStorage'
import WalletButton from '../components/WalletButton'

interface ShampooLog {
  id: number
  date: string
  shampooed: boolean
}

export default function ShampooTracker() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const chainId = useChainId()
  
  const [logs, setLogs] = useState<ShampooLog[]>([
    { id: 1, date: "2024-01-15", shampooed: true },
    { id: 2, date: "2024-01-14", shampooed: false },
    { id: 3, date: "2024-01-13", shampooed: true },
  ])
  const [message, setMessage] = useState("今日の髪の調子はどう？ ✨")
  const [activeTab, setActiveTab] = useState("home")

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
    }

    const newLog = {
      id: logs.length + 1,
      date: today,
      shampooed,
    }
    setLogs([newLog, ...logs.slice(0, 2)]) // Keep only last 3 logs

    if (shampooed) {
      const messages = [
        "シャンプーしてえらい！ ✨",
        "髪がいい匂いになったね！ 🌸",
        "清潔な髪、清潔な気持ち！ 💕",
        "ピカピカで可愛い！ ✨",
      ]
      setMessage(messages[Math.floor(Math.random() * messages.length)])
    } else {
      const messages = [
        "生きててえらい！ 💜",
        "明日は新しい日～ 🌙",
        "セルフケアにはいろんな形があるよ ✨",
        "そのままで完璧だよ！ 💕",
      ]
      setMessage(messages[Math.floor(Math.random() * messages.length)])
    }
  }

  // Show success message when transaction is confirmed
  if (isConfirmed) {
    const messages = [
      "ブロックチェーンに記録されました！ ✨",
      "永続的に保存されたよ！ 🌸",
      "Web3でシャンプー記録完了！ 💕",
    ]
    setMessage(messages[Math.floor(Math.random() * messages.length)])
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Wallet Button */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">🧴</span>
          </div>
          <h1 className="text-foreground font-bold text-xl">風呂キャン止めるくん</h1>
        </div>
        <WalletButton />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary font-sans">Shampoo Tracker</h1>
          <p className="text-muted-foreground text-sm">あなたのヘアケアの旅を記録しよう ✨</p>
        </div>

        {/* Anime Girl Placeholder */}
        <div className="relative">
          <div className="w-48 h-48 bg-card rounded-full flex items-center justify-center border-4 border-primary/20">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-6xl">🧴</span>
            </div>
          </div>
          <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🌸</div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full max-w-sm">
          <Button
            onClick={() => handleShampooAction(true)}
            disabled={isWritePending || isConfirming}
            className="flex-1 h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg"
          >
            {isWritePending && '署名待ち...'}
            {isConfirming && '記録中...'}
            {!isWritePending && !isConfirming && (
              isConnected ? 'シャンプーした！ ✨' : 'シャンプーした！ ✨（接続）'
            )}
          </Button>
          <Button
            onClick={() => handleShampooAction(false)}
            variant="secondary"
            className="flex-1 h-14 text-lg font-semibold bg-muted hover:bg-muted/80 text-muted-foreground rounded-2xl shadow-lg"
          >
            今日はパス 💜
          </Button>
        </div>

        {/* Message Area */}
        <Card className="w-full max-w-sm p-4 bg-card/50 backdrop-blur-sm border-primary/20">
          <p className="text-center text-card-foreground font-medium">{message}</p>
        </Card>

        {/* Network Warning */}
        {isConnected && !contractAddress && (
          <Card className="w-full max-w-sm p-4 bg-destructive/10 border-destructive/20">
            <p className="text-destructive text-sm text-center">
              ⚠️ Base または Base Sepolia ネットワークに切り替えてください
            </p>
          </Card>
        )}

        {/* Error Display */}
        {writeError && (
          <Card className="w-full max-w-sm p-4 bg-destructive/10 border-destructive/20">
            <p className="text-destructive text-sm text-center">
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
                  <span className="text-sm text-card-foreground">
                    {new Date(log.date).toLocaleDateString('ja-JP')}
                  </span>
                  <span className="text-sm">
                    {log.shampooed ? "✨ シャンプーした" : "💜 パス"}
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
