import { decimalToBaseUnits } from './amounts.js';
import type { TutorialConfig } from './config.js';
import {
  type QuoteRequest,
  type QuoteResponse,
  type StatusResponse,
  type TokenInfo,
  quoteResponseSchema,
  statusResponseSchema,
  tokenSchema,
} from './types.js';

/**
 * API呼び出し用のヘッダーを構築します。
 * @param config 
 * @returns 
 */
function headers(config: TutorialConfig): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (config.apiKey) {
    headers['X-API-Key'] = config.apiKey;
  }

  return headers;
}

/**
 * JSONレスポンスを解析し、エラーがあれば例外をスローします。
 * @param response 
 * @returns 
 */
async function parseJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(
      `1-Click API error ${response.status}: ${JSON.stringify(body, null, 2)}`,
    );
  }
  return body;
}

/**
 * トークン情報を取得するAPI
 * @param config 
 * @returns 
 */
export async function getTokens(config: TutorialConfig): Promise<TokenInfo[]> {
  const response = await fetch(`${config.baseUrl}/v0/tokens`);
  const body = await parseJsonResponse(response);
  return tokenSchema.array().parse(body);
}

/**
 * トークンを検索するユーティリティ関数
 * @param tokens 
 * @param assetId 
 * @returns 
 */
export function findToken(tokens: TokenInfo[], assetId: string): TokenInfo {
  const token = tokens.find((candidate) => candidate.assetId === assetId);
  if (!token) {
    throw new Error(`Asset not found in /v0/tokens response: ${assetId}`);
  }
  return token;
}

/**
 * 見積もり取得のためのリクエストオブジェクトを構築します。
 * @param config 
 * @param origin 
 * @param dry 
 * @returns 
 */
export function buildQuoteRequest(
  config: TutorialConfig,
  origin: TokenInfo,
  dry: boolean,
): QuoteRequest {
  return {
    dry,
    swapType: 'EXACT_INPUT',
    slippageTolerance: config.slippageBps,
    originAsset: config.originAsset,
    depositType: 'ORIGIN_CHAIN',
    destinationAsset: config.destinationAsset,
    amount: decimalToBaseUnits(config.amount, origin.decimals),
    refundTo: config.refundTo,
    refundType: 'ORIGIN_CHAIN',
    recipient: config.recipient,
    recipientType: 'DESTINATION_CHAIN',
    deadline: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    depositMode: 'SIMPLE',
    referral: config.referral,
    quoteWaitingTimeMs: config.quoteWaitingTimeMs,
  };
}

/**
 * 見積もりを取得するAPIを呼び出します。
 * @param config 
 * @param quoteRequest 
 * @returns 
 */
export async function getQuote(
  config: TutorialConfig,
  quoteRequest: QuoteRequest,
): Promise<QuoteResponse> {
  const response = await fetch(`${config.baseUrl}/v0/quote`, {
    method: 'POST',
    headers: headers(config),
    body: JSON.stringify(quoteRequest),
  });
  const body = await parseJsonResponse(response);
  return quoteResponseSchema.parse(body);
}

/**
 * 入金トランザクションを提出するAPIを呼び出します。
 * @param config 
 * @param depositAddress 
 * @param txHash 
 * @returns 
 */
export async function submitDepositTx(
  config: TutorialConfig,
  depositAddress: string,
  txHash: string,
): Promise<unknown> {
  // 注意: 1-Click APIは入金トランザクションの内容を検査しないため、ユーザーが誤ったトランザクションを提出するリスクがあります。d
  const body: Record<string, string> = { depositAddress, txHash };
  if (config.senderNearAccount) {
    body.nearSenderAccount = config.senderNearAccount;
  }

  const response = await fetch(`${config.baseUrl}/v0/deposit/submit`, {
    method: 'POST',
    headers: headers(config),
    body: JSON.stringify(body),
  });
  return parseJsonResponse(response);
}

/**
 * トランザクションのステータスを取得するAPIを呼び出します。
 * @param config 
 * @param depositAddress 
 * @param depositMemo 
 * @returns 
 */
export async function getStatus(
  config: TutorialConfig,
  depositAddress: string,
  depositMemo?: string | null,
): Promise<StatusResponse> {
  const url = new URL(`${config.baseUrl}/v0/status`);
  url.searchParams.set('depositAddress', depositAddress);
  if (depositMemo) {
    url.searchParams.set('depositMemo', depositMemo);
  }

  const response = await fetch(url, { headers: headers(config) });
  const body = await parseJsonResponse(response);
  return statusResponseSchema.parse(body);
}
