import type { CoffeeBeanApiItem } from '@/types/coffee';

const originTranslations: Record<string, string> = {
  ethiopia: 'エチオピア',
  panama: 'パナマ',
  colombia: 'コロンビア',
  kenya: 'ケニア',
  peru: 'ペルー',
  ecuador: 'エクアドル',
  brazil: 'ブラジル',
  indonesia: 'インドネシア',
  guatemala: 'グアテマラ',
  'costa rica': 'コスタリカ',
};

const varietyTranslations: Record<string, string> = {
  geisha: 'ゲイシャ',
  gesha: 'ゲイシャ',
  heirloom: '在来系品種',
  heirlooms: '在来系品種',
  sl28: 'SL28',
  sl34: 'SL34',
  'ruiru 11': 'ルイル11',
  batian: 'バティアン',
  caturra: 'カトゥーラ',
  'yellow caturra': 'イエローカトゥーラ',
  'pink bourbon': 'ピンクブルボン',
  typica: 'ティピカ',
  'typica mejorado': 'ティピカ・メホラード',
  bourbon: 'ブルボン',
  chiroso: 'チロソ',
  papayo: 'パパヨ',
};

const processTranslations: Record<string, string> = {
  natural: 'ナチュラル',
  washed: 'ウォッシュト',
  honey: 'ハニー',
  anaerobic: 'アナエロビック',
  'controlled fermentation': '制御発酵',
  'multi-stage fermentation': '多段階発酵',
  depulped: '果肉除去',
  'dried on raised beds': 'レイズドベッド乾燥',
  'dried on african beds': 'アフリカンベッド乾燥',
  sorted: '選別済み',
  'slow dry': '低速乾燥',
  'sun-dried': '天日乾燥',
  'fully washed': 'フリーウォッシュト',
  'yeast inoculated': '酵母添加',
  'nitrogen flushed': '窒素置換',
};

const degreeTranslations: Record<string, string> = {
  'ultra light': '極浅煎り',
  'nordic light': 'ノルディック浅煎り',
  light: '浅煎り',
  'light to medium-light': '浅煎り〜中浅煎り',
  'nordic light to medium-light': 'ノルディック浅煎り〜中浅煎り',
  'light to medium': '浅煎り〜中煎り',
  'medium-light': '中浅煎り',
  medium: '中煎り',
  'medium-dark': '中深煎り',
  dark: '深煎り',
};

const tastingTranslations: Record<string, string> = {
  floral: '花のような',
  berries: 'ベリー',
  'black tea': '紅茶',
  'white tea': '白茶',
  citrus: '柑橘',
  rose: 'バラ',
  sweet: '甘い',
  syrupy: 'シロップのような',
  perfumed: '香水のような',
  pastry: '焼き菓子',
  mandarin: 'マンダリン',
  honey: 'はちみつ',
  fruity: '果実感',
  jasmine: 'ジャスミン',
  'brown sugar': '黒糖',
  blueberries: 'ブルーベリー',
  blackberries: 'ブラックベリー',
  mineral: 'ミネラル感',
  hibiscus: 'ハイビスカス',
  guava: 'グアバ',
  mangosteen: 'マンゴスチン',
  nougat: 'ヌガー',
  'raw sugar': '粗糖',
  complex: '複雑',
};

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');

const withOriginal = (translated: string, original: string) => (translated === original ? original : `${translated}（${original}）`);

const translateSingle = (value: string, dictionary: Record<string, string>, showOriginal = true) => {
  const trimmed = value.trim();
  const translated = dictionary[normalize(trimmed)] ?? trimmed;
  return showOriginal ? withOriginal(translated, trimmed) : translated;
};

const splitList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const translateOrigin = (value: string | null) => {
  if (!value) return null;
  return translateSingle(value, originTranslations);
};

export const translateVariety = (value: string | null) => {
  if (!value) return null;
  return splitList(value)
    .map((item) => translateSingle(item, varietyTranslations))
    .join(' / ');
};

export const translateProcess = (value: string | null) => {
  if (!value) return null;
  return splitList(value)
    .map((item) => translateSingle(item, processTranslations, false))
    .join(' / ');
};

export const translateDegree = (value: string | null) => {
  if (!value) return null;
  return translateSingle(value, degreeTranslations);
};

export const translateTastingTag = (value: string) => tastingTranslations[normalize(value)] ?? value;

export const formatBeanDisplayName = (bean: CoffeeBeanApiItem) => {
  if (bean.name && bean.name !== 'Unnamed bean') {
    return bean.name;
  }

  const fallbackParts = [bean.roaster, translateOrigin(bean.origin), translateVariety(bean.variety)].filter(Boolean);
  return fallbackParts.length > 0 ? fallbackParts.join(' / ') : '豆名不明';
};
