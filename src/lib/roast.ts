import type { CoffeeBeanApiItem, RoastReaction } from '@/types/coffee';

const clampReactionValue = (value: number) => Math.min(100, Math.max(0, Math.round(value)));

type ReactionAdjustment = Partial<Record<keyof RoastReaction, number>>;

const normalize = (value: string | null | undefined) => value?.toLowerCase() ?? '';

const addAdjustment = (target: RoastReaction, adjustment: ReactionAdjustment) => {
  Object.entries(adjustment).forEach(([key, value]) => {
    target[key as keyof RoastReaction] += value ?? 0;
  });
};

const applyVarietyAdjustments = (reaction: RoastReaction, variety: string | null) => {
  const value = normalize(variety);

  if (value.includes('geisha') || value.includes('gesha')) {
    addAdjustment(reaction, { acidity: 8, aromaIntensity: 10, bitterness: -5 });
  }

  if (value.includes('heirloom')) {
    addAdjustment(reaction, { acidity: 6, aromaIntensity: 8 });
  }

  if (value.includes('sl28') || value.includes('sl34')) {
    addAdjustment(reaction, { acidity: 10, aromaIntensity: 4, sweetness: 3 });
  }

  if (value.includes('ruiru 11') || value.includes('batian')) {
    addAdjustment(reaction, { body: 4, bitterness: 3 });
  }

  if (value.includes('pink bourbon')) {
    addAdjustment(reaction, { sweetness: 7, acidity: 5, aromaIntensity: 5 });
  } else if (value.includes('bourbon')) {
    addAdjustment(reaction, { sweetness: 8, body: 4 });
  }

  if (value.includes('yellow caturra') || value.includes('caturra')) {
    addAdjustment(reaction, { sweetness: 5, acidity: 3 });
  }

  if (value.includes('typica mejorado') || value.includes('typica')) {
    addAdjustment(reaction, { sweetness: 5, aromaIntensity: 4 });
  }

  if (value.includes('robusta')) {
    addAdjustment(reaction, { bitterness: 12, body: 8, acidity: -8 });
  }
};

const applyProcessAdjustments = (reaction: RoastReaction, process: string | null) => {
  const value = normalize(process);

  if (value.includes('natural')) {
    addAdjustment(reaction, { sweetness: 6, aromaIntensity: 6, body: 3 });
  }

  if (value.includes('washed')) {
    addAdjustment(reaction, { acidity: 6, sweetness: -2 });
  }

  if (value.includes('honey')) {
    addAdjustment(reaction, { sweetness: 7, body: 4 });
  }

  if (value.includes('anaerobic') || value.includes('controlled fermentation') || value.includes('multi-stage fermentation')) {
    addAdjustment(reaction, { aromaIntensity: 10, sweetness: 4, acidity: 2 });
  }

  if (value.includes('dried on raised beds') || value.includes('dried on african beds')) {
    addAdjustment(reaction, { aromaIntensity: 2 });
  }
};

const applyDegreeAdjustments = (reaction: RoastReaction, degree: string | null) => {
  const value = normalize(degree);

  if (value.includes('ultra light')) {
    addAdjustment(reaction, { acidity: 8, bitterness: -8, aminoAcidsRemaining: 8, maillardProducts: -6 });
  } else if (value.includes('light to medium-light') || value.includes('nordic light to medium-light')) {
    addAdjustment(reaction, { acidity: 3, sweetness: 3 });
  } else if (value.includes('nordic light') || value === 'light') {
    addAdjustment(reaction, { acidity: 5, bitterness: -5 });
  } else if (value === 'medium') {
    addAdjustment(reaction, { sweetness: 5, maillardProducts: 5 });
  } else if (value.includes('medium-dark') || value.includes('dark')) {
    addAdjustment(reaction, { bitterness: 8, body: 6, acidity: -8, maillardProducts: 8 });
  }
};

const clampReaction = (reaction: RoastReaction): RoastReaction => {
  return {
    aminoAcidsRemaining: clampReactionValue(reaction.aminoAcidsRemaining),
    maillardProducts: clampReactionValue(reaction.maillardProducts),
    acidity: clampReactionValue(reaction.acidity),
    sweetness: clampReactionValue(reaction.sweetness),
    bitterness: clampReactionValue(reaction.bitterness),
    aromaIntensity: clampReactionValue(reaction.aromaIntensity),
    body: clampReactionValue(reaction.body),
  };
};

export const calculateRoastReaction = (roastLevel: number, bean: CoffeeBeanApiItem | null = null): RoastReaction => {
  const reaction: RoastReaction = {
    aminoAcidsRemaining: 100 - roastLevel * 0.65,
    maillardProducts: roastLevel,
    acidity: 100 - roastLevel * 0.75,
    sweetness: Math.min(100, 45 + roastLevel * 0.25),
    bitterness: roastLevel * 0.9,
    aromaIntensity: Math.min(100, 30 + roastLevel * 0.75),
    body: Math.min(100, 40 + roastLevel * 0.5),
  };

  if (bean) {
    applyVarietyAdjustments(reaction, bean.variety);
    applyProcessAdjustments(reaction, bean.process);
    applyDegreeAdjustments(reaction, bean.degree);
  }

  return clampReaction(reaction);
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
