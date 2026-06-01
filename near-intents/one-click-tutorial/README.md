# NEAR Intents 1-Click チュートリアル

これは、1-Click API を通じて NEAR Intents を学ぶためのスクリプト形式のチュートリアルです。

プロトコルの仕組みを UI の裏側に隠すことなく理解することが目的です。各スクリプトは1つのコンセプトに対応しています：

1. サポートされているトークンと `assetId` の値を調べる。
2. ドライラン（試算）の見積もりをリクエストする。
3. デポジットアドレス付きのライブ見積もりをリクエストする。
4. （任意）少量の NEAR をデポジットする。
5. デポジットのトランザクションハッシュを送信する。
6. スワップのステータスをポーリングする。

## なぜ 1-Click から始めるのか？

NEAR Intents を使うと、ブリッジ・ソルバー・決済を手動で調整する代わりに、「トークン A を持っていて、この送付先でトークン B が欲しい」というゴールを宣言するだけで済みます。1-Click API はシンプルな REST エンドポイントでこのライフサイクルを公開しているため、初心者にとって最も取り組みやすい入口です。

NEAR Intents には現在テストネットがありません。まずはドライランモードを使ってください。実際のスワップを行う場合は、失っても構わないごく少額に留めてください。

## セットアップ

```sh
cd near-intents/one-click-tutorial
pnpm install
cp .env.example .env
```

`.env` の各フィールドを理解してから編集してください。`pnpm walkthrough` と `pnpm quote:dry` は秘密鍵なしで実行できます。

## コマンド

```sh
pnpm tokens
pnpm quote:dry
pnpm walkthrough
```

これらは安全な学習用コマンドです。

```sh
pnpm quote:live
```

これは実際の時間制限付きデポジットアドレスを作成しますが、資金の移動は行いません。

```sh
pnpm deposit:near
pnpm submit
pnpm status
```

これらは任意の実スワップ用コマンドです。`deposit:near` は以下の条件を全て満たさない限り実行を拒否します：

- `SENDER_NEAR_ACCOUNT` が設定されている
- `SENDER_PRIVATE_KEY` が設定されている
- `REAL_SWAP_CONFIRM=I_UNDERSTAND_NEAR_INTENTS_HAS_NO_TESTNET` が設定されている
- 最新の見積もりが `ORIGIN_ASSET=nep141:wrap.near` を使用している

## 概念モデル

`tokens` で学べること：

- `assetId` はトークンの正式な識別子です。
- トークンの小数点以下の桁数（decimals）が、`/v0/quote` に送る最小単位の金額を決定します。

`quote:dry` で学べること：

- `dry: true` にすると、デポジットアドレスを作成せずにルートと出力をプレビューできます。
- `EXACT_INPUT` は入力金額を固定し、出力はスリッページの範囲内で変動します。

`quote:live` で学べること：

- `dry: false` にすると `depositAddress`、任意の `depositMemo`、および期限が返されます。
- 署名とコリレーション ID はトラブルシューティングの証拠になるため、見積もり全体を必ず保存してください。

`deposit:near` で学べること：

- スワップはオリジンチェーンへのデポジットが届いた時点で開始されます。
- このチュートリアルは NEAR オリジンのデポジットのみ自動化しています。他のチェーンからのデポジットには、そのチェーン固有のウォレットコードが必要です。

`status` で学べること：

- `PENDING_DEPOSIT`：デポジット待ち。
- `KNOWN_DEPOSIT_TX`：デポジットを検出済み。
- `PROCESSING`：スワップを実行中。
- `SUCCESS`：送付先に資金が届いた。
- `INCOMPLETE_DEPOSIT`、`REFUNDED`、`FAILED`：終端の失敗・返金状態。

## 設定

重要な `.env` フィールド：

- `ONE_CLICK_API_KEY`：任意ですが設定を推奨します。
- `ORIGIN_ASSET`：デフォルトは `nep141:wrap.near`。
- `DESTINATION_ASSET`：`pnpm tokens` を使って有効な値を選んでください。
- `AMOUNT`：人間が読める形式のオリジン金額。トークンの decimals を使って変換されます。
- `RECIPIENT`：`DESTINATION_ASSET` に対応する送付先チェーンのアドレス。
- `REFUND_TO`：オリジンチェーンの返金先アドレス。
- `SENDER_NEAR_ACCOUNT`、`SENDER_PRIVATE_KEY`：実際の NEAR デポジット時のみ必要。

## 検証

```sh
pnpm lint
pnpm typecheck
pnpm test
```

`pnpm lint` は Biome によるフォーマット・import 整理・lint を確認します。整形を適用する場合は `pnpm format`、lint の自動修正まで含める場合は `pnpm lint:fix` を使ってください。

テストは金額変換・実スワップの安全ゲート・ステータスの説明をカバーしています。

## 参考リンク

- 公式サンプルリポジトリ：https://github.com/near-examples/near-intents-examples
- 1-Click API ドキュメント：https://docs.near-intents.org/integration/distribution-channels/1click-api/about-1click-api
- クイックスタート：https://docs.near-intents.org/integration/distribution-channels/1click-api/quickstart
