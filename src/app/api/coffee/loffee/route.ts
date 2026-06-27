import { NextRequest, NextResponse } from 'next/server';
import { buildLoffeeBeansEndpoint, DEFAULT_LOFFEE_API_BASE_URL, normalizeLoffeeBeans } from '@/lib/loffee';
import type { CoffeeBeanApiItem } from '@/types/coffee';

const queryKeys = ['search', 'origin', 'variety', 'process', 'degree', 'limit'] as const;
const CACHE_TTL_MS = 30_000;

type CacheEntry = {
  beans: CoffeeBeanApiItem[];
  expiresAt: number;
};

const cache = new Map<string, CacheEntry>();

const buildLoffeeUrl = (request: NextRequest) => {
  const url = buildLoffeeBeansEndpoint(process.env.LOFFEE_API_BASE_URL ?? DEFAULT_LOFFEE_API_BASE_URL);
  const requestParams = request.nextUrl.searchParams;

  queryKeys.forEach((key) => {
    const value = requestParams.get(key);
    if (value) url.searchParams.set(key, value);
  });

  const requestedLimit = Number(url.searchParams.get('limit') ?? 50);
  const limit = Number.isFinite(requestedLimit) ? Math.min(50, Math.max(1, Math.round(requestedLimit))) : 50;
  url.searchParams.set('limit', String(limit));

  return url;
};

const cacheKeyFor = (url: URL) => {
  const params = new URLSearchParams();

  queryKeys.forEach((key) => {
    const value = url.searchParams.get(key);
    if (value) params.set(key, value);
  });

  return params.toString();
};

const responseBodySnippet = (body: string) => body.slice(0, 500);

const causeMessage = (error: unknown) => {
  if (!(error instanceof Error)) return 'Unknown error';

  const cause = error.cause instanceof Error ? `; cause: ${error.cause.message}` : '';
  return `${error.message}${cause}`;
};

export async function GET(request: NextRequest) {
  const apiKey = process.env.LOFFEE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { beans: [], error: 'LOFFEE_API_KEY is not set. Add it to .env.local and restart the dev server.' },
      { status: 500 },
    );
  }

  let loffeeUrl: URL | null = null;

  try {
    loffeeUrl = buildLoffeeUrl(request);
    const cacheKey = cacheKeyFor(loffeeUrl);
    const cachedEntry = cache.get(cacheKey);

    if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
      return NextResponse.json({ beans: cachedEntry.beans, cached: true });
    }

    const response = await fetch(loffeeUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'X-API-Key': apiKey,
      },
      cache: 'no-store',
    });

    const responseText = await response.text();

    if (!response.ok) {
      const isRateLimited = response.status === 429;

      return NextResponse.json(
        {
          beans: [],
          cached: false,
          error: isRateLimited
            ? 'Rate limit exceeded. Wait a few seconds and try again.'
            : `Loffee Labs API request failed with status ${response.status}.`,
          details: {
            endpoint: loffeeUrl.toString(),
            status: response.status,
            statusText: response.statusText,
            responseBody: responseBodySnippet(responseText),
            causeMessage: null,
          },
        },
        { status: response.status },
      );
    }

    const payload = responseText ? JSON.parse(responseText) : [];
    const beans = normalizeLoffeeBeans(payload);
    cache.set(cacheKey, { beans, expiresAt: Date.now() + CACHE_TTL_MS });

    return NextResponse.json({ beans, cached: false });
  } catch (error) {
    const message = causeMessage(error);
    return NextResponse.json(
      {
        beans: [],
        cached: false,
        error: `Failed to fetch Loffee Labs beans: ${message}`,
        details: {
          endpoint: loffeeUrl?.toString() ?? null,
          status: null,
          statusText: null,
          responseBody: null,
          causeMessage: message,
        },
      },
      { status: 502 },
    );
  }
}
