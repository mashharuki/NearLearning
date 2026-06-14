import { z } from 'zod';

export const tokenSchema = z.object({
  assetId: z.string(),
  decimals: z.number().int().nonnegative(),
  blockchain: z.string(),
  symbol: z.string(),
  price: z.number().nullable(),
  priceUpdatedAt: z.string().nullable(),
  contractAddress: z.string().nullable(),
});

export const tokensResponseSchema = z.object({
  tokens: z.array(tokenSchema),
  fetchedAt: z.string(),
});

export const quoteInputSchema = z
  .object({
    originAsset: z.string().min(1),
    destinationAsset: z.string().min(1),
    amount: z.string().regex(/^\d+$/),
    recipient: z.string().trim().min(1).max(256),
    refundTo: z.string().trim().min(1).max(256),
    slippageTolerance: z.number().int().min(1).max(500),
  })
  .refine((value) => value.originAsset !== value.destinationAsset, {
    message: '送付元と受取先には異なる資産を選択してください。',
    path: ['destinationAsset'],
  });

export const quoteResultSchema = z.object({
  correlationId: z.string(),
  timestamp: z.string(),
  quote: z.object({
    amountIn: z.string(),
    amountInFormatted: z.string(),
    amountInUsd: z.string(),
    amountOut: z.string(),
    amountOutFormatted: z.string(),
    amountOutUsd: z.string(),
    minAmountOut: z.string(),
    timeEstimate: z.number(),
    depositAddress: z.string().optional(),
  }),
});

export const apiErrorSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

export type Token = z.infer<typeof tokenSchema>;
export type TokensResponse = z.infer<typeof tokensResponseSchema>;
export type QuoteInput = z.infer<typeof quoteInputSchema>;
export type QuoteResult = z.infer<typeof quoteResultSchema>;
