'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { SHAMPOO_TRACKER_ABI, CONTRACT_ADDRESSES } from '../lib/contract'

export default function ShampooRecorder() {
  const { address, isConnected } = useAccount()
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

  const handleRecordShampoo = async () => {
    if (!isConnected || !address || !contractAddress) return

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

  if (!isConnected) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg text-center">
        <p className="text-gray-600">ウォレットを接続してシャンプーを記録しましょう</p>
      </div>
    )
  }

  if (!contractAddress) {
    return (
      <div className="p-6 bg-yellow-100 rounded-lg text-center">
        <p className="text-yellow-800">
          このネットワークではコントラクトが利用できません。<br />
          Base または Base Sepolia に切り替えてください。
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="p-4 bg-green-100 border border-green-400 rounded-lg text-center animate-bounce">
          <p className="text-green-800 text-lg font-semibold">
            🎉 シャンプーしてえらい！
          </p>
          <p className="text-green-600 text-sm">
            ブロックチェーンに記録されました
          </p>
        </div>
      )}

      {/* Shampoo Record Button */}
      <div className="p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          今日のシャンプー記録
        </h2>
        
        <button
          onClick={handleRecordShampoo}
          disabled={isWritePending || isConfirming}
          className="w-full py-4 px-6 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isWritePending && '署名待ち...'}
          {isConfirming && '記録中...'}
          {!isWritePending && !isConfirming && '🧴 今日シャンプーした！'}
        </button>
        
        <p className="text-sm text-gray-500 mt-2">
          ブロックチェーンに永続的に記録されます
        </p>
      </div>

      {/* Error Display */}
      {writeError && (
        <div className="p-4 bg-red-100 border border-red-400 rounded-lg">
          <p className="text-red-800 text-sm">
            エラーが発生しました: {writeError.message}
          </p>
        </div>
      )}

      {/* Transaction Hash */}
      {hash && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-sm">
            トランザクション: 
            <span className="font-mono ml-1">
              {hash.slice(0, 10)}...{hash.slice(-8)}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}