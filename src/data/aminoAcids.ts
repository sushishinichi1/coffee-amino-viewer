import type { AminoAcidLocalInfo } from '@/types/amino';

export const aminoAcids: AminoAcidLocalInfo[] = [
  {
    id: 'alanine',
    queryName: 'alanine',
    nameEn: 'Alanine',
    nameJa: 'アラニン',
    category: '小型・中性アミノ酸',
    roastRole: '焙煎中のメイラード反応やストレッカー分解で、香りの前駆体として扱いやすいアミノ酸です。',
    flavorHint: '甘さ、丸み、軽い厚みの説明に使いやすいです。',
    maillardNote: '還元糖と反応して褐色化や香ばしさに関わる生成物へつながります。',
  },
  {
    id: 'glutamic-acid',
    queryName: 'glutamic acid',
    nameEn: 'Glutamic acid',
    nameJa: 'グルタミン酸',
    category: '酸性アミノ酸',
    roastRole: 'コーヒーのコクや旨味の説明に使いやすく、焙煎反応の材料としても見せやすい成分です。',
    flavorHint: '旨味、コク、後味の厚みを考える入口になります。',
    maillardNote: '焙煎が進むほど残存量は減り、メイラード反応由来の複雑な香味へ寄与します。',
  },
  {
    id: 'phenylalanine',
    queryName: 'phenylalanine',
    nameEn: 'Phenylalanine',
    nameJa: 'フェニルアラニン',
    category: '芳香族アミノ酸',
    roastRole: '芳香環を持つため、香りの前駆体として説明しやすいアミノ酸です。',
    flavorHint: '華やかさ、甘い香り、焙煎香の奥行きを考える手がかりになります。',
    maillardNote: 'ストレッカー分解を通じて、香気成分の形成に関係します。',
  },
  {
    id: 'proline',
    queryName: 'proline',
    nameEn: 'Proline',
    nameJa: 'プロリン',
    category: '環状アミノ酸',
    roastRole: 'メイラード反応や香ばしさ、褐色化の説明に使いやすい代表的なアミノ酸です。',
    flavorHint: 'ナッツ、焼き菓子、ロースト香のような印象を考える入口になります。',
    maillardNote: '還元糖との反応で焙煎由来の香ばしさや褐色成分の形成に関係します。',
  },
  {
    id: 'leucine',
    queryName: 'leucine',
    nameEn: 'Leucine',
    nameJa: 'ロイシン',
    category: '分岐鎖アミノ酸',
    roastRole: 'ロースト香や厚みを説明するときに扱いやすい分岐鎖アミノ酸です。',
    flavorHint: 'ボディ、厚み、香ばしさの支えとして見せやすいです。',
    maillardNote: 'ストレッカー分解で香気成分形成に関わり、焙煎香の複雑さにつながります。',
  },
];

export const DEFAULT_AMINO_ACID_ID = 'proline';

export const findAminoAcidByName = (name: string | null | undefined) => {
  if (!name) return null;
  const normalizedName = name.trim().toLowerCase();

  return (
    aminoAcids.find((item) => {
      const aliases = [item.id, item.queryName, item.nameEn, item.nameJa].map((value) => value.toLowerCase());
      return aliases.includes(normalizedName);
    }) ?? null
  );
};
