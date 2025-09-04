# Farcaster Mini App デプロイメント進捗

## 📅 更新日時
2025年3月9日

## 🎯 プロジェクト概要
**風呂キャン止めるくん** - シャンプー習慣をブロックチェーンで記録するFarcaster Mini App

- **デプロイURL**: https://furocan.vercel.app
- **リポジトリ**: https://github.com/drmdr/Furocan.git

## ✅ 完了済みタスク

### 1. Vercel デプロイメント設定
- ✅ `vercel.json` 設定ファイル作成
- ✅ Next.jsプロジェクトのVercelデプロイ
- ✅ 安定したHTTPS URL取得: `https://furocan.vercel.app`

### 2. 環境変数設定
- ✅ Farcaster Mini App必須環境変数を追加:
  - `NEXT_PUBLIC_URL`: `https://furocan.vercel.app`
  - `NEXT_PUBLIC_IMAGE_URL`: `https://furocan.vercel.app/icon.svg`
  - `NEXT_PUBLIC_SPLASH_IMAGE_URL`: `https://furocan.vercel.app/splash.svg`
  - `NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR`: `#4F46E5`
- ✅ `.env.local` と `.env.example` ファイル更新

### 3. アプリアイコン・画像作成
- ✅ `public/icon.svg` - アプリアイコン作成
- ✅ `public/splash.svg` - スプラッシュ画像作成
- ✅ 風呂キャンテーマのデザイン（シャンプーボトル + 泡）

### 4. Farcaster Manifest実装
- ✅ `/.well-known/farcaster.json` エンドポイント作成
- ✅ `src/app/.well-known/farcaster.json/route.ts` 実装
- ✅ accountAssociation と frame 設定を含むmanifest構造
- ✅ テスト用に `noindex: true` 設定

### 5. Frame Metadata設定
- ✅ `layout.tsx` にFarcaster Frame用メタデータ追加
- ✅ 埋め込み表示用の `fc:frame` メタデータ設定
- ✅ リッチな共有体験用の設定

### 6. API エンドポイント作成
- ✅ `/api/webhook` - Farcaster webhook処理用
- ✅ `/api/frame` - Frame interaction処理用
- ✅ 基本的なエラーハンドリング実装

### 7. Git管理
- ✅ 全変更をコミット・プッシュ完了
- ✅ `.gitignore` に `.env` ファイル追加

## ⚠️ 進行中・次のタスク

### 8. Farcaster Account Association（現在のステップ）
- 🔄 **進行中**: `npx create-onchain --manifest` 実行中
- ❌ **課題**: Farcaster custody walletでの署名が必要
- 📝 **必要な作業**:
  1. Farcasterアプリから Recovery Phrase を取得
  2. Custody walletをMetaMaskにインポート
  3. `npx create-onchain --manifest` を再実行
  4. 生成された環境変数を設定:
     - `FARCASTER_HEADER`
     - `FARCASTER_PAYLOAD` 
     - `FARCASTER_SIGNATURE`

## 🔜 残りのタスク

### 9. Vercel環境変数設定
```bash
vercel env add NEXT_PUBLIC_CDP_CLIENT_API_KEY
vercel env add FARCASTER_HEADER
vercel env add FARCASTER_PAYLOAD
vercel env add FARCASTER_SIGNATURE
```

### 10. API Key取得
- [ ] Coinbase Developer Platform: https://portal.cdp.coinbase.com/
- [ ] `NEXT_PUBLIC_CDP_CLIENT_API_KEY` の実際の値を取得

### 11. テスト・検証
- [ ] `https://furocan.vercel.app/.well-known/farcaster.json` でJSON出力確認
- [ ] Farcasterでの埋め込み表示テスト
- [ ] Mini Appの動作確認

### 12. 本番準備
- [ ] テスト完了後、manifest内の `noindex: false` に変更
- [ ] 最終デプロイ

## 📋 公式ドキュメント準拠状況

### ✅ Deploy (完了)
- Vercel CLI インストール済み
- デプロイ完了: `https://furocan.vercel.app`
- 環境変数設定済み

### 🔄 Create Manifest (進行中)
- CLI実行中: `npx create-onchain --manifest`
- **課題**: Farcaster custody wallet署名待ち
- /.well-known/farcaster.json 実装済み
- Frame metadata 設定済み

### ⏳ 次のステップ
- Manifest完成後のテスト
- 本番環境への最終デプロイ

## 🚨 重要な注意事項
1. **Farcaster Custody Wallet**: 通常の取引用ウォレットではなく、Farcasterアカウントの管理ウォレットが必要
2. **Recovery Phrase**: Farcaster Settings → Advanced から取得
3. **環境変数**: 生成後は必ずVercelに設定
4. **テスト**: 本番前に必ず `.well-known/farcaster.json` の動作確認

## 📞 次回作業時の手順
1. Farcaster custody walletの設定
2. `npx create-onchain --manifest` の完了
3. 生成された環境変数のVercel設定
4. エンドポイントテスト
5. 最終デプロイ