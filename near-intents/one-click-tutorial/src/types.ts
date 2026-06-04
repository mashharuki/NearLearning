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
  amountIn: z.string().nullable().optional(),
  amountInFormatted: z.string().nullable().optional(),
  amountInUsd: z.union([z.string(), z.number()]).optional(),
  minAmountIn: z.string().nullable().optional(),
  amountOut: z.string().nullable().optional(),
  amountOutFormatted: z.string().nullable().optional(),
  amountOutUsd: z.union([z.string(), z.number()]).optional(),
  minAmountOut: z.string().nullable().optional(),
  timeEstimate: z.number().nullable().optional(),
  depositAddress: z.string().nullable().optional(),
  depositMemo: z.string().nullable().optional(),
  deadline: z.string().nullable().optional(),
  timeWhenInactive: z.string().nullable().optional(),
  refundFee: z.string().nullable().optional(),
});

export const quoteResponseSchema = z.object({
  correlationId: z.string().optional(),
  timestamp: z.string().optional(),
  signature: z.string().nullable().optional(),
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
      amountIn: z.string().nullable().optional(),
      amountInFormatted: z.string().nullable().optional(),
      amountOut: z.string().nullable().optional(),
      amountOutFormatted: z.string().nullable().optional(),
      slippage: z.number().nullable().optional(),
      refundedAmount: z.string().nullable().optional(),
      refundedAmountFormatted: z.string().nullable().optional(),
      refundReason: z.string().nullable().optional(),
      depositedAmount: z.string().nullable().optional(),
      depositedAmountFormatted: z.string().nullable().optional(),
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
