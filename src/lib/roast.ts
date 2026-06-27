import type { RoastReaction } from '@/types/coffee';

const clampReactionValue = (value: number) => Math.min(100, Math.max(0, Math.round(value)));

export const calculateRoastReaction = (roastLevel: number): RoastReaction => {
  return {
    aminoAcidsRemaining: clampReactionValue(100 - roastLevel * 0.65),
    maillardProducts: clampReactionValue(roastLevel),
    acidity: clampReactionValue(100 - roastLevel * 0.75),
    bitterness: clampReactionValue(roastLevel * 0.9),
    aromaIntensity: clampReactionValue(30 + roastLevel * 0.75),
    body: clampReactionValue(40 + roastLevel * 0.5),
  };
};

export const roastLabel = (value: number) => {
  if (value < 30) return '生豆に近い';
  if (value < 60) return '浅煎り';
  if (value < 85) return '中煎り';
  return '深煎り';
};

export const flavorOutput = (roastLevel: number) => {
  if (roastLevel < 35) {
    return '浅い焙煎では、酸味や産地由来の香りが残りやすく、アミノ酸や糖の反応はまだ控えめです。明るい酸味、花のような香り、軽い質感が出やすくなります。';
  }

  if (roastLevel < 70) {
    return '中程度の焙煎では、酸味と甘さ、香ばしさのバランスが取れます。アミノ酸と糖の反応が進み、ナッツ感、カラメル感、丸みのあるコクが出やすくなります。';
  }

  return '深い焙煎では、アミノ酸や糖の反応が大きく進み、メイラード生成物や苦味、重いコクが強くなります。酸味は下がり、ビターチョコ、スモーキー、ロースト感が前面に出ます。';
};
