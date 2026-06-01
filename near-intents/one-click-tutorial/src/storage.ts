import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import { type QuoteResponse, quoteResponseSchema } from './types.js';

export const quoteFile = resolve('data/latest-quote.json');
export const txFile = resolve('data/latest-deposit-tx.json');

export async function saveQuote(
  response: QuoteResponse,
  file = quoteFile,
): Promise<void> {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(response, null, 2)}\n`);
}

export async function loadQuote(file = quoteFile): Promise<QuoteResponse> {
  const raw = await readFile(file, 'utf8');
  return quoteResponseSchema.parse(JSON.parse(raw));
}

export async function saveDepositTx(
  txHash: string,
  file = txFile,
): Promise<void> {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify({ txHash }, null, 2)}\n`);
}

export async function loadDepositTx(file = txFile): Promise<string> {
  const raw = await readFile(file, 'utf8');
  const parsed = JSON.parse(raw) as { txHash?: unknown };
  if (typeof parsed.txHash !== 'string' || !parsed.txHash) {
    throw new Error(`No txHash found in ${file}`);
  }
  return parsed.txHash;
}
