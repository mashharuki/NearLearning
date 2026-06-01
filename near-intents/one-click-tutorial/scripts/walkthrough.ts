import { getConfig } from '../src/config.js';
import {
  printQuoteRequest,
  printQuoteResponse,
  printTokenSummary,
} from '../src/display.js';
import {
  buildQuoteRequest,
  findToken,
  getQuote,
  getTokens,
} from '../src/one-click.js';

const config = getConfig();

console.log('Step 1: Fetch supported tokens');
const tokens = await getTokens(config);
printTokenSummary(tokens);

console.log('\nStep 2: Build a dry-run quote request');
const origin = findToken(tokens, config.originAsset);
const quoteRequest = buildQuoteRequest(config, origin, true);
printQuoteRequest(quoteRequest);

console.log('\nStep 3: Request dry-run quote');
const quote = await getQuote(config, quoteRequest);
printQuoteResponse(quote);

console.log('\nWalkthrough complete.');
console.log('Next safe command: pnpm quote:dry');
console.log('Next live-preview command: pnpm quote:live');
console.log(
  'Real funds are never sent unless you run pnpm deposit:near with REAL_SWAP_CONFIRM set.',
);
