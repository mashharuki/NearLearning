import { assertRealSwapAllowed, getConfig } from '../src/config.js';
import { sendNearDeposit } from '../src/near-deposit.js';
import { loadQuote, saveDepositTx, txFile } from '../src/storage.js';

const config = getConfig();
assertRealSwapAllowed(config);

const quote = await loadQuote();
const depositAddress = quote.quote.depositAddress;
const depositAmount = quote.quote.amountIn;

if (!depositAddress || !depositAmount) {
  throw new Error(
    'Latest quote does not contain depositAddress and amountIn. Run pnpm quote:live first.',
  );
}

if (quote.quoteRequest.originAsset !== 'nep141:wrap.near') {
  throw new Error(
    'deposit:near only supports ORIGIN_ASSET=nep141:wrap.near in this tutorial.',
  );
}

if (quote.quote.depositMemo) {
  throw new Error(
    'deposit:near cannot attach a deposit memo. Use a chain-specific sender for memo-based deposits.',
  );
}

console.log('Sending real NEAR deposit to 1-Click deposit address...');
console.log(`  receiverId: ${depositAddress}`);
console.log(`  amount(base units): ${depositAmount}`);

const txHash = await sendNearDeposit(config, depositAddress, depositAmount);
await saveDepositTx(txHash);

console.log(`\nDeposit transaction hash: ${txHash}`);
console.log(`Saved tx hash to ${txFile}`);
console.log('Next: run pnpm submit, then pnpm status.');
