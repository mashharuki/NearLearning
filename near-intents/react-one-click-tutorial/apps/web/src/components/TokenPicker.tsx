import type { Token } from '@near-intents/shared';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { TokenMark } from './TokenMark';

const chainLabels: Record<string, string> = {
  near: 'NEAR',
  eth: 'Ethereum',
  base: 'Base',
  arb: 'Arbitrum',
  sol: 'Solana',
  btc: 'Bitcoin',
  bsc: 'BNB Chain',
  pol: 'Polygon',
  op: 'Optimism',
  avax: 'Avalanche',
  tron: 'Tron',
  stellar: 'Stellar',
  ton: 'TON',
};

export function getChainLabel(chain: string) {
  return chainLabels[chain] || chain.toUpperCase();
}

export function TokenPicker({
  label,
  tokens,
  value,
  excludedAssetId,
  onChange,
}: {
  label: string;
  tokens: Token[];
  value: Token | null;
  excludedAssetId?: string;
  onChange: (token: Token) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [chain, setChain] = useState('all');

  const chains = useMemo(
    () =>
      Array.from(new Set(tokens.map((token) => token.blockchain))).sort(
        (a, b) => getChainLabel(a).localeCompare(getChainLabel(b)),
      ),
    [tokens],
  );

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return tokens.filter((token) => {
      if (token.assetId === excludedAssetId) return false;
      if (chain !== 'all' && token.blockchain !== chain) return false;
      if (!normalizedSearch) return true;

      return `${token.symbol} ${token.blockchain} ${token.assetId}`
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [chain, excludedAssetId, search, tokens]);

  return (
    <div className="token-picker">
      <span className="field-label">{label}</span>
      <button
        className="token-picker__trigger"
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        {value ? (
          <>
            <TokenMark token={value} />
            <span className="token-picker__selected">
              <strong>{value.symbol}</strong>
              <span>{getChainLabel(value.blockchain)}</span>
            </span>
          </>
        ) : (
          <span className="token-picker__placeholder">資産を選択</span>
        )}
        <ChevronsUpDown size={18} aria-hidden="true" />
      </button>

      {open ? (
        <div className="dialog-backdrop">
          <section
            className="token-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={`${label}トークンを選択`}
          >
            <header className="token-dialog__header">
              <div>
                <span className="eyebrow">SUPPORTED ASSETS</span>
                <h2>{label}トークン</h2>
              </div>
              <button
                className="icon-button"
                type="button"
                onClick={() => setOpen(false)}
                aria-label="閉じる"
                title="閉じる"
              >
                <X size={20} />
              </button>
            </header>

            <label className="search-field">
              <Search size={18} aria-hidden="true" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="シンボル、チェーン、assetIdで検索"
              />
            </label>

            <div className="chain-tabs" role="tablist" aria-label="チェーン">
              <button
                type="button"
                className={chain === 'all' ? 'is-active' : ''}
                onClick={() => setChain('all')}
              >
                All
              </button>
              {chains.map((chainName) => (
                <button
                  type="button"
                  key={chainName}
                  className={chain === chainName ? 'is-active' : ''}
                  onClick={() => setChain(chainName)}
                >
                  {getChainLabel(chainName)}
                </button>
              ))}
            </div>

            <div className="token-list">
              {filtered.length > 0 ? (
                filtered.map((token) => (
                  <button
                    type="button"
                    className="token-option"
                    key={token.assetId}
                    onClick={() => {
                      onChange(token);
                      setOpen(false);
                      setSearch('');
                    }}
                  >
                    <TokenMark token={token} />
                    <span className="token-option__name">
                      <strong>{token.symbol}</strong>
                      <span>{getChainLabel(token.blockchain)}</span>
                    </span>
                    <span className="token-option__price">
                      {token.price === null
                        ? '価格なし'
                        : `$${token.price.toLocaleString('en-US', {
                            maximumFractionDigits: 4,
                          })}`}
                    </span>
                    {value?.assetId === token.assetId ? (
                      <Check size={18} aria-label="選択中" />
                    ) : null}
                  </button>
                ))
              ) : (
                <div className="empty-state">
                  条件に一致する資産はありません。
                </div>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
