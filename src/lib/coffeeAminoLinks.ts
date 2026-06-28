import type { CoffeeBeanApiItem } from '@/types/coffee';

export type RelatedAminoAcid = {
  nameJa: string;
  queryName: string;
};

const aminoAcids: Record<string, RelatedAminoAcid> = {
  alanine: { nameJa: 'アラニン', queryName: 'alanine' },
  glutamicAcid: { nameJa: 'グルタミン酸', queryName: 'glutamic acid' },
  phenylalanine: { nameJa: 'フェニルアラニン', queryName: 'phenylalanine' },
  proline: { nameJa: 'プロリン', queryName: 'proline' },
  leucine: { nameJa: 'ロイシン', queryName: 'leucine' },
};

const normalizeText = (value: string | null | undefined) => (value ?? '').trim().toLowerCase();

const includesAny = (text: string, keywords: string[]) => keywords.some((keyword) => text.includes(keyword));

const addUnique = (items: RelatedAminoAcid[], additions: RelatedAminoAcid[]) => {
  additions.forEach((addition) => {
    if (!items.some((item) => item.queryName === addition.queryName)) {
      items.push(addition);
    }
  });
};

export const getRelatedAminoAcidsForBean = (bean: CoffeeBeanApiItem | null, limit = 5) => {
  if (!bean) return [];

  const relatedAminoAcids: RelatedAminoAcid[] = [];
  const variety = normalizeText(bean.variety);
  const process = normalizeText(bean.process);
  const degree = normalizeText(bean.degree);
  const tasting = bean.tasting.map((tag) => normalizeText(tag)).join(' ');

  if (includesAny(variety, ['geisha', 'gesha'])) {
    addUnique(relatedAminoAcids, [aminoAcids.phenylalanine, aminoAcids.proline]);
  }

  if (includesAny(variety, ['heirloom', 'heirlooms'])) {
    addUnique(relatedAminoAcids, [aminoAcids.phenylalanine, aminoAcids.proline, aminoAcids.alanine]);
  }

  if (includesAny(variety, ['pink bourbon', 'bourbon', 'typica', 'caturra'])) {
    addUnique(relatedAminoAcids, [aminoAcids.alanine, aminoAcids.proline, aminoAcids.glutamicAcid]);
  }

  if (includesAny(variety, ['sl28', 'sl 28', 'sl34', 'sl 34'])) {
    addUnique(relatedAminoAcids, [aminoAcids.glutamicAcid, aminoAcids.alanine, aminoAcids.proline]);
  }

  if (includesAny(variety, ['ruiru 11', 'ruiru11', 'batian'])) {
    addUnique(relatedAminoAcids, [aminoAcids.leucine, aminoAcids.glutamicAcid, aminoAcids.proline]);
  }

  if (includesAny(process, ['natural'])) {
    addUnique(relatedAminoAcids, [aminoAcids.alanine, aminoAcids.proline, aminoAcids.phenylalanine]);
  }

  if (includesAny(process, ['washed', 'wash'])) {
    addUnique(relatedAminoAcids, [aminoAcids.alanine, aminoAcids.glutamicAcid]);
  }

  if (includesAny(process, ['honey'])) {
    addUnique(relatedAminoAcids, [aminoAcids.alanine, aminoAcids.proline]);
  }

  if (includesAny(process, ['anaerobic', 'controlled fermentation'])) {
    addUnique(relatedAminoAcids, [aminoAcids.phenylalanine, aminoAcids.proline]);
  }

  if (includesAny(degree, ['ultra light', 'nordic light', 'light'])) {
    addUnique(relatedAminoAcids, [aminoAcids.alanine, aminoAcids.glutamicAcid, aminoAcids.phenylalanine]);
  }

  const isDarkDegree = includesAny(degree, ['dark', 'medium-dark', 'medium dark']);

  if (isDarkDegree) {
    addUnique(relatedAminoAcids, [aminoAcids.leucine, aminoAcids.proline]);
  }

  if (!isDarkDegree && includesAny(degree, ['medium-light', 'medium light', 'medium'])) {
    addUnique(relatedAminoAcids, [aminoAcids.proline, aminoAcids.alanine, aminoAcids.phenylalanine]);
  }

  if (includesAny(tasting, ['floral', 'rose', 'jasmine'])) {
    addUnique(relatedAminoAcids, [aminoAcids.phenylalanine, aminoAcids.proline]);
  }

  if (includesAny(tasting, ['citrus'])) {
    addUnique(relatedAminoAcids, [aminoAcids.glutamicAcid, aminoAcids.alanine]);
  }

  if (includesAny(tasting, ['black tea', 'white tea'])) {
    addUnique(relatedAminoAcids, [aminoAcids.phenylalanine, aminoAcids.alanine]);
  }

  if (includesAny(tasting, ['berries', 'berry'])) {
    addUnique(relatedAminoAcids, [aminoAcids.phenylalanine, aminoAcids.proline]);
  }

  if (includesAny(tasting, ['honey', 'syrupy', 'sweet'])) {
    addUnique(relatedAminoAcids, [aminoAcids.alanine, aminoAcids.proline]);
  }

  return relatedAminoAcids.slice(0, limit);
};
