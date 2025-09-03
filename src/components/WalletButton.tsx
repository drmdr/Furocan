'use client'


import { 
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet'

export default function WalletButton() {
  return (
    <div className="flex justify-end">
      <Wallet>
        <ConnectWallet className="bg-transparent border border-red-500 text-red-500 rounded-full hover:bg-red-500/10 hover:border-red-400 transition-all duration-200 px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="font-medium">未接続</span>
          </div>
        </ConnectWallet>
        <WalletDropdown className="bg-black/90 backdrop-blur-sm border border-pink-500/30 rounded-xl shadow-xl">
          <div className="p-4">
            <div className="text-pink-200 text-sm mb-2">接続中</div>
            <WalletDropdownLink 
              icon="wallet" 
              href="https://wallet.coinbase.com"
              className="text-white hover:text-pink-300 transition-colors"
            >
              ウォレットを開く
            </WalletDropdownLink>
            <WalletDropdownDisconnect className="w-full px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm mt-2" />
          </div>
        </WalletDropdown>
      </Wallet>
    </div>
  )
}