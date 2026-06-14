# NEAR Intents React フロントエンド調査レポート

調査日: 2026-06-14

## 1. 結論

次の学習ステップでは、独自UIのReactアプリから **1Click Swap SDK** を利用する構成を推奨する。

- フロントエンド: React + TypeScript + Vite
- サーバー側API (BFF): Node.js + TypeScript
- 1Clickクライアント: `@defuse-protocol/one-click-sdk-typescript`
- 非同期状態管理: TanStack Query
- 最初のウォレット: NEAR Wallet Selector
- 次の段階: wagmi + viemでEVMチェーンを追加
- 入出力検証: Zod
- テスト: Vitest + React Testing Library、重要フローはPlaywright

1Click SDKはクロスチェーンスワップを高レベルに扱うSDKである。一方、
`@defuse-protocol/intents-sdk` はIntents内部残高、署名済みIntent、Transfer、
Withdrawalなどを扱う低レベルSDKであり、最初のReact教材としては範囲が広い。

公式React Widgetは短時間で完成品を組み込む用途には適するが、見積り、デポジット、
ステータス遷移を自分で実装して学ぶ目的には抽象度が高すぎる。この教材では参考実装
または比較対象として扱う。

## 2. NEAR Intentsの技術モデル

NEAR Intentsでは、ユーザーは実行経路ではなく「何を渡し、何を受け取りたいか」という
結果を指定する。1Click Swap APIはIntent作成、Market Makerとの調整、決済、失敗時の
返金処理をREST APIとして抽象化する。

基本フローは次の通り。

1. `/v0/tokens` から正式な `assetId` とdecimalsを取得する。
2. `dry: true` で見積りをプレビューする。
3. `dry: false` で期限付きの `depositAddress` を取得する。
4. ユーザーのウォレットから指定資産をデポジットする。
5. 任意でデポジットTxハッシュを送信し、検出を早める。
6. ステータスを終端状態までポーリングする。

主な状態:

| 状態 | 終端 | UIでの意味 |
| --- | --- | --- |
| `PENDING_DEPOSIT` | いいえ | ユーザーの入金待ち |
| `KNOWN_DEPOSIT_TX` | いいえ | 入金Txを検出済み |
| `PROCESSING` | いいえ | Solver/Market Makerが処理中 |
| `SUCCESS` | はい | 送付先へ着金済み |
| `INCOMPLETE_DEPOSIT` | はい | 必要額未満の入金 |
| `REFUNDED` | はい | 返金済み |
| `FAILED` | はい | 処理失敗 |

重要な制約:

- 2026-06-14時点で、1Click Swapに一般利用できるテストネットはない。
- 実取引の検証には、失っても問題ない最小額を使用する。
- `assetId` は手作業で組み立てず、必ず `/v0/tokens` の値を使用する。
- 金額はトークンの最小単位でAPIへ渡す。
- ライブ見積りの `depositAddress`、`depositMemo`、`deadline` をセットで保存する。
- Memoが必要なチェーンでは、アドレスだけでなくMemoも送金に含める。

## 3. SDKの選択肢

### 3.1 1Click Swap SDK: 今回の推奨

パッケージ:

```sh
pnpm add @defuse-protocol/one-click-sdk-typescript
```

公式リポジトリの `main` ブランチでは、調査時点のバージョンは `0.1.17`。
OpenAPIから生成された型と `OneClickService` を提供する。

主なAPI:

```ts
import {
  OneClickService,
  OpenAPI,
  QuoteRequest,
} from '@defuse-protocol/one-click-sdk-typescript';

OpenAPI.BASE = 'https://1click.chaindefuser.com';
OpenAPI.TOKEN = process.env.ONE_CLICK_JWT;

const tokens = await OneClickService.getTokens();
const quote = await OneClickService.getQuote(quoteRequest);
await OneClickService.submitDepositTx({ depositAddress, txHash });
const status = await OneClickService.getExecutionStatus(depositAddress);
```

SDKが担当するのは1Click APIとの通信である。ユーザーのウォレット接続と
`depositAddress` への送金は、オリジンチェーンごとにアプリ側で実装する。

### 3.2 Intents SDK: 発展教材向け

パッケージ:

```sh
pnpm add --save-exact @defuse-protocol/intents-sdk
```

用途:

- NEP-413またはERC-191によるIntent署名
- Intentの送信とSettlement待機
- Intents内部のTransfer
- Intents残高から外部チェーンへのWithdrawal

公式ドキュメントでは、Deposit機能は未実装で、ブリッジのインターフェースを直接使う
必要があるとされている。したがって、「外部ウォレットからクロスチェーンSwapを行う」
最初のReactアプリには1Click SDKの方が適している。

### 3.3 React Widget: 比較・短期導入向け

パッケージ:

```sh
pnpm add @aurora-is-near/intents-swap-widget
```

またはウォレット接続込みの:

```sh
pnpm add @aurora-is-near/intents-swap-widget-standalone
```

数行でSwap UIを埋め込める。ただし、APIライフサイクルとチェーン別送金処理がWidget内に
隠れるため、今回の学習目的では主実装にしない。

## 4. 推奨アーキテクチャ

```text
Browser
  React UI
    Token selector
    Amount / recipient form
    Wallet adapter
    Swap progress
        |
        | /api/tokens, /api/quote, /api/status, /api/deposit/submit
        v
Node BFF
  OneClick SDK
  JWT secret
  Request validation
        |
        v
1Click Swap API

Browser wallet
  └─ origin chain transaction ─> quote.depositAddress
```

BFFを置く最大の理由はJWTの保護である。公式ドキュメントはJWTを安全に保管し、
リポジトリへコミットしないよう求めている。Reactの `VITE_*` 環境変数はビルド成果物へ
埋め込まれるため、JWTの保存場所にはできない。

学習時に未認証リクエストを直接試す選択肢はあるが、公式ドキュメントでは未認証Swapに
0.2%のplatform feeがかかる。さらにSDK READMEはQuote、Submit、Statusを認証対象と
説明しており、ドキュメント間に表現差がある。このため、教材実装はBFF + JWTを標準とし、
未認証モードは明示的なオプションに留める。

## 5. 推奨技術スタック

| 領域 | 技術 | 採用理由 |
| --- | --- | --- |
| UI | React + TypeScript | 状態遷移の多いSwap UIを型安全に実装できる |
| Build | Vite | 独立した学習用SPAを小さく構成できる |
| API cache | TanStack Query | Tokensのキャッシュ、Quote更新、Status pollingに適する |
| BFF | Node.js + TypeScript | SDKと既存TypeScript教材を再利用しやすい |
| Validation | Zod | ブラウザ入力とBFF境界を実行時検証できる |
| NEAR wallet | NEAR Wallet Selector | NEARアカウント接続と署名Txに対応する |
| EVM wallet | wagmi + viem | EVM接続、native/ERC-20送金、チェーン切替を扱える |
| Unit test | Vitest + Testing Library | Vite/Reactとの統合が簡単 |
| E2E | Playwright | Quoteから署名直前、Status表示までをブラウザで検証できる |

Reduxなどの大域状態管理は初期段階では不要。サーバー状態はTanStack Query、フォームと
選択状態はReactのローカルstate、進行中Swapは小さなstate machineとして管理する。

## 6. Reactアプリの責務

### Token取得

- `/v0/tokens` の結果を5分程度キャッシュする。
- `blockchain`、`symbol`、`assetId` で選択肢を構成する。
- 同じsymbolでもチェーンが異なる資産を別物として表示する。
- `contractAddress` が `null` のnative assetを考慮する。

### Quote

- 入力中は `dry: true` のQuoteだけを取得する。
- debounceし、毎キー入力でリクエストしない。
- Swap確定ボタン押下後にだけ `dry: false` を作成する。
- `amountOut`、`minAmountOut`、所要時間、deadlineを確認画面に表示する。
- 古いQuoteの結果が新しい入力を上書きしないようquery keyへ全パラメータを含める。

### Deposit

- ライブQuote取得後、送金前にオリジンチェーンとウォレットチェーンを照合する。
- `amountIn` をそのまま使用し、表示値から再計算しない。
- native asset、ERC-20、NEP-141で送金処理を分離する。
- `depositMemo` がある場合はMemo対応ウォレット処理を必須にする。
- 署名拒否、期限切れ、残高不足を独立したエラーとして表示する。

### Status

- `depositAddress` と必要なら `depositMemo` でポーリングする。
- 終端状態でポーリングを停止する。
- `correlationId`、Quote、Tx hashをローカルに保存し、リロード後も追跡可能にする。
- `SUCCESS` 時はdestination transaction explorerへのリンクを表示する。

## 7. 最小サンプル設計

### BFFのQuote処理

```ts
import {
  OneClickService,
  OpenAPI,
  type QuoteRequest,
} from '@defuse-protocol/one-click-sdk-typescript';

OpenAPI.BASE = 'https://1click.chaindefuser.com';
OpenAPI.TOKEN = process.env.ONE_CLICK_JWT;

export async function createQuote(request: QuoteRequest) {
  return OneClickService.getQuote(request);
}
```

### ReactのStatus polling

```ts
import { useQuery } from '@tanstack/react-query';

const terminalStatuses = new Set([
  'SUCCESS',
  'INCOMPLETE_DEPOSIT',
  'REFUNDED',
  'FAILED',
]);

export function useSwapStatus(depositAddress?: string) {
  return useQuery({
    queryKey: ['swap-status', depositAddress],
    queryFn: async () => {
      const params = new URLSearchParams({ depositAddress: depositAddress! });
      const response = await fetch(`/api/status?${params}`);
      if (!response.ok) throw new Error('Failed to load swap status');
      return response.json();
    },
    enabled: Boolean(depositAddress),
    refetchInterval: (query) =>
      terminalStatuses.has(query.state.data?.status) ? false : 2_000,
  });
}
```

### NEP-141 Depositの概念

NEAR Wallet Selectorから、トークンコントラクトの `ft_transfer` を呼び出す。

```ts
const wallet = await selector.wallet();

const result = await wallet.signAndSendTransactions({
  transactions: [
    {
      receiverId: tokenContractId,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'ft_transfer',
            args: {
              receiver_id: depositAddress,
              amount: quote.quote.amountIn,
            },
            gas: '50000000000000',
            deposit: '1',
          },
        },
      ],
    },
  ],
});
```

実装時には、受取アカウントのstorage registration要否を確認する。既存スクリプトの
`ensureNep141StorageRegistration` は、その考え方をReact側の送金サービスへ移植する
際の参考になる。

## 8. 教材としての実装順序

### Phase 1: 読み取り専用UI

- React/Viteプロジェクトを作る。
- Token一覧をSDK経由で表示する。
- 人間向け金額と最小単位を相互変換する。
- `dry: true` Quoteを表示する。
- この段階ではウォレットも実資金も使わない。

### Phase 2: NEAR-origin Swap

- NEAR Wallet Selectorを接続する。
- `wNEAR` またはNEP-141をオリジン資産に限定する。
- ライブQuote、NEAR送金、Tx submit、Status pollingを実装する。
- 実行前にmainnet/少額警告とdeadline確認を表示する。

### Phase 3: EVM-origin Swap

- wagmi + viemを追加する。
- native tokenとERC-20送金を分ける。
- チェーン切替、allowance不要の通常transfer、Tx receipt確認を実装する。

### Phase 4: 発展

- destination chainのアドレス検証を追加する。
- 再読込後のSwap復元、履歴、explorerリンクを追加する。
- 公式Widget版と独自実装版を比較する。
- Intents SDKで内部残高、署名、Transfer、Withdrawalを学ぶ別教材へ進む。

## 9. 既存スクリプトから再利用できるもの

`near-intents/one-click-tutorial` から次を再利用できる。

- `src/amounts.ts`: decimalsとbase unitsの変換
- `src/types.ts`: APIレスポンスのZod schema
- `src/display.ts`: statusの終端判定と説明
- `src/near-deposit.ts`: NEAR/NEP-141送金とstorage registrationの考え方
- テスト: 金額変換、安全ゲート、status判定

一方、次はReact/BFF向けに変更が必要。

- ファイル保存はブラウザ永続化またはDBへ置き換える。
- private keyによる署名は廃止し、ユーザーウォレットで署名する。
- REST直書き部分を1Click SDKへ置き換える。
- API認証ヘッダーを現行仕様に合わせる。

## 10. 既存実装で確認すべき差分

現在の `one-click-tutorial/src/one-click.ts` はAPIキーを `X-API-Key` で送信する。
現行の公式ドキュメントとSDKはJWTを `Authorization: Bearer <token>` として扱うため、
React教材を実装する前に既存教材も更新対象として検討すべきである。

また、公式資料間で未認証時のfeeに差異がある。

- 現行API Keysページ: 0.2% (20 bps)
- 公式example repositoryのREADME: 0.1%という記述が残る

料金や認証仕様は変わり得るため、アプリへ固定文言を埋め込まず、リリース前にAPI Keysと
Feesの公式ページを再確認する。

## 11. セキュリティとUXのチェックリスト

- JWT、秘密鍵、seed phraseをブラウザbundleへ含めない。
- ウォレットへ渡すreceiver、token、amountを確認画面にも表示する。
- Quote作成後に入力が変わった場合、古いライブQuoteを破棄する。
- deadline経過後は送金ボタンを無効化し、新しいQuoteを要求する。
- `depositAddress` へ異なるtokenやamountを送らないよう警告する。
- CEXの入金アドレスは着金できない場合があるため注意を表示する。
- Status APIが一時失敗してもSwap失敗と断定せず、再試行可能にする。
- Tx submitは補助処理として扱い、失敗してもStatus追跡を継続する。
- 本番前に対応チェーン、対応資産、fee、障害状況を公式ページで再確認する。

## 12. 推奨ディレクトリ構成

```text
near-intents/
  react-one-click-tutorial/
    apps/
      web/
        src/
          components/
          features/swap/
          hooks/
          wallet/
      api/
        src/
          routes/
          services/one-click.ts
          schemas/
    packages/
      shared/
        src/
          amounts.ts
          types.ts
          status.ts
```

ただし最初からmonorepoツールを導入する必要はない。`apps/web` と `apps/api` をpnpm
workspaceで管理する程度に留め、既存チュートリアルの純粋関数だけを `shared` へ移す。

## 13. 参考資料

一次情報を優先した。

- [1Click Swap API Overview](https://docs.near-intents.org/integration/distribution-channels/1click-api/about-1click-api)
- [1Click Quickstart](https://docs.near-intents.org/integration/distribution-channels/1click-api/quickstart)
- [1Click Swap SDK](https://docs.near-intents.org/integration/distribution-channels/1click-api/sdk)
- [1Click API Keys](https://docs.near-intents.org/integration/distribution-channels/1click-api/authentication)
- [Supported Chains](https://docs.near-intents.org/resources/chain-support)
- [Supported Assets](https://docs.near-intents.org/resources/asset-support)
- [React Widget](https://docs.near-intents.org/integration/devkit/react-widget)
- [Intents SDK](https://docs.near-intents.org/integration/devkit/intents-sdk)
- [1Click TypeScript SDK repository](https://github.com/defuse-protocol/one-click-sdk-typescript)
- [Intents SDK repository](https://github.com/defuse-protocol/sdk-monorepo/tree/main/packages/intents-sdk)
- [Official NEAR Intents examples](https://github.com/near-examples/near-intents-examples)
- [1Click OpenAPI](https://1click.chaindefuser.com/docs/v0/openapi.yaml)

## 14. 次の実装方針

最初の完成目標は「NEARのwNEARをオリジン資産として、任意の対応チェーンの資産へSwap
する学習用アプリ」とする。Phase 1は完全なdry-runに限定し、Phase 2でのみmainnetの
最小額を扱う。これにより、既存スクリプトの知識を活かしながら、SDK、Reactの非同期
状態管理、ウォレット署名、クロスチェーン進捗UIを段階的に学習できる。
