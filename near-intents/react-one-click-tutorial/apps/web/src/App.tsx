import {
  decimalToBaseUnits,
  type QuoteInput,
  type Token,
} from '@near-intents/shared';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowDownUp,
  BookOpen,
  CircleAlert,
  FlaskConical,
  Github,
  LoaderCircle,
  RefreshCw,
  Route,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { fetchDryQuote, fetchTokens } from './api';
import { QuoteDetails } from './components/QuoteDetails';
import { RouteMap } from './components/RouteMap';
import { TokenPicker } from './components/TokenPicker';
import { useDebouncedValue } from './hooks/useDebouncedValue';

const DEFAULT_ORIGIN = 'nep141:wrap.near';
const DEFAULT_DESTINATION =
  'nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near';

const lifecycle = [
  { label: 'Asset discovery', description: '正式なassetIdとdecimalsを取得' },
  { label: 'Dry quote', description: '資金を動かさずルートを試算' },
  { label: 'Deposit', description: 'Phase 2でウォレット署名を追加' },
  { label: 'Settlement', description: 'Phase 2で進捗追跡を追加' },
];

function findDefaultToken(tokens: Token[], assetId: string) {
  return tokens.find((token) => token.assetId === assetId) || null;
}

export default function App() {
  const [origin, setOrigin] = useState<Token | null>(null);
  const [destination, setDestination] = useState<Token | null>(null);
  const [amount, setAmount] = useState('0.01');
  const [recipient, setRecipient] = useState(
    '0x0000000000000000000000000000000000000000',
  );
  const [refundTo, setRefundTo] = useState('example.near');
  const [slippage, setSlippage] = useState(100);

  const tokensQuery = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokens,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!tokensQuery.data || origin || destination) return;
    setOrigin(findDefaultToken(tokensQuery.data.tokens, DEFAULT_ORIGIN));
    setDestination(
      findDefaultToken(tokensQuery.data.tokens, DEFAULT_DESTINATION),
    );
  }, [destination, origin, tokensQuery.data]);

  const amountInBaseUnits = useMemo(() => {
    if (!origin || !amount) return null;
    try {
      const value = decimalToBaseUnits(amount, origin.decimals);
      if (BigInt(value) <= 0n) throw new Error('0より大きい金額が必要です。');
      return value;
    } catch (error) {
      return error instanceof Error ? error : null;
    }
  }, [amount, origin]);

  const amountError =
    amountInBaseUnits instanceof Error ? amountInBaseUnits.message : null;

  const quoteInput = useMemo<QuoteInput | null>(() => {
    if (
      !origin ||
      !destination ||
      typeof amountInBaseUnits !== 'string' ||
      !recipient.trim() ||
      !refundTo.trim()
    ) {
      return null;
    }
    return {
      originAsset: origin.assetId,
      destinationAsset: destination.assetId,
      amount: amountInBaseUnits,
      recipient: recipient.trim(),
      refundTo: refundTo.trim(),
      slippageTolerance: slippage,
    };
  }, [amountInBaseUnits, destination, origin, recipient, refundTo, slippage]);

  const debouncedQuoteInput = useDebouncedValue(quoteInput, 650);
  const quoteQuery = useQuery({
    queryKey: ['dry-quote', debouncedQuoteInput],
    queryFn: () => fetchDryQuote(debouncedQuoteInput as QuoteInput),
    enabled: debouncedQuoteInput !== null,
    retry: 1,
    staleTime: 15_000,
  });

  const isEditing = quoteInput !== debouncedQuoteInput;
  const tokens = tokensQuery.data?.tokens || [];
  const chainCount = new Set(tokens.map((token) => token.blockchain)).size;

  const swapDirection = () => {
    setOrigin(destination);
    setDestination(origin);
    setRecipient(refundTo);
    setRefundTo(recipient);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Intent Atlas ホーム">
          <span className="brand__mark">
            <Route size={21} />
          </span>
          <span>
            <strong>Intent Atlas</strong>
            <small>NEAR INTENTS LAB</small>
          </span>
        </a>

        <div className="topbar__meta">
          <span className="network-badge">
            <span />
            MAINNET DATA
          </span>
          <a
            className="icon-button"
            href="https://github.com/mashharuki/NearLearning"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHubリポジトリ"
            title="GitHubリポジトリ"
          >
            <Github size={19} />
          </a>
        </div>
      </header>

      <main>
        <section className="workspace-heading">
          <div>
            <span className="eyebrow">CROSS-CHAIN QUOTE WORKBENCH</span>
            <h1>
              意図を組み立て、
              <br />
              ルートを観察する。
            </h1>
          </div>
          <p>
            1Click SDKの実データを使う、資金移動なしの学習環境です。
            assetId、最小単位、スリッページが見積りへどう反映されるか確認できます。
          </p>
        </section>

        <div className="workspace">
          <section className="swap-panel" aria-label="Swap条件">
            <div className="panel-header">
              <div>
                <span className="eyebrow">01 / COMPOSE</span>
                <h2>Swap intent</h2>
              </div>
              <span className="dry-badge">
                <FlaskConical size={15} />
                DRY RUN ONLY
              </span>
            </div>

            {tokensQuery.isLoading ? (
              <div className="loading-panel">
                <LoaderCircle className="spin" size={24} />
                対応資産を読み込んでいます
              </div>
            ) : tokensQuery.isError ? (
              <div className="error-banner">
                <CircleAlert size={20} />
                <div>
                  <strong>資産一覧を取得できませんでした</strong>
                  <span>{tokensQuery.error.message}</span>
                </div>
                <button
                  className="icon-button"
                  type="button"
                  onClick={() => tokensQuery.refetch()}
                  aria-label="再試行"
                  title="再試行"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            ) : (
              <>
                <div className="asset-row">
                  <TokenPicker
                    label="送付元"
                    tokens={tokens}
                    value={origin}
                    excludedAssetId={destination?.assetId}
                    onChange={setOrigin}
                  />
                  <button
                    className="swap-direction"
                    type="button"
                    onClick={swapDirection}
                    aria-label="送付元と受取先を入れ替える"
                    title="送付元と受取先を入れ替える"
                    disabled={!origin || !destination}
                  >
                    <ArrowDownUp size={18} />
                  </button>
                  <TokenPicker
                    label="受取先"
                    tokens={tokens}
                    value={destination}
                    excludedAssetId={origin?.assetId}
                    onChange={setDestination}
                  />
                </div>

                <label className="amount-field">
                  <span className="field-label">送付数量</span>
                  <div>
                    <input
                      inputMode="decimal"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      aria-invalid={Boolean(amountError)}
                    />
                    <span>{origin?.symbol || '-'}</span>
                  </div>
                  <small className={amountError ? 'field-error' : ''}>
                    {amountError ||
                      (typeof amountInBaseUnits === 'string'
                        ? `${amountInBaseUnits} base units`
                        : 'トークンのdecimalsから最小単位へ変換します')}
                  </small>
                </label>

                <div className="address-grid">
                  <label>
                    <span className="field-label">受取アドレス</span>
                    <input
                      value={recipient}
                      onChange={(event) => setRecipient(event.target.value)}
                      placeholder="Destination chain address"
                    />
                  </label>
                  <label>
                    <span className="field-label">返金アドレス</span>
                    <input
                      value={refundTo}
                      onChange={(event) => setRefundTo(event.target.value)}
                      placeholder="Origin chain address"
                    />
                  </label>
                </div>

                <div className="slippage-control">
                  <div>
                    <span className="field-label">Slippage tolerance</span>
                    <strong>{(slippage / 100).toFixed(2)}%</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    step="10"
                    value={slippage}
                    onChange={(event) =>
                      setSlippage(Number(event.target.value))
                    }
                    aria-label="スリッページ許容値"
                  />
                  <div className="range-labels">
                    <span>0.10%</span>
                    <span>3.00%</span>
                  </div>
                </div>
              </>
            )}

            <div className="safety-note">
              <ShieldCheck size={19} />
              <div>
                <strong>この画面から資金は移動しません</strong>
                <span>
                  `dry: true` のため、デポジットアドレスは生成されません。
                </span>
              </div>
            </div>
          </section>

          <aside className="insight-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">02 / OBSERVE</span>
                <h2>Route telemetry</h2>
              </div>
              <span className="live-indicator">
                <span />
                LIVE API
              </span>
            </div>

            <RouteMap
              origin={origin}
              destination={destination}
              active={quoteQuery.isFetching || isEditing}
            />

            {quoteQuery.isFetching || isEditing ? (
              <div className="quote-loading">
                <LoaderCircle className="spin" size={20} />
                <div>
                  <strong>Solverの応答を待っています</strong>
                  <span>入力が止まってから見積りを更新します</span>
                </div>
              </div>
            ) : quoteQuery.isError ? (
              <div className="error-banner error-banner--quote">
                <CircleAlert size={20} />
                <div>
                  <strong>見積りを取得できませんでした</strong>
                  <span>{quoteQuery.error.message}</span>
                </div>
              </div>
            ) : quoteQuery.data && destination ? (
              <QuoteDetails quote={quoteQuery.data} destination={destination} />
            ) : (
              <div className="quote-placeholder">
                <Sparkles size={23} />
                <strong>条件を入力すると見積りが表示されます</strong>
                <span>
                  Recipientとrefund
                  addressは各チェーンの形式に合わせてください。
                </span>
              </div>
            )}

            <div className="data-strip">
              <div>
                <span>ASSETS</span>
                <strong>{tokens.length || '-'}</strong>
              </div>
              <div>
                <span>CHAINS</span>
                <strong>{chainCount || '-'}</strong>
              </div>
              <div>
                <span>REFRESH</span>
                <strong>15 sec cache</strong>
              </div>
            </div>
          </aside>
        </div>

        <section className="learning-track">
          <header>
            <div>
              <span className="eyebrow">LEARNING TRACK</span>
              <h2>1Clickの裏側を段階的に理解する</h2>
            </div>
            <a
              href="https://github.com/mashharuki/NearLearning/blob/main/near-intents/frontend-app-research-report.md"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              <BookOpen size={17} />
              調査レポート
            </a>
          </header>
          <div className="lifecycle">
            {lifecycle.map((step, index) => (
              <article
                key={step.label}
                className={index < 2 ? 'is-available' : ''}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{step.label}</strong>
                  <p>{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <span>Built for learning. Powered by NEAR Intents 1Click.</span>
        <span>
          {tokensQuery.data
            ? `Token data: ${new Date(tokensQuery.data.fetchedAt).toLocaleTimeString('ja-JP')}`
            : 'Waiting for token data'}
        </span>
      </footer>
    </div>
  );
}
