import assert from 'node:assert/strict';
import test from 'node:test';

import { explainStatus, isTerminalStatus } from '../src/display.js';

test('explains each important swap status', () => {
  assert.match(explainStatus('PENDING_DEPOSIT'), /waiting/i);
  assert.match(explainStatus('KNOWN_DEPOSIT_TX'), /detected/i);
  assert.match(explainStatus('SUCCESS'), /completed/i);
  assert.match(explainStatus('REFUNDED'), /refunded/i);
});

test('identifies terminal statuses', () => {
  assert.equal(isTerminalStatus('PENDING_DEPOSIT'), false);
  assert.equal(isTerminalStatus('PROCESSING'), false);
  assert.equal(isTerminalStatus('SUCCESS'), true);
  assert.equal(isTerminalStatus('FAILED'), true);
});
