export type CoffeeBeanApiItem = {
  id: string;
  roaster: string | null;
  name: string;
  origin: string | null;
  region: string | null;
  producer: string | null;
  variety: string | null;
  process: string | null;
  degree: string | null;
  tasting: string[];
  elevation: string | null;
  minElev: number | null;
  maxElev: number | null;
};

export type CoffeeSearchParams = {
  search?: string;
  origin?: string;
  variety?: string;
  process?: string;
  degree?: string;
  limit?: number;
};

export type LoffeeBeansResponse = {
  beans: CoffeeBeanApiItem[];
  error?: string;
};

export type RoastReaction = {
  aminoAcidsRemaining: number;
  maillardProducts: number;
  acidity: number;
  bitterness: number;
  aromaIntensity: number;
  body: number;
};
