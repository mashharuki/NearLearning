import {
  apiErrorSchema,
  type QuoteInput,
  type QuoteResult,
  quoteResultSchema,
  type TokensResponse,
  tokensResponseSchema,
} from '@near-intents/shared';

async function readResponse<T>(
  response: Response,
  parse: (value: unknown) => T,
): Promise<T> {
  const body: unknown = await response.json();
  if (!response.ok) {
    const parsedError = apiErrorSchema.safeParse(body);
    throw new Error(
      parsedError.success
        ? [parsedError.data.error, parsedError.data.details]
            .filter(Boolean)
            .join(' ')
        : `API request failed with status ${response.status}`,
    );
  }
  return parse(body);
}

export async function fetchTokens(): Promise<TokensResponse> {
  const response = await fetch('/api/tokens');
  return readResponse(response, (body) => tokensResponseSchema.parse(body));
}

export async function fetchDryQuote(input: QuoteInput): Promise<QuoteResult> {
  const response = await fetch('/api/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return readResponse(response, (body) => quoteResultSchema.parse(body));
}
