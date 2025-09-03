'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useConnect } from 'wagmi'
import { SHAMPOO_TRACKER_ABI, CONTRACT_ADDRESSES } from '../lib/contract'

export default function ShampooRecorder() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const chainId = useChainId()
  const [showSuccess, setShowSuccess] = useState(false)
  
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

  // Get contract address for current chain
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  const handleConnect = () => {
    const coinbaseConnector = connectors.find(connector => 
      connector.name.toLowerCase().includes('coinbase')
    )
    if (coinbaseConnector) {
      connect({ connector: coinbaseConnector })
    }
  }

  const handleRecordShampoo = async () => {
    // If not connected, trigger connection first
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
  }

  // Show success message when transaction is confirmed
  if (isConfirmed && !showSuccess) {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="space-y-4">
      {/* Success Message */}
      {showSuccess && (
        <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl text-center backdrop-blur-sm animate-pulse">
          <p className="text-green-300 text-lg font-semibold mb-1">
            🎉 シャンプーしてえらい！
          </p>
          <p className="text-green-200 text-sm">
            ブロックチェーンに記録されました✨
          </p>
        </div>
      )}

      {/* Shampoo Record Button */}
      <div className="p-6 bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm border border-pink-500/30 rounded-2xl">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🧴</div>
          <h2 className="text-xl font-bold text-white mb-2">
            今日シャンプーした？
          </h2>
          <p className="text-pink-200 text-sm">
            ブロックチェーンに永続記録
          </p>
        </div>
        
        <button
          onClick={handleRecordShampoo}
          disabled={isWritePending || isConfirming}
          className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg font-bold rounded-xl hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
        >
          {isWritePending && '署名待ち...'}
          {isConfirming && '記録中...'}
          {!isWritePending && !isConfirming && (
            isConnected ? '🧴 シャンプーした！' : '🧴 シャンプーした！（接続）'
          )}
        </button>
        
        {!isConnected && (
          <p className="text-pink-300 text-xs mt-2 text-center">
            ※ ウォレット接続が必要です
          </p>
        )}
      </div>

      {/* Network Warning */}
      {isConnected && !contractAddress && (
        <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-2xl backdrop-blur-sm">
          <p className="text-yellow-300 text-sm text-center">
            ⚠️ Base または Base Sepolia ネットワークに切り替えてください
          </p>
        </div>
      )}

      {/* Error Display */}
      {writeError && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-2xl backdrop-blur-sm">
          <p className="text-red-300 text-sm text-center">
            エラー: {writeError.message}
          </p>
        </div>
      )}

      {/* Transaction Hash */}
      {hash && (
        <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-2xl backdrop-blur-sm">
          <p className="text-blue-300 text-sm text-center">
            トランザクション: 
            <span className="font-mono ml-1 text-blue-200">
              {hash.slice(0, 10)}...{hash.slice(-8)}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}