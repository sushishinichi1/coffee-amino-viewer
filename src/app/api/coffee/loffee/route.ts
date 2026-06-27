import { NextRequest, NextResponse } from 'next/server';
import { normalizeLoffeeBeans } from '@/lib/loffee';

const LOFFEE_API_BASE_URL = process.env.LOFFEE_API_BASE_URL ?? 'https://api.loffeelabs.com/v2';
const queryKeys = ['search', 'origin', 'variety', 'process', 'degree', 'limit'] as const;

const buildLoffeeUrl = (request: NextRequest) => {
  const url = new URL('/v2/beans', LOFFEE_API_BASE_URL.endsWith('/v2') ? LOFFEE_API_BASE_URL.replace(/\/v2$/, '') : LOFFEE_API_BASE_URL);
  const requestParams = request.nextUrl.searchParams;

  queryKeys.forEach((key) => {
    const value = requestParams.get(key);
    if (value) url.searchParams.set(key, value);
  });

  if (!url.searchParams.has('limit')) {
    url.searchParams.set('limit', '20');
  }

  return url;
};

export async function GET(request: NextRequest) {
  const apiKey = process.env.LOFFEE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { beans: [], error: 'LOFFEE_API_KEY is not set. Add it to .env.local and restart the dev server.' },
      { status: 500 },
    );
  }

  try {
    const loffeeUrl = buildLoffeeUrl(request);
    const response = await fetch(loffeeUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'X-API-Key': apiKey,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { beans: [], error: `Loffee Labs API request failed with status ${response.status}.` },
        { status: response.status },
      );
    }

    const payload = await response.json();
    return NextResponse.json({ beans: normalizeLoffeeBeans(payload) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ beans: [], error: `Failed to fetch Loffee Labs beans: ${message}` }, { status: 502 });
  }
}
