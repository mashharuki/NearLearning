import { getConfig } from '../src/config.js';
import { submitDepositTx } from '../src/one-click.js';
import { loadDepositTx, loadQuote } from '../src/storage.js';

const config = getConfig();
const quote = await loadQuote();
const txHash = await loadDepositTx();
const depositAddress = quote.quote.depositAddress;

if (!depositAddress) {
  throw new Error(
    'Latest quote does not contain depositAddress. Run pnpm quote:live first.',
  );
}

console.log('Submitting deposit transaction hash to 1-Click...');
console.log(`  depositAddress: ${depositAddress}`);
console.log(`  txHash: ${txHash}`);

const response = await submitDepositTx(config, depositAddress, txHash);
console.log('\nSubmit response:');
console.log(JSON.stringify(response, null, 2));
