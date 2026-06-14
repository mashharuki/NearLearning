import type { Token } from '@near-intents/shared';
import { ArrowRight } from 'lucide-react';
import { TokenMark } from './TokenMark';
import { getChainLabel } from './TokenPicker';

export function RouteMap({
  origin,
  destination,
  active,
}: {
  origin: Token | null;
  destination: Token | null;
  active: boolean;
}) {
  return (
    <div className={`route-map ${active ? 'is-active' : ''}`}>
      <div className="route-map__grid" aria-hidden="true" />
      <div className="route-node">
        {origin ? <TokenMark token={origin} size="large" /> : <span />}
        <div>
          <span>ORIGIN</span>
          <strong>{origin ? getChainLabel(origin.blockchain) : '-'}</strong>
        </div>
      </div>

      <div className="route-line" aria-hidden="true">
        <span className="route-line__pulse" />
        <ArrowRight size={20} />
      </div>

      <div className="route-node route-node--destination">
        {destination ? (
          <TokenMark token={destination} size="large" />
        ) : (
          <span />
        )}
        <div>
          <span>DESTINATION</span>
          <strong>
            {destination ? getChainLabel(destination.blockchain) : '-'}
          </strong>
        </div>
      </div>
    </div>
  );
}
