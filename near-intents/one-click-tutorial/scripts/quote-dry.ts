import { getConfig } from '../src/config.js';
import { printQuoteRequest, printQuoteResponse } from '../src/display.js';
import {
  buildQuoteRequest,
  findToken,
  getQuote,
  getTokens,
} from '../src/one-click.js';

const config = getConfig();
const tokens = await getTokens(config);
const origin = findToken(tokens, config.originAsset);
const quoteRequest = buildQuoteRequest(config, origin, true);

printQuoteRequest(quoteRequest);
const quote = await getQuote(config, quoteRequest);
printQuoteResponse(quote);

console.log(
  '\nLearning note: dry=true validates the intent and pricing without creating a deposit address.',
);
