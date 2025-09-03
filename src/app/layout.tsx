import type React from "react"
import type { Metadata } from "next"
import { Hachi_Maru_Pop } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import "./globals.css"
import { Providers } from './providers'

const hachiMaruPop = Hachi_Maru_Pop({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-hachi-maru-pop",
  display: "swap",
})

export const metadata: Metadata = {
  title: "風呂キャン止めるくん - Shampoo Tracker",
  description: "シャンプー習慣をブロックチェーンで記録するBase Mini App",
  generator: "v0.app",
  manifest: "/manifest.json",
  openGraph: {
    title: "風呂キャン止めるくん",
    description: "シャンプー習慣をブロックチェーンで記録するBase Mini App",
    url: "https://furocan.vercel.app",
    siteName: "風呂キャン止めるくん",
    images: [
      {
        url: "/splash.svg",
        width: 1200,
        height: 630,
        alt: "風呂キャン止めるくん - Shampoo Tracker",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "風呂キャン止めるくん",
    description: "シャンプー習慣をブロックチェーンで記録するBase Mini App",
    images: ["/splash.svg"],
  },
  other: {
    // Farcaster Frame metadata
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://furocan.vercel.app/splash.svg',
    'fc:frame:button:1': 'シャンプー記録を開始',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://furocan.vercel.app',
    'fc:frame:post_url': 'https://furocan.vercel.app/api/frame',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`${hachiMaruPop.variable} ${GeistMono.variable} font-sans`}>
        <Providers>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}
