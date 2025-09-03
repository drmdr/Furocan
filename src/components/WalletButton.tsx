'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleConnect = () => {
    const coinbaseConnector = connectors.find(connector => 
      connector.name.toLowerCase().includes('coinbase')
    )
    if (coinbaseConnector) {
      connect({ connector: coinbaseConnector })
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-lg"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-medium">{formatAddress(address)}</span>
        </button>
        
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-sm border border-pink-500/30 rounded-xl shadow-xl z-50">
            <div className="p-4">
              <div className="text-pink-200 text-sm mb-2">接続中</div>
              <div className="text-white font-mono text-xs mb-4 break-all">
                {address}
              </div>
              <button
                onClick={() => {
                  disconnect()
                  setShowDropdown(false)
                }}
                className="w-full px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
              >
                切断
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      className="flex items-center space-x-2 px-4 py-2 bg-black/40 backdrop-blur-sm border border-pink-500/30 text-pink-300 rounded-full hover:bg-pink-500/20 hover:border-pink-400 transition-all duration-200"
    >
      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
      <span className="font-medium">未接続</span>
    </button>
  )
}