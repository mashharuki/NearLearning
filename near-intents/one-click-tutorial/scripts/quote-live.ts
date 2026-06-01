import { getConfig } from '../src/config.js';
import { printQuoteRequest, printQuoteResponse } from '../src/display.js';
import {
  buildQuoteRequest,
  findToken,
  getQuote,
  getTokens,
} from '../src/one-click.js';
import { quoteFile, saveQuote } from '../src/storage.js';

const config = getConfig();
const tokens = await getTokens(config);
const origin = findToken(tokens, config.originAsset);
const quoteRequest = buildQuoteRequest(config, origin, false);

console.log(
  'Creating a live quote. This does not transfer funds, but the deposit address is time-sensitive.',
);
printQuoteRequest(quoteRequest);

const quote = await getQuote(config, quoteRequest);
printQuoteResponse(quote);
await saveQuote(quote);

console.log(`\nSaved quote to ${quoteFile}`);
console.log(
  'Learning note: send funds only if you understand the origin asset, amount, memo, and deadline.',
);
