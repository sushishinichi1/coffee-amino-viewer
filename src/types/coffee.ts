export type AminoAcidLevel = 'low' | 'medium' | 'high';

export type AminoAcid = {
  name: string;
  role: string;
  level: AminoAcidLevel;
  flavorHint: string;
};

export type CoffeeSample = {
  id: string;
  name: string;
  origin: string;
  roast: string;
  processing: string;
  flavorKeywords: string[];
  aminoAcids: AminoAcid[];
};

export type RoastReaction = {
  aminoAcidsRemaining: number;
  maillardProducts: number;
  acidity: number;
  bitterness: number;
  aromaIntensity: number;
  body: number;
};
