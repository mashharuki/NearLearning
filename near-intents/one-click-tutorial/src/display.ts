import type {
  QuoteRequest,
  QuoteResponse,
  StatusResponse,
  TokenInfo,
} from './types.js';

const statusDescriptions: Record<StatusResponse['status'], string> = {
  PENDING_DEPOSIT: 'Deposit address is waiting for your transfer.',
  KNOWN_DEPOSIT_TX: 'Deposit transaction was detected and is being tracked.',
  PROCESSING: 'Market makers / settlement are processing the swap.',
  SUCCESS: 'Swap completed and destination funds were delivered.',
  INCOMPLETE_DEPOSIT:
    'Deposit was below the required amount; check refund details.',
  REFUNDED: 'Swap failed or expired and funds were refunded.',
  FAILED:
    'Swap failed; inspect details and request a fresh quote before retrying.',
};

export function explainStatus(status: StatusResponse['status']): string {
  return statusDescriptions[status];
}

export function isTerminalStatus(status: StatusResponse['status']): boolean {
  return ['SUCCESS', 'INCOMPLETE_DEPOSIT', 'REFUNDED', 'FAILED'].includes(
    status,
  );
}

export function printTokenSummary(tokens: TokenInfo[]): void {
  const byChain = new Map<string, number>();
  for (const token of tokens) {
    byChain.set(token.blockchain, (byChain.get(token.blockchain) || 0) + 1);
  }

  console.log(`Supported tokens: ${tokens.length}`);
  console.log('Chains:');
  for (const [chain, count] of [...byChain.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    console.log(`  - ${chain}: ${count}`);
  }

  console.log('\nExamples:');
  for (const token of tokens.slice(0, 10)) {
    console.log(
      `  - ${token.symbol.padEnd(8)} ${token.blockchain.padEnd(8)} ${token.assetId}`,
    );
  }
}

export function printQuoteRequest(request: QuoteRequest): void {
  console.log('Quote request:');
  console.log(`  dry: ${request.dry}`);
  console.log(`  swapType: ${request.swapType}`);
  console.log(`  originAsset: ${request.originAsset}`);
  console.log(`  destinationAsset: ${request.destinationAsset}`);
  console.log(`  amount(base units): ${request.amount}`);
  console.log(`  slippageTolerance: ${request.slippageTolerance} bps`);
  console.log(`  recipient: ${request.recipient}`);
  console.log(`  refundTo: ${request.refundTo}`);
  console.log(`  deadline: ${request.deadline}`);
}

export function printQuoteResponse(response: QuoteResponse): void {
  const quote = response.quote;

  console.log('\nQuote response:');
  console.log(`  correlationId: ${response.correlationId}`);
  console.log(
    `  amountIn: ${quote.amountInFormatted ?? quote.amountIn ?? 'unknown'}`,
  );
  console.log(
    `  amountOut: ${quote.amountOutFormatted ?? quote.amountOut ?? 'unknown'}`,
  );
  console.log(`  minAmountOut: ${quote.minAmountOut ?? 'not provided'}`);
  console.log(
    `  timeEstimate: ${quote.timeEstimate ? `${quote.timeEstimate}s` : 'not provided'}`,
  );

  if (quote.depositAddress) {
    console.log('\nLive quote deposit instructions:');
    console.log(`  depositAddress: ${quote.depositAddress}`);
    console.log(`  depositMemo: ${quote.depositMemo || 'none'}`);
    console.log(`  deadline: ${quote.deadline || 'not provided'}`);
    console.log(
      '  Send only the quoted origin asset and amount before the deadline.',
    );
  } else {
    console.log('\nDry-run quote: no deposit address was created.');
  }
}

export function printStatus(response: StatusResponse): void {
  console.log('Swap status:');
  console.log(`  status: ${response.status}`);
  console.log(`  meaning: ${explainStatus(response.status)}`);
  if (response.updatedAt) {
    console.log(`  updatedAt: ${response.updatedAt}`);
  }

  if (response.swapDetails) {
    console.log('\nSwap details:');
    console.log(
      `  amountIn: ${response.swapDetails.amountInFormatted ?? response.swapDetails.amountIn ?? 'unknown'}`,
    );
    console.log(
      `  amountOut: ${response.swapDetails.amountOutFormatted ?? response.swapDetails.amountOut ?? 'unknown'}`,
    );
    if (response.swapDetails.refundReason) {
      console.log(`  refundReason: ${response.swapDetails.refundReason}`);
    }
  }
}
