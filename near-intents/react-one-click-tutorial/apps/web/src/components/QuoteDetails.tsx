import {
  baseUnitsToDecimal,
  formatTokenAmount,
  formatUsd,
  type QuoteResult,
  type Token,
} from '@near-intents/shared';
import { Clock3, Fingerprint, Gauge, ShieldCheck } from 'lucide-react';

export function QuoteDetails({
  quote,
  destination,
}: {
  quote: QuoteResult;
  destination: Token;
}) {
  return (
    <section className="quote-result" aria-live="polite">
      <div className="quote-result__headline">
        <span>受取見込み</span>
        <div>
          <strong>
            {formatTokenAmount(quote.quote.amountOutFormatted, 8)}
          </strong>
          <span>{destination.symbol}</span>
        </div>
        <small>{formatUsd(quote.quote.amountOutUsd)}</small>
      </div>

      <div className="metric-grid">
        <div className="metric">
          <Gauge size={17} />
          <span>最小受取量</span>
          <strong>
            {formatTokenAmount(
              baseUnitsToDecimal(
                quote.quote.minAmountOut,
                destination.decimals,
              ),
              8,
            )}
          </strong>
        </div>
        <div className="metric">
          <Clock3 size={17} />
          <span>推定時間</span>
          <strong>約 {Math.ceil(quote.quote.timeEstimate / 60)} 分</strong>
        </div>
        <div className="metric">
          <ShieldCheck size={17} />
          <span>モード</span>
          <strong>Dry run</strong>
        </div>
        <div className="metric">
          <Fingerprint size={17} />
          <span>Correlation</span>
          <strong title={quote.correlationId}>
            {quote.correlationId.slice(0, 8)}
          </strong>
        </div>
      </div>
    </section>
  );
}
