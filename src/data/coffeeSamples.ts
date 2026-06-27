import type { CoffeeSample } from '@/types/coffee';

export const coffeeSamples: CoffeeSample[] = [
  {
    id: 'ethiopia-light',
    name: 'エチオピア浅煎り',
    origin: 'エチオピア',
    roast: '浅煎り',
    processing: 'ウォッシュト',
    flavorKeywords: ['花のような香り', '柑橘感', '紅茶のような軽さ', '明るい酸味'],
    aminoAcids: [
      { name: 'アラニン', role: '甘さと丸みの前駆体', level: 'medium', flavorHint: 'やわらかな甘さ' },
      { name: 'グルタミン酸', role: '旨味とコクに関係', level: 'medium', flavorHint: '奥行き' },
      { name: 'フェニルアラニン', role: '香気成分の前駆体', level: 'high', flavorHint: '花のような香り' },
      { name: 'プロリン', role: 'メイラード反応に寄与', level: 'medium', flavorHint: '焙煎由来の甘さ' },
    ],
  },
  {
    id: 'mandheling-dark',
    name: 'マンデリン深煎り',
    origin: 'インドネシア / スマトラ',
    roast: '深煎り',
    processing: 'スマトラ式',
    flavorKeywords: ['土っぽさ', '重いコク', 'ビターチョコ', '酸味控えめ'],
    aminoAcids: [
      { name: 'アラニン', role: '甘さと丸みの前駆体', level: 'low', flavorHint: '控えめな甘さ' },
      { name: 'グルタミン酸', role: '旨味とコクに関係', level: 'high', flavorHint: '重いコク' },
      { name: 'ロイシン', role: 'ロースト香の前駆体', level: 'medium', flavorHint: '焙煎香' },
      { name: 'プロリン', role: 'メイラード反応に寄与', level: 'high', flavorHint: '深い甘さ' },
    ],
  },
  {
    id: 'brazil-medium',
    name: 'ブラジル中煎り',
    origin: 'ブラジル',
    roast: '中煎り',
    processing: 'ナチュラル',
    flavorKeywords: ['ナッツ感', 'チョコ感', 'カラメル感', 'バランス型'],
    aminoAcids: [
      { name: 'アラニン', role: '甘さと丸みの前駆体', level: 'high', flavorHint: 'カラメルのような甘さ' },
      { name: 'グルタミン酸', role: '旨味とコクに関係', level: 'medium', flavorHint: 'なめらかな厚み' },
      { name: 'フェニルアラニン', role: '香気成分の前駆体', level: 'medium', flavorHint: '蜂蜜のような香り' },
      { name: 'プロリン', role: 'メイラード反応に寄与', level: 'high', flavorHint: 'ナッツのような焙煎感' },
    ],
  },
];
