import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RouteMap } from './RouteMap';

const origin = {
  assetId: 'nep141:wrap.near',
  decimals: 24,
  blockchain: 'near',
  symbol: 'wNEAR',
  price: 2.5,
  priceUpdatedAt: null,
  contractAddress: 'wrap.near',
};

const destination = {
  assetId: 'nep141:base-usdc.omft.near',
  decimals: 6,
  blockchain: 'base',
  symbol: 'USDC',
  price: 1,
  priceUpdatedAt: null,
  contractAddress: '0x123',
};

describe('RouteMap', () => {
  it('renders the selected origin and destination chains', () => {
    render(
      <RouteMap origin={origin} destination={destination} active={false} />,
    );

    expect(screen.getByText('NEAR')).toBeInTheDocument();
    expect(screen.getByText('Base')).toBeInTheDocument();
  });
});
