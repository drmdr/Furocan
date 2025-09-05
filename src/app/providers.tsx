'use client'

import { MiniKitProvider } from '@coinbase/onchainkit/minikit'
import { base, baseSepolia } from 'wagmi/chains'

export function Providers({ children }: { children: React.ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY ?? process.env.NEXT_PUBLIC_CDP_CLIENT_API_KEY
  const chain = process.env.NEXT_PUBLIC_CHAIN === 'base' ? base : baseSepolia

  return (
    <MiniKitProvider apiKey={apiKey} chain={chain}>
      {children}
    </MiniKitProvider>
  )
}
