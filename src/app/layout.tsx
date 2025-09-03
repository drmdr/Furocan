import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import "./globals.css"
import { Providers } from './providers'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
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
        url: "/og-image.png",
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
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`font-sans ${poppins.variable} ${GeistMono.variable}`}>
        <Providers>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}
