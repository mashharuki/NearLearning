import { describe, expect, it } from 'vitest';

import {
  baseUnitsToDecimal,
  decimalToBaseUnits,
  formatTokenAmount,
  formatUsd,
} from './amounts.js';

describe('decimalToBaseUnits', () => {
  it('converts a human amount to base units', () => {
    expect(decimalToBaseUnits('0.001', 24)).toBe('1000000000000000000000');
  });

  it('rejects excess decimal places', () => {
    expect(() => decimalToBaseUnits('1.001', 2)).toThrow(
      '小数点以下は最大2桁です。',
    );
  });

  it('converts base units back to a human amount', () => {
    expect(baseUnitsToDecimal('1234567', 6)).toBe('1.234567');
  });
});

describe('formatters', () => {
  it('formats token values and USD values', () => {
    expect(formatTokenAmount('1234.56789', 2)).toBe('1,234.57');
    expect(formatUsd('12.4')).toBe('$12.40');
  });
});
