const varietySearchAliases: Record<string, string> = {
  c: 'colombia',
  co: 'colombia',
  col: 'colombia',
  ca: 'caturra',
  cat: 'caturra',
  ci: 'citrus',
  e: 'ethiopia',
  et: 'ethiopia',
  g: 'geisha',
  ge: 'geisha',
  ges: 'geisha',
  gei: 'geisha',
  gesha: 'gesha',
  h: 'heirlooms',
  he: 'heirlooms',
  hei: 'heirlooms',
  heir: 'heirlooms',
  k: 'kenya',
  ke: 'kenya',
  p: 'panama',
  pa: 'panama',
  b: 'bourbon',
  bo: 'bourbon',
  bour: 'bourbon',
  s: 'sl28',
  sl: 'sl28',
  pink: 'pink bourbon',
  typ: 'typica',
};

const normalizeKey = (query: string) => query.trim().toLowerCase().replace(/\s+/g, ' ');

export const normalizeCoffeeSearchQuery = (query: string) => {
  const normalized = normalizeKey(query);
  if (!normalized) return 'coffee';

  return varietySearchAliases[normalized] ?? normalized;
};

export const isVarietyLikeSearchQuery = (query: string) => {
  const normalized = normalizeKey(query);

  return Boolean(varietySearchAliases[normalized]);
};
