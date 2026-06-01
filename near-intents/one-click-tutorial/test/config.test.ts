import assert from 'node:assert/strict';
import test from 'node:test';

import {
  REAL_SWAP_CONFIRM_VALUE,
  type TutorialConfig,
  assertRealSwapAllowed,
} from '../src/config.js';

function config(overrides: Partial<TutorialConfig> = {}): TutorialConfig {
  return {
    baseUrl: 'https://1click.chaindefuser.com',
    originAsset: 'nep141:wrap.near',
    destinationAsset: 'nep141:arb-token',
    amount: '0.001',
    slippageBps: 100,
    quoteWaitingTimeMs: 3000,
    recipient: '0x0000000000000000000000000000000000000000',
    refundTo: 'example.near',
    referral: 'test',
    sessionId: 'test-session',
    nearRpcUrl: 'https://rpc.mainnet.near.org',
    ...overrides,
  };
}

test('assertRealSwapAllowed requires explicit no-testnet confirmation', () => {
  assert.throws(
    () => assertRealSwapAllowed(config()),
    /Refusing to send real funds/,
  );
});

test('assertRealSwapAllowed requires sender credentials after confirmation', () => {
  assert.throws(
    () =>
      assertRealSwapAllowed(
        config({ realSwapConfirm: REAL_SWAP_CONFIRM_VALUE }),
      ),
    /SENDER_NEAR_ACCOUNT and SENDER_PRIVATE_KEY/,
  );
});

test('assertRealSwapAllowed accepts confirmed config with sender credentials', () => {
  assert.doesNotThrow(() =>
    assertRealSwapAllowed(
      config({
        realSwapConfirm: REAL_SWAP_CONFIRM_VALUE,
        senderNearAccount: 'alice.near',
        senderPrivateKey: 'ed25519:test',
      }),
    ),
  );
});
