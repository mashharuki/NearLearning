import 'dotenv/config';

import { serve } from '@hono/node-server';
import { quoteInputSchema, tokensResponseSchema } from '@near-intents/shared';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import {
  describeOneClickError,
  getApiConfiguration,
  getDryQuote,
  getSupportedTokens,
} from './one-click.js';

const app = new Hono();

app.use(logger());
app.use(
  '/api/*',
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  }),
);

app.get('/api/health', (context) =>
  context.json({
    ok: true,
    service: 'intent-atlas-api',
    ...getApiConfiguration(),
  }),
);

app.get('/api/tokens', async (context) => {
  try {
    const response = tokensResponseSchema.parse({
      tokens: await getSupportedTokens(),
      fetchedAt: new Date().toISOString(),
    });
    return context.json(response);
  } catch (error) {
    const described = describeOneClickError(error);
    return context.json(
      { error: described.error, details: described.details },
      described.status as 500,
    );
  }
});

app.post('/api/quote', async (context) => {
  const parsed = quoteInputSchema.safeParse(await context.req.json());
  if (!parsed.success) {
    return context.json(
      {
        error: '見積り条件を確認してください。',
        details: parsed.error.issues[0]?.message,
      },
      400,
    );
  }

  try {
    return context.json(await getDryQuote(parsed.data));
  } catch (error) {
    const described = describeOneClickError(error);
    return context.json(
      { error: described.error, details: described.details },
      described.status as 500,
    );
  }
});

app.notFound((context) =>
  context.json({ error: 'API endpoint not found.' }, 404),
);

const port = Number(process.env.PORT || 8787);

serve({ fetch: app.fetch, hostname: '127.0.0.1', port }, (info) => {
  console.log(`Intent Atlas API listening on http://localhost:${info.port}`);
});
