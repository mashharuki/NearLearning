import { getConfig } from '../src/config.js';
import { printStatus } from '../src/display.js';
import { getStatus } from '../src/one-click.js';
import { loadQuote } from '../src/storage.js';

const config = getConfig();
const quote = await loadQuote();
const depositAddress = quote.quote.depositAddress;

if (!depositAddress) {
  throw new Error(
    'Latest quote does not contain depositAddress. Run pnpm quote:live first.',
  );
}

const status = await getStatus(config, depositAddress, quote.quote.depositMemo);
printStatus(status);

console.log(
  '\nLearning note: status polling is how apps turn cross-chain uncertainty into user-facing progress.',
);
