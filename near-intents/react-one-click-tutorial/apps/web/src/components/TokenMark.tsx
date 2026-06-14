import type { Token } from '@near-intents/shared';

const chainColors: Record<string, string> = {
  near: '#00a57a',
  eth: '#5163b8',
  base: '#246bfe',
  arb: '#2f86c5',
  sol: '#674ad8',
  btc: '#e58b18',
  bsc: '#bd8b14',
  tron: '#d84a4a',
  stellar: '#31343c',
  ton: '#2788c8',
};

export function TokenMark({
  token,
  size = 'medium',
}: {
  token: Token;
  size?: 'small' | 'medium' | 'large';
}) {
  const background = chainColors[token.blockchain] || '#59645f';
  const initials = token.symbol.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2);

  return (
    <span
      className={`token-mark token-mark--${size}`}
      style={{ '--token-color': background } as React.CSSProperties}
      aria-hidden="true"
    >
      {initials || '?'}
      <span className="token-mark__chain" />
    </span>
  );
}
