# Intent Atlas

NEAR Intents 1Click SDKをReactから学ぶための、dry-run専用クロスチェーン見積りアプリです。

## 現在の機能

- 1Click SDKから対応トークンを取得
- チェーン・シンボル・assetIdによる資産検索
- 人間向け金額からbase unitsへの安全な変換
- 入力debounce付き `dry: true` 見積り
- 受取見込み、最小受取量、推定時間、correlation IDの表示
- JWTをブラウザへ露出しないNode.js BFF
- PC・モバイル対応UI

このフェーズでは資金を移動しません。ライブ見積り、ウォレット署名、デポジット、
ステータス追跡は次フェーズで追加します。

## セットアップ

```sh
cd near-intents/react-one-click-tutorial
pnpm install
cp .env.example .env
pnpm dev
```

- Web: http://localhost:5173
- API: http://localhost:8787

`ONE_CLICK_JWT` は任意ですが、Quote APIが認証を要求する環境では
[NEAR Intents Partners Portal](https://partners.near-intents.org/) から取得して
`.env` に設定してください。`VITE_*` 変数には設定しないでください。

## 検証

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## 構成

```text
apps/web       React + Vite + TanStack Query
apps/api       Hono + 1Click TypeScript SDK
packages/shared  Zod schema、金額変換、共有型
```
