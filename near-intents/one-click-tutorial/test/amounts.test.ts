import assert from 'node:assert/strict';
import test from 'node:test';

import { baseUnitsToDecimal, decimalToBaseUnits } from '../src/amounts.js';

test('decimalToBaseUnits converts NEAR-style decimals', () => {
  assert.equal(decimalToBaseUnits('1', 24), '1000000000000000000000000');
  assert.equal(decimalToBaseUnits('0.001', 24), '1000000000000000000000');
});

test('decimalToBaseUnits rejects too many decimal places', () => {
  assert.throws(
    () => decimalToBaseUnits('0.0001', 3),
    /Too many decimal places/,
  );
});

test('baseUnitsToDecimal trims trailing zeroes', () => {
  assert.equal(baseUnitsToDecimal('1000000000000000000000000', 24), '1');
  assert.equal(baseUnitsToDecimal('1000000000000000000000', 24), '0.001');
});
