# 🧴 風呂キャン止めるくん

シャンプー習慣をブロックチェーンで記録するBase Mini App

## 機能

- ✅ ウォレット接続（MetaMask、Coinbase Wallet、WalletConnect）
- ✅ シャンプー記録をブロックチェーンに保存
- ✅ シャンプーしなかった日をローカルストレージに記録
- 🚧 カレンダー表示（今後実装予定）

## 技術スタック

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Blockchain**: Base Network, Solidity
- **Web3**: wagmi, viem
- **Development**: Hardhat

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# テスト実行
npm test
```

## デプロイ

このアプリはVercelにデプロイされています。

## コントラクト

ShampooTrackerコントラクトはBase Sepoliaテストネットにデプロイされています。

## ライセンス

MIT