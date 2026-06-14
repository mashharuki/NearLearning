import {
  ApiError,
  OneClickService,
  OpenAPI,
  QuoteRequest,
  type TokenResponse,
} from '@defuse-protocol/one-click-sdk-typescript';
import {
  type QuoteInput,
  type QuoteResult,
  quoteResultSchema,
  type Token,
} from '@near-intents/shared';

const baseUrl =
  process.env.ONE_CLICK_BASE_URL || 'https://1click.chaindefuser.com';

OpenAPI.BASE = baseUrl;
if (process.env.ONE_CLICK_JWT) {
  OpenAPI.TOKEN = process.env.ONE_CLICK_JWT;
}

function normalizeToken(token: TokenResponse): Token {
  return {
    assetId: token.assetId,
    decimals: token.decimals,
    blockchain: token.blockchain,
    symbol: token.symbol,
    price: Number.isFinite(token.price) ? token.price : null,
    priceUpdatedAt: token.priceUpdatedAt || null,
    contractAddress: token.contractAddress || null,
  };
}

export async function getSupportedTokens() {
  const tokens = await OneClickService.getTokens();
  return tokens.map(normalizeToken);
}

export async function getDryQuote(input: QuoteInput): Promise<QuoteResult> {
  const request: QuoteRequest = {
    dry: true,
    swapType: QuoteRequest.swapType.EXACT_INPUT,
    slippageTolerance: input.slippageTolerance,
    originAsset: input.originAsset,
    depositType: QuoteRequest.depositType.ORIGIN_CHAIN,
    destinationAsset: input.destinationAsset,
    amount: input.amount,
    refundTo: input.refundTo,
    refundType: QuoteRequest.refundType.ORIGIN_CHAIN,
    recipient: input.recipient,
    recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
    deadline: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    depositMode: QuoteRequest.depositMode.SIMPLE,
    referral: 'nearlearning-tutorial',
    quoteWaitingTimeMs: 3_000,
  };

  const response = await OneClickService.getQuote(request);
  return quoteResultSchema.parse({
    correlationId: response.correlationId,
    timestamp: response.timestamp,
    quote: {
      amountIn: response.quote.amountIn,
      amountInFormatted: response.quote.amountInFormatted,
      amountInUsd: response.quote.amountInUsd,
      amountOut: response.quote.amountOut,
      amountOutFormatted: response.quote.amountOutFormatted,
      amountOutUsd: response.quote.amountOutUsd,
      minAmountOut: response.quote.minAmountOut,
      timeEstimate: response.quote.timeEstimate,
      depositAddress: response.quote.depositAddress,
    },
  });
}

export function describeOneClickError(error: unknown) {
  if (error instanceof ApiError) {
    const bodyMessage =
      typeof error.body === 'object' &&
      error.body !== null &&
      'message' in error.body &&
      typeof error.body.message === 'string'
        ? error.body.message
        : undefined;

    if (error.status === 401) {
      return {
        status: 401,
        error:
          '1Click APIの認証に失敗しました。サーバーのONE_CLICK_JWTを確認してください。',
        details: bodyMessage,
      };
    }

    return {
      status: error.status >= 400 && error.status < 600 ? error.status : 502,
      error: bodyMessage || '1Click APIがリクエストを処理できませんでした。',
      details: `1Click API status: ${error.status}`,
    };
  }

  return {
    status: 500,
    error: '予期しないサーバーエラーが発生しました。',
    details: error instanceof Error ? error.message : undefined,
  };
}

export function getApiConfiguration() {
  return {
    baseUrl,
    authenticated: Boolean(process.env.ONE_CLICK_JWT),
  };
}
