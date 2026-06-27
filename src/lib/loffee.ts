import type { CoffeeBeanApiItem, CoffeeSearchParams, LoffeeBeansResponse } from '@/types/coffee';

type LoffeeRawRecord = Record<string, unknown>;

export const DEFAULT_LOFFEE_API_BASE_URL = 'https://api.loffeelabs.com/api/v2';

export const buildLoffeeBeansEndpoint = (baseUrl = DEFAULT_LOFFEE_API_BASE_URL) => {
  const trimmedBaseUrl = baseUrl.trim().replace(/\/+$/, '');
  const endpoint = trimmedBaseUrl.endsWith('/beans') ? trimmedBaseUrl : `${trimmedBaseUrl}/beans`;

  return new URL(endpoint);
};

const textOrNull = (value: unknown): string | null => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return null;
};

const numberOrNull = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const pickText = (item: LoffeeRawRecord, keys: string[]): string | null => {
  for (const key of keys) {
    const value = textOrNull(item[key]);
    if (value) return value;
  }

  return null;
};

const pickNumber = (item: LoffeeRawRecord, keys: string[]): number | null => {
  for (const key of keys) {
    const value = numberOrNull(item[key]);
    if (value !== null) return value;
  }

  return null;
};

const tastingList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(textOrNull).filter((item): item is string => Boolean(item));
  }

  const text = textOrNull(value);
  if (!text) return [];

  return text
    .split(/[,/|]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeBean = (item: unknown, index: number): CoffeeBeanApiItem | null => {
  if (!item || typeof item !== 'object') return null;

  const record = item as LoffeeRawRecord;
  const id = pickText(record, ['id', '_id', 'uuid', 'slug']) ?? `loffee-bean-${index}`;
  const name = pickText(record, ['name', 'beanName', 'coffee', 'title']) ?? 'Unnamed bean';

  return {
    id,
    roaster: pickText(record, ['roaster', 'roasterName', 'brand', 'company']),
    name,
    origin: pickText(record, ['origin', 'country', 'countryOfOrigin']),
    region: pickText(record, ['region', 'area', 'district']),
    producer: pickText(record, ['producer', 'farm', 'farmer', 'estate']),
    variety: pickText(record, ['variety', 'varietal', 'cultivar']),
    process: pickText(record, ['process', 'processing', 'processMethod']),
    degree: pickText(record, ['degree', 'roast', 'roastDegree', 'roastLevel']),
    tasting: tastingList(record.tasting ?? record.tastingNotes ?? record.notes ?? record.flavor ?? record.flavors),
    elevation: pickText(record, ['elevation', 'altitude']),
    minElev: pickNumber(record, ['minElev', 'minElevation', 'elevationMin', 'altitudeMin']),
    maxElev: pickNumber(record, ['maxElev', 'maxElevation', 'elevationMax', 'altitudeMax']),
  };
};

const extractItems = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;

  if (!payload || typeof payload !== 'object') return [];

  const record = payload as Record<string, unknown>;
  const candidates = [record.beans, record.data, record.items, record.results];
  const nestedData = record.data && typeof record.data === 'object' ? (record.data as Record<string, unknown>) : null;

  if (nestedData) {
    candidates.push(nestedData.beans, nestedData.items, nestedData.results);
  }

  return candidates.find(Array.isArray) ?? [];
};

export const normalizeLoffeeBeans = (payload: unknown): CoffeeBeanApiItem[] => {
  return extractItems(payload)
    .map(normalizeBean)
    .filter((item): item is CoffeeBeanApiItem => Boolean(item));
};

export const toCoffeeQueryString = (params: CoffeeSearchParams) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    searchParams.set(key, String(value));
  });

  return searchParams.toString();
};

export const fetchLoffeeBeans = async (params: CoffeeSearchParams): Promise<CoffeeBeanApiItem[]> => {
  const query = toCoffeeQueryString(params);
  const response = await fetch(`/api/coffee/loffee${query ? `?${query}` : ''}`);
  const payload = (await response.json()) as LoffeeBeansResponse;

  if (!response.ok) {
    const errorMessage =
      payload.details?.status === 429
        ? 'リクエスト制限に達しました。数秒待ってから再検索してください。'
        : payload.error ?? 'コーヒー豆データの取得に失敗しました。';
    const details = payload.details
      ? [
          payload.details.endpoint ? `endpoint: ${payload.details.endpoint}` : null,
          payload.details.status !== undefined ? `status: ${payload.details.status}` : null,
          payload.details.statusText ? `statusText: ${payload.details.statusText}` : null,
          payload.details.causeMessage ? `cause: ${payload.details.causeMessage}` : null,
          payload.details.responseBody ? `responseBody: ${payload.details.responseBody}` : null,
        ]
          .filter(Boolean)
          .join(' / ')
      : '';

    throw new Error(`${errorMessage}${details ? ` (${details})` : ''}`);
  }

  return payload.beans ?? [];
};
