import { getConfig } from '../src/config.js';
import { printTokenSummary } from '../src/display.js';
import { getTokens } from '../src/one-click.js';

const config = getConfig();
const tokens = await getTokens(config);

printTokenSummary(tokens);
console.log(
  '\nLearning note: assetId is the canonical token identifier. Use values from this list.',
);
