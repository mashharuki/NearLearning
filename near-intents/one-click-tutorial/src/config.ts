import 'dotenv/config';

import { randomUUID } from 'node:crypto';

export const REAL_SWAP_CONFIRM_VALUE =
  'I_UNDERSTAND_NEAR_INTENTS_HAS_NO_TESTNET';

export interface TutorialConfig {
  baseUrl: string;
  apiKey?: string;
  originAsset: string;
  destinationAsset: string;
  amount: string;
  slippageBps: number;
  quoteWaitingTimeMs: number;
  recipient: string;
  refundTo: string;
  referral: string;
  sessionId: string;
  senderNearAccount?: string;
  senderPrivateKey?: string;
  nearRpcUrl: string;
  realSwapConfirm?: string;
}

export function getConfig(): TutorialConfig {
  return {
    baseUrl:
      process.env.ONE_CLICK_BASE_URL || 'https://1click.chaindefuser.com',
    apiKey:
      process.env.ONE_CLICK_API_KEY || process.env.ONE_CLICK_JWT || undefined,
    originAsset: process.env.ORIGIN_ASSET || 'nep141:wrap.near',
    destinationAsset:
      process.env.DESTINATION_ASSET ||
      'nep141:arb-0x912ce59144191c1204e64559fe8253a0e49e6548.omft.near',
    amount: process.env.AMOUNT || '0.001',
    slippageBps: Number(process.env.SLIPPAGE_BPS || '100'),
    quoteWaitingTimeMs: Number(process.env.QUOTE_WAITING_TIME_MS || '3000'),
    recipient:
      process.env.RECIPIENT || '0x0000000000000000000000000000000000000000',
    refundTo:
      process.env.REFUND_TO ||
      process.env.SENDER_NEAR_ACCOUNT ||
      'example.near',
    referral: process.env.REFERRAL || 'nearlearning-tutorial',
    sessionId: process.env.SESSION_ID || `nearlearning-${randomUUID()}`,
    senderNearAccount: process.env.SENDER_NEAR_ACCOUNT || undefined,
    senderPrivateKey: process.env.SENDER_PRIVATE_KEY || undefined,
    nearRpcUrl: process.env.NEAR_RPC_URL || 'https://rpc.mainnet.near.org',
    realSwapConfirm: process.env.REAL_SWAP_CONFIRM || undefined,
  };
}

export function assertRealSwapAllowed(config: TutorialConfig): void {
  if (config.realSwapConfirm !== REAL_SWAP_CONFIRM_VALUE) {
    throw new Error(
      [
        'Refusing to send real funds.',
        'NEAR Intents has no testnet. To continue, set:',
        `REAL_SWAP_CONFIRM=${REAL_SWAP_CONFIRM_VALUE}`,
      ].join('\n'),
    );
  }

  if (!config.senderNearAccount || !config.senderPrivateKey) {
    throw new Error(
      'SENDER_NEAR_ACCOUNT and SENDER_PRIVATE_KEY are required for deposit:near.',
    );
  }
}
