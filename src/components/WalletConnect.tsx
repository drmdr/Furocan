'use client'

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'

export default function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const isCorrectNetwork = chainId === base.id || chainId === baseSepolia.id

  if (isConnected) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <p className="text-sm text-gray-600">接続済み</p>
          <p className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
        
        {!isCorrectNetwork && (
          <div className="text-center">
            <p className="text-red-600 text-sm mb-2">
              Baseネットワークに切り替えてください
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => switchChain({ chainId: base.id })}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Base Mainnet
              </button>
              <button
                onClick={() => switchChain({ chainId: baseSepolia.id })}
                className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Base Sepolia
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          切断
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800">ウォレットを接続</h3>
      <p className="text-sm text-gray-600 text-center">
        シャンプー記録をブロックチェーンに保存するには<br />
        ウォレットの接続が必要です
      </p>
      
      <div className="flex flex-col gap-2 w-full">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? '接続中...' : `${connector.name}で接続`}
          </button>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 text-center">
        Baseネットワークでの使用を推奨します
      </p>
    </div>
  )
}