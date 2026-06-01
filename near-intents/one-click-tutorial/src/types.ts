import { z } from 'zod';

export const tokenSchema = z.object({
  assetId: z.string(),
  decimals: z.number(),
  blockchain: z.string(),
  symbol: z.string(),
  price: z.union([z.number(), z.string()]).optional(),
  priceUpdatedAt: z.string().optional(),
  contractAddress: z.string().nullable().optional(),
});

export const quoteRequestSchema = z.object({
  dry: z.boolean(),
  swapType: z.enum(['EXACT_INPUT', 'EXACT_OUTPUT', 'FLEX_INPUT', 'ANY_INPUT']),
  slippageTolerance: z.number(),
  originAsset: z.string(),
  depositType: z.enum(['ORIGIN_CHAIN', 'INTENTS', 'CONFIDENTIAL_INTENTS']),
  destinationAsset: z.string(),
  amount: z.string(),
  refundTo: z.string(),
  refundType: z.enum(['ORIGIN_CHAIN', 'INTENTS', 'CONFIDENTIAL_INTENTS']),
  recipient: z.string(),
  recipientType: z.enum([
    'DESTINATION_CHAIN',
    'INTENTS',
    'CONFIDENTIAL_INTENTS',
  ]),
  deadline: z.string(),
  depositMode: z.enum(['SIMPLE', 'MEMO']).optional(),
  referral: z.string().optional(),
  quoteWaitingTimeMs: z.number().optional(),
});

export const quoteSchema = z.object({
  amountIn: z.string().optional(),
  amountInFormatted: z.string().optional(),
  amountInUsd: z.union([z.string(), z.number()]).optional(),
  minAmountIn: z.string().optional(),
  amountOut: z.string().optional(),
  amountOutFormatted: z.string().optional(),
  amountOutUsd: z.union([z.string(), z.number()]).optional(),
  minAmountOut: z.string().optional(),
  timeEstimate: z.number().optional(),
  depositAddress: z.string().optional(),
  depositMemo: z.string().nullable().optional(),
  deadline: z.string().optional(),
  timeWhenInactive: z.string().optional(),
  refundFee: z.string().optional(),
});

export const quoteResponseSchema = z.object({
  correlationId: z.string(),
  timestamp: z.string(),
  signature: z.string().optional(),
  quoteRequest: quoteRequestSchema.partial().passthrough(),
  quote: quoteSchema.passthrough(),
});

export const statusResponseSchema = z.object({
  correlationId: z.string().optional(),
  quoteResponse: quoteResponseSchema.optional(),
  status: z.enum([
    'KNOWN_DEPOSIT_TX',
    'PENDING_DEPOSIT',
    'INCOMPLETE_DEPOSIT',
    'PROCESSING',
    'SUCCESS',
    'REFUNDED',
    'FAILED',
  ]),
  updatedAt: z.string().optional(),
  swapDetails: z
    .object({
      amountIn: z.string().optional(),
      amountInFormatted: z.string().optional(),
      amountOut: z.string().optional(),
      amountOutFormatted: z.string().optional(),
      slippage: z.number().optional(),
      refundedAmount: z.string().optional(),
      refundedAmountFormatted: z.string().optional(),
      refundReason: z.string().optional(),
      depositedAmount: z.string().optional(),
      depositedAmountFormatted: z.string().optional(),
      originChainTxHashes: z
        .array(
          z.object({ hash: z.string(), explorerUrl: z.string().optional() }),
        )
        .optional(),
      destinationChainTxHashes: z
        .array(
          z.object({ hash: z.string(), explorerUrl: z.string().optional() }),
        )
        .optional(),
    })
    .passthrough()
    .optional(),
});

export type TokenInfo = z.infer<typeof tokenSchema>;
export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
export type QuoteResponse = z.infer<typeof quoteResponseSchema>;
export type StatusResponse = z.infer<typeof statusResponseSchema>;
export type SwapStatus = StatusResponse['status'];
