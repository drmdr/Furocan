'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { OnchainKitProvider } from '@coinbase/onchainkit'
import { MiniKitProvider } from '@coinbase/onchainkit/minikit'
import { base, baseSepolia } from 'wagmi/chains'
import { config } from '../lib/wagmi'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* OnchainKitProvider is optional when using MiniKitProvider, but safe to keep. */}
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY ?? process.env.NEXT_PUBLIC_CDP_CLIENT_API_KEY}
          chain={process.env.NEXT_PUBLIC_CHAIN === 'base' ? base : baseSepolia}
        >
          {/* Pass apiKey to MiniKitProvider per official docs */}
          <MiniKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY ?? process.env.NEXT_PUBLIC_CDP_CLIENT_API_KEY}
            chain={process.env.NEXT_PUBLIC_CHAIN === 'base' ? base : baseSepolia}
          >
            {children}
          </MiniKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
