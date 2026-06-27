const varietySearchAliases: Record<string, string> = {
  ge: 'geisha',
  ges: 'geisha',
  gei: 'geisha',
  gesha: 'gesha',
  hei: 'heirlooms',
  heir: 'heirlooms',
  sl: 'SL28',
  cat: 'caturra',
  bour: 'bourbon',
  pink: 'pink bourbon',
  typ: 'typica',
};

const normalizeKey = (query: string) => query.trim().toLowerCase().replace(/\s+/g, ' ');

export const normalizeCoffeeSearchQuery = (query: string) => {
  const normalized = normalizeKey(query);
  if (!normalized) return 'coffee';

  return varietySearchAliases[normalized] ?? query.trim();
};

export const isVarietyLikeSearchQuery = (query: string) => {
  const normalized = normalizeKey(query);

  return Boolean(varietySearchAliases[normalized]);
};
